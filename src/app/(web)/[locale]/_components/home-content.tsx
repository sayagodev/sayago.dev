'use client'

import { Button } from "@/components/ui/button";
import wo from '@/public/images/zhongwen/yo.svg';
import { MaskIcon } from "@/utils/mask-icon";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "motion/react"

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
        <div className="flex flex-col items-center justify-center flex-1 gap-24 text-center">
            <motion.h1 className="text-4xl md:text-5xl font-bold font-krypton"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Button href="/">sāyago;dev</Button>
            </motion.h1>
            <motion.section
                className="flex flex-col gap-5 font-argon *:font-semibold md:flex-row md:gap-16 lg:gap-44"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                <MotionButton className="text-2xl md:text-3xl" href="/work" variants={item}>
                    {t("work")}
                </MotionButton>
                <MotionButton className="w-fit mx-auto" href="/wo" variants={item}>
                    <MaskIcon src={wo.src} className="size-8 lg:size-10 translate-y-1 md:translate-y-0" />
                </MotionButton>
                <MotionButton className="text-2xl md:text-3xl" href="/contact" variants={item}>
                    {t("talk")}
                </MotionButton>
            </motion.section>
        </div>
    )
}