'use client'

import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTheme } from 'next-themes'
import './theme-picker.css'

gsap.registerPlugin(useGSAP)

const BORDER_RADIUS = 14
const BORDER_CIRCUMFERENCE = 2 * Math.PI * BORDER_RADIUS

interface Theme {
  id: string
  name: string
  gradient: [string, string, string]
  tone: 'light' | 'dark'
}

interface ThemePickerProps {
  themes: Theme[]
  orientation?: 'vertical' | 'horizontal'
  onSelect?: (theme: Theme) => void
}

export function ThemePicker({ themes, orientation = 'vertical', onSelect }: ThemePickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { setTheme } = useTheme()

  const itemRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const borderRefs = useRef<(SVGCircleElement | null)[]>([null, null, null])

  const getCircularIndex = (index: number) => {
    const len = themes.length
    return ((index % len) + len) % len
  }

  const visibleIndices = [
    getCircularIndex(currentIndex - 1),
    getCircularIndex(currentIndex),
    getCircularIndex(currentIndex + 1),
  ]

  const isVertical = orientation === 'vertical'
  const offset = isVertical ? 44 : 52

  const navigate = (dir: number) => {
    setDirection(dir)
    setCurrentIndex((prev) => getCircularIndex(prev + dir))
    const newIndex = getCircularIndex(currentIndex + dir)
    const selectedTheme = themes[newIndex]
    onSelect?.(selectedTheme)
    setTheme(selectedTheme.name.toLowerCase())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (orientation === 'vertical') {
      if (e.key === 'ArrowUp') navigate(-1)
      if (e.key === 'ArrowDown') navigate(1)
    } else {
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
  }

  useGSAP(
    () => {
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[]

      items.forEach((item) => gsap.killTweensOf(item))
      items.forEach((item, position) => {
        const basePosition = (position - 1) * offset

        gsap.set(item, {
          x: isVertical ? 0 : basePosition + direction * offset,
          y: isVertical ? basePosition + direction * offset : 0,
          opacity: 0,
        })

        gsap.to(item, {
          x: isVertical ? 0 : basePosition,
          y: isVertical ? basePosition : 0,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        })
      })
    },
    { dependencies: [currentIndex, direction, isVertical, offset], revertOnUpdate: true }
  )

  useGSAP(
    () => {
      const borderCircle = borderRefs.current[1]
      if (!borderCircle) return
      gsap.killTweensOf(borderCircle)

      const tl = gsap.timeline()
      tl.to(borderCircle, {
        strokeDashoffset: BORDER_CIRCUMFERENCE,
        duration: 0.25,
        ease: 'power2.in',
      })
      tl.to(borderCircle, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: 'power2.out',
      })

      return () => gsap.killTweensOf(borderCircle)
    },
    { dependencies: [currentIndex], revertOnUpdate: false }
  )

  return (
    <div
      role="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="theme-picker"
      data-orientation={orientation}
    >
      <div className="theme-picker__circles">
        {visibleIndices.map((themeIndex, position) => {
          const theme = themes[themeIndex]
          const [color1, color2, color3] = theme.gradient

          return (
            <div
              key={position}
              ref={(el) => {
                itemRefs.current[position] = el
              }}
              role="option"
              aria-selected={position === 1}
              onClick={() => {
                if (position === 0) navigate(-1)
                if (position === 2) navigate(1)
              }}
              className="theme-option"
            >
              <div
                className="theme-option__circle"
                style={{
                  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
                }}
              />
              {position === 1 && (
                <svg className="theme-option__border" viewBox="0 0 32 32">
                  <circle
                    ref={(el) => {
                      borderRefs.current[1] = el
                    }}
                    cx="16"
                    cy="16"
                    r={BORDER_RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={BORDER_CIRCUMFERENCE}
                    style={{ strokeDashoffset: BORDER_CIRCUMFERENCE }}
                    transform="rotate(-90 16 16)"
                  />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
