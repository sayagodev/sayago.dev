'use client'

import { getLocalizedUrl } from 'intlayer'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { useLocale } from 'next-intlayer'
import type { PropsWithChildren, FC } from 'react'

/**
 * Función utilitaria para verificar si una URL dada es externa.
 * Si la URL comienza con http:// o https://, se considera externa.
 */
export const checkIsExternalLink = (href?: string): boolean => /^https?:\/\//.test(href ?? '')

/**
 * Un componente Link personalizado que adapta el atributo href según la configuración regional actual.
 * Para enlaces internos, utiliza `getLocalizedUrl` para anteponer la configuración regional a la URL (por ejemplo, /fr/about).
 * Esto asegura que la navegación se mantenga dentro del mismo contexto regional.
 */
export const Link: FC<PropsWithChildren<NextLinkProps>> = ({ href, children, ...props }) => {
  const { locale } = useLocale()
  const isExternalLink = checkIsExternalLink(href.toString())

  // Si el enlace es interno y se proporciona un href válido, obtiene la URL localizada.
  const hrefI18n: NextLinkProps['href'] =
    href && !isExternalLink ? getLocalizedUrl(href.toString(), locale) : href

  return (
    <NextLink href={hrefI18n} {...props}>
      {children}
    </NextLink>
  )
}
