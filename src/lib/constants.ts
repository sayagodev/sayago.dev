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
  light2: {
    tone: 'light',
    color1: '#FF97D0',
    color2: '#B331F1',
    color3: '#FBF5A7',
  },
  dark2: {
    tone: 'dark',
    color1: '#BBDC12',
    color2: '#8ECA3C',
    color3: '#276F27',
  },
  light3: {
    tone: 'light',
    color1: '#00E0BA',
    color2: '#FFCF00',
    color3: '#FF3483',
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

export const gradients: Array<{
  c1: string
  c2: string
  c3: string
}> = Object.keys(GRAINIENT_COLORS).map((key, _) => {
  const themeKey = key as keyof typeof GRAINIENT_COLORS
  const themeData = GRAINIENT_COLORS[themeKey]

  return {
    c1: themeData.color1,
    c2: themeData.color2,
    c3: themeData.color3,
  }
})
