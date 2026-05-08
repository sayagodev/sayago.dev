import { FooterClock } from '@/components/layout/footer-clock'
import { ShowVersion } from '@/components/layout/show-version'
import { WoPageView } from '@/features/wo/views/wo-page-view'
import { NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'

const WoPage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <WoPageView />
    </IntlayerServerProvider>
  )
}

export default WoPage
