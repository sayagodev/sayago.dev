import { getRequestConfig } from "next-intl/server"

export const locales = ["es", "en"]
export const DEFAULT_LOCALE = "es" as Locale
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !locales.includes(locale as Locale)) {
    locale = "es"
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
