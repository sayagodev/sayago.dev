export const COOLDOWN_MS = 24 * 60 * 60 * 1000

const STORAGE_KEY = 'sayagodev-contact-cooldown'
const COOLDOWN_EVENT = 'sayagodev:contact-cooldown'

export function getRemainingMs(untilEpochMs: number, now = Date.now()): number {
  return Math.max(0, untilEpochMs - now)
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function notify() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(COOLDOWN_EVENT))
}

export function readCooldownUntil(): number {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return 0
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

export function writeCooldownUntil(untilEpochMs: number): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, String(untilEpochMs))
  notify()
}

export function clearCooldown(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
  notify()
}

export function subscribeCooldown(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  window.addEventListener(COOLDOWN_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(COOLDOWN_EVENT, callback)
  }
}

const serverSentAt = new Map<string, number>()

export function getServerCooldownUntil(email: string, now = Date.now()): number {
  const until = serverSentAt.get(email.toLowerCase())
  if (!until) return 0
  return until > now ? until : 0
}

export function registerSend(email: string, now = Date.now()): void {
  serverSentAt.set(email.toLowerCase(), now + COOLDOWN_MS)
}
