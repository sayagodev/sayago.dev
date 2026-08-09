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

// Congela elementos en su posición visual actual usando left/top en px y
// transform: none. Así animamos left/top sin depender de la caché de GSAP
// (corrompida por el pin crudo del snap() y los transforms base del CSS),
// que hacía que los corners se teletransportaran a posiciones absurdas.
function freezeAtCurrentPosition(elements: HTMLElement[]) {
  elements.forEach((el) => {
    const r = el.getBoundingClientRect()
    el.style.position = 'fixed'
    el.style.transform = 'none'
    el.style.left = `${r.left}px`
    el.style.top = `${r.top}px`
    el.style.right = 'auto'
    el.style.bottom = 'auto'
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
    const half = CORNER_SIZE / 2
    const corners = gsap.utils.toArray<HTMLElement>(CORNER_SELECTOR)
    const frames = gsap.utils.toArray<HTMLElement>('.frame-top-r, .frame-bottom-l')
    const tl = gsap.timeline({ onComplete: next })

    freezeAtCurrentPosition([...corners, ...frames])

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

    // 1) corners + láminas → centro (left/top puro, sin transform)
    corners.forEach((el) => {
      tl.add(
        gsap.to(el, {
          left: vw / 2 - half,
          top: vh / 2 - half,
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
    const outerGap = vw < MOBILE_BREAKPOINT ? CORNER_GAP_MOBILE : CORNER_GAP_DESKTOP

    // Mismos targets que el snap(): el borde exterior del corner toca el gap
    const targets: Record<string, [number, number]> = {
      '.corner-top-r': [vw - outerGap - CORNER_SIZE, outerGap],
      '.corner-top-l': [outerGap, outerGap],
      '.corner-bottom-l': [outerGap, vh - outerGap - CORNER_SIZE],
      '.corner-bottom-r': [vw - outerGap - CORNER_SIZE, vh - outerGap - CORNER_SIZE],
    }

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new Event('page-transition-end'))
        next()
      },
    })

    const corners = gsap.utils.toArray<HTMLElement>(CORNER_SELECTOR)
    const frames = gsap.utils.toArray<HTMLElement>('.frame-top-r, .frame-bottom-l')
    freezeAtCurrentPosition([...corners, ...frames])

    // Colon sale primero, el square desaparece justo después
    tl.to('.colon', { opacity: 0, y: '70%', duration: FLY_DURATION, ease: FLY_EASE }, 0)
    tl.set('.square', { opacity: 0 }, '<0.3')

    // Corners + láminas salen en paralelo (como el reveal)
    corners.forEach((el) => {
      const [tx, ty] =
        targets[
          el.classList.contains('corner-top-l')
            ? '.corner-top-l'
            : el.classList.contains('corner-top-r')
              ? '.corner-top-r'
              : el.classList.contains('corner-bottom-l')
                ? '.corner-bottom-l'
                : '.corner-bottom-r'
        ]
      tl.add(
        gsap.to(el, {
          left: tx,
          top: ty,
          duration: FLY_DURATION,
          ease: FLY_EASE,
        }),
        '<'
      )
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
