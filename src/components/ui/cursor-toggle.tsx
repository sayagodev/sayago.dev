'use client'

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
            className="absolute top-[30px] left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 px-3 py-1.5 border border-foreground/20 hover:border-foreground/40 transition-colors font-argon text-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            title={isCustomCursorEnabled ? "Desactivar cursor custom" : "Activar cursor custom"}
        >
            <span className="relative flex items-center justify-center w-4 h-4">
                {/* Icono de cursor */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
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
                        <span className="w-5 h-0.5 bg-current rotate-45 rounded-full" />
                    </motion.span>
                )}
            </span>
            <span className="hidden sm:inline">
                {isCustomCursorEnabled ? "Cursor: On" : "Cursor: Off"}
            </span>
        </MotionButton>
    )
}
