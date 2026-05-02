import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { Providers } from "@/app/providers"
import { NextLayoutIntlayer } from "next-intlayer"

export { generateStaticParams } from "next-intlayer"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "sáyago;dev",
  description: "Mi portafolio",
}

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  )
}

export default LocaleLayout
