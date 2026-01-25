"use client"

import { VERSION } from "@/version"
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export function ShowVersion() {
  const t = useTranslations("home")
  const [isHover, setIsHover] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  // Mouse tracking (in viewport) with smoothing
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const xSpring = useSpring(x, { stiffness: 600, damping: 40, mass: 0.2 })
  const ySpring = useSpring(y, { stiffness: 600, damping: 40, mass: 0.2 })

  useEffect(() => {
    // Prevent ReferenceError during SSR
    setPortalTarget(document.body)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      x.set(-160)
      y.set(window.innerHeight / 2)
    }
  }, [x, y])

  return (
    <>
      <motion.div
        className="absolute top-1/2 left-5 hidden -translate-y-1/2 flex-col items-center justify-center lg:flex"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.3, ease: "easeOut" }}
        onMouseEnter={(e) => {
          // Posiciona antes de montar el tooltip para evitar "salto" inicial
          x.set(e.clientX)
          y.set(e.clientY - 16)
          setIsHover(true)
        }}
        onMouseLeave={() => setIsHover(false)}
        onMouseMove={(e) => {
          // Coordenadas en viewport: clientX/Y
          x.set(e.clientX)
          y.set(e.clientY - 16) // pequeño offset hacia arriba
        }}
      >
        <p className="font-zi flex flex-col text-xl">
          <span>版</span>
          <span>本</span>
        </p>
        <span className="font-zi text-xl">{VERSION}</span>
      </motion.div>

      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {isHover && (
              <motion.div
                className="pointer-events-none fixed z-50"
                style={{
                  left: xSpring,
                  top: ySpring,
                  translateY: "-100%",
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                <div className="bg-info px-2 py-1">
                  <p className="font-neon text-info-content text-xl font-medium">
                    {`${t("version", { version: VERSION })} `}
                    <motion.span
                      className="inline-block -translate-x-[2px] -translate-y-[2px]"
                      animate={{ x: [0, 2, 0, -2, 0], y: [0, 2, 0, 2, 0] }}
                      transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      🥳
                    </motion.span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalTarget
        )}
    </>
  )
}
