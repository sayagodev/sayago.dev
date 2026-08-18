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
        es: 'yo',
        en: 'me',
      }),
      contact: t({
        es: 'contacto',
        en: 'contact',
      }),
    },
    config: {
      title: t({
        es: 'config 設定',
        en: 'config 設定',
      }),
      language: t({
        es: 'idioma',
        en: 'language',
      }),
      sound: t({
        es: 'sonido',
        en: 'sound',
      }),
      theme: t({
        es: 'tema テーマ',
        en: 'theme テーマ',
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
