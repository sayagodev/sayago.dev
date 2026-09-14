'use client'

import { useEffect, useRef } from 'react'
import { Spring } from '@/lib/spring'

// Port of the censor tag in `refactor/wo-page` WoImageSection: idle sine
// float + cursor repulsion, smoothed by springs. The bar covers part of the
// photo (see screenshot) and dodges the cursor on hover.
const INFLUENCE_RADIUS = 80
const MAX_REPEL = 8
const FLOAT_AMPLITUDE = 1
const FLOAT_ANGULAR_SPEED = Math.PI * 2 // 1 Hz

export function CensorBar() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const springX = new Spring({ stiffness: 150, damping: 15 })
    const springY = new Spring({ stiffness: 150, damping: 15 })
    let raf = 0
    let last = performance.now()
    const start = last

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.hypot(deltaX, deltaY)

      if (distance < INFLUENCE_RADIUS && distance > 0) {
        const force = (1 - distance / INFLUENCE_RADIUS) * MAX_REPEL
        const angle = Math.atan2(-deltaY, -deltaX)
        springX.set(Math.cos(angle) * force)
        springY.set(Math.sin(angle) * force)
      } else {
        springX.set(0)
        springY.set(0)
      }
    }

    const handleMouseLeave = () => {
      springX.set(0)
      springY.set(0)
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const float = reduceMotion
        ? 0
        : Math.sin(((now - start) / 1000) * FLOAT_ANGULAR_SPEED) * FLOAT_AMPLITUDE
      const x = springX.update(dt)
      const y = springY.update(dt) + float
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(-10deg)`
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="wo-image__censor font-zi" aria-hidden="true">
      她很漂亮
    </div>
  )
}
