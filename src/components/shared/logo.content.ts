import { t, type Dictionary } from 'intlayer'

const LogoContent = {
  key: 'logo',
  content: {
    aria: {
      label: t({
        es: 'Ir a la página de inicio',
        en: 'Go to home page',
      }),
      title: t({
        es: 'Ir al inicio',
        en: 'Go to home',
      }),
    },
  },
} satisfies Dictionary

export default LogoContent
