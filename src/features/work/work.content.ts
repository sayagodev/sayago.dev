import { t, type Dictionary } from 'intlayer'

const WorkContent = {
  key: 'work',
  content: {
    title: t({
      es: 'Proyectos',
      en: 'Projects',
    }),
    description: t({
      es: 'El oficio de crear — proyectos nacidos de la curiosidad, construidos con precisión y pulidos con obsesión por el detalle.',
      en: 'The craft of creating — projects born from curiosity, built with precision and polished with an obsession for detail.',
    }),
    hoverHint: t({
      es: 'Pasa el cursor sobre cada fila.',
      en: 'Hover over each row.',
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
    sourceCode: t({
      es: 'source_code </>',
      en: 'source_code </>',
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
        es: 'El oficio de crear — proyectos nacidos de la curiosidad, construidos con precisión y pulidos con obsesión por el detalle.',
        en: 'The craft of creating — projects born from curiosity, built with precision and polished with an obsession for detail.',
      }),
    },
    descriptions: {
      zihuame: t({
        es: 'Interfaz de comercio digital a medida para accesorios sustentables de lujo. Tipografía de alta fidelidad y patrones de interacción mínimos.',
        en: 'Custom digital commerce interface for sustainable luxury accessories. High-fidelity typography and minimal interaction patterns.',
      }),
      lms: t({
        es: 'Sistema propietario de gestión de aprendizaje para entrenamiento técnico interno. Renderizador markdown propio y motor de seguimiento de progreso.',
        en: 'Proprietary learning management system for internal technical training. Custom markdown renderer and progress tracking engine.',
      }),
      chat: t({
        es: 'Terminal de mensajería cifrada de extremo a extremo. Sin persistencia, arquitectura zero-log enfocada en transmisión par-a-par.',
        en: 'End-to-end encrypted messaging terminal. Zero-log architecture focused on peer-to-peer transmission.',
      }),
      hanzi: t({
        es: 'Entrenador de escritura hanzi con orden de trazos, entrada pinyin y estadísticas de precisión. Nació de mis propias sesiones de estudio.',
        en: 'Hanzi writing trainer with stroke order, pinyin input, and accuracy stats. Born from my own study sessions.',
      }),
      calendar: t({
        es: 'Interfaz de agenda de alta densidad para equipos de desarrollo. Navegación keyboard-first y lienzo optimizado para modo oscuro.',
        en: 'High-density calendar interface for development teams. Keyboard-first navigation and dark-mode optimized canvas.',
      }),
    },
  },
} satisfies Dictionary

export default WorkContent
