import { t, type Dictionary } from 'intlayer'

const ThemePickerContent = {
  key: 'theme-picker',
  content: {
    aria: {
      label: t({
        es: 'Selector de categorías',
        en: 'Category picker',
      }),
    },
  },
} satisfies Dictionary

export default ThemePickerContent
