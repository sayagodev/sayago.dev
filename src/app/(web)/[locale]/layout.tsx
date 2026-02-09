import { Locale, locales } from "@/lib/i18n"
import "@/styles/globals.css"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import localFont from "next/font/local"
// import { EntryOverlay } from "./entry-overlay";
import { Corners } from "@/components/layout/corners"
import { PageTransition } from "@/components/layout/page-transition"
import { ReducedMotionProvider } from "@/components/providers/reduced-motion-provider"
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { FloatingMenu } from "@/components/layout/floating-menu"
// import { AnimatedTitleProvider } from "@/components/providers/animated-title-provider";

const monaArgon = localFont({
  src: [
    {
      path: "../../../../public/fonts/Monaspace_Argon_Var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-mona-argon",
})

const monaKrypton = localFont({
  src: [
    {
      path: "../../../../public/fonts/Monaspace_Krypton_Var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-mona-krypton",
})

const monaNeon = localFont({
  src: [
    {
      path: "../../../../public/fonts/Monaspace_Neon_Var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-mona-neon",
})

const zi = localFont({
  src: [
    {
      path: "../../../../public/fonts/zi.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-zi",
})

export const metadata: Metadata = {
  title: "sāyago;dev - portafolío",
  description: "Ángel Sáyago Portafolio",
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}>) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning data-theme="beish">
      <head>
        <link rel="icon" type="image/png" href="/images/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
      </head>
      <body
        className={`${[
          monaArgon.variable,
          monaKrypton.variable,
          monaNeon.variable,
          zi.variable,
        ].join(" ")} font-neon relative antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReducedMotionProvider />
          <SmoothScrollProvider />
          {/* <EntryOverlay /> */}
          <Corners />
          <PageTransition />
          <FloatingMenu />
          <CustomCursor />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
