import { t, type Dictionary } from 'intlayer'

const FloatingNavContent = {
  key: 'floating-nav',
  content: {
    items: {
      home: t({
        es: 'inicio',
        en: 'home',
      }),
      work: t({
        es: 'proyectos',
        en: 'projects',
      }),
      wo: t({
        es: 'sobre mí',
        en: 'me',
      }),
      contact: t({
        es: 'hablemos',
        en: 'contact',
      }),
    },
    config: {
      language: t({
        es: 'idioma',
        en: 'language',
      }),
      soon: t({
        es: 'pronto',
        en: 'soon',
      }),
    },
    aria: {
      nav: t({
        es: 'navegación principal',
        en: 'main navigation',
      }),
      config: t({
        es: 'configuración',
        en: 'settings',
      }),
    },
  },
} satisfies Dictionary

export default FloatingNavContent
