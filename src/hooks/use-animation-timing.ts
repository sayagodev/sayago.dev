"use client"

import { useIsMobile } from './use-mobile'
import { ANIMATION_TIMING } from '@/lib/animations'

/**
 * Hook to get animation timings based on the platform
 * @returns Object with animation timings (fast, normal, slow, stagger)
 */
export function useAnimationTiming() {
    const isMobile = useIsMobile()

    return {
        fast: isMobile ? ANIMATION_TIMING.mobile.fast : ANIMATION_TIMING.fast,
        normal: isMobile ? ANIMATION_TIMING.mobile.normal : ANIMATION_TIMING.normal,
        slow: isMobile ? ANIMATION_TIMING.mobile.slow : ANIMATION_TIMING.slow,
        stagger: ANIMATION_TIMING.stagger,
    }
}