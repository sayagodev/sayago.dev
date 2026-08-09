import type { Metadata } from 'next'
import { getIntlayer } from 'intlayer'
import { LocalPromiseParams } from 'next-intlayer'
import { getPageMetadata } from '@/lib/metadata'
import { ShowVersion } from '@/components/widgets/show-version'
import { ContactPageView } from '@/features/contact/views/contact-page-view'
import { NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params
  const content = getIntlayer('contact', locale)
  const site = getIntlayer('site', locale)

  return getPageMetadata(content, site, locale ?? '', '/contact')
}

const ContactPage: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <ShowVersion />

      <ContactPageView />
    </IntlayerServerProvider>
  )
}

export default ContactPage
