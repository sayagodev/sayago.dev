"use client"

import { Button } from "@/components/ui/button"
import { ANIMATION_EASING, ANIMATION_TIMING } from "@/lib/animations"
import colon from "@/public/images/colon.svg"
import recCenter from "@/public/images/rec_center.svg"
import { usePathname, useRouter } from "@/utils/i18n-navigation"
import { MaskIcon } from "@/utils/mask-icon"
import { ArrowRight, Zap, ZapOff } from "lucide-react"
import { AnimatePresence, cubicBezier, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Activity, useEffect, useRef, useState } from "react"
import { CollapsibleMarkdown } from "./CollapsibleMarkdown"

interface WoResumeProps {
  mContent: string
  mContentShort: string
}

type CurtainPhase = "down" | "hold" | "exit"

export function WoResume({ mContent, mContentShort }: WoResumeProps) {
  const t = useTranslations("pages.wo")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isTldrActive = searchParams.get("tldr") === "true"

  const [isAnimating, setIsAnimating] = useState(false)
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>("down")
  const [showColon, setShowColon] = useState(false)
  const isCancelledRef = useRef(false)

  const durations = {
    curtainDown: ANIMATION_TIMING.normal, // 0.2s
    colonDisplay: ANIMATION_TIMING.slow * 2, // 0.6s
    colonFadeOut: ANIMATION_TIMING.normal, // 0.2s
    curtainExit: ANIMATION_TIMING.normal, // 0.2s
    contentChange: 50, // ms
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleTLDR = async () => {
    const newIsTldrActive = !isTldrActive
    const params = new URLSearchParams(searchParams.toString())
    if (newIsTldrActive) {
      params.set("tldr", "true")
    } else {
      params.delete("tldr")
    }
    const newSearch = params.toString()
    const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname
    router.replace(newUrl)

    // Cancelar animación anterior si existe
    isCancelledRef.current = true
    await delay(0) // Permitir que React procese el cambio
    isCancelledRef.current = false

    setIsAnimating(true)
    setCurtainPhase("down")
    setShowColon(false)

    // Fase 1: Cortina baja desde arriba hasta cubrir todo
    await delay(durations.curtainDown * 1000)
    if (isCancelledRef.current) return

    setCurtainPhase("hold")
    setShowColon(true)

    // Fase 2: Se queda mostrando el logo
    await delay(durations.colonDisplay * 1000)
    if (isCancelledRef.current) return

    // Fase 3: Colon desaparece
    setShowColon(false)
    await delay(durations.colonFadeOut * 1000)
    if (isCancelledRef.current) return

    // Fase 4: Cambiar contenido y actualizar URL
    await delay(durations.contentChange)
    if (isCancelledRef.current) return

    // Fase 5: Bajar cortina
    setCurtainPhase("exit")
    await delay(durations.curtainExit * 1000)
    if (isCancelledRef.current) return

    // Fase 6: Finalizar
    setIsAnimating(false)
    setCurtainPhase("down")
    setShowColon(false)
  }

  const currentContent = isTldrActive ? mContentShort : mContent

  const getCurtainY = () => {
    if (curtainPhase === "down") return "0%"
    if (curtainPhase === "hold") return "0%"
    if (curtainPhase === "exit") return "100%"
    return "0%"
  }

  const getCurtainTransitionDuration = () => {
    if (curtainPhase === "down") return durations.curtainDown
    if (curtainPhase === "exit") return durations.curtainExit
    return 0
  }

  useEffect(() => {
    return () => {
      isCancelledRef.current = true
    }
  }, [])

  return (
    <article className="w-full">
      <div className="mb-4 flex items-center gap-2 place-self-start">
        <h1 className="text-[16px] md:text-xl">{t("title")}</h1>
        <ArrowRight className="size-3 font-bold md:size-4" aria-hidden="true" />
        <Button
          className="flex items-center justify-center gap-2 text-[16px] font-semibold md:text-xl"
          onClick={handleTLDR}
          disabled={isAnimating}
          aria-label={t(isTldrActive ? "aria.tldrOn" : "aria.tldrOff")}
          title={t(isTldrActive ? "aria.tldrOn" : "aria.tldrOff")}
        >
          TL;DR
          <motion.span
            layout
            animate={{ rotate: isTldrActive ? 180 : 0, scale: isTldrActive ? 1.2 : 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.4,
            }}
          >
            {!isTldrActive ? (
              <ZapOff className="text-warning size-4" />
            ) : (
              <Zap className="text-warning size-4" />
            )}
          </motion.span>
        </Button>
      </div>

      <div className="relative min-h-[200px] w-full overflow-hidden">
        <div className="w-full">
          <CollapsibleMarkdown content={currentContent} maxHeight={400} />
        </div>

        {/* Curtain that drops down from above */}
        <Activity mode={isAnimating ? "visible" : "hidden"}>
          <AnimatePresence>
            <motion.div
              className="bg-background absolute inset-0 z-10"
              initial={{ y: "-100%" }}
              animate={{ y: getCurtainY() }}
              transition={{
                duration: getCurtainTransitionDuration(),
                ease: cubicBezier(...ANIMATION_EASING.easeInOut),
              }}
            >
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence>
                  {showColon && (
                    <>
                      {/* RecCenter arriba */}
                      <motion.div
                        className="relative mb-[10px]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: durations.colonFadeOut,
                          ease: cubicBezier(...ANIMATION_EASING.easeOut),
                        }}
                      >
                        <MaskIcon src={recCenter.src} className="bg-corners h-[60px] w-[60px]" />
                      </motion.div>

                      {/* Colon abajo */}
                      <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: durations.colonFadeOut,
                          ease: cubicBezier(...ANIMATION_EASING.easeOut),
                        }}
                      >
                        <MaskIcon src={colon.src} className="bg-corners h-[120px] w-[60px]" />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </Activity>
      </div>
    </article>
  )
}
