import { ShowVersion } from '@/components/widgets/show-version'
import { ContactPageView } from '@/features/contact/views/contact-page-view'
import { NextPageIntlayer } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'

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
