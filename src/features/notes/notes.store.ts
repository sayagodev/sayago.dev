import { get, put } from '@vercel/blob'
import type { Note } from './types'

const PATHNAME = 'notes/notes.json'
const MAX_NOTES = 200

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN
}

function isNote(value: unknown): value is Note {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if (
    typeof v.id !== 'string' ||
    typeof v.text !== 'string' ||
    typeof v.createdAt !== 'string' ||
    v.id.length === 0 ||
    v.id.length > 64
  ) {
    return false
  }
  if (v.kind !== undefined && v.kind !== 'note' && v.kind !== 'quote') return false
  if (v.author !== undefined && typeof v.author !== 'string') return false
  if (v.sourceUrl !== undefined && typeof v.sourceUrl !== 'string') return false
  return true
}

function sortDesc(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function getNotes(): Promise<Note[]> {
  try {
    // El store está configurado como privado (igual que los PDFs del CV):
    // se lee con `get` autenticado y se consume el stream, sin fetch público.
    // useCache: false para leer siempre el último contenido tras publicar.
    const result = await get(PATHNAME, { access: 'private', useCache: false, token: blobToken() })
    if (!result || result.statusCode !== 200) return []
    const data: unknown = JSON.parse(await new Response(result.stream).text())
    if (!Array.isArray(data)) return []
    return sortDesc(data.filter(isNote)).slice(0, MAX_NOTES)
  } catch (error) {
    console.error('[notes] blob read failed:', error)
    return []
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  const payload = JSON.stringify(sortDesc(notes).slice(0, MAX_NOTES))
  await put(PATHNAME, payload, {
    access: 'private',
    contentType: 'application/json',
    allowOverwrite: true,
    addRandomSuffix: false,
    token: blobToken(),
  })
}
