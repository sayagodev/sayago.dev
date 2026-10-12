import type { Metadata } from 'next'
import { after } from 'next/server'
import { headers } from 'next/headers'
import { getIntlayer } from 'intlayer'
import { LocalPromiseParams, type NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'
import { getPageMetadata } from '@/lib/metadata'
import { ShowVersion } from '@/components/widgets/show-version'
import { NotesPageView } from '@/features/notes/views/notes-page-view'
import { isAdmin } from '@/features/notes/actions'
import { recordVisit, visitInputFromHeaders } from '@/features/notes/visits.store'

export const dynamic = 'force-dynamic'

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params
  const content = getIntlayer('notes', locale)
  const site = getIntlayer('site', locale)

  return getPageMetadata(content, site, locale ?? '', '/notes')
}

const NotesPage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  // Logger de visitas: corre después de servir la página (no retrasa el render)
  // y no cuenta tus propias visitas como admin.
  if (!(await isAdmin())) {
    const input = visitInputFromHeaders(await headers(), '/notes')
    after(() => recordVisit(input))
  }

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <NotesPageView locale={locale ?? 'es'} />
    </IntlayerServerProvider>
  )
}

export default NotesPage
