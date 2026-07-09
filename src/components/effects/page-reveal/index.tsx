'use client'

import { usePageReveal } from './use-page-reveal'
import { useRef } from 'react'
import { gradients } from '@/lib/constants'
import './page-reveal.css'
import { Background } from '../background'

export default function PageReveal({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  usePageReveal(containerRef)

  return (
    <div ref={containerRef}>
      {/* Layer 1: Semicolon preloader overlay — covers everything */}
      <div className="preloader-overlay">
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
      <div className="cards-overlay">
        <div className="cards-overlay__bg" />
        <div className="cards-container">
          {gradients.map((g, i) => (
            <div key={i} className={`intro-img ${i === 2 ? 'hero-img' : ''}`}>
              <Background c1={g.c1} c2={g.c2} c3={g.c3} />
            </div>
          ))}
        </div>
      </div>

      {/* Layer 3: Page content — hidden until reveal completes */}
      <div className="page-content">
        {children}
      </div>
    </div>
  )
}
