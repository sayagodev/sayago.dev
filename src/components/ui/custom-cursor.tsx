"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { useCursor } from "@/hooks/use-cursor"
import { useIsMobile } from "@/hooks/use-mobile"

export function CustomCursor() {
  const { isCustomCursorEnabled } = useCursor()
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const isMobile = useIsMobile()
  // Spring suave para el anillo exterior (sigue con delay)
  const xSpring = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 })
  const ySpring = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 })
  const lastPos = useRef({ x: 0, y: 0 })

  // Controla la clase en el body para ocultar/mostrar cursor nativo
  useEffect(() => {
    if (typeof document === "undefined") return

    if (isCustomCursorEnabled) {
      document.body.classList.add("custom-cursor-enabled")
    } else {
      document.body.classList.remove("custom-cursor-enabled")
    }

    return () => {
      document.body.classList.remove("custom-cursor-enabled")
    }
  }, [isCustomCursorEnabled])

  useEffect(() => {
    setIsClient(true)

    const isPointerTarget = (el: Element | null) => {
      if (!el || !(el instanceof HTMLElement)) return false
      if (
        el.closest(
          'a, button, [role="button"], input, select, textarea, summary, [data-cursor="pointer"]'
        )
      ) {
        return true
      }
      const cursor = window.getComputedStyle(el).cursor
      return cursor === "pointer"
    }

    const handleMove = (e: MouseEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY }
      x.set(e.clientX)
      y.set(e.clientY)
      if (!isVisible) setIsVisible(true)

      const el = document.elementFromPoint(e.clientX, e.clientY)
      setIsPointer(isPointerTarget(el))
    }

    const handleLeave = () => setIsVisible(false)
    const handleEnter = () => setIsVisible(true)

    const handleDown = (e: MouseEvent) => {
      const target = e.target as Element | null
      const hasSelection =
        typeof window.getSelection === "function" && window.getSelection()?.type === "Range"

      if (hasSelection || isPointerTarget(target)) {
        setIsDragging(true)
      }
    }

    const stopDragging = () => {
      setIsDragging(false)
      setIsVisible(true)
      const el = document.elementFromPoint(lastPos.current.x, lastPos.current.y)
      setIsPointer(isPointerTarget(el))
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseleave", handleLeave)
    window.addEventListener("mouseenter", handleEnter)
    window.addEventListener("mousedown", handleDown)
    window.addEventListener("mouseup", stopDragging)
    document.addEventListener("mouseup", stopDragging)
    document.addEventListener("dragend", stopDragging)
    document.addEventListener("drop", stopDragging)
    window.addEventListener("pointerup", stopDragging)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseleave", handleLeave)
      window.removeEventListener("mouseenter", handleEnter)
      window.removeEventListener("mousedown", handleDown)
      window.removeEventListener("mouseup", stopDragging)
      document.removeEventListener("mouseup", stopDragging)
      document.removeEventListener("dragend", stopDragging)
      document.removeEventListener("drop", stopDragging)
      window.removeEventListener("pointerup", stopDragging)
    }
  }, [isVisible, x, y])

  if (!isClient || !isCustomCursorEnabled || isMobile) return null

  const showCursor = isVisible && !isDragging

  return (
    <>
      {/* Punto central - sigue el mouse exacto */}
      <motion.div
        className="pointer-events-none fixed z-9999 hidden lg:block"
        style={{
          left: x,
          top: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showCursor && !isPointer ? 1 : 0,
          scale: showCursor && !isPointer ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Doble capa: sombra clara + punto oscuro */}
        <div className="relative">
          {/* <div className="absolute inset-0 size-3 rounded-full bg-primary/80 blur-[1px]" /> */}
          <div className="bg-cursor relative size-3 rounded-full" />
        </div>
      </motion.div>

      {/* Anillo exterior - sigue con spring (efecto "trail") */}
      <motion.div
        className="pointer-events-none fixed z-9999 hidden items-center justify-center lg:flex"
        style={{
          left: xSpring,
          top: ySpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: showCursor ? 1 : 0,
          scale: showCursor ? (isPointer ? 1.4 : 1) : 0.5,
        }}
        transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
      >
        {/* Doble borde: exterior claro + interior oscuro para contraste en cualquier fondo */}
        <div
          style={{
            boxShadow: "0 0 0 1px var(--color-cursor)",
          }}
          className={[
            "rounded-full transition-all duration-200 ease-out",
            isPointer
              ? "border-cursor/90 bg-cursor/5 h-8 w-8 border"
              : "border-cursor/80 h-6 w-6 border bg-transparent",
          ].join(" ")}
        />
      </motion.div>
    </>
  )
}
