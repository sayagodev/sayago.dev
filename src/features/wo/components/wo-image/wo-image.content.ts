import { t, type Dictionary } from 'intlayer'

const WoImageContent = {
  key: 'wo-image',
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

export default WoImageContent
