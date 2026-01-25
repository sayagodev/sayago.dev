"use client"

import { useEffect } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function ReducedMotionProvider() {
  const initialize = useReducedMotion((state) => state.initialize)

  useEffect(() => {
    const cleanup = initialize()
    return cleanup
  }, [initialize])

  return null
}
