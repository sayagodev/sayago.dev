'use client'

import { useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePathname } from 'next/navigation'
import { getLocalizedUrl } from 'intlayer'
import { useIntlayer, useLocale } from 'next-intlayer'
import { Link } from '@/components/localized-link'
import VERSION from '@/lib/version'
import { cn } from '@/lib/utils'
import './floating-nav.css'

gsap.registerPlugin(useGSAP)

type NavLabelKey = 'home' | 'work' | 'wo' | 'contact'

interface NavItem {
  href: string
  hanzi: string
  labelKey: NavLabelKey
  match: (path: string) => boolean
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', hanzi: '首', labelKey: 'home', match: (p) => p === '/' },
  {
    href: '/work',
    hanzi: '作',
    labelKey: 'work',
    match: (p) => p === '/work' || p.startsWith('/work/'),
  },
  {
    href: '/wo',
    hanzi: '我',
    labelKey: 'wo',
    match: (p) => p === '/wo' || p.startsWith('/wo/'),
  },
  {
    href: '/contact',
    hanzi: '信',
    labelKey: 'contact',
    match: (p) => p === '/contact' || p.startsWith('/contact/'),
  },
]

interface IconProps {
  open: boolean
  size?: number
  strokeWidth?: number
  className?: string
}

function Icon({ open, size = 18, strokeWidth = 1.5, className }: IconProps) {
  const Comp = open ? X : Menu
  return <Comp size={size} strokeWidth={strokeWidth} className={className} />
}

const PANEL_ID = 'floating-nav-panel'

export function FloatingNav() {
  const { locale, pathWithoutLocale, availableLocales } = useLocale()
  const content = useIntlayer('floating-nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)
  const navRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // El panel de config se cierra al cambiar de ruta (ajuste en render, sin effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  // En mobile, el dock sube solo al llegar al final del scroll (donde aparecen
  // los corners inferiores). El scroll puede vivir en el documento o en un
  // viewport de OverlayScrollbars; escuchamos en fase de captura y en cada
  // turno elegimos el elemento scrollable que realmente se desplaza.
  useEffect(() => {
    let raf = 0

    // Devuelve el elemento con el mayor desbordamiento (el que de verdad hace
    // scroll: OverlayScrollbars, html o body según el entorno/navegador).
    const getViewport = (): HTMLElement | null => {
      const candidates = [
        document.querySelector<HTMLElement>('.os-viewport'),
        document.documentElement,
        document.body,
      ].filter((el): el is HTMLElement => !!el)
      let best: HTMLElement | null = null
      let bestOverflow = 0
      for (const el of candidates) {
        const overflow = el.scrollHeight - el.clientHeight
        if (overflow > bestOverflow) {
          bestOverflow = overflow
          best = el
        }
      }
      return best
    }

    const update = () => {
      const vp = getViewport()
      if (!vp) return
      const scrollable = vp.scrollHeight - vp.clientHeight
      if (scrollable <= 0) return // sin scroll: el dock se queda abajo
      const reached = vp.scrollTop + vp.clientHeight >= scrollable - 8
      setAtBottom(reached)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  // Expansión/colapso del panel de config (height 0 → auto)
  useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel) return
      if (open) {
        gsap.fromTo(
          panel,
          { height: 0, opacity: 0, y: 8 },
          { height: 'auto', opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
        )
      } else {
        gsap.to(panel, { height: 0, opacity: 0, y: 8, duration: 0.3, ease: 'power2.in' })
      }
    },
    { dependencies: [open], scope: navRef }
  )

  // Cerrar el panel con Escape y devolver el foco al toggle
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        navRef.current
          ?.querySelector<HTMLButtonElement>('.floating-nav__toggle')
          ?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Roving focus con flechas: mueve el foco entre los items + toggle,
  // con wrap circular, mientras el foco está dentro de la barra.
  const handleNavKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      return
    }
    const focusables = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>('.floating-nav__item, .floating-nav__toggle') ?? []
    )
    if (focusables.length === 0) return
    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement)
    if (currentIndex === -1) return
    e.preventDefault()
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown'
    const delta = forward ? 1 : -1
    const next = focusables[(currentIndex + delta + focusables.length) % focusables.length]
    next.focus()
  }

  // Al entrar el foco en la barra, activa el roving (los no-parse a -1);
  // al salir de la barra, restaura el tab order natural.
  const handleNavFocus = () => {
    const focusables = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>('.floating-nav__item, .floating-nav__toggle') ?? []
    )
    focusables.forEach((el) => {
      el.tabIndex = el === document.activeElement ? 0 : -1
    })
  }

  const handleNavBlur = (e: React.FocusEvent) => {
    if (navRef.current?.contains(e.relatedTarget as Node)) return
    const focusables = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>('.floating-nav__item, .floating-nav__toggle') ?? []
    )
    focusables.forEach((el) => {
      el.tabIndex = 0
    })
  }

  return (
    <nav
      ref={navRef}
      className="floating-nav"
      aria-label={content.aria.nav}
      data-at-bottom={atBottom}
      onKeyDown={handleNavKeyDown}
      onFocus={handleNavFocus}
      onBlur={handleNavBlur}
    >
      {/* panel de config */}
      <div
        ref={panelRef}
        id={PANEL_ID}
        className="floating-nav__panel"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="floating-nav__panel-head">
          <span>{content.config.title}</span>
        </div>

        <div className="floating-nav__panel-row">
          <span>{content.config.language}</span>
          <span className="floating-nav__langs">
            {availableLocales.map((item) => (
              <NextLink
                key={item}
                href={getLocalizedUrl(pathWithoutLocale, item)}
                hrefLang={item}
                replace
                data-transition-ignore
                className="floating-nav__lang"
                data-active={locale === item}
                aria-current={locale === item ? 'page' : undefined}
              >
                {item.toUpperCase()}
              </NextLink>
            ))}
          </span>
        </div>

        <div className="floating-nav__panel-row" data-disabled="true">
          <span>{content.config.sound}</span>
          <span className="floating-nav__soon">{content.config.soon}</span>
        </div>

        <div className="floating-nav__panel-row" data-disabled="true">
          <span>{content.config.theme}</span>
          <span className="floating-nav__soon">{content.config.soon}</span>
        </div>

        <div className="floating-nav__panel-foot">sāyago;dev — v{VERSION} — 版本</div>
      </div>

      {/* barra — hanzi siempre visible, label solo en el activo */}
      <div className="floating-nav__bar">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathWithoutLocale)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="floating-nav__item"
              data-active={active}
              aria-label={content.items[item.labelKey]}
              aria-current={active ? 'page' : undefined}
            >
              {/* tooltip — solo dispositivos con hover real */}
              <span className="floating-nav__tip">{content.items[item.labelKey]}</span>
              <span className="floating-nav__hanzi">{item.hanzi}</span>
              <span className="floating-nav__label">{content.items[item.labelKey]}</span>
            </Link>
          )
        })}

        <span className="floating-nav__divider" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={content.aria.config}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={PANEL_ID}
          className="floating-nav__toggle"
          data-open={open}
        >
          <span className="floating-nav__tip">{content.aria.config}</span>
          <Icon
            open={open}
            strokeWidth={1.5}
            className={cn('floating-nav__glyph', open && 'floating-nav__glyph--open')}
            aria-hidden="true"
          />
        </button>
      </div>
    </nav>
  )
}
