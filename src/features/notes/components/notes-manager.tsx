'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createNote, deleteNote, logoutAdmin } from '../actions'
import type { Note, NoteKind } from '../types'

interface ManagerLabels {
  placeholder: string
  quotePlaceholder: string
  typeNote: string
  typeQuote: string
  authorPlaceholder: string
  linkPlaceholder: string
  quoteBadge: string
  urlError: string
  publish: string
  publishing: string
  deleteLabel: string
  logout: string
  viewPublic: string
}

export function NotesManager({
  initialNotes,
  labels,
  publicHref,
}: {
  initialNotes: Note[]
  labels: ManagerLabels
  publicHref: string
}) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [kind, setKind] = useState<NoteKind>('note')
  const [author, setAuthor] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [pending, setPending] = useState(false)
  const [urlError, setUrlError] = useState(false)

  const isQuote = kind === 'quote'

  const publish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length === 0) return
    setUrlError(false)
    setPending(true)
    const res = await createNote({ text, kind, author, sourceUrl })
    setPending(false)
    if (res.ok) {
      setText('')
      setAuthor('')
      setSourceUrl('')
      setKind('note')
      router.refresh()
    } else if (res.error === 'url') {
      setUrlError(true)
    }
  }

  const remove = async (id: string) => {
    await deleteNote(id)
    router.refresh()
  }

  const logout = async () => {
    await logoutAdmin()
    router.refresh()
  }

  return (
    <div className="notes-admin__manager">
      <form onSubmit={publish} className="notes-admin__composer">
        <div
          role="group"
          aria-label={`${labels.typeNote} / ${labels.typeQuote}`}
          className="notes-admin__kinds"
        >
          {(['note', 'quote'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`notes-admin__kind${kind === k ? ' notes-admin__kind--active' : ''}`}
            >
              {k === 'note' ? labels.typeNote : labels.typeQuote}
            </button>
          ))}
        </div>

        <textarea
          rows={isQuote ? 3 : 4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isQuote ? labels.quotePlaceholder : labels.placeholder}
          maxLength={2000}
          className="notes-admin__textarea"
        />

        {isQuote && (
          <div className="notes-admin__quote-fields">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={labels.authorPlaceholder}
              maxLength={120}
              className="notes-admin__input"
              aria-label={labels.authorPlaceholder}
            />
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder={labels.linkPlaceholder}
              maxLength={500}
              inputMode="url"
              className="notes-admin__input"
              aria-label={labels.linkPlaceholder}
            />
          </div>
        )}

        {urlError && (
          <p role="alert" className="notes-admin__error">
            {labels.urlError}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || text.trim().length === 0}
          className="notes-admin__btn"
        >
          {pending ? labels.publishing : labels.publish}
        </button>
      </form>

      <div className="notes-admin__list">
        {initialNotes.map((note) => (
          <div key={note.id} className="notes-admin__row">
            <div className="notes-admin__row-body">
              {note.kind === 'quote' && (
                <span className="notes-admin__badge">{labels.quoteBadge}</span>
              )}
              <p className="notes-admin__text">
                {note.kind === 'quote' ? `“${note.text}”` : note.text}
              </p>
              {note.author && <p className="notes-admin__meta">— {note.author}</p>}
            </div>
            <button
              type="button"
              onClick={() => remove(note.id)}
              className="notes-admin__delete"
              aria-label={`${labels.deleteLabel}: ${note.text.slice(0, 40)}`}
            >
              {labels.deleteLabel}
            </button>
          </div>
        ))}
      </div>

      <div className="notes-admin__foot">
        <a href={publicHref} className="notes-admin__link">
          {labels.viewPublic}
        </a>
        <button type="button" onClick={logout} className="notes-admin__link">
          {labels.logout}
        </button>
      </div>
    </div>
  )
}
