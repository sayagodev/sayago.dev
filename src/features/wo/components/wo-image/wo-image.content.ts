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
    metadata: {
      title: t({
        es: 'Sobre mí',
        en: 'About me',
      }),
      description: t({
        es: 'Ángel Sáyago — egresado de la UANL, autodidacta del desarrollo de aplicaciones desde ~2017.',
        en: 'Ángel Sáyago — UANL graduate, self-taught app developer since ~2017.',
      }),
    },
  },
} satisfies Dictionary

export default WoImageContent
