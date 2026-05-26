import { t, type Dictionary } from 'intlayer'

const homeNavigationContent = {
  key: 'home',
  content: {
    nav: {
      work: t({
        es: 'Proyectos',
        en: 'Projects',
      }),
      contact: t({
        es: 'Hablemos',
        en: 'Contact',
      }),
    },
  },
} satisfies Dictionary

export default homeNavigationContent
