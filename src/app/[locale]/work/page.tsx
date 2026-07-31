import { ShowVersion } from '@/components/widgets/show-version'
import { WorkPageView } from '@/features/work/views/work-page-view'
import { NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'

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
