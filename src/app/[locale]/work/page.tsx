import type { Metadata } from 'next'
import { LocalPromiseParams } from 'next-intlayer'
import { getPageMetadata } from '@/lib/metadata'
import { ShowVersion } from '@/components/widgets/show-version'
import { WorkPageView } from '@/features/work/views/work-page-view'
import { NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params

  return getPageMetadata('work', locale, '/work')
}

const WorkPage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <WorkPageView />
    </IntlayerServerProvider>
  )
}

export default WorkPage
