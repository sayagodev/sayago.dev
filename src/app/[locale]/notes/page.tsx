import type { Metadata } from 'next'
import { getIntlayer } from 'intlayer'
import { LocalPromiseParams, type NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'
import { getPageMetadata } from '@/lib/metadata'
import { ShowVersion } from '@/components/widgets/show-version'
import { NotesPageView } from '@/features/notes/views/notes-page-view'

export const revalidate = 60

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params
  const content = getIntlayer('notes', locale)
  const site = getIntlayer('site', locale)

  return getPageMetadata(content, site, locale ?? '', '/notas')
}

const NotesPage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <NotesPageView locale={locale ?? 'es'} />
    </IntlayerServerProvider>
  )
}

export default NotesPage
