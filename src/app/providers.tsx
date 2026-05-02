import { ThemeProvider } from '@/components/shared/theme-provider'
import { IntlayerClientProvider } from 'next-intlayer'

export async function Providers({
  children,
  locale,
}: {
  children: React.ReactNode
  locale?: string
}) {
  return (
    <IntlayerClientProvider locale={locale}>
      <ThemeProvider>{children}</ThemeProvider>
    </IntlayerClientProvider>
  )
}
