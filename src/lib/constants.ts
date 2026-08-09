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
    color1: '#30AFFF',
    color2: '#92EEFF',
    color3: '#D8FFC5',
  },
  dark2: {
    tone: 'dark',
    color1: '#8B1E2D',
    color2: '#E63946',
    color3: '#F4D35E',
  },
  light3: {
    tone: 'light',
    color1: '#FFF47D',
    color2: '#FFBF86',
    color3: '#C2F784',
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
