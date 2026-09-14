import { t, type Dictionary } from 'intlayer'

const WoBlogContent = {
  key: 'wo-blog',
  content: {
    heading: t({
      es: 'Blog',
      en: 'Blog',
    }),
    title: t({
      es: 'En construcción',
      en: 'Under construction',
    }),
    description: t({
      es: 'Esta parte está en construcción. Por favor, inténtelo más tarde.',
      en: 'This part is under construction. Please try again later.',
    }),
  },
} satisfies Dictionary

export default WoBlogContent
