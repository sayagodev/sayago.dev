'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTheme } from 'next-themes'
import { useIntlayer } from 'next-intlayer'
import { flushSync } from 'react-dom'
import {
  CENTER_SLOT,
  HIDDEN_SLOT_FROM,
  pickerConfig,
  slotOf,
  slotOpacity,
  slotPosition,
  snapOrbsToSlots,
} from './config'
import './theme-picker.css'

gsap.registerPlugin(useGSAP)

const STORAGE_KEY = 'sayagodev-colortheme'
const DEBUG_HASH = 'debug'
const RING_CIRCUMFERENCE = 2 * Math.PI * pickerConfig.ringRadius
const TRACE_POP = { duration: 0.4, ease: 'back.out(1.7)' }

// El intro (bolas volando) solo se reproduce una vez por sesión. Al cambiar de
// idioma el layout [locale] se re-monta y con él el ThemePicker; sin este flag
// el intro volvería a sonar en cada cambio de idioma. El flag vive a nivel de
// módulo: se resetea en cada carga completa de página.
let introPlayed = false

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

const getStoredThemeIndex = (themes: Theme[]): number => {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return 0
  const clean = stored.replace(/^"|"$/g, '')
  const idx = themes.findIndex((t) => t.name === clean)
  return idx >= 0 ? idx : 0
}

export function ThemePicker({ themes, orientation = 'vertical', onSelect }: ThemePickerProps) {
  const [userIndex, setUserIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()
  const content = useIntlayer('theme-picker')

  const pickerRef = useRef<HTMLDivElement>(null)
  const orbRefs = useRef<(HTMLDivElement | null)[]>([])
  const traceRefs = useRef<(SVGCircleElement | null)[]>([])
  const currentIndexRef = useRef(0)
  const prevIndexRef = useRef(0)
  const directionRef = useRef(1)
  const pendingThemeRef = useRef<Theme | null>(null)
  const vtTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const storedIndex = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange)
      return () => window.removeEventListener('storage', onStoreChange)
    },
    () => getStoredThemeIndex(themes),
    () => 0
  )

  const currentIndex = userIndex ?? storedIndex
  const isVertical = orientation === 'vertical'
  const axisOffset = (value: number) => (isVertical ? { x: 0, y: value } : { x: value, y: 0 })

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    return () => {
      if (vtTimerRef.current) clearTimeout(vtTimerRef.current)
    }
  }, [])

  // El panel de ajuste (animación, espaciado, geometría) vive fuera del bundle
  // de producción: solo se importa en development y con #debug en la URL.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (!window.location.hash.includes(DEBUG_HASH)) return
    void import('./debug-panel').then(({ mountThemePickerDebug }) => mountThemePickerDebug())
  }, [])

  const runThemeTransition = async (selectedTheme: Theme) => {
    const applyTheme = () => setTheme(selectedTheme.name.toLowerCase())

    if (!document.startViewTransition) {
      applyTheme()
      return
    }

    const centerOrb = orbRefs.current[currentIndexRef.current]
    if (!centerOrb) {
      applyTheme()
      return
    }

    const rect = centerOrb.getBoundingClientRect()
    // El clip-path del ::view-transition-new(root) se resuelve en el
    // espacio del documento raíz, que en Chrome Android incluye la zona
    // de la barra de URL: sin compensar, el círculo arranca ~180px más
    // arriba de la bola (en la zona de la URL). rootTop + scrollY
    // aísla esa altura en cualquier estado de scroll; en desktop y en
    // headless es 0.
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
    root.style.setProperty('--vt-c1', selectedTheme.gradient[0])
    root.style.setProperty('--vt-c2', selectedTheme.gradient[1])
    root.style.setProperty('--vt-c3', selectedTheme.gradient[2])

    const vt = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    await vt.ready

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: pickerConfig.lensDuration * 1000,
        easing: pickerConfig.lensEase,
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }

  // La transición de vista se dispara cuando la cinta ya se asentó, para que el
  // círculo nazca siempre en la bola central. El timer de fallback cubre el caso
  // de que el tween no llegue a completar.
  const consumePendingTheme = () => {
    const pending = pendingThemeRef.current
    if (!pending) return
    pendingThemeRef.current = null
    if (vtTimerRef.current) clearTimeout(vtTimerRef.current)
    vtTimerRef.current = setTimeout(() => runThemeTransition(pending), pickerConfig.vtSettleDelay)
  }

  const selectTheme = (index: number, direction: number) => {
    const total = themes.length
    const nextIndex = ((index % total) + total) % total
    const selectedTheme = themes[nextIndex]

    directionRef.current = direction
    setUserIndex(nextIndex)
    onSelect?.(selectedTheme)

    pendingThemeRef.current = selectedTheme
    if (vtTimerRef.current) clearTimeout(vtTimerRef.current)
    vtTimerRef.current = setTimeout(() => {
      const pending = pendingThemeRef.current
      if (!pending) return
      pendingThemeRef.current = null
      runThemeTransition(pending)
    }, pickerConfig.vtFallbackDelay)
  }

  const navigate = (dir: number) => {
    selectTheme(currentIndexRef.current + dir, dir)
  }

  const handleOrbClick = (index: number) => {
    const slot = slotOf(index, currentIndexRef.current, themes.length)
    if (slot >= HIDDEN_SLOT_FROM || slot === CENTER_SLOT) return
    selectTheme(index, slot < CENTER_SLOT ? -1 : 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === (isVertical ? 'ArrowUp' : 'ArrowLeft')) navigate(-1)
    if (e.key === (isVertical ? 'ArrowDown' : 'ArrowRight')) navigate(1)
  }

  useGSAP(
    () => {
      if (mounted) return
      const picker = pickerRef.current
      if (!picker) return
      const orbs = orbRefs.current.filter(Boolean) as HTMLDivElement[]
      if (orbs.length === 0) return

      // Re-mount por cambio de idioma: el intro ya se vio esta sesión, así que
      // las bolas se colocan directamente en su slot, sin animación.
      if (introPlayed) {
        snapOrbsToSlots(picker, currentIndex)
        prevIndexRef.current = currentIndex
        setMounted(true)
        return
      }

      const gap = pickerConfig.slotGap[orientation]
      const entries: { orb: HTMLDivElement; slot: number; target: { x: number; y: number } }[] = []

      // El índice recién se conoce al hidratar (useSyncExternalStore arranca en
      // 0 en el primer render): si llega una colocación previa a medio camino,
      // este efecto vuelve a correr y la reemplaza.
      orbs.forEach((orb) => gsap.killTweensOf(orb))

      orbs.forEach((orb, index) => {
        const slot = slotOf(index, currentIndex, orbs.length)
        const target = slotPosition(slot, orientation, gap)

        if (slot >= HIDDEN_SLOT_FROM) {
          gsap.set(orb, { ...target, opacity: 0, scale: 1, rotation: 0 })
          return
        }

        // Arrancan una posición más allá de su slot, giradas y encogidas.
        gsap.set(orb, { ...axisOffset(slot * gap), opacity: 0, scale: 0.5, rotation: -180 })
        entries.push({ orb, slot, target })
      })

      gsap.to(
        entries.map(({ orb }) => orb),
        {
          x: (i: number) => entries[i].target.x,
          y: (i: number) => entries[i].target.y,
          opacity: (i: number) => slotOpacity(entries[i].slot),
          scale: 1,
          rotation: 0,
          duration: pickerConfig.introDuration,
          ease: pickerConfig.introEase,
          stagger: pickerConfig.introStagger,
          delay: pickerConfig.introDelay,
          onComplete: () => {
            introPlayed = true
            prevIndexRef.current = currentIndex
            setMounted(true)
          },
        }
      )
    },
    { dependencies: [orientation, currentIndex], revertOnUpdate: false }
  )

  useGSAP(
    () => {
      if (!mounted) return
      const previous = prevIndexRef.current
      if (previous === currentIndex) return

      const total = themes.length
      const direction = directionRef.current
      const gap = pickerConfig.slotGap[orientation]
      // El orbe que sale de la banda se apaga en su extremo; el que entra por el
      // lado opuesto viene desde el slot oculto.
      const exitSlot = direction > 0 ? 0 : 2
      const enterSlot = direction > 0 ? HIDDEN_SLOT_FROM : total - 1
      const timeline = gsap.timeline({ onComplete: consumePendingTheme })

      orbRefs.current.forEach((orb) => {
        if (orb) gsap.killTweensOf(orb)
      })

      orbRefs.current.forEach((orb, index) => {
        if (!orb) return
        const fromSlot = slotOf(index, previous, total)
        const toSlot = slotOf(index, currentIndex, total)
        const target = slotPosition(toSlot, orientation, gap)

        if (fromSlot === enterSlot) {
          timeline.fromTo(
            orb,
            { ...slotPosition(fromSlot, orientation, gap), opacity: 0 },
            {
              ...target,
              opacity: slotOpacity(toSlot),
              duration: pickerConfig.shiftDuration,
              ease: pickerConfig.shiftEase,
            },
            0
          )
          return
        }

        if (fromSlot === exitSlot) {
          timeline.to(
            orb,
            {
              ...target,
              opacity: 0,
              duration: pickerConfig.shiftDuration * 0.5,
              ease: 'power1.in',
            },
            0
          )
          return
        }

        timeline.to(
          orb,
          {
            ...target,
            opacity: slotOpacity(toSlot),
            duration: pickerConfig.shiftDuration,
            ease: pickerConfig.shiftEase,
          },
          fromSlot * pickerConfig.shiftStagger
        )
      })

      prevIndexRef.current = currentIndex
    },
    { dependencies: [currentIndex, mounted], revertOnUpdate: false }
  )

  useGSAP(
    () => {
      if (!mounted) return

      traceRefs.current.forEach((trace) => {
        if (!trace) return
        gsap.killTweensOf(trace)
        gsap.set(trace, { strokeDashoffset: RING_CIRCUMFERENCE, opacity: 0 })
      })

      const trace = traceRefs.current[currentIndex]
      if (!trace) return

      // El resto de trazos queda apagado: solo el activo se dibuja.
      gsap.set(trace, { opacity: 1 })

      const svg = trace.closest('svg')
      if (svg) {
        gsap.killTweensOf(svg)
        gsap.fromTo(svg, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, ...TRACE_POP })
      }

      gsap.timeline({ delay: pickerConfig.traceDelay }).to(trace, {
        strokeDashoffset: 0,
        duration: pickerConfig.traceDuration,
        ease: 'power2.out',
      })
    },
    { dependencies: [currentIndex, mounted], revertOnUpdate: false }
  )

  return (
    <div
      ref={pickerRef}
      role="listbox"
      tabIndex={0}
      aria-label={content.aria.label}
      onKeyDown={handleKeyDown}
      className="theme-picker"
      data-orientation={orientation}
    >
      <div className="theme-picker__dock">
        {themes.map((theme, index) => {
          const selected = index === currentIndex
          const [color1, color2, color3] = theme.gradient

          return (
            <div
              key={theme.id}
              ref={(el) => {
                orbRefs.current[index] = el
                // Beidou detecta interactivos vía [onclick] en el DOM; React no
                // emite el atributo, así que lo marcamos nativamente
                el?.setAttribute('onclick', 'void(0)')
              }}
              role="option"
              aria-selected={selected}
              aria-label={content.aria.options[theme.name as keyof typeof content.aria.options]}
              data-slot={slotOf(index, currentIndex, themes.length)}
              data-selected={selected}
              className="theme-orb"
              onClick={() => handleOrbClick(index)}
            >
              <span
                className="theme-orb__surface"
                aria-hidden="true"
                style={{
                  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
                }}
              />
              <svg
                className="theme-orb__svg"
                width={32}
                height={32}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <circle
                  ref={(el) => {
                    traceRefs.current[index] = el
                  }}
                  className="theme-orb__trace"
                  cx="16"
                  cy="16"
                  r={pickerConfig.ringRadius}
                  fill="none"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE}
                  transform="rotate(-90 16 16)"
                />
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}
