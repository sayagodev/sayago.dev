'use client'

import { useEffect } from 'react'

// Glifo "punto y coma" en su espacio original (83 de ancho): punto (bloque
// superior) y punto y coma (bloque medio + coma, unidos). El hueco del original
// (20 entre el punto y el punto y coma) se abre para que ambos no se fundan en
// una mancha a tamaño de pestaña; el conjunto se centra dentro del círculo.
type Rect = [x0: number, y0: number, x1: number, y1: number]

const TOP_RECTS: Rect[] = [
  [0, 0, 83, 20.75],
  [0, 0, 20.75, 83],
  [62.25, 0, 83, 83],
  [0, 62.25, 83, 83],
  [15, 16, 69, 71],
]

const MID_RECTS: Rect[] = [
  [0, 103, 83, 123.75],
  [0, 103, 20.75, 186],
  [62.25, 103, 83, 186],
  [0, 165.25, 83, 186],
  [20.75, 123.75, 62.25, 165.25],
]

const COMMA_POINTS: [number, number][] = [
  [38.733, 268.308],
  [83, 186],
  [38.733, 186],
  [17.983, 256.328],
]

const TOP_HEIGHT = 83
const MID_HEIGHT = 83
const COMMA_HEIGHT = 82.308
const ORIGINAL_GAP = 20

const GAP_TOP_MID = 36
const GAP_MID_COMMA = 0

// Alto del glifo (con sus huecos) y tamaño al que se dibuja en el lienzo 100×100
const GLYPH_HEIGHT = TOP_HEIGHT + GAP_TOP_MID + MID_HEIGHT + GAP_MID_COMMA + COMMA_HEIGHT
const GLYPH_SIZE = 70

const LOGO_SCALE = GLYPH_SIZE / GLYPH_HEIGHT
const LOGO_TRANSLATE_X = (100 - 83 * LOGO_SCALE) / 2
const LOGO_TRANSLATE_Y = (100 - GLYPH_SIZE) / 2

const FALLBACK_CORNER = '#ffa4a4'
const FALLBACK_REVEAL_BG = '#fefcf5'

// apple-touch-icon no acepta SVG: se rasteriza el mismo dibujo a PNG.
const APPLE_ICON_SIZE = 180

const rectPath = ([x0, y0, x1, y1]: Rect) => `M${x0} ${y0}h${x1 - x0}v${y1 - y0}h${-(x1 - x0)}z`

function glyphPaths(): string[] {
  const dyMid = GAP_TOP_MID - ORIGINAL_GAP
  const dyComma = dyMid + GAP_MID_COMMA
  const shift = ([x0, y0, x1, y1]: Rect, dy: number): Rect => [x0, y0 + dy, x1, y1 + dy]

  return [
    ...TOP_RECTS.map(rectPath),
    ...MID_RECTS.map((r) => rectPath(shift(r, dyMid))),
    `M${COMMA_POINTS.map(([x, y]) => `${x} ${y + dyComma}`).join('L')}z`,
  ]
}

function buildIconHref(corner: string, revealBg: string): string {
  const paths = glyphPaths()
    .map((d) => `<path fill="${corner}" d="${d}"/>`)
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="${revealBg}"/>
  <g transform="translate(${LOGO_TRANSLATE_X} ${LOGO_TRANSLATE_Y}) scale(${LOGO_SCALE})">${paths}</g>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function buildAppleIconHref(corner: string, revealBg: string): string | null {
  const canvas = document.createElement('canvas')
  canvas.width = APPLE_ICON_SIZE
  canvas.height = APPLE_ICON_SIZE

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const scale = APPLE_ICON_SIZE / 100
  ctx.setTransform(scale, 0, 0, scale, 0, 0)

  ctx.fillStyle = revealBg
  ctx.beginPath()
  ctx.arc(50, 50, 50, 0, Math.PI * 2)
  ctx.fill()

  ctx.translate(LOGO_TRANSLATE_X, LOGO_TRANSLATE_Y)
  ctx.scale(LOGO_SCALE, LOGO_SCALE)
  ctx.fillStyle = corner
  glyphPaths().forEach((d) => ctx.fill(new Path2D(d)))

  return canvas.toDataURL('image/png')
}

export function ThemeFavicon() {
  useEffect(() => {
    const apply = () => {
      const cs = getComputedStyle(document.documentElement)
      const corner = cs.getPropertyValue('--corner').trim() || FALLBACK_CORNER
      const revealBg = cs.getPropertyValue('--reveal-bg').trim() || FALLBACK_REVEAL_BG

      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-theme-icon]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/svg+xml'
        link.sizes = 'any'
        link.setAttribute('data-theme-icon', '')
        document.head.appendChild(link)
      }
      link.href = buildIconHref(corner, revealBg)

      const appleHref = buildAppleIconHref(corner, revealBg)
      if (appleHref) {
        let apple = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
        if (!apple) {
          apple = document.createElement('link')
          apple.rel = 'apple-touch-icon'
          document.head.appendChild(apple)
        }
        apple.href = appleHref
      }
    }

    apply()

    // Re-aplicar cuando cambie el theme (atributo data-theme en <html>)
    const observer = new MutationObserver(apply)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return null
}
