import { create } from "zustand"

export type TransitionState =
  | "idle"
  | "corners-out" // Corners hacia centro
  | "center-in" // Cuadrado aparece
  | "colon-in" // Colon aparece
  | "navigating" // Cargando ruta
  | "fade-out" // Todo desaparece
  | "corners-in" // Corners vuelven

interface PageTransitionStore {
  state: TransitionState
  targetHref: string | { pathname: string; params?: Record<string, string> } | null
  setState: (state: TransitionState) => void
  startTransition: (href: string | { pathname: string; params?: Record<string, string> }) => void
  reset: () => void
}

export const usePageTransition = create<PageTransitionStore>((set) => ({
  state: "idle",
  targetHref: null,
  setState: (state) => set({ state }),
  startTransition: (href) => set({ state: "corners-out", targetHref: href }),
  reset: () => set({ state: "idle", targetHref: null }),
}))
