import { t, type Dictionary } from 'intlayer'

const SiteContent = {
  key: 'site',
  content: {
    title: 'sāyago;dev',
    description: t({
      es: 'Portafolio de Ángel Sáyago',
      en: 'Ángel Sáyago portfolio',
    }),
    keywords: t({
      es: [
        'Ángel Sáyago',
        'desarrollo web',
        'portafolio',
        'frontend',
        'Next.js',
        'React',
        'TypeScript',
      ],
      en: [
        'Ángel Sáyago',
        'web development',
        'portfolio',
        'frontend',
        'Next.js',
        'React',
        'TypeScript',
      ],
    }),
    author: 'Ángel Sáyago',
    url: 'https://sayago.dev',
  },
} satisfies Dictionary

export default SiteContent
