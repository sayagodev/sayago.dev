import { createHmac, timingSafeEqual } from 'node:crypto'
import { get } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Una descarga por ventana y usuario (anónimo): se aplica a ambos idiomas.
// Sin base de datos, el límite se impone con una cookie HttpOnly firmada
// (anti-manipulación) + un registro en memoria por IP como segunda barrera
// (best-effort en serverless: cada instancia guarda su propio mapa).
const WINDOW_MS = 24 * 60 * 60 * 1000
const COOKIE_NAME = 'cv_download'

// Secreto solo-servidor para firmar la cookie. Sin vars nuevas: reutiliza las
// ya presentes en todos los entornos (local + Vercel). Opcionalmente se puede
// fijar CV_DOWNLOAD_SECRET para rotarlo de forma independiente.
const SECRET =
  process.env.CV_DOWNLOAD_SECRET ??
  process.env.BLOB_READ_WRITE_TOKEN ??
  process.env.RESEND_API_KEY ??
  'dev-only-insecure-secret'

const CV = {
  es: { pathname: 'cv/cv-es.pdf', filename: 'Ángel Sáyago CV_es.pdf' },
  en: { pathname: 'cv/cv-en.pdf', filename: 'Ángel Sáyago CV_en.pdf' },
} as const

type Lang = keyof typeof CV

// IP -> timestamp de la última descarga (ms). Se poda en cada acceso.
const hitsByIp = new Map<string, number>()

function sign(timestamp: number): string {
  return createHmac('sha256', SECRET).update(`cv-download:${timestamp}`).digest('hex')
}

function parseCookie(value: string | undefined): number | null {
  if (!value) return null
  const [tsRaw, sig] = value.split('.')
  const ts = Number(tsRaw)
  if (!Number.isFinite(ts) || !sig) return null
  const expected = sign(ts)
  if (sig.length !== expected.length) return null
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  } catch {
    return null
  }
  return ts
}

function pruneIpHits(now: number): void {
  for (const [ip, ts] of hitsByIp) {
    if (now - ts >= WINDOW_MS) hitsByIp.delete(ip)
  }
  // Techo de seguridad: en serverless el mapa muere con la instancia.
  if (hitsByIp.size > 10_000) hitsByIp.clear()
}

function remainingMs(lastAt: number | null, now: number): number {
  if (lastAt === null) return 0
  return Math.max(0, lastAt + WINDOW_MS - now)
}

function rateLimitedResponse(retryAfterMs: number): NextResponse {
  return NextResponse.json(
    { error: 'rate_limited', retryAfterMs, nextAllowedAt: Date.now() + retryAfterMs },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
    }
  )
}

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip')?.trim()
  return ip || null
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const langParam = request.nextUrl.searchParams.get('lang')
  if (langParam !== 'es' && langParam !== 'en') {
    return NextResponse.json({ error: 'invalid_lang' }, { status: 400 })
  }
  const lang: Lang = langParam
  const now = Date.now()

  const cookieTs = parseCookie(request.cookies.get(COOKIE_NAME)?.value)
  const cookieRemaining = remainingMs(cookieTs, now)
  if (cookieRemaining > 0) return rateLimitedResponse(cookieRemaining)

  pruneIpHits(now)
  const ip = clientIp(request)
  const ipTs = ip ? (hitsByIp.get(ip) ?? null) : null
  const ipRemaining = remainingMs(ipTs, now)
  if (ipRemaining > 0) return rateLimitedResponse(ipRemaining)

  const { pathname, filename } = CV[lang]
  let result: Awaited<ReturnType<typeof get>>
  try {
    result = await get(pathname, {
      access: 'private',
      // El token explícito gana al OIDC. En local hay OIDC de development
      // (store no conectado a ese entorno) + BLOB_STORE_ID: sin esto el SDK
      // intentaría OIDC y fallaría con 403. En Vercel no hay RW token
      // (undefined) y se usa el OIDC del entorno.
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (error) {
    console.error('[cv/download] blob get failed:', error)
    return NextResponse.json({ error: 'blob_unavailable' }, { status: 502 })
  }
  if (result?.statusCode !== 200) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const response = new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType || 'application/pdf',
      // attachment fuerza la descarga en vez de abrir el visor del navegador
      'Content-Disposition': `attachment; filename="Angel Sayago CV_${lang}.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Content-Length': String(result.blob.size),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })

  response.cookies.set(COOKIE_NAME, `${now}.${sign(now)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: WINDOW_MS / 1000,
  })
  if (ip) hitsByIp.set(ip, now)

  return response
}
