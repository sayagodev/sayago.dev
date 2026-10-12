import { getIntlayer } from 'intlayer'
import { getLocalizedUrl } from 'intlayer'
import { Container } from '@/components/layout/container'
import { Logo } from '@/components/widgets/logo'
import { getNotes } from '../notes.store'
import { getVisits, type Visit } from '../visits.store'
import { isAdmin, isAdminSetup } from '../actions'
import { AdminLoginForm } from '../components/admin-login-form'
import { LocalTime } from '../components/local-time'
import { NotesManager } from '../components/notes-manager'
import './admin-page-view.css'

function locationOf(visit: Visit): string {
  const parts = [visit.city, visit.country].filter((p) => p.length > 0)
  return parts.length > 0 ? parts.join(', ') : '—'
}

export async function AdminPageView({ locale }: { locale: string }) {
  const content = getIntlayer('notes', locale)
  const setup = await isAdminSetup()
  const authed = setup && (await isAdmin())
  const notes = authed ? await getNotes() : []
  const visits = authed ? await getVisits() : []

  return (
    <main className="notes-admin">
      <Container>
        <Logo />

        <header className="notes-admin__head">
          <h1 className="notes-admin__title">{content.admin.title}</h1>
        </header>

        {!setup ? (
          <p className="notes-admin__error">{content.admin.noSetup}</p>
        ) : !authed ? (
          <AdminLoginForm
            passwordLabel={content.admin.passwordLabel}
            submitLabel={content.admin.login}
            errorMessage={content.admin.loginError}
          />
        ) : (
          <>
            <NotesManager
              initialNotes={notes}
              publicHref={getLocalizedUrl('/notes', locale)}
              labels={{
                placeholder: content.admin.placeholder,
                quotePlaceholder: content.admin.quotePlaceholder,
                typeNote: content.admin.typeNote,
                typeQuote: content.admin.typeQuote,
                authorPlaceholder: content.admin.authorPlaceholder,
                linkPlaceholder: content.admin.linkPlaceholder,
                quoteBadge: content.admin.quoteBadge,
                urlError: content.admin.urlError,
                publish: content.admin.publish,
                publishing: content.admin.publishing,
                deleteLabel: content.admin.delete,
                logout: content.admin.logout,
                viewPublic: content.admin.viewPublic,
              }}
            />

            <section className="notes-admin__visits" aria-label={content.admin.visitsTitle}>
              <h2 className="notes-admin__visits-title">
                {content.admin.visitsTitle}{' '}
                <span className="notes-admin__count">
                  ({String(visits.length).padStart(2, '0')})
                </span>
              </h2>

              {visits.length === 0 ? (
                <p className="notes-admin__visits-empty">{content.admin.visitsEmpty}</p>
              ) : (
                <div className="notes-admin__table-wrap">
                  <table className="notes-admin__table">
                    <thead>
                      <tr>
                        <th scope="col">{content.admin.thVisitor}</th>
                        <th scope="col">{content.admin.thLocation}</th>
                        <th scope="col">{content.admin.thFirst}</th>
                        <th scope="col">{content.admin.thLast}</th>
                        <th scope="col">{content.admin.thCount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((visit) => (
                        <tr key={visit.id}>
                          <td>
                            {visit.device} · {visit.os} · {visit.browser}
                          </td>
                          <td>{locationOf(visit)}</td>
                          <td>
                            <LocalTime iso={visit.firstSeen} />
                          </td>
                          <td>
                            <LocalTime iso={visit.lastSeen} />
                          </td>
                          <td>({visit.count})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </Container>
    </main>
  )
}
