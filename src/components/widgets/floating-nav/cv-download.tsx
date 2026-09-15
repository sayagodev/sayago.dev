'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { Download } from 'lucide-react'
import { useLocale } from 'next-intlayer'
import { useIntlayer } from 'next-intlayer'

const STORAGE_KEY = 'cv-next-allowed-at'
// Debe coincidir con WINDOW_MS de la API (24 h): solo es una pista de UX, el
// límite real lo impone el servidor con la cookie HttpOnly.
const WINDOW_MS = 24 * 60 * 60 * 1000

const CV_LANGS = ['es', 'en'] as const
type CvLang = (typeof CV_LANGS)[number]

// Bloqueo persistido entre navegaciones. En SSR no hay localStorage: null.
// useSyncExternalStore evita el mismatch de hidratación si hay bloqueo.
function readStoredBlock(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const ts = raw ? Number(raw) : NaN
    return Number.isFinite(ts) && ts > readClock() ? ts : null
  } catch {
    return null
  }
}

function subscribeStoredBlock(): () => void {
  return () => {}
}

// Reloj de 30 s para refrescar la cuenta atrás mientras el límite está activo
let clockSnapshot = 0

function subscribeClock(notify: () => void): () => void {
  clockSnapshot = Date.now()
  notify()
  const id = window.setInterval(() => {
    clockSnapshot = Date.now()
    notify()
  }, 30_000)
  return () => window.clearInterval(id)
}

function readClock(): number {
  return clockSnapshot
}

function formatRemaining(ms: number, locale: string): string {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60_000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return locale.startsWith('es') ? `${hours} h ${minutes} min` : `${hours}h ${minutes}m`
}

export function CvDownload() {
  const content = useIntlayer('floating-nav')
  const { locale } = useLocale()
  const [pending, setPending] = useState<CvLang | null>(null)
  const [failed, setFailed] = useState(false)
  const [freshBlock, setFreshBlock] = useState<number | null>(null)
  const storedBlock = useSyncExternalStore(subscribeStoredBlock, readStoredBlock, () => null)
  const now = useSyncExternalStore(subscribeClock, readClock, () => 0)

  const nextAllowedAt = freshBlock ?? storedBlock
  const blocked = nextAllowedAt !== null && now !== 0 && nextAllowedAt > now

  const blockUntil = useCallback((timestamp: number) => {
    setFreshBlock(timestamp)
    try {
      localStorage.setItem(STORAGE_KEY, String(timestamp))
    } catch {
      // Sin storage (modo privado): el servidor sigue imponiendo el límite
    }
  }, [])

  const download = useCallback(
    async (lang: CvLang) => {
      if (pending !== null) return
      setPending(lang)
      setFailed(false)
      try {
        const response = await fetch(`/api/cv/download?lang=${lang}`)
        if (response.status === 429) {
          const body = (await response.json().catch(() => null)) as {
            retryAfterMs?: number
          } | null
          blockUntil(Date.now() + (body?.retryAfterMs ?? WINDOW_MS))
          return
        }
        if (!response.ok) {
          setFailed(true)
          return
        }
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `Angel Sayago CV_${lang}.pdf`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
        // Descarga OK: el servidor ya fijó la cookie, reflejamos el bloqueo
        blockUntil(Date.now() + WINDOW_MS)
      } catch {
        setFailed(true)
      } finally {
        setPending(null)
      }
    },
    [pending, blockUntil]
  )

  return (
    <>
      <div className="floating-nav__panel-row">
        <span>{content.config.cv}</span>
        <span className="floating-nav__langs">
          {CV_LANGS.map((lang) => (
            <button
              key={lang}
              type="button"
              className="floating-nav__lang floating-nav__cv-btn"
              disabled={pending !== null || blocked}
              onClick={() => download(lang)}
              aria-label={`${content.aria.downloadCv} ${lang.toUpperCase()}`}
            >
              <Download size={12} strokeWidth={2} aria-hidden="true" />
              {pending === lang ? '…' : lang.toUpperCase()}
            </button>
          ))}
        </span>
      </div>
      {(blocked || failed || pending !== null) && (
        <div className="floating-nav__cv-status" role="status" aria-live="polite">
          {pending !== null
            ? content.cv.downloading
            : blocked && nextAllowedAt !== null
              ? `${content.cv.retryIn} ${formatRemaining(nextAllowedAt - now, locale)}`
              : failed
                ? content.cv.error
                : null}
        </div>
      )}
    </>
  )
}
