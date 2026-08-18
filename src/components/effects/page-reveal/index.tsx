'use client'

import { usePageReveal } from './use-page-reveal'
import { useRef, useState } from 'react'
import { gradients, themes } from '@/lib/constants'
import './page-reveal.css'
import { Background } from '../background'

const STORAGE_KEY = 'sayagodev-colortheme'

const DEFAULT_THEME_NAME = 'light'

function fallbackIndex() {
  const idx = themes.findIndex((t) => t.name === DEFAULT_THEME_NAME)
  return idx >= 0 ? idx : 2
}

function getHeroIndex(): number {
  if (typeof window === 'undefined') return fallbackIndex()
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return fallbackIndex()
  const clean = stored.replace(/^"|"$/g, '')
  const idx = themes.findIndex((t) => t.name === clean)
  return idx >= 0 ? idx : fallbackIndex()
}

function sortGradientsForHero(heroIdx: number): typeof gradients {
  const len = gradients.length
  return Array.from({ length: 5 }, (_, offset) => {
    const idx = (((heroIdx + offset - 2) % len) + len) % len
    return gradients[idx]
  })
}
export default function PageReveal({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [sortedGradients] = useState(() => {
    const heroIdx = getHeroIndex()
    return sortGradientsForHero(heroIdx)
  })

  usePageReveal(containerRef)

  return (
    <div ref={containerRef}>
      {/* Layer 1: Semicolon preloader overlay — covers everything */}
      <div className="preloader-overlay" aria-hidden="true">
        <div className="semicolon">
          <div className="frame-top-r" />
          <div className="frame-bottom-l" />
          <div className="square" />
          <div className="corner-top-r" />
          <div className="corner-top-l" />
          <div className="corner-bottom-l" />
          <div className="corner-bottom-r" />
          <div className="colon"></div>
        </div>
      </div>

      {/* Layer 2: Cards overlay — white bg + gradient cards */}
      <div className="cards-overlay" aria-hidden="true">
        <div className="cards-overlay__bg" />
        <div className="cards-container">
          {sortedGradients.map((g, i) => (
            <div key={i} className={`intro-img ${i === 2 ? 'hero-img' : ''}`}>
              <Background {...(i === 2 ? {} : { c1: g.c1, c2: g.c2, c3: g.c3 })} />
            </div>
          ))}
        </div>
      </div>

      {/* Layer 3: Page content — hidden until reveal completes */}
      <div className="page-content">{children}</div>
    </div>
  )
}
