import { t, type Dictionary } from 'intlayer'

const WorkContent = {
  key: 'work',
  content: {
    title: t({
      es: 'Proyectos',
      en: 'Projects',
    }),
    description: t({
      es: 'Crear, probar y construir — una selección de proyectos que fueron tomando forma desde la primera idea hasta convertirse en algo real.',
      en: 'Create, test, and build — a selection of projects that took shape from the first idea to something real.',
    }),
    hoverHint: t({
      es: 'Pasa el cursor sobre cada fila.',
      en: 'Hover over each row.',
    }),
    touchHint: t({
      es: 'Toca cada fila para ver más.',
      en: 'Tap each row to see more.',
    }),
    filterAll: t({
      es: 'todos',
      en: 'all',
    }),
    filterProfessional: t({
      es: 'profesional',
      en: 'professional',
    }),
    filterPersonal: t({
      es: 'personal',
      en: 'personal',
    }),
    viewProject: t({
      es: 'ver proyecto',
      en: 'view project',
    }),
    preview: t({
      es: 'Previsualización',
      en: 'Preview',
    }),
    metadata: {
      title: t({
        es: 'Proyectos',
        en: 'Projects',
      }),
      description: t({
        es: 'Crear, probar y construir — una selección de proyectos que fueron tomando forma desde la primera idea hasta convertirse en algo real.',
        en: 'Create, test, and build — a selection of projects that took shape from the first idea to something real.',
      }),
    },
    descriptions: {
      zihuame: t({
        es: 'Sitio institucional para una ONG que apoya a pueblos originarios desde 2003. CMS editable, transparencia, eventos y donativos en línea.',
        en: 'Institutional site for an NGO supporting indigenous communities since 2003. Editable CMS, transparency, events and online donations.',
      }),
      vanguardias: t({
        es: 'Portal de una organización iberófona con comunicados, estatutos y directorio. Registro de miembros, galería y gestión de contenido.',
        en: 'Portal for an iberophone organization with statements, statutes and directory. Member registration, gallery and content management.',
      }),
      beidou: t({
        es: 'Sitio del overlay de navegación por teclado: pulsa Alt y salta a cualquier botón con una letra. Documentación viva y demos interactivas.',
        en: 'Home of the keyboard navigation overlay: press Alt and jump to any button with a keystroke. Living docs and interactive demos.',
      }),
      resonance: t({
        es: 'Plataforma de texto a voz y clonado de voz con IA. Crea voces personalizadas, genera audio desde texto y gestiona tu historial.',
        en: 'AI text-to-speech and voice cloning platform. Create custom voices, generate audio from text and manage your history.',
      }),
      mo: t({
        es: 'Capa de interfaz sin dependencias: HTML semántico, CSS moderno y un toque de JS. Sistema de tokens neutros y componentes componibles.',
        en: 'Zero-dependency interface layer: semantic HTML, modern CSS and a touch of JS. Neutral token system with composable components.',
      }),
    },
  },
} satisfies Dictionary

export default WorkContent
