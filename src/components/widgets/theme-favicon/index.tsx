'use client'

import { useEffect } from 'react'

// Paths del logo (semicolon) — public/logo.svg, recolorados con el corner del theme
const SEMICOLON_PATHS = [
  'M0 186h20.75v-83H0z',
  'M0 103v20.75h83V103z',
  'M83 186H62.25v-83H83z',
  'M83 103v20.75H0V103z',
  'M0 103h20.75v83H0z',
  'M0 186v-20.75h83V186z',
  'M83 103H62.25v83H83z',
  'M83 186v-20.75H0V186zm-44.267 82.308L83 186H38.733l-20.75 70.328zM20.75 123.75h41.5v41.5h-41.5zM0 83h20.75V0H0z',
  'M0 0v20.75h83V0z',
  'M83 83H62.25V0H83z',
  'M83 0v20.75H0V0z',
  'M0 0h20.75v83H0z',
  'M0 83V62.25h83V83z',
  'M15 16h54v55H15z',
  'M83 0H62.25v83H83z',
  'M83 83V62.25H0V83z',
]

const FALLBACK_CORNER = '#ffa4a4'
const FALLBACK_REVEAL_BG = '#fefcf5'

// El logo (83×269) escalado para llenar el círculo (100×100): ocupa el 80%
// del lienzo (la zona segura: los masks de macOS/iOS recortan el borde)
const LOGO_SCALE = 80 / 269
const LOGO_WIDTH = 83 * LOGO_SCALE
const LOGO_TRANSLATE_X = (100 - LOGO_WIDTH) / 2
const LOGO_TRANSLATE_Y = (100 - 80) / 2

function buildIconHref(corner: string, revealBg: string): string {
  const paths = SEMICOLON_PATHS.map((d) => `<path fill="${corner}" d="${d}"/>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="${revealBg}"/>
  <g transform="translate(${LOGO_TRANSLATE_X} ${LOGO_TRANSLATE_Y}) scale(${LOGO_SCALE})">${paths}</g>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
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
