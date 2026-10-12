export type NoteKind = 'note' | 'quote'

export interface Note {
  id: string
  text: string
  createdAt: string
  kind?: NoteKind
  author?: string
  sourceUrl?: string
}

export function isQuote(note: Note): boolean {
  return note.kind === 'quote'
}
