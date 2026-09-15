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
      cursor: t({
        es: 'cursor',
        en: 'cursor',
      }),
      cv: t({
        es: 'currículum',
        en: 'résumé',
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
      downloadCv: t({
        es: 'descargar currículum en',
        en: 'download résumé in',
      }),
    },
    cv: {
      downloading: t({
        es: 'descargando…',
        en: 'downloading…',
      }),
      retryIn: t({
        es: 'disponible en',
        en: 'available in',
      }),
      error: t({
        es: 'no se pudo descargar, inténtalo de nuevo',
        en: 'download failed, try again',
      }),
    },
  },
} satisfies Dictionary

export default FloatingNavContent
