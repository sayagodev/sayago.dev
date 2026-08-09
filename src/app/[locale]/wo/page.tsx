import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LocalPromiseParams } from 'next-intlayer'
import { getPageMetadata } from '@/lib/metadata'
import { ShowVersion } from '@/components/widgets/show-version'
import { WoPageView } from '@/features/wo/views/wo-page-view'
import { NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params

  return getPageMetadata('wo-image', locale, '/wo')
}

const WoPage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <Suspense>
        <WoPageView />
      </Suspense>
    </IntlayerServerProvider>
  )
}

export default WoPage
