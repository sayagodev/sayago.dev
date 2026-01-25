"use client"

import { useCursor } from "@/hooks/use-cursor"
import { motion } from "motion/react"
import { Button } from "./button"

const MotionButton = motion.create(Button)

export function CursorToggle() {
  const { isCustomCursorEnabled, toggleCustomCursor } = useCursor()

  return (
    <MotionButton
      tabIndex={0}
      onClick={toggleCustomCursor}
      className="border-foreground/20 hover:border-foreground/40 font-argon absolute top-[30px] left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 border px-3 py-1.5 text-sm transition-colors lg:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      title={isCustomCursorEnabled ? "Desactivar cursor custom" : "Activar cursor custom"}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {/* Icono de cursor */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
        </svg>
        {/* Tachado si está desactivado */}
        {!isCustomCursorEnabled && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            <span className="h-0.5 w-5 rotate-45 rounded-full bg-current" />
          </motion.span>
        )}
      </span>
      <span className="hidden sm:inline">
        {isCustomCursorEnabled ? "Cursor: On" : "Cursor: Off"}
      </span>
    </MotionButton>
  )
}
