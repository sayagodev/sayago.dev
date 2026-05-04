import type { Metadata } from 'next'
import { LocalPromiseParams, type NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'
import { getIntlayer } from 'intlayer'
import { HomePageView } from '@/features/home/views/home-page-view'
import { FooterClock } from '@/components/layout/footer-clock'
import { ShowVersion } from '@/components/layout/show-version'

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params
  const content = getIntlayer('theme-picker', locale)

  return {
    title: content.system,
  }
}

const HomePage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <HomePageView />

      <FooterClock />
    </IntlayerServerProvider>
  )
}

export default HomePage
