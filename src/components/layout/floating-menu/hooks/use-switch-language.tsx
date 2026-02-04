"use client"

import { type Locale } from "@/lib/i18n"
import { usePathname, useRouter } from "@/utils/i18n-navigation"
import { useLocale } from "next-intl"
import { useParams } from "next/navigation"

export function useSwitchLanguage() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const locale = useLocale() as Locale

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) {
      newLocale = newLocale === "en" ? "es" : "en"
    }

    // Check if pathname is a dynamic route (contains brackets)
    if (pathname.includes("[") || pathname.includes("]")) {
      // Extract params from the current URL
      const routeParams: Record<string, string> = {}
      Object.entries(params).forEach(([key, value]) => {
        if (key !== "locale") {
          routeParams[key] = String(value)
        }
      })

      router.replace(
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pathname: pathname as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params: routeParams as any,
        },
        { locale: newLocale }
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(pathname as any, { locale: newLocale })
    }
  }

  return { switchLocale, locale }
}
