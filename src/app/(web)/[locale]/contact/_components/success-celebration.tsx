"use client"

import confetti from "canvas-confetti"
import { motion } from "motion/react"
import { useEffect } from "react"
import { AnimatedCheckmark } from "./animated-checkmark"
import { useTranslations } from "next-intl"

interface SuccessCelebrationProps {
  name: string
  service: string
  email: string
  onReset: () => void
}

export function SuccessCelebration({ name, service, email, onReset }: SuccessCelebrationProps) {
  const t = useTranslations("success")

  useEffect(() => {
    // Fire confetti
    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: {
          x: 0,
        },
        colors: ["#8B0000", "#D2B48C", "#1F2937"],
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: {
          x: 1,
        },
        colors: ["#8B0000", "#D2B48C", "#1F2937"],
      })
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="relative z-10 mx-auto w-full max-w-4xl py-8 text-center md:p-16"
    >
      <motion.div
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="bg-success mx-auto mb-8 flex size-16 items-center justify-center rounded-full shadow-lg md:size-24"
      >
        <AnimatedCheckmark size={48} color="white" />
      </motion.div>

      <motion.h2
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.5,
        }}
        className="mb-6 text-2xl font-bold md:text-5xl"
      >
        {t("title")}
      </motion.h2>

      <motion.div
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.7,
        }}
        className="text-neutral mb-12 space-y-2 text-lg md:text-2xl"
      >
        <p>
          {t("thanks")} <span className="border-primary/50 border-b-2 font-bold">{name}</span>.
        </p>
        <p>
          {t("received")} <span className="border-primary/50 border-b-2 font-bold">{service}</span>.
        </p>
        <p className="text-neutral/80 mt-4 text-base">{t("contact", { email })}</p>
      </motion.div>

      <motion.button
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.9,
        }}
        whileHover={{
          scale: 1.01,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={onReset}
        className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary rounded-full border-2 px-8 py-3 font-bold transition-colors"
      >
        {t("reset")}
      </motion.button>
    </motion.div>
  )
}
