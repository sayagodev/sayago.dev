import localFont from 'next/font/local'
import Script from 'next/script'
import type { Metadata } from 'next'
import { getIntlayer } from 'intlayer'
import { LocalPromiseParams } from 'next-intlayer'
export { generateStaticParams } from 'next-intlayer'
import { NextLayoutIntlayer } from 'next-intlayer'
import { ThemePicker } from '@/components/widgets/theme-picker'
import { FloatingNav } from '@/components/widgets/floating-nav'
import { themes } from '@/lib/constants'
import { Providers } from '@/app/providers'
import { cn } from '@/lib/utils'
import PageReveal from '@/components/effects/page-reveal'
import { TransitionProvider } from '@/components/providers/transition-provider'
import { ThemeFavicon } from '@/components/widgets/theme-favicon'

const monaArgon = localFont({
  src: [
    {
      path: '../../../public/fonts/Monaspace_Argon_Var.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-mona-argon',
  // Solo se usa en la home (nav): no pre-cargarlo en
  // las demás páginas ahorra ~280KB de transferencia por visita
  preload: false,
})

const monaKrypton = localFont({
  src: [
    {
      path: '../../../public/fonts/Monaspace_Krypton_Var.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-mona-krypton',
})

const monaNeon = localFont({
  src: [
    {
      path: '../../../public/fonts/Monaspace_Neon_Var.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-mona-neon',
})

const zi = localFont({
  src: [
    {
      path: '../../../public/fonts/zi.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-zi',
})

export async function generateMetadata({ params }: LocalPromiseParams): Promise<Metadata> {
  const { locale } = await params
  const content = getIntlayer('site', locale)
  const canonicalUrl = `${content.url}${locale === 'es' ? '' : `/${locale}`}`

  return {
    metadataBase: new URL(content.url),
    title: {
      default: content.title,
      template: `%s | ${content.title}`,
    },
    description: content.description,
    keywords: content.keywords,
    authors: [{ name: content.author, url: content.url }],
    creator: content.author,
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      siteName: content.title,
      title: content.title,
      description: content.description,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: content.title,
      description: content.description,
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.png',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: 'https://sayago.dev/',
        en: 'https://sayago.dev/en',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params

  return (
    <html
      lang={locale}
      className={cn(monaArgon.variable, monaKrypton.variable, monaNeon.variable, zi.variable)}
      data-overlayscrollbars-initialize
      suppressHydrationWarning
    >
      <body data-ko-ctx="root" data-overlayscrollbars-initialize>
        <ThemeFavicon />
        <Providers locale={locale}>
          <TransitionProvider>
            <PageReveal>
              {children}
              <div>
                {/* Theme Picker - RIGHT side on desktop (vertical) */}
                <div className="theme-picker-desktop">
                  <ThemePicker themes={themes} orientation="vertical" />
                </div>

                {/* Theme Picker - TOP on mobile (horizontal) */}
                <div className="theme-picker-mobile">
                  <ThemePicker themes={themes} orientation="horizontal" />
                </div>
              </div>

              <FloatingNav />
            </PageReveal>
          </TransitionProvider>
        </Providers>
        <Script src="/oat.min.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}

export default LocaleLayout
