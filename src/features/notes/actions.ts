'use server'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getNotes, saveNotes } from './notes.store'

const COOKIE_NAME = 'notes_admin'
const SESSION_MS = 30 * 24 * 60 * 60 * 1000
const MAX_TEXT = 2000
const MAX_AUTHOR = 120
const MAX_URL = 500

function adminSecret(): string | null {
  const secret = process.env.NOTES_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD
  if (secret && secret.length >= 8) return secret
  if (process.env.NODE_ENV !== 'production') return 'dev-only-admin'
  return null
}

function sign(ts: number, secret: string): string {
  return createHmac('sha256', secret).update(`notes-admin:${ts}`).digest('hex')
}

function parseSession(value: string | undefined, secret: string): number | null {
  if (!value) return null
  const [tsRaw, sig] = value.split('.')
  const ts = Number(tsRaw)
  if (!Number.isFinite(ts) || !sig) return null
  const expected = sign(ts, secret)
  if (sig.length !== expected.length) return null
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  } catch {
    return null
  }
  if (Date.now() - ts > SESSION_MS) return null
  return ts
}

export async function isAdmin(): Promise<boolean> {
  const secret = adminSecret()
  if (!secret) return false
  const store = await cookies()
  return parseSession(store.get(COOKIE_NAME)?.value, secret) !== null
}

export async function isAdminSetup(): Promise<boolean> {
  return adminSecret() !== null
}

function timingSafeCompare(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  try {
    return timingSafeEqual(ab, bb)
  } catch {
    return false
  }
}

export async function loginAdmin(password: string): Promise<{ ok: boolean }> {
  const secret = adminSecret()
  if (!secret) return { ok: false }
  if (!timingSafeCompare(password, secret)) return { ok: false }

  const now = Date.now()
  const store = await cookies()
  store.set(COOKIE_NAME, `${now}.${sign(now, secret)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MS / 1000,
  })
  return { ok: true }
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export interface CreateNoteInput {
  text: string
  kind: 'note' | 'quote'
  author?: string
  sourceUrl?: string
}

export async function createNote(input: CreateNoteInput): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: 'unauthorized' }
  const clean = input.text.trim()
  if (clean.length === 0) return { ok: false, error: 'empty' }
  if (clean.length > MAX_TEXT) return { ok: false, error: 'too_long' }
  if (input.kind !== 'note' && input.kind !== 'quote') return { ok: false, error: 'kind' }

  const author = (input.author ?? '').trim().slice(0, MAX_AUTHOR)
  const sourceUrl = (input.sourceUrl ?? '').trim().slice(0, MAX_URL)
  if (sourceUrl.length > 0 && !/^https?:\/\//i.test(sourceUrl)) {
    return { ok: false, error: 'url' }
  }

  const notes = await getNotes()
  notes.unshift({
    id: newId(),
    text: clean,
    createdAt: new Date().toISOString(),
    ...(input.kind === 'quote'
      ? {
          kind: 'quote' as const,
          ...(author.length > 0 ? { author } : {}),
          ...(sourceUrl.length > 0 ? { sourceUrl } : {}),
        }
      : {}),
  })
  await saveNotes(notes)
  revalidatePath('/notes')
  revalidatePath('/en/notes')
  revalidatePath('/admin')
  revalidatePath('/en/admin')
  return { ok: true }
}

export async function deleteNote(id: string): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false }
  const notes = await getNotes()
  await saveNotes(notes.filter((n) => n.id !== id))
  revalidatePath('/notes')
  revalidatePath('/en/notes')
  revalidatePath('/admin')
  revalidatePath('/en/admin')
  return { ok: true }
}
