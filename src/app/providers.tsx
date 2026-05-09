import { ThemeProvider } from '@/components/shared/theme-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
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
      <NuqsAdapter>
        <ThemeProvider>{children}</ThemeProvider>
      </NuqsAdapter>
    </IntlayerClientProvider>
  )
}
