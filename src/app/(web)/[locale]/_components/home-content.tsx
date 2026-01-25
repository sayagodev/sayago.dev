"use client"

import { Button } from "@/components/ui/button"
import { motion, type Variants } from "motion/react"
import { useTranslations } from "next-intl"

const container: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.8, 0.25, 1],
      delayChildren: 0.3,
      staggerChildren: 0.25,
    },
  },
}
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const MotionButton = motion.create(Button)

export function HomeContent() {
  const t = useTranslations("home")

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-24 text-center">
      <motion.h1
        className="font-krypton text-4xl font-bold md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Button href="/">sāyago;dev</Button>
      </motion.h1>
      <motion.section
        className="font-argon flex flex-col gap-5 *:font-semibold md:flex-row md:gap-16 lg:gap-44"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <MotionButton className="text-2xl md:text-3xl" href="/work" variants={item}>
          {t("work")}
        </MotionButton>
        <MotionButton
          className="font-zi mx-auto w-fit -translate-y-0.5 text-[32px] md:-translate-y-3 lg:-translate-x-1 lg:text-[40px]"
          href="/wo"
          variants={item}
        >
          我
        </MotionButton>
        <MotionButton className="text-2xl md:text-3xl" href="/contact" variants={item}>
          {t("talk")}
        </MotionButton>
      </motion.section>
    </div>
  )
}
