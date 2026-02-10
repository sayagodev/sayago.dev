"use client"

import { cubicBezier, motion, Variants } from "motion/react"
import { useAnimationTiming } from "@/hooks/use-animation-timing"
import { ANIMATION_EASING } from "@/lib/animations"
import { Card, CardProps } from "./card"

interface WorkContentProps {
  title: string
  cards: CardProps[]
}

export function WorkContent({ title, cards }: WorkContentProps) {
  const { normal, stagger } = useAnimationTiming()
  const ease = cubicBezier(...ANIMATION_EASING.easeIn)

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        delayChildren: 0.1,
        staggerChildren: stagger,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: normal,
        ease,
      },
    },
  }

  return (
    <>
      <motion.h1
        className="font-argon mb-8 text-center text-2xl font-bold md:text-4xl lg:text-start"
        variants={item}
        initial="hidden"
        animate="visible"
      >
        {title}
      </motion.h1>

      <motion.section
        className="grid w-full auto-rows-fr gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card) => (
          <motion.div
            key={card.url}
            variants={item}
            className="mx-auto h-full w-full max-w-xs sm:max-w-none"
          >
            <Card {...card} />
          </motion.div>
        ))}
      </motion.section>
    </>
  )
}
