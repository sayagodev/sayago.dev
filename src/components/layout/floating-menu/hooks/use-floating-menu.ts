"use client"

import { usePageTransition } from "@/hooks/use-page-transition"
import { usePathname } from "@/utils/i18n-navigation"
import { useEffect, useState, useRef } from "react"

export function useFloatingMenu() {
  const pathname = usePathname()
  const { state } = usePageTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const isHome = pathname === "/"

  // Detectar dirección del scroll
  useEffect(() => {
    if (isHome || state !== "idle") return

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight

          // Detectar si está cerca del final de la página (100px antes del final)
          const isNearBottom = windowHeight + currentScrollY >= documentHeight - 100

          // Si está cerca del final, siempre mostrar el menú
          if (isNearBottom) {
            setIsVisible(true)
          }
          // Si el scroll es hacia abajo, ocultar el menú
          else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false)
            setIsOpen(false) // Cerrar el dropdown también
          }
          // Si el scroll es hacia arriba, mostrar el menú
          else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true)
          }

          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHome, state])

  // Lógica de visibilidad
  useEffect(() => {
    if (isHome || state !== "idle") {
      setShouldShow(false)
      setIsOpen(false)
      return
    }
    const timer = setTimeout(() => setShouldShow(true), 100)
    return () => clearTimeout(timer)
  }, [isHome, state, pathname])

  // Click fuera
  useEffect(() => {
    if (!shouldShow) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return
      setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [shouldShow])

  // Ruta activa
  const isActive = (basePath: string) => {
    if (state !== "idle") return false

    if (basePath === "/work") {
      return (
        pathname === "/work" ||
        pathname === "/work/[name]" ||
        (typeof pathname === "string" && pathname.startsWith("/work/"))
      )
    }

    return pathname === basePath
  }

  return {
    isHome,
    isOpen,
    setIsOpen,
    shouldShow: shouldShow && isVisible,
    isActive,
    menuRef,
  }
}
