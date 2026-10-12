import { t, type Dictionary } from 'intlayer'

const NotesContent = {
  key: 'notes',
  content: {
    title: t({
      es: 'Notas',
      en: 'Notes',
    }),
    description: t({
      es: 'Fragmentos, citas y pensamientos sueltos.',
      en: 'Fragments, quotes and loose thoughts.',
    }),
    empty: t({
      es: 'Aún no hay notas.',
      en: 'No notes yet.',
    }),
    count: t({
      es: 'notas',
      en: 'notes',
    }),
    metadata: {
      title: t({
        es: 'Notas',
        en: 'Notes',
      }),
      description: t({
        es: 'Fragmentos, citas y pensamientos sueltos de Ángel Sáyago.',
        en: 'Fragments, quotes and loose thoughts by Ángel Sáyago.',
      }),
    },
    admin: {
      title: t({
        es: 'Admin',
        en: 'Admin',
      }),
      passwordLabel: t({
        es: 'Contraseña',
        en: 'Password',
      }),
      login: t({
        es: 'Entrar',
        en: 'Sign in',
      }),
      loginError: t({
        es: 'Contraseña incorrecta.',
        en: 'Wrong password.',
      }),
      noSetup: t({
        es: 'Falta NOTES_ADMIN_PASSWORD en el entorno.',
        en: 'Missing NOTES_ADMIN_PASSWORD in the environment.',
      }),
      placeholder: t({
        es: 'Escribe una nota…',
        en: 'Write a note…',
      }),
      quotePlaceholder: t({
        es: 'Pega la cita…',
        en: 'Paste the quote…',
      }),
      typeNote: t({
        es: 'Nota',
        en: 'Note',
      }),
      typeQuote: t({
        es: 'Cita',
        en: 'Quote',
      }),
      authorPlaceholder: t({
        es: 'Autor (opcional)',
        en: 'Author (optional)',
      }),
      linkPlaceholder: t({
        es: 'Enlace https://… (opcional)',
        en: 'Link https://… (optional)',
      }),
      quoteBadge: t({
        es: 'cita',
        en: 'quote',
      }),
      urlError: t({
        es: 'El enlace debe empezar por http:// o https://',
        en: 'The link must start with http:// or https://',
      }),
      publish: t({
        es: 'Publicar',
        en: 'Publish',
      }),
      publishing: t({
        es: 'Publicando…',
        en: 'Publishing…',
      }),
      delete: t({
        es: 'Borrar',
        en: 'Delete',
      }),
      logout: t({
        es: 'Salir',
        en: 'Sign out',
      }),
      viewPublic: t({
        es: 'Ver página pública',
        en: 'View public page',
      }),
      visitsTitle: t({
        es: 'Visitas',
        en: 'Visits',
      }),
      visitsEmpty: t({
        es: 'Aún no hay visitas registradas.',
        en: 'No visits recorded yet.',
      }),
      thVisitor: t({
        es: 'Visitante',
        en: 'Visitor',
      }),
      thLocation: t({
        es: 'Ubicación',
        en: 'Location',
      }),
      thFirst: t({
        es: 'Primera',
        en: 'First',
      }),
      thLast: t({
        es: 'Última',
        en: 'Last',
      }),
      thCount: t({
        es: 'Visitas',
        en: 'Count',
      }),
    },
  },
} satisfies Dictionary

export default NotesContent
