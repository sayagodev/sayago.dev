import { LocalPromiseParams } from 'next-intlayer'
import { IntlayerServerProvider } from 'next-intlayer/server'
import { FlipTestView } from '@/features/flip-test/flip-test-view'

const FlipTestPage = async ({ params }: LocalPromiseParams) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <FlipTestView />
    </IntlayerServerProvider>
  )
}

export default FlipTestPage
