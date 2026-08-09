import type { Metadata } from 'next'
import { getIntlayer, type LocalesValues } from 'intlayer'

type DictionaryKey = Parameters<typeof getIntlayer>[0]

/**
 * Metadata de página localizada: título/descripción del diccionario + OG
 * completo (el openGraph de página reemplaza al del layout en Next).
 */
export function getPageMetadata(
  key: DictionaryKey,
  locale: LocalesValues | undefined,
  path: string
): Metadata {
  const resolvedLocale = locale ?? 'es'
  const content = getIntlayer(key, resolvedLocale) as unknown as {
    metadata: { title: string; description: string }
  }
  const site = getIntlayer('site', resolvedLocale) as unknown as { title: string; url: string }

  const localePath = resolvedLocale === 'es' ? '' : `/${resolvedLocale}`
  const pagePath = path === '/' ? '' : path
  const url = `${site.url}${localePath}${pagePath}`

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    openGraph: {
      type: 'website',
      url,
      siteName: site.title,
      title: content.metadata.title,
      description: content.metadata.description,
      locale: resolvedLocale === 'es' ? 'es_ES' : 'en_US',
    },
  }
}
