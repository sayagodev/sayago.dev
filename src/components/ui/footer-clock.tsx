'use client'

import { useCurrentTime } from "@/hooks/use-current-time"
import { useTranslations } from "next-intl"

import sleepIcon from '@/public/images/zhongwen/sleep.svg'
import workIcon from '@/public/images/zhongwen/work.svg'
import preparationIcon from '@/public/images/zhongwen/preparation.svg'
import { MaskIcon } from "@/utils/mask-icon"
import { motion } from "motion/react"

type Message = {
    message: string
    icon: string
}

export function FooterClock({ animate = true }: { animate?: boolean }) {
    const { time } = useCurrentTime()
    const messages = useTranslations("messages")
    const { message, icon } = getMessage(time)

    const footerClassName = "w-full flex items-center justify-center absolute bottom-0 left-0 pb-4 lg:pb-[45px]"

    const footerContent = (
        <>
            {/* Versión móvil */}
            <p className="flex items-center gap-2 lg:hidden">
                <span className="text-md md:text-lg font-argon font-medium">{time}</span>
                <MaskIcon src={icon} className="size-9 md:size-10" />
            </p>
            {/* Versión desktop */}
            <p className="hidden lg:flex items-center gap-2">
                <span className="text-xl font-argon font-medium">{messages(message, { time })}</span>
                <MaskIcon src={icon} className="size-10" />
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

    return (
        <footer className={footerClassName}>
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
                icon: preparationIcon.src,
            }
        }
    } else {
        const hour = parseInt(time.replace("p.m.", "").trim().split(":")[0])
        if (hour >= 12 || (hour >= 1 && hour <= 8)) {
            return {
                message: "afternoon.message",
                icon: workIcon.src,
            }
        }
    }

    return {
        message: "night.message",
        icon: sleepIcon.src,
    }
}
