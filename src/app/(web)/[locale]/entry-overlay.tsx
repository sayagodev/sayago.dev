"use client"

import { useEffect, useState } from "react"

interface EntryOverlayProps {
  durationMs?: number
}

export function EntryOverlay({ durationMs = 1200 }: EntryOverlayProps) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setHidden(true), durationMs)
    return () => clearTimeout(timeout)
  }, [durationMs])

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center bg-(--color-warning) transition-opacity duration-700 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="font-krypton text-neutral text-4xl font-bold tracking-wide">sāyago;dev</h1>
    </div>
  )
}
