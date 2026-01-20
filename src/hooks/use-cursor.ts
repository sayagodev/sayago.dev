import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CursorState {
    isCustomCursorEnabled: boolean
    toggleCustomCursor: () => void
    setCustomCursor: (enabled: boolean) => void
}

export const useCursor = create<CursorState>()(
    persist(
        (set) => ({
            isCustomCursorEnabled: true,
            toggleCustomCursor: () => set((state) => ({ isCustomCursorEnabled: !state.isCustomCursorEnabled })),
            setCustomCursor: (enabled) => set({ isCustomCursorEnabled: enabled }),
        }),
        {
            name: 'cursor-settings',
        }
    )
)
