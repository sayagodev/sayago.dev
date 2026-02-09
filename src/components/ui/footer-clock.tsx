"use client"

import { useCurrentTime } from "@/hooks/use-current-time"
import { useTranslations } from "next-intl"
import VerticalCutReveal from "./vertical-cut-reveal"

type Message = {
  message: string
  zhMessage: string
}

export function FooterClock() {
  const { time } = useCurrentTime()
  const messages = useTranslations("messages")
  const { message, zhMessage } = getMessage(time)

  const footerClassName =
    "w-full flex items-center justify-center absolute bottom-0 left-0 pb-4 lg:pb-[45px]"

  const footerContent = (
    <>
      {/* Versión móvil */}
      <p className="flex items-center gap-2 lg:hidden">
        <VerticalCutReveal
          containerClassName="text-md font-argon font-medium md:text-lg"
          splitBy="lines"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1,
          }}
        >
          {time}
        </VerticalCutReveal>
        <VerticalCutReveal
          containerClassName="font-zi -translate-y-0.5 text-[21px] md:text-[26px]"
          splitBy="lines"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1,
          }}
        >
          {zhMessage}
        </VerticalCutReveal>
      </p>
      {/* Versión desktop */}
      <p className="hidden items-center gap-2 lg:flex">
        <VerticalCutReveal
          containerClassName="font-argon text-xl font-medium"
          splitBy="lines"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1,
          }}
        >
          {messages(message, { time })}
        </VerticalCutReveal>
        <VerticalCutReveal
          containerClassName="font-zi -translate-y-0.5 text-[21px] md:text-[26px]"
          splitBy="lines"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1,
          }}
        >
          {zhMessage}
        </VerticalCutReveal>
      </p>
    </>
  )

  return (
    <footer className={footerClassName} aria-hidden="true" role="presentation">
      {footerContent}
    </footer>
  )
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
