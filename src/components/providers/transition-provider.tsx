'use client'

import gsap from 'gsap'
import { TransitionRouter } from 'next-transition-router'

const CORNER_SIZE = 60
const CORNER_GAP_MOBILE = 15
const CORNER_GAP_DESKTOP = 30
const MOBILE_BREAKPOINT = 640

// Mismo ritmo que el page-reveal (0.3s por parte), pero en orden inverso
const FLY_DURATION = 0.3
const FLY_EASE = 'power3.inOut'

const CORNER_SELECTOR = '.corner-top-r, .corner-top-l, .corner-bottom-l, .corner-bottom-r'

// Anima un elemento hasta que su centro quede en (x, y) del viewport.
// Usa deltas RELATIVOS ("+="): funciona tanto con corners pineados
// (transform: none) como con transforms acumulados del intro.
function moveTo(el: HTMLElement, x: number, y: number, vars: gsap.TweenVars) {
  const rect = el.getBoundingClientRect()
  return gsap.to(el, {
    x: `+=${x - (rect.left + rect.width / 2)}`,
    y: `+=${y - (rect.top + rect.height / 2)}`,
    ...vars,
  })
}

// El snap()/reveal dejan transforms inline cuyo estado GSAP-cacheado puede
// diferir del estado computado real (el fly-out del intro vs el pin crudo).
// Sincroniza la caché de GSAP con la matriz computada para que los deltas
// "+=" partan del estado real. También zeroea xPercent/yPercent: el reveal
// los deja en -50 en la caché y GSAP los compondría al escribir x/y,
// desplazando los corners ~30px.
function syncTransformCache(elements: HTMLElement[]) {
  elements.forEach((el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform)
    gsap.set(el, { x: m.e, y: m.f, xPercent: 0, yPercent: 0 })
  })
}

// Las láminas (200%×200svh con translate(-50%,-50%)) tienen un transform
// base que corrompe la caché de GSAP. Las congelamos en su posición visual
// actual con left/top en px y transform: none, y animamos left/top (sin
// transform ni caché de por medio).
function freezeFrames(frames: HTMLElement[]) {
  frames.forEach((frame) => {
    const r = frame.getBoundingClientRect()
    frame.style.transform = 'none'
    frame.style.left = `${r.left}px`
    frame.style.top = `${r.top}px`
  })
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  // LEAVE — el page-reveal al revés:
  // 1) corners + láminas van al centro (misma duración: los más lejanos van
  //    más rápido y llegan a la vez — GSAP anima la duración, no la velocidad)
  // 2) el cuadrado aparece tapando el centro
  // 3) un poco después el colon completa el semicolon
  const leave = (next: () => void) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const corners = gsap.utils.toArray<HTMLElement>(CORNER_SELECTOR)
    const frames = gsap.utils.toArray<HTMLElement>('.frame-top-r, .frame-bottom-l')
    const tl = gsap.timeline({ onComplete: next })

    syncTransformCache(corners)
    freezeFrames(frames)

    // El colon (la figura de abajo): normalizamos a su posición CSS
    // (translate(-50%, 35%) → y ≈ 42px) para que quede 12px debajo del
    // square, como en el reveal. El yPercent de GSAP se SUMA al y del CSS,
    // así que animamos en px.
    const colon = document.querySelector<HTMLElement>('.colon')
    let colonBaseY = 42
    if (colon) {
      gsap.set(colon, { clearProps: 'transform' })
      colonBaseY = new DOMMatrix(getComputedStyle(colon).transform).f
      gsap.set(colon, { y: colonBaseY })
    }

    // El overlay (z 9999) tapa los corners (z 100): los subimos por encima.
    // El square va DETRÁS de los corners (como en el reveal): solo se ve a
    // través del hueco central que dejan las L-shapes, no como bloque sólido.
    tl.set(CORNER_SELECTOR, { zIndex: 10000 }, 0)
    tl.set('.preloader-overlay', { visibility: 'visible' }, 0)
    tl.set('.square', { clearProps: 'transform,zIndex' }, 0)
    tl.set('.square', { opacity: 0 }, 0)
    if (colon) tl.set(colon, { opacity: 0 }, 0)

    // 1) corners + láminas → centro
    corners.forEach((el) => {
      tl.add(
        moveTo(el, vw / 2, vh / 2, {
          duration: FLY_DURATION,
          ease: FLY_EASE,
        }),
        0
      )
    })
    frames.forEach((frame) => {
      tl.add(
        gsap.to(frame, {
          left: vw / 2 - vw,
          top: vh / 2 - vh,
          duration: FLY_DURATION,
          ease: FLY_EASE,
          onComplete: () => gsap.set(frame, { clearProps: 'left,top,transform' }),
        }),
        0
      )
    })

    // 2) el cuadrado tapa el centro (al llegar los corners)
    tl.to('.square', { opacity: 1, duration: 0.2, ease: 'power2.out' }, FLY_DURATION)

    // 3) el colon (la figura de abajo) completa el semicolon.
    // Sube desde abajo hasta su posición CSS (y = colonBaseY ≈ 42px),
    // 12px debajo del square, como en el reveal.
    if (colon) {
      tl.fromTo(
        colon,
        { opacity: 0, y: colonBaseY + colon.offsetHeight * 0.7 },
        {
          opacity: 1,
          y: colonBaseY,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => gsap.set(colon, { clearProps: 'transform' }),
        },
        FLY_DURATION + 0.05
      )
    }

    return () => tl.kill()
  }

  // ENTER — el mismo timing que el page-reveal:
  // colon sale primero, square desaparece, corners + láminas salen en paralelo
  const enter = (next: () => void) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Mismos targets que el snap(): el borde exterior del corner toca el gap
    const outerGap = vw < MOBILE_BREAKPOINT ? CORNER_GAP_MOBILE : CORNER_GAP_DESKTOP
    const half = CORNER_SIZE / 2

    const targets: Record<string, [number, number]> = {
      '.corner-top-r': [vw - outerGap - half, outerGap + half],
      '.corner-top-l': [outerGap + half, outerGap + half],
      '.corner-bottom-l': [outerGap + half, vh - outerGap - half],
      '.corner-bottom-r': [vw - outerGap - half, vh - outerGap - half],
    }

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new Event('page-transition-end'))
        next()
      },
    })

    const frames = gsap.utils.toArray<HTMLElement>('.frame-top-r, .frame-bottom-l')
    freezeFrames(frames)

    // Colon sale primero, el square desaparece justo después
    tl.to('.colon', { opacity: 0, y: '70%', duration: FLY_DURATION, ease: FLY_EASE }, 0)
    tl.set('.square', { opacity: 0 }, '<0.3')

    // Corners + láminas salen en paralelo (como el reveal)
    Object.entries(targets).forEach(([selector, [tx, ty]]) => {
      const el = document.querySelector<HTMLElement>(selector)
      if (!el) return
      tl.add(moveTo(el, tx, ty, { duration: FLY_DURATION, ease: FLY_EASE }), '<')
    })
    frames.forEach((frame) => {
      const isTop = frame.classList.contains('frame-top-r')
      tl.add(
        gsap.to(frame, {
          left: isTop ? 0 : -vw,
          top: isTop ? -vh : 0,
          duration: FLY_DURATION,
          ease: FLY_EASE,
        }),
        '<'
      )
    })
    tl.set('.preloader-overlay', { visibility: 'hidden' }, '<0.4')

    return () => tl.kill()
  }

  return (
    <TransitionRouter auto leave={leave} enter={enter}>
      {children}
    </TransitionRouter>
  )
}
