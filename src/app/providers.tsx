import { ThemeProvider } from '@/components/providers/theme-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { IntlayerClientProvider } from 'next-intlayer'
import BeidouProvider from '@/components/providers/beidou-provider'

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
        <ThemeProvider>
          <BeidouProvider />
          {children}
        </ThemeProvider>
      </NuqsAdapter>
    </IntlayerClientProvider>
  )
}
