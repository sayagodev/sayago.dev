"use client"

import { type Locale } from "@/lib/i18n"
import { DynamicPathname, usePathname, useRouter } from "@/utils/i18n-navigation"
import { useLocale } from "next-intl"
import { useParams, useSearchParams } from "next/navigation"

export function useSwitchLanguage() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = useLocale() as Locale

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) {
      newLocale = newLocale === "en" ? "es" : "en"
    }

    const queryString = searchParams.toString()
    const hasQueryParams = queryString.length > 0

    if (pathname.includes("[") || pathname.includes("]")) {
      const routeParams: Record<string, string> = {}
      Object.entries(params).forEach(([key, value]) => {
        if (key !== "locale") {
          routeParams[key] = String(value)
        }
      })

      if (hasQueryParams) {
        router.replace(
          {
            pathname: pathname as DynamicPathname,
            params: routeParams,
            query: Object.fromEntries(searchParams.entries()),
          },
          { locale: newLocale }
        )
      } else {
        router.replace(
          {
            pathname: pathname as DynamicPathname,
            params: routeParams,
          },
          { locale: newLocale }
        )
      }
    } else {
      const urlWithQuery = hasQueryParams ? `${pathname}?${queryString}` : pathname
      router.replace(urlWithQuery, { locale: newLocale })
    }
  }

  return { switchLocale, locale }
}
