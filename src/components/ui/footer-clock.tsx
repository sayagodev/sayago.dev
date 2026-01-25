"use client"

import { useCurrentTime } from "@/hooks/use-current-time"
import { useTranslations } from "next-intl"

import { motion } from "motion/react"

type Message = {
  message: string
  zhMessage: string
}

export function FooterClock({ animate = true }: { animate?: boolean }) {
  const { time } = useCurrentTime()
  const messages = useTranslations("messages")
  const { message, zhMessage } = getMessage(time)

  const footerClassName =
    "w-full flex items-center justify-center absolute bottom-0 left-0 pb-4 lg:pb-[45px]"

  const footerContent = (
    <>
      {/* Versión móvil */}
      <p className="flex items-center gap-2 lg:hidden">
        <span className="text-md font-argon font-medium md:text-lg">{time}</span>
        <span className="font-zi -translate-y-0.5 text-[21px] md:text-[26px]">{zhMessage}</span>
      </p>
      {/* Versión desktop */}
      <p className="hidden items-center gap-2 lg:flex">
        <span className="font-argon text-xl font-medium">{messages(message, { time })}</span>
        <span className="font-zi -translate-y-0.5 text-[21px] md:text-[26px]">{zhMessage}</span>
      </p>
    </>
  )

  if (animate) {
    return (
      <motion.footer
        className={footerClassName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.3, ease: "easeOut" }}
      >
        {footerContent}
      </motion.footer>
    )
  }

  return <footer className={footerClassName}>{footerContent}</footer>
}

const getMessage = (time: string): Message => {
  if (time.includes("a.m.")) {
    const hour = parseInt(time.replace("a.m.", "").trim().split(":")[0])
    if (hour >= 6 && hour < 12) {
      return {
        message: "morning.message",
        zhMessage: "准备",
      }
    }
  } else {
    const hour = parseInt(time.replace("p.m.", "").trim().split(":")[0])
    if (hour >= 12 || (hour >= 1 && hour <= 8)) {
      return {
        message: "afternoon.message",
        zhMessage: "工作",
      }
    }
  }

  return {
    message: "night.message",
    zhMessage: "睡觉",
  }
}
