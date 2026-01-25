"use client"

import topIzq from "@/public/images/corners/top-izq.svg"
import topDer from "@/public/images/corners/top-der.svg"
import bottomIzq from "@/public/images/corners/bottom-izq.svg"
import bottomDer from "@/public/images/corners/bottom-der.svg"

import recCenter from "@/public/images/rec_center.svg"
import colon from "@/public/images/colon.svg"

import { TransitionState, usePageTransition } from "@/hooks/use-page-transition"
import { usePathname, useRouter } from "@/utils/i18n-navigation"
import { MaskIcon } from "@/utils/mask-icon"
import { AnimatePresence, cubicBezier, motion } from "motion/react"
import { useEffect, useMemo, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ANIMATION_EASING } from "@/lib/animations"
import { useAnimationTiming } from "@/hooks/use-animation-timing"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"

// Possbile changes in the future
const EASING = {
  in: ANIMATION_EASING.easeInOut,
  out: ANIMATION_EASING.easeInOut,
} as const

export function PageTransition() {
  const { state, setState, targetHref, reset } = usePageTransition()
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()
  const router = useRouter()
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const scrollPositionRef = useRef(0)
  const { fast, normal, slow, stagger } = useAnimationTiming()

  const TIMING = useMemo(
    () => ({
      cornersOut: fast,
      centerIn: normal,
      colonIn: normal,
      hold: stagger,
      fadeOut: slow,
      cornersIn: fast,
    }),
    [fast, normal, slow, stagger]
  )

  const isTransitioning = state !== "idle"
  const isClosing = ["corners-out", "center-in", "colon-in", "navigating", "fade-out"].includes(
    state
  )
  const isOpening = state === "corners-in"
  const showCenter = ["center-in", "colon-in", "navigating", "fade-out"].includes(state)
  const showColon = ["colon-in", "navigating", "fade-out"].includes(state)
  const isFadingOut = state === "fade-out"
  const duration = isOpening ? TIMING.cornersIn : TIMING.cornersOut
  const ease = isOpening ? cubicBezier(...EASING.out) : cubicBezier(...EASING.in)
  const padding = isMobile ? "10px" : "32px"

  useEffect(() => {
    if (prefersReducedMotion) return

    if (isTransitioning) {
      scrollPositionRef.current = window.scrollY

      // block scroll
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = "100%"
    } else {
      // Restore scroll
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""

      // Restaurar posición del scroll solo si estamos en la misma página
      if (pathname === prevPathname.current) {
        window.scrollTo(0, scrollPositionRef.current)
      } else {
        // Si cambió de página, scroll al inicio
        window.scrollTo(0, 0)
      }
    }

    return () => {
      // Cleanup en caso de desmontaje
      if (!isTransitioning) {
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
      }
    }
  }, [isTransitioning, prefersReducedMotion, pathname])

  useEffect(() => {
    if (prefersReducedMotion || state === "idle") return

    const next: Record<Exclude<TransitionState, "idle">, { wait: number; to: TransitionState }> = {
      "corners-out": { wait: TIMING.cornersOut, to: "center-in" },
      "center-in": { wait: TIMING.centerIn, to: "colon-in" },
      "colon-in": { wait: TIMING.colonIn + TIMING.hold, to: "navigating" },
      navigating: { wait: 0, to: "fade-out" },
      "fade-out": { wait: TIMING.fadeOut, to: "corners-in" },
      "corners-in": { wait: TIMING.cornersIn, to: "idle" },
    }

    if (state === "navigating") return
    const step = next[state]
    const timer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (state === "colon-in" && targetHref) router.push(targetHref as any)
      if (state === "corners-in") reset()
      else setState(step.to)
    }, step.wait * 1000)

    return () => clearTimeout(timer)
  }, [state, setState, targetHref, router, reset, prefersReducedMotion])

  useEffect(() => {
    if (!prefersReducedMotion || state === "idle") return

    if (state === "corners-out" && targetHref) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(targetHref as any)
      reset()
    }
  }, [prefersReducedMotion, state, targetHref, router, reset])

  // Detect when navigation completes (pathname changes)
  useEffect(() => {
    if (prefersReducedMotion) return
    if (state === "navigating" && pathname !== prevPathname.current) {
      prevPathname.current = pathname
      setState("fade-out")
    }
  }, [pathname, state, setState, prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* top */}
          <motion.div
            className="bg-background fixed top-0 h-[25px] will-change-transform lg:h-[47px]"
            animate={{ height: isClosing ? "50dvh" : "25px" }}
            transition={{ duration, ease }}
          />
          {/* left */}
          <motion.div
            className="bg-background fixed left-0 h-full w-[25px] lg:w-[47px]"
            animate={{ width: isClosing ? "50dvw" : "25px" }}
            transition={{ duration, ease }}
          />
          {/* bottom */}
          <motion.div
            className="bg-background fixed bottom-0 h-[25px] w-full lg:h-[47px]"
            animate={{ height: isClosing ? "50dvh" : "25px" }}
            transition={{ duration, ease }}
          />
          {/* right */}
          <motion.div
            className="bg-background absolute top-0 right-0 h-full w-[25px] lg:w-[47px]"
            animate={{ width: isClosing ? "50dvw" : "25px" }}
            transition={{ duration, ease }}
          />

          {/* Top-Right Corner */}
          <motion.div
            className="absolute top-2.5 right-2.5 h-[60px] w-[60px] lg:top-8 lg:right-8"
            animate={{
              x: isClosing ? `calc(-50dvw + ${padding} + 30px)` : 0,
              y: isClosing ? `calc(50dvh - ${padding} - 30px)` : 0,
            }}
            transition={{ duration, ease: cubicBezier(...EASING.out) }}
          >
            <MaskIcon src={topDer.src} className="bg-corners h-full w-full" />
          </motion.div>
          {/* Top-Left Corner */}
          <motion.div
            className="absolute top-2.5 left-2.5 h-[60px] w-[60px] lg:top-8 lg:left-8"
            animate={{
              x: isClosing ? `calc(50dvw - ${padding} - 30px)` : 0,
              y: isClosing ? `calc(50dvh - ${padding} - 30px)` : 0,
            }}
            transition={{ duration, ease: cubicBezier(...EASING.out) }}
          >
            <MaskIcon src={topIzq.src} className="bg-corners h-full w-full" />
          </motion.div>
          {/* Bottom-Right Corner */}
          <motion.div
            className="absolute right-2.5 bottom-2.5 h-[60px] w-[60px] lg:right-8 lg:bottom-8"
            animate={{
              x: isClosing ? `calc(-50dvw + ${padding} + 30px)` : 0,
              y: isClosing ? `calc(-50dvh + ${padding} + 30px)` : 0,
            }}
            transition={{ duration, ease: cubicBezier(...EASING.out) }}
          >
            <MaskIcon src={bottomDer.src} className="bg-corners h-full w-full" />
          </motion.div>
          {/* Bottom-Left Corner */}
          <motion.div
            className="absolute bottom-2.5 left-2.5 h-[60px] w-[60px] lg:bottom-8 lg:left-8"
            animate={{
              x: isClosing ? `calc(50dvw - ${padding} - 30px)` : 0,
              y: isClosing ? `calc(-50dvh + ${padding} + 30px)` : 0,
            }}
            transition={{ duration, ease: cubicBezier(...EASING.out) }}
          >
            <MaskIcon src={bottomIzq.src} className="bg-corners h-full w-full" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[43%]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: showCenter ? (isFadingOut ? 0 : 1) : 0,
            }}
            transition={{
              duration: isFadingOut ? TIMING.fadeOut : TIMING.centerIn,
              ease: cubicBezier(...EASING.out),
            }}
          >
            <MaskIcon src={recCenter.src} className="bg-corners h-[35px] w-[40px]" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-15"
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: showColon ? (isFadingOut ? 0 : 1) : 0,
              y: showColon ? 0 : 5,
            }}
            transition={{
              duration: isFadingOut ? TIMING.fadeOut : TIMING.colonIn,
              ease: cubicBezier(...EASING.out),
            }}
          >
            <MaskIcon src={colon.src} className="bg-corners h-[120px] w-[60px]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
