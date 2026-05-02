import { t, type Dictionary } from 'intlayer'

const ThemePickerContent = {
  key: 'theme-picker',
  content: {
    light: t({
      es: 'Claro',
      en: 'Light',
    }),
    dark: t({
      es: 'Oscuro',
      en: 'Dark',
    }),
    system: t({
      es: 'Sistema',
      en: 'System',
    }),
  },
} satisfies Dictionary

export default ThemePickerContent
