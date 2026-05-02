'use client'

import type { FC } from 'react'
import { Locales, getHTMLTextDir, getLocaleName, getLocalizedUrl } from 'intlayer'
import { useLocale } from 'next-intlayer'
import Link from 'next/link'

export const LocaleSwitcher: FC = () => {
  const { locale, pathWithoutLocale, availableLocales, setLocale } = useLocale()

  return (
    <div>
      <button>{getLocaleName(locale)}</button>
      <div>
        {availableLocales.map((localeItem) => (
          <Link
            href={getLocalizedUrl(pathWithoutLocale, localeItem)}
            hrefLang={localeItem}
            key={localeItem}
            aria-current={locale === localeItem ? 'page' : undefined}
            onClick={() => setLocale(localeItem)}
          >
            <span>
              {/* Idioma en su propia localización - por ejemplo Français */}
              {getLocaleName(localeItem, locale)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
