import { t, type Dictionary } from 'intlayer'

const ThemePickerContent = {
  key: 'theme-picker',
  content: {
    aria: {
      label: t({
        es: 'Selector de temas',
        en: 'Theme picker',
      }),
      options: {
        light: t({
          es: 'Claro',
          en: 'Light',
        }),
        dark: t({
          es: 'Oscuro',
          en: 'Dark',
        }),
        light2: t({
          es: 'Claro 2',
          en: 'Light 2',
        }),
        dark2: t({
          es: 'Oscuro 2',
          en: 'Dark 2',
        }),
        light3: t({
          es: 'Claro 3',
          en: 'Light 3',
        }),
      },
    },
  },
} satisfies Dictionary

export default ThemePickerContent
