import type { Metadata } from "next"
import { ThemePicker } from "@/components/theme-picker"
import { IntlayerClientProvider, LocalPromiseParams, type NextPageIntlayer } from "next-intlayer"
import { IntlayerServerProvider } from "next-intlayer/server"
import { getIntlayer } from "intlayer"

export const generateMetadata = async ({ params }: LocalPromiseParams): Promise<Metadata> => {
  const { locale } = await params
  const content = getIntlayer("theme-picker", locale)

  return {
    title: content.system,
  }
}

const Page: NextPageIntlayer = async ({ params }) => {
  const { locale } = await params

  return (
    <IntlayerServerProvider locale={locale}>
      <IntlayerClientProvider locale={locale}>
        <h1>sáyago;dev</h1>
        <ThemePicker />
      </IntlayerClientProvider>
    </IntlayerServerProvider>
  )
}

export default Page
