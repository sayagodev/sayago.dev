import { useSyncExternalStore } from 'react'

// Persisted on/off state for the custom cursor. Replaces the zustand store
// from `refactor/wo-page` — same behavior, no extra dependency.
const STORAGE_KEY = 'sayago:custom-cursor'
const LEGACY_STORAGE_KEY = 'cursor-settings'

let enabled = true
let initialized = false
const listeners = new Set<() => void>()

function readInitial(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw !== null) return raw === '1'
    // Migrate the zustand `persist` shape used in `refactor/wo-page`.
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'state' in parsed &&
        typeof (parsed as { state: unknown }).state === 'object' &&
        (parsed as { state: object | null }).state !== null &&
        'isCustomCursorEnabled' in (parsed as { state: object }).state
      ) {
        return (
          (parsed as { state: { isCustomCursorEnabled: unknown } }).state.isCustomCursorEnabled ===
          true
        )
      }
    }
  } catch {
    // Corrupt storage: fall through to the default.
  }
  return true
}

function init(): void {
  if (initialized) return
  initialized = true
  if (typeof window !== 'undefined') enabled = readInitial()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): boolean {
  init()
  return enabled
}

function getServerSnapshot(): boolean {
  return true
}

export function setCustomCursor(value: boolean): void {
  enabled = value
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    // Storage unavailable (private mode): keep the in-memory value.
  }
  listeners.forEach((listener) => listener())
}

export function useCustomCursor(): { enabled: boolean; setEnabled: (value: boolean) => void } {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { enabled: value, setEnabled: setCustomCursor }
}
