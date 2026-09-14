'use client'

import { useEffect, useRef, useState } from 'react'
import { Spring } from '@/lib/spring'

interface VersionBadgeProps {
  readonly label: string
  readonly version: string
}

// Port of the hover tooltip in `refactor/wo-page` ShowVersion: a chip that
// chases the cursor with springs while hovering the version badge.
const CURSOR_OFFSET_Y = 16

export function VersionBadge({ label, version }: VersionBadgeProps) {
  const [open, setOpen] = useState(false)
  const tipRef = useRef<HTMLDivElement>(null)
  const springsRef = useRef<{ x: Spring; y: Spring } | null>(null)

  useEffect(() => {
    const tip = tipRef.current
    if (!tip) return

    const springs = {
      x: new Spring({ stiffness: 600, damping: 40, mass: 0.2 }),
      y: new Spring({ stiffness: 600, damping: 40, mass: 0.2 }),
    }
    springs.x.snap(-160)
    springs.y.snap(window.innerHeight / 2)
    springsRef.current = springs

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const x = springs.x.update(dt)
      const y = springs.y.update(dt)
      tip.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateY(-100%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      springsRef.current = null
      cancelAnimationFrame(raf)
    }
  }, [])

  const moveTip = (clientX: number, clientY: number) => {
    springsRef.current?.x.set(clientX)
    springsRef.current?.y.set(clientY - CURSOR_OFFSET_Y)
  }

  return (
    <>
      <div
        className="version-badge"
        aria-hidden="true"
        role="presentation"
        onMouseEnter={(e) => {
          moveTip(e.clientX, e.clientY)
          setOpen(true)
        }}
        onMouseMove={(e) => moveTip(e.clientX, e.clientY)}
        onMouseLeave={() => setOpen(false)}
      >
        <p className="version-badge__text">
          <span>版</span>
          <span>本</span>
        </p>
        <span className="version-badge__number">{version}</span>
      </div>

      <div
        ref={tipRef}
        className="version-badge__tip"
        data-open={open}
        aria-hidden="true"
        role="presentation"
      >
        <div className="version-badge__tip-inner">
          <p className="version-badge__tip-text">
            {label} {version} <span className="version-badge__party">🥳</span>
          </p>
        </div>
      </div>
    </>
  )
}
