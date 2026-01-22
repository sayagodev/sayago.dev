'use client'

import topIzq from '@/public/images/corners/top-izq.svg'
import topDer from '@/public/images/corners/top-der.svg'
import bottomIzq from '@/public/images/corners/bottom-izq.svg'
import bottomDer from '@/public/images/corners/bottom-der.svg'

import recCenter from '@/public/images/rec_center.svg'
import colon from '@/public/images/colon.svg'

import { TransitionState, usePageTransition } from "@/hooks/use-page-transition"
import { usePathname, useRouter } from "@/utils/i18n-navigation"
import { MaskIcon } from "@/utils/mask-icon"
import { AnimatePresence, cubicBezier, motion } from "motion/react"
import { useEffect, useMemo, useRef } from "react"
import { useIsMobile } from '@/hooks/use-mobile'
import { ANIMATION_EASING } from '@/lib/animations'
import { useAnimationTiming } from '@/hooks/use-animation-timing'
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion'

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
    const { fast, normal, slow, stagger } = useAnimationTiming()

    const TIMING = useMemo(() => ({
        cornersOut: fast,
        centerIn: normal,
        colonIn: normal,
        hold: stagger,
        fadeOut: slow,
        cornersIn: fast,
    }), [fast, normal, slow, stagger])

    const isTransitioning = state !== 'idle'
    const isClosing = ['corners-out', 'center-in', 'colon-in', 'navigating', 'fade-out'].includes(state)
    const isOpening = state === 'corners-in'
    const showCenter = ['center-in', 'colon-in', 'navigating', 'fade-out'].includes(state)
    const showColon = ['colon-in', 'navigating', 'fade-out'].includes(state)
    const isFadingOut = state === 'fade-out'
    const duration = isOpening ? TIMING.cornersIn : TIMING.cornersOut
    const ease = isOpening ? cubicBezier(...EASING.out) : cubicBezier(...EASING.in)
    const padding = isMobile ? '10px' : '32px'

    useEffect(() => {
        if (prefersReducedMotion || state === 'idle') return

        const next: Record<Exclude<TransitionState, 'idle'>, { wait: number, to: TransitionState }> = {
            'corners-out': { wait: TIMING.cornersOut, to: 'center-in' },
            'center-in': { wait: TIMING.centerIn, to: 'colon-in' },
            'colon-in': { wait: TIMING.colonIn + TIMING.hold, to: 'navigating' },
            'navigating': { wait: 0, to: 'fade-out' },
            'fade-out': { wait: TIMING.fadeOut, to: 'corners-in' },
            'corners-in': { wait: TIMING.cornersIn, to: 'idle' }
        }

        if (state === 'navigating') return
        const step = next[state]
        const timer = setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (state === 'colon-in' && targetHref) router.push(targetHref as any)
            if (state === 'corners-in') reset()
            else setState(step.to)
        }, step.wait * 1000)

        return () => clearTimeout(timer)
    }, [state, setState, targetHref, router, reset, prefersReducedMotion])

    useEffect(() => {
        if (!prefersReducedMotion || state === 'idle') return

        if (state === 'corners-out' && targetHref) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.push(targetHref as any)
            reset()
        }

    }, [prefersReducedMotion, state, targetHref, router, reset])


    // Detect when navigation completes (pathname changes)
    useEffect(() => {
        if (prefersReducedMotion) return
        if (state === 'navigating' && pathname !== prevPathname.current) {
            prevPathname.current = pathname
            setState('fade-out')
        }
    }, [pathname, state, setState, prefersReducedMotion])

    if (prefersReducedMotion) return null

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div className="fixed inset-0 z-50 pointer-events-auto"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* top */}
                    <motion.div className="sticky top-0 bg-background h-[25px] lg:h-[47px] will-change-transform"
                        animate={{ height: isClosing ? '50dvh' : '25px' }}
                        transition={{ duration, ease }}
                    />
                    {/* left */}
                    <motion.div className="sticky bg-background left-0 h-full w-[25px] lg:w-[47px]"
                        animate={{ width: isClosing ? '50dvw' : '25px' }}
                        transition={{ duration, ease }}
                    />
                    {/* bottom */}
                    <motion.div className="sticky bg-background bottom-0 h-[25px] lg:h-[47px] w-full"
                        animate={{ height: isClosing ? '50dvh' : '25px' }}
                        transition={{ duration, ease }}
                    />
                    {/* right */}
                    <motion.div className="absolute right-0 top-0 bg-background h-full w-[25px] lg:w-[47px]"
                        animate={{ width: isClosing ? '50dvw' : '25px' }}
                        transition={{ duration, ease }}
                    />

                    {/* Top-Right Corner */}
                    <motion.div className="absolute w-[60px] h-[60px] top-2.5 right-2.5 lg:top-8 lg:right-8"
                        animate={{
                            x: isClosing ? `calc(-50dvw + ${padding} + 30px)` : 0,
                            y: isClosing ? `calc(50dvh - ${padding} - 30px)` : 0,
                        }}
                        transition={{ duration, ease: cubicBezier(...EASING.out) }}
                    >
                        <MaskIcon src={topDer.src} className='w-full h-full bg-corners' />
                    </motion.div>
                    {/* Top-Left Corner */}
                    <motion.div className="absolute w-[60px] h-[60px] top-2.5 left-2.5 lg:top-8 lg:left-8"
                        animate={{
                            x: isClosing ? `calc(50dvw - ${padding} - 30px)` : 0,
                            y: isClosing ? `calc(50dvh - ${padding} - 30px)` : 0,
                        }}
                        transition={{ duration, ease: cubicBezier(...EASING.out) }}
                    >
                        <MaskIcon src={topIzq.src} className='w-full h-full bg-corners' />
                    </motion.div>
                    {/* Bottom-Right Corner */}
                    <motion.div className="absolute w-[60px] h-[60px] bottom-2.5 right-2.5 lg:bottom-8 lg:right-8"
                        animate={{
                            x: isClosing ? `calc(-50dvw + ${padding} + 30px)` : 0,
                            y: isClosing ? `calc(-50dvh + ${padding} + 30px)` : 0,
                        }}
                        transition={{ duration, ease: cubicBezier(...EASING.out) }}
                    >
                        <MaskIcon src={bottomDer.src} className='w-full h-full bg-corners' />
                    </motion.div>
                    {/* Bottom-Left Corner */}
                    <motion.div className="absolute w-[60px] h-[60px] bottom-2.5 left-2.5 lg:bottom-8 lg:left-8"
                        animate={{
                            x: isClosing ? `calc(50dvw - ${padding} - 30px)` : 0,
                            y: isClosing ? `calc(-50dvh + ${padding} + 30px)` : 0,
                        }}
                        transition={{ duration, ease: cubicBezier(...EASING.out) }}
                    >
                        <MaskIcon src={bottomIzq.src} className='w-full h-full bg-corners' />
                    </motion.div>

                    <motion.div
                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[43%]'
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: showCenter ? (isFadingOut ? 0 : 1) : 0,
                        }}
                        transition={{
                            duration: isFadingOut ? TIMING.fadeOut : TIMING.centerIn,
                            ease: cubicBezier(...EASING.out),
                        }}
                    >
                        <MaskIcon src={recCenter.src} className="w-[40px] h-[35px] bg-corners" />
                    </motion.div>

                    <motion.div
                        className='absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-15'
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
                        <MaskIcon src={colon.src} className="w-[60px] h-[120px] bg-corners" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
