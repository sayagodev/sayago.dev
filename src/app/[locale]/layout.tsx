import localFont from 'next/font/local'
import Script from 'next/script'
import type { Metadata } from 'next'
export { generateStaticParams } from 'next-intlayer'
import { NextLayoutIntlayer } from 'next-intlayer'
import { Providers } from '@/app/providers'
import { cn } from '@/lib/utils'

const monaArgon = localFont({
  src: [
    {
      path: '../../../public/fonts/Monaspace_Argon_Var.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-mona-argon',
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

export const metadata: Metadata = {
  title: 'sāyago;dev - portafolío',
  description: 'Mi portafolio',
}

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params

  return (
    <html
      lang={locale}
      className={cn(
        monaArgon.variable,
        monaKrypton.variable,
        monaNeon.variable,
        zi.variable,
      )}
      suppressHydrationWarning
    >
      <body>
        <Providers locale={locale}>{children}</Providers>
        <Script src='/oat.min.js' strategy='afterInteractive' />
      </body>
    </html>
  )
}

export default LocaleLayout
