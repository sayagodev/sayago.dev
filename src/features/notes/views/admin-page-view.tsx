import { getIntlayer } from 'intlayer'
import { getLocalizedUrl } from 'intlayer'
import { Container } from '@/components/layout/container'
import { Logo } from '@/components/widgets/logo'
import { getNotes } from '../notes.store'
import { isAdmin, isAdminSetup } from '../actions'
import { AdminLoginForm } from '../components/admin-login-form'
import { NotesManager } from '../components/notes-manager'
import './admin-page-view.css'

export async function AdminPageView({ locale }: { locale: string }) {
  const content = getIntlayer('notes', locale)
  const setup = await isAdminSetup()
  const authed = setup && (await isAdmin())
  const notes = authed ? await getNotes() : []

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
        )}
      </Container>
    </main>
  )
}
