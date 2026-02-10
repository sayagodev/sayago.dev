"use client"

import { usePageTransition } from "@/hooks/use-page-transition"
import { usePathname } from "@/utils/i18n-navigation"
import { useEffect, useState, useRef } from "react"

export function useFloatingMenu() {
  const pathname = usePathname()
  const { state } = usePageTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isHome = pathname === "/"

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
    shouldShow,
    isActive,
    menuRef,
  }
}
