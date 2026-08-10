'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'
import './flip-picker.css'

gsap.registerPlugin(Flip)

interface Theme {
  id: string
  name: string
  gradient: [string, string, string]
  tone: 'light' | 'dark'
}

interface FlipPickerProps {
  themes: Theme[]
  orientation?: 'vertical' | 'horizontal'
}

const STORAGE_KEY = 'sayagodev-colortheme'

const getStoredThemeName = (): string => {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? stored.replace(/^"|"$/g, '') : 'light'
  } catch {
    return 'light'
  }
}

/**
 * Picker de prueba con reorden tipo "flip" (el seleccionado salta al
 * primer lugar y el resto se desplaza), imitando el Reorder de Motion
 * pero con GSAP Flip.
 *
 * El teleport del intento anterior venía de `absolute: true`: durante el
 * flip los items pasan a position:absolute y el contenedor flex colapsa.
 * Con el modo por defecto (absolute: false) los items permanecen en el
 * layout final y Flip anima un transform compensatorio: sin reflow y
 * sin saltos.
 */
export function FlipPicker({ themes, orientation = 'vertical' }: FlipPickerProps) {
  const { setTheme } = useTheme()
  const rootRef = useRef<HTMLUListElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [currentName, setCurrentName] = useState(getStoredThemeName)
  const [order, setOrder] = useState<Theme[]>(() => {
    const selected = themes.find((t) => t.name === getStoredThemeName())
    return selected ? [selected, ...themes.filter((t) => t.name !== selected.name)] : themes
  })

  useEffect(() => {
    const sync = () => {
      const name = document.documentElement.dataset.theme
      if (!name) return
      const selected = themes.find((t) => t.name === name)
      if (!selected) return
      setCurrentName(name)
      setOrder((prev) => {
        if (prev[0]?.name === name) return prev
        return [selected, ...prev.filter((t) => t.name !== name)]
      })
    }
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [themes])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Entrada sutil al montar
  useEffect(() => {
    const items = rootRef.current?.querySelectorAll<HTMLElement>('.flip-item')
    if (!items?.length) return
    gsap.from(items, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.05,
      delay: 0.4,
    })
  }, [])

  const runThemeTransition = (next: Theme) => {
    const button = rootRef.current?.querySelector<HTMLButtonElement>(
      `.flip-picker__ball[data-theme-name="${next.name}"]`
    )
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!document.startViewTransition || !button || prefersReducedMotion) {
      setTheme(next.name)
      return
    }

    const rect = button.getBoundingClientRect()
    const barOffset = Math.max(
      0,
      -document.documentElement.getBoundingClientRect().top - window.scrollY
    )
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2 + barOffset
    const maxRadius = Math.hypot(
      Math.max(rect.left, window.innerWidth - rect.left),
      Math.max(rect.top, window.innerHeight - rect.top)
    )

    const root = document.documentElement
    root.style.setProperty('--vt-c1', next.gradient[0])
    root.style.setProperty('--vt-c2', next.gradient[1])
    root.style.setProperty('--vt-c3', next.gradient[2])

    const vt = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(next.name)
      })
    })

    void vt.ready.then(() => {
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
    })
  }

  const handleChange = (next: Theme) => {
    if (next.name === currentName) return

    const root = rootRef.current
    if (!root) return
    const items = root.querySelectorAll<HTMLLIElement>('.flip-item')

    gsap.killTweensOf(items)

    // 1) Estado visual actual
    const state = Flip.getState(items)

    // 2) Reorden con render síncrono
    setCurrentName(next.name)
    flushSync(() => {
      setOrder((prev) => {
        if (prev[0]?.name === next.name) return prev
        return [next, ...prev.filter((t) => t.name !== next.name)]
      })
    })

    // 3) Animación FLIP al nuevo layout (sin absolute: el contenedor no colapsa)
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
    })

    // 4) View transition cuando el flip se asienta
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => runThemeTransition(next), 700)
  }

  return (
    <ul ref={rootRef} className="flip-picker" data-orientation={orientation}>
      {order.map((item) => {
        const isSelected = item.name === currentName
        return (
          <li key={item.name} className="flip-item">
            <button
              type="button"
              data-theme-name={item.name}
              onClick={() => handleChange(item)}
              disabled={isSelected}
              aria-pressed={isSelected}
              aria-label={item.name}
              className="flip-picker__ball"
              style={{
                background: `linear-gradient(135deg, ${item.gradient[0]} 0%, ${item.gradient[1]} 50%, ${item.gradient[2]} 100%)`,
              }}
            />
            {isSelected && <span className="flip-picker__ring" aria-hidden="true" />}
          </li>
        )
      })}
    </ul>
  )
}
