import { createHash } from 'node:crypto'
import { get, put } from '@vercel/blob'

const PATHNAME = 'notes/visits.json'
const MAX_VISITORS = 500

export interface Visit {
  id: string
  device: string
  os: string
  browser: string
  country: string
  region: string
  city: string
  lang: string
  path: string
  firstSeen: string
  lastSeen: string
  count: number
}

export interface VisitInput {
  ip: string
  ua: string
  country: string
  region: string
  city: string
  lang: string
  path: string
}

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN
}

function isVisit(value: unknown): value is Visit {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.id === 'string' && typeof v.lastSeen === 'string' && typeof v.count === 'number'
}

function sortByRecent(visits: Visit[]): Visit[] {
  return [...visits].sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1))
}

export async function getVisits(): Promise<Visit[]> {
  try {
    // useCache: false para ver siempre el último conteo en el admin.
    const result = await get(PATHNAME, { access: 'private', useCache: false, token: blobToken() })
    if (!result || result.statusCode !== 200) return []
    const data: unknown = JSON.parse(await new Response(result.stream).text())
    if (!Array.isArray(data)) return []
    return sortByRecent(data.filter(isVisit)).slice(0, MAX_VISITORS)
  } catch (error) {
    console.error('[visits] blob read failed:', error)
    return []
  }
}

export async function saveVisits(visits: Visit[]): Promise<void> {
  await put(PATHNAME, JSON.stringify(sortByRecent(visits).slice(0, MAX_VISITORS)), {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
    addRandomSuffix: false,
    token: blobToken(),
  })
}

const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|python-requests|curl|wget|headless/i

function parseUA(ua: string): { device: string; os: string; browser: string } {
  let device = 'Desktop'
  if (/tablet|ipad/i.test(ua)) device = 'Tablet'
  else if (/mobile|iphone|ipod|android|phone/i.test(ua)) device = 'Mobile'

  let os = 'Otro'
  if (/windows nt/i.test(ua)) os = 'Windows'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/mac os x/i.test(ua)) os = 'macOS'
  else if (/linux/i.test(ua)) os = 'Linux'

  let browser = 'Otro'
  if (/edg\//i.test(ua)) browser = 'Edge'
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera'
  else if (/chrome\//i.test(ua)) browser = 'Chrome'
  else if (/safari\//i.test(ua) && /version\//i.test(ua)) browser = 'Safari'
  else if (/firefox\//i.test(ua)) browser = 'Firefox'
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung'

  return { device, os, browser }
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function visitInputFromHeaders(h: Headers, path: string): VisitInput {
  const forwarded = h.get('x-forwarded-for')
  return {
    ip: forwarded?.split(',')[0]?.trim() || 'local',
    ua: h.get('user-agent') ?? '',
    // Headers de geo de Vercel (vacíos en local): ciudad viene URL-encoded.
    country: h.get('x-vercel-ip-country') ?? '',
    region: safeDecode(h.get('x-vercel-ip-country-region') ?? ''),
    city: safeDecode(h.get('x-vercel-ip-city') ?? ''),
    lang: h.get('accept-language')?.split(',')[0]?.trim() || '',
    path,
  }
}

export async function recordVisit(input: VisitInput): Promise<void> {
  if (!input.ua || BOT_RE.test(input.ua)) return
  // La IP nunca se guarda: solo un hash para agrupar visitas del mismo visitante.
  const id = createHash('sha256').update(`${input.ip}|${input.ua}`).digest('hex').slice(0, 16)
  const { device, os, browser } = parseUA(input.ua)
  const now = new Date().toISOString()

  const visits = await getVisits()
  const existing = visits.find((v) => v.id === id)
  if (existing) {
    existing.count += 1
    existing.lastSeen = now
    existing.path = input.path || existing.path
    if (input.city) existing.city = input.city
    if (input.country) existing.country = input.country
  } else {
    visits.unshift({
      id,
      device,
      os,
      browser,
      country: input.country,
      region: input.region,
      city: input.city,
      lang: input.lang,
      path: input.path,
      firstSeen: now,
      lastSeen: now,
      count: 1,
    })
  }
  await saveVisits(visits)
}
