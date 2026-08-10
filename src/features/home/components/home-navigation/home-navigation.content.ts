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
    metadata: {
      title: t({
        es: 'Inicio',
        en: 'Home',
      }),
      description: t({
        es: 'Ángel Sáyago — desarrollo de aplicaciones web con bases sólidas y obsesión por el detalle.',
        en: 'Ángel Sáyago — web development with solid foundations and an obsession for detail.',
      }),
    },
  },
} satisfies Dictionary

export default homeNavigationContent
