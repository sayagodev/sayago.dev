'use client'

import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'
import './theme-picker.css'

gsap.registerPlugin(useGSAP)

const BORDER_RADIUS = 14
const BORDER_CIRCUMFERENCE = 2 * Math.PI * BORDER_RADIUS
const SELECTED_BORDER_COLOR = '#FFE5BF'
const BORDER_DELAY = 1.6
const BORDER_DURATION = 0.6
const STAGGER_DELAY = 0.05
const VT_DELAY_AFTER_SLIDE = 800

const BOX_SHADOW = {
  idle: '0 2px 6px rgb(from #000 r g b / 0.15)',
  hover: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
  selected: `0 0 20px 0 rgba(255, 229, 191, 0.9)`,
}

const STORAGE_KEY = 'sayagodev-colortheme'

const getStoredThemeIndex = (themes: Theme[]): number => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return 0
  const clean = stored.replace(/^"|"$/g, '')
  const idx = themes.findIndex((t) => t.name === clean)
  return idx >= 0 ? idx : 0
}

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
  const [currentIndex, setCurrentIndex] = useState(() => getStoredThemeIndex(themes))
  const [direction, setDirection] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { setTheme } = useTheme()

  const itemRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const borderRefs = useRef<(SVGCircleElement | null)[]>([null, null, null])
  const currentIndexRef = useRef(0)
  const vtTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    return () => {
      if (vtTimerRef.current) clearTimeout(vtTimerRef.current)
    }
  }, [])

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

  const navigate = async (dir: number) => {
    const newIndex = getCircularIndex(currentIndexRef.current + dir)
    const selectedTheme = themes[newIndex]

    setDirection(dir)
    setCurrentIndex(newIndex)
    onSelect?.(selectedTheme)

    if (document.startViewTransition) {
      if (vtTimerRef.current) clearTimeout(vtTimerRef.current)

      vtTimerRef.current = setTimeout(async () => {
        const centerEl = itemRefs.current[1]
        if (!centerEl) {
          setTheme(selectedTheme.name.toLowerCase())
          return
        }

        const rect = centerEl.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2
        const maxRadius = Math.hypot(
          Math.max(rect.left, window.innerWidth - rect.left),
          Math.max(rect.top, window.innerHeight - rect.top)
        )

        const root = document.documentElement
        root.style.setProperty('--vt-c1', selectedTheme.gradient[0])
        root.style.setProperty('--vt-c2', selectedTheme.gradient[1])
        root.style.setProperty('--vt-c3', selectedTheme.gradient[2])

        const vt = document.startViewTransition(() => {
          flushSync(() => {
            setTheme(selectedTheme.name.toLowerCase())
          })
        })

        await vt.ready

        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      }, VT_DELAY_AFTER_SLIDE)
    } else {
      setTheme(selectedTheme.name.toLowerCase())
    }
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
      if (mounted) return

      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[]
      if (items.length === 0) return

      items.forEach((item, position) => {
        const basePosition = (position - 1) * offset
        gsap.set(item, {
          x: isVertical ? 0 : basePosition + offset,
          y: isVertical ? basePosition + offset : 0,
          opacity: 0,
          scale: 0.5,
          rotation: -180,
        })
      })

      gsap.to(items, {
        x: (i: number) => (isVertical ? 0 : (i - 1) * offset),
        y: (i: number) => (isVertical ? (i - 1) * offset : 0),
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'back.out(1.4)',
        stagger: STAGGER_DELAY,
        delay: 0.5,
        onComplete: () => setMounted(true),
      })
    },
    { dependencies: [isVertical, offset], revertOnUpdate: false }
  )

  useGSAP(
    () => {
      if (!mounted) return

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
          delay: position * STAGGER_DELAY,
        })
      })
    },
    { dependencies: [currentIndex, direction, isVertical, offset, mounted] }
  )

  useGSAP(
    () => {
      if (!mounted) return

      const borderCircle = borderRefs.current[1]
      if (!borderCircle) return
      gsap.killTweensOf(borderCircle)

      gsap.set(borderCircle, {
        strokeDashoffset: BORDER_CIRCUMFERENCE,
      })

      const svg = borderCircle.closest('svg')
      if (svg) {
        gsap.fromTo(
          svg,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1.1, duration: 0.4, ease: 'back.out(1.7)' }
        )
      }

      const tl = gsap.timeline({ delay: BORDER_DELAY })
      tl.to(borderCircle, {
        strokeDashoffset: 0,
        duration: BORDER_DURATION,
        ease: 'power2.out',
      })

      return () => gsap.killTweensOf(borderCircle)
    },
    { dependencies: [currentIndex, mounted], revertOnUpdate: false }
  )

  const getBoxShadow = (position: number) => {
    if (position === 1) return BOX_SHADOW.selected
    if (hoveredIndex === position) return BOX_SHADOW.hover
    return BOX_SHADOW.idle
  }

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
              onMouseEnter={() => setHoveredIndex(position)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="theme-option"
            >
              <div
                className="theme-option__circle"
                style={{
                  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
                  boxShadow: getBoxShadow(position),
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
                    stroke={SELECTED_BORDER_COLOR}
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
