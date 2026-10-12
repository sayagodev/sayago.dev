import { getIntlayer } from 'intlayer'
import { Container } from '@/components/layout/container'
import { Logo } from '@/components/widgets/logo'
import { getNotes } from '../notes.store'
import { isQuote } from '../types'
import './notes-page-view.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export async function NotesPageView({ locale }: { locale: string }) {
  const content = getIntlayer('notes', locale)
  const notes = await getNotes()

  return (
    <main className="notes-view">
      <Container>
        <Logo />

        <header className="notes-view__head">
          <h1 className="notes-view__title">
            {content.title} <span className="notes-view__hanzi">念</span>
            <span className="notes-view__count">({String(notes.length).padStart(2, '0')})</span>
          </h1>
          <p className="notes-view__description">{content.description}</p>
        </header>

        {notes.length === 0 ? (
          <p className="notes-view__empty">{content.empty}</p>
        ) : (
          <div className="notes-list">
            {notes.map((note) => {
              const quote = isQuote(note)
              const citeName = note.author?.trim() || (note.sourceUrl ? hostOf(note.sourceUrl) : '')
              return (
                <article
                  key={note.id}
                  id={note.id}
                  data-kind={quote ? 'quote' : 'note'}
                  className="notes-list__item"
                >
                  <time dateTime={note.createdAt} className="notes-list__date">
                    {formatDate(note.createdAt)}
                  </time>
                  {quote ? (
                    <blockquote className="notes-quote">
                      <p className="notes-quote__text">{note.text}</p>
                      {citeName.length > 0 && (
                        <footer className="notes-quote__cite">
                          —
                          {note.sourceUrl ? (
                            <a href={note.sourceUrl} target="_blank" rel="noopener noreferrer">
                              {citeName}
                            </a>
                          ) : (
                            <span>{citeName}</span>
                          )}
                        </footer>
                      )}
                    </blockquote>
                  ) : (
                    <p className="notes-list__text">{note.text}</p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </Container>
    </main>
  )
}
