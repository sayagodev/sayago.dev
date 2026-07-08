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
    <>
      <div ref={containerRef}>
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

        <div className="background">
          {gradients.map((g, i) => (
            <div key={i} className={`intro-img ${i === 2 ? 'hero-img' : ''}`}>
              <Background c1={g.c1} c2={g.c2} c3={g.c3} />
            </div>
          ))}
          {children}
        </div>
      </div>
    </>
  )
}
