import type { Metadata } from 'next'

/**
 * Metadata de página localizada: recibe el contenido ya resuelto por
 * getIntlayer (key literal en la página para que el compilador lo resuelva)
 * y arma el OG completo (el openGraph de página reemplaza al del layout).
 */
export function getPageMetadata(
  content: { metadata: { title: string; description: string } },
  site: { title: string; url: string },
  locale: string,
  path: string
): Metadata {
  const resolvedLocale = locale || 'es'
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
