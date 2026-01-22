import { create } from 'zustand'

interface ReducedMotionState {
    prefersReducedMotion: boolean
    isInitialized: boolean
    initialize: () => () => void
}

let cleanup: (() => void) | null = null

export const useReducedMotion = create<ReducedMotionState>((set, get) => ({
    prefersReducedMotion: false,
    isInitialized: false,
    initialize: () => {
        if (typeof window === 'undefined') return () => { }

        // If the hook has already been initialized, return the cleanup function
        if (get().isInitialized) {
            return cleanup || (() => { })
        }

        const getMatches = () => {
            return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
        }

        set({ prefersReducedMotion: getMatches(), isInitialized: true })

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

        const handleChange = (e: MediaQueryListEvent) => {
            set({ prefersReducedMotion: e.matches })
        }

        mediaQuery.addEventListener('change', handleChange)

        const cleanupFn = () => {
            mediaQuery.removeEventListener('change', handleChange)
            set({ isInitialized: false })
            cleanup = null
        }

        cleanup = cleanupFn
        return cleanupFn
    },
}))

/**
 * Hook helper to easily get the prefers-reduced-motion state
 * @returns boolean - true if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
    return useReducedMotion((state) => state.prefersReducedMotion)
}
