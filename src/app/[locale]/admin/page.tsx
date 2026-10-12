import type { Metadata } from 'next'
import { type NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'
import { ShowVersion } from '@/components/widgets/show-version'
import { AdminPageView } from '@/features/notes/views/admin-page-view'

export const dynamic = 'force-dynamic'

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Admin',
  description: 'Admin',
  robots: { index: false, follow: false },
})

const AdminPage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <AdminPageView locale={locale ?? 'es'} />
    </IntlayerServerProvider>
  )
}

export default AdminPage
