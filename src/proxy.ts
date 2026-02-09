import createMiddleware from "next-intl/middleware"
import { DEFAULT_LOCALE, locales } from "./lib/i18n"

const pathnames = {
  "/": {},
  "/work": {
    en: "/work",
    es: "/proyectos",
  },
  "/work/[name]": {
    en: "/work/[name]",
    es: "/proyectos/[name]",
  },
  "/wo": {
    en: "/me",
    es: "/yo",
  },
  "/contact": {
    en: "/lets-connect",
    es: "/hablemos",
  },
}

export const routing = {
  locales,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed" as const,
  localeDetection: true,
  pathnames: pathnames,
}

export default createMiddleware(routing)

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
