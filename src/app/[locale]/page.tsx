import type { Metadata } from 'next'
import { getIntlayer } from 'intlayer'
import { LocalPromiseParams, type NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'
import { getPageMetadata } from '@/lib/metadata'
import { HomePageView } from '@/features/home/views/home-page-view'
import { ShowVersion } from '@/components/widgets/show-version'

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params
  const content = getIntlayer('home', locale)
  const site = getIntlayer('site', locale)

  return getPageMetadata(content, site, locale ?? '', '/')
}

const HomePage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <HomePageView />
    </IntlayerServerProvider>
  )
}

export default HomePage
