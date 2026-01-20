import { Locale, locales } from "@/lib/i18n";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import localFont from "next/font/local"
import "@/styles/globals.css";
// import { EntryOverlay } from "./entry-overlay";
import { Corners } from "@/components/layout/corners";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { CursorToggle } from "@/components/ui/cursor-toggle";

const monaArgon = localFont({
  src: [{
    path: "../../../../public/fonts/Monaspace_Argon_Var.woff2",
    weight: "100 900",
    style: "normal"
  }],
  variable: '--font-mona-argon'
})

const monaKrypton = localFont({
  src: [{
    path: "../../../../public/fonts/Monaspace_Krypton_Var.woff2",
    weight: "100 900",
    style: "normal"
  }],
  variable: '--font-mona-krypton'
})

const monaNeon = localFont({
  src: [{
    path: "../../../../public/fonts/Monaspace_Neon_Var.woff2",
    weight: "100 900",
    style: "normal"
  }],
  variable: '--font-mona-neon'
})

export const metadata: Metadata = {
  title: "sāyago;dev ... portafolío",
  description: "Ángel Sáyago Portafolio",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning data-theme="beish">
      <body
        className={`${[
          monaArgon.variable,
          monaKrypton.variable,
          monaNeon.variable,
        ].join(' ')} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {/* <EntryOverlay /> */}
          <Corners />
          <CustomCursor />
          <CursorToggle />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
