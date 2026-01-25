"use client"

import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import Lenis from "lenis"
import { useEffect } from "react"

export function SmoothScrollProvider() {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    // Skip Lenis if user prefers reduced motion
    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return null
}
