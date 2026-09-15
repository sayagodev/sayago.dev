'use client'

import { useEffect, useRef, useState } from 'react'
import { Spring } from '@/lib/spring'
import { useCustomCursor } from './cursor-store'
import './custom-cursor.css'

// Port of `refactor/wo-page` CustomCursor without motion/zustand: an exact
// dot plus a spring-trailing ring. The ring grows over interactive elements
// and both hide while dragging.
const POINTER_SELECTOR =
  'a, button, [role="button"], input, select, textarea, summary, [data-cursor="pointer"]'
const MEDIA = '(hover: hover) and (pointer: fine) and (min-width: 1024px)'

function isPointerTarget(el: Element | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false
  if (el.closest(POINTER_SELECTOR)) return true
  return window.getComputedStyle(el).cursor === 'pointer'
}

export function CustomCursor() {
  const { enabled } = useCustomCursor()
  const [allowed, setAllowed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MEDIA).matches
  )
  const [visible, setVisible] = useState(false)
  const [pointer, setPointer] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const springsRef = useRef<{ x: Spring; y: Spring } | null>(null)

  useEffect(() => {
    const query = window.matchMedia(MEDIA)
    const onChange = (e: MediaQueryListEvent) => setAllowed(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled || !allowed) return
    document.body.classList.add('custom-cursor-enabled')
    return () => document.body.classList.remove('custom-cursor-enabled')
  }, [enabled, allowed])

  useEffect(() => {
    if (!enabled || !allowed) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const springs = {
      x: new Spring({ stiffness: 150, damping: 20, mass: 0.5 }),
      y: new Spring({ stiffness: 150, damping: 20, mass: 0.5 }),
    }
    springsRef.current = springs

    const lastPos = { x: 0, y: 0 }
    let snapped = false
    let raf = 0
    let last = performance.now()
    let pointerDirty = false

    const place = (clientX: number, clientY: number) => {
      lastPos.x = clientX
      lastPos.y = clientY
      dot.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`
      if (!snapped) {
        snapped = true
        springs.x.snap(clientX)
        springs.y.snap(clientY)
      } else {
        springs.x.set(clientX)
        springs.y.set(clientY)
      }
    }

    const handleMove = (e: MouseEvent) => {
      place(e.clientX, e.clientY)
      // El hit-test (elementFromPoint + getComputedStyle) se difiere al tick:
      // hacerlo por evento fuerza un recalculo de layout en cada mousemove.
      pointerDirty = true
    }

    const handleDown = (e: MouseEvent) => {
      const target = e.target as Element | null
      const hasSelection =
        typeof window.getSelection === 'function' && window.getSelection()?.type === 'Range'
      if (hasSelection || isPointerTarget(target)) setDragging(true)
    }

    const stopDragging = () => {
      setDragging(false)
      setVisible(true)
      setPointer(isPointerTarget(document.elementFromPoint(lastPos.x, lastPos.y)))
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const x = springs.x.update(dt)
      const y = springs.y.update(dt)
      ring.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      if (pointerDirty) {
        pointerDirty = false
        setVisible(true)
        setPointer(isPointerTarget(document.elementFromPoint(lastPos.x, lastPos.y)))
      }
      raf = requestAnimationFrame(tick)
    }

    const handleLeave = () => setVisible(false)
    const handleEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    window.addEventListener('mouseenter', handleEnter)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', stopDragging)
    document.addEventListener('mouseup', stopDragging)
    document.addEventListener('dragend', stopDragging)
    document.addEventListener('drop', stopDragging)
    window.addEventListener('pointerup', stopDragging)
    raf = requestAnimationFrame(tick)

    return () => {
      springsRef.current = null
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('mouseenter', handleEnter)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', stopDragging)
      document.removeEventListener('mouseup', stopDragging)
      document.removeEventListener('dragend', stopDragging)
      document.removeEventListener('drop', stopDragging)
      window.removeEventListener('pointerup', stopDragging)
      cancelAnimationFrame(raf)
    }
  }, [enabled, allowed])

  // Note: the markup always renders (hidden by default) so server and
  // client HTML match. `enabled`/`allowed` only gate the effects and the
  // visibility flags — never the rendered output (avoids hydration #418).
  const show = enabled && allowed && visible && !dragging

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor__dot"
        data-show={show && !pointer}
        aria-hidden="true"
        role="presentation"
      >
        <div className="custom-cursor__dot-inner" />
      </div>
      <div
        ref={ringRef}
        className="custom-cursor__ring"
        data-show={show}
        data-pointer={pointer}
        aria-hidden="true"
        role="presentation"
      >
        <div className="custom-cursor__ring-inner" />
      </div>
    </>
  )
}
