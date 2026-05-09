import { t, type Dictionary } from 'intlayer'

const WoPageContent = {
  key: 'wo-page',
  content: {
    image: {
      altImage: t({
        es: 'Centro de Guanajuato, GTO.',
        en: 'Downtown Guanajuato, GTO.',
      }),
    },
    tldrTitle: t({
      es: '¿Poco tiempo/interes?',
      en: 'Short on time/interest?',
    }),
  },
} satisfies Dictionary

export default WoPageContent
