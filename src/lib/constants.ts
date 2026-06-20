export const GRAINIENT_COLORS = {
  light: {
    tone: 'light',
    color1: '#BADFDB',
    color2: '#FFBDBD',
    color3: '#FCF9EA',
  },
  dark: {
    tone: 'dark',
    color1: '#210F37',
    color2: '#4F1C51',
    color3: '#A55B4B',
  },
  ligt2: {
    tone: 'light',
    color1: '#FF97D0',
    color2: '#B331F1',
    color3: '#FBF5A7',
  },
} as const

export const themes: Array<{
  id: string
  name: string
  gradient: [string, string, string]
  tone: 'light' | 'dark'
}> = Object.keys(GRAINIENT_COLORS).map((key, index) => {
  const themeKey = key as keyof typeof GRAINIENT_COLORS
  const themeData = GRAINIENT_COLORS[themeKey]

  return {
    id: String(index),
    name: themeKey,
    tone: themeData.tone,
    gradient: [themeData.color1, themeData.color2, themeData.color3],
  }
})
