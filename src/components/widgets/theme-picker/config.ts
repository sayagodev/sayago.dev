import gsap from 'gsap'

export type ThemePickerOrientation = 'vertical' | 'horizontal'

/**
 * Valores de la cinta. El objeto es mutable a propósito: el panel de debug
 * (solo development, ver debug-panel.tsx) escribe aquí y las animaciones leen
 * en el momento de ejecutarse, así los sliders se ven en vivo.
 */
export const pickerConfig = {
  /** Separación entre slots, por eje (px). */
  slotGap: { vertical: 36, horizontal: 44 },
  /** Desplazamiento de la cinta al cambiar de tema (mismos valores que new_theme). */
  shiftDuration: 0.28,
  shiftEase: 'power2.out',
  shiftStagger: 0,
  /** Entrada de las bolas al montar (una vez por sesión). */
  introDuration: 0.5,
  introEase: 'back.out(1.4)',
  introStagger: 0.05,
  introDelay: 0.5,
  /** Trazado del anillo del tema activo. */
  traceDelay: 1.6,
  traceDuration: 0.6,
  ringRadius: 14,
  /** Lente (view transition) al aplicar el tema. */
  lensDuration: 0.8,
  lensEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
  vtFallbackDelay: 1500,
  vtSettleDelay: 120,
  /** Solo debug: la opacidad por defecto es 1 (los inactivos no se atenúan). */
  inactiveOpacity: 1,
  shockwave: false,
  debug: false,
  showOrigin: false,
}

/** Slots de la cinta: centro, vecinos y los dos ocultos que cierran el círculo. */
export const CENTER_SLOT = 1
export const HIDDEN_SLOT_FROM = 3

/** Slot que ocupa un tema dentro de la cinta, relativo al tema activo. */
export function slotOf(index: number, currentIndex: number, total: number): number {
  return (((index - currentIndex + CENTER_SLOT) % total) + total) % total
}

export function slotOffset(slot: number, gap: number): number {
  // Los visibles se reparten alrededor del centro; los dos ocultos que cierran
  // el círculo van a +2 y -2 gaps (abajo y arriba, cada uno por su extremo).
  if (slot < HIDDEN_SLOT_FROM) return (slot - CENTER_SLOT) * gap
  return (slot === HIDDEN_SLOT_FROM ? 2 : -2) * gap
}

/** Los slots ocultos quedan en opacidad 0 para que el salto de extremo no se vea. */
export function slotOpacity(slot: number): number {
  if (slot >= HIDDEN_SLOT_FROM) return 0
  return slot === CENTER_SLOT ? 1 : pickerConfig.inactiveOpacity
}

export function slotPosition(
  slot: number,
  orientation: ThemePickerOrientation,
  gap: number
): { x: number; y: number } {
  const offset = slotOffset(slot, gap)
  return orientation === 'vertical' ? { x: 0, y: offset } : { x: offset, y: 0 }
}

/**
 * Coloca todas las bolas en su slot sin animar. Lo usan el arranque (cuando el
 * intro ya se vio en la sesión) y el panel de debug al tocar la geometría.
 */
export function snapOrbsToSlots(picker: HTMLElement, currentIndex: number): void {
  const orientation: ThemePickerOrientation =
    picker.dataset.orientation === 'horizontal' ? 'horizontal' : 'vertical'
  const gap = pickerConfig.slotGap[orientation]
  const orbs = Array.from(picker.querySelectorAll<HTMLElement>('.theme-orb'))

  orbs.forEach((orb, index) => {
    const slot = slotOf(index, currentIndex, orbs.length)
    gsap.set(orb, {
      ...slotPosition(slot, orientation, gap),
      opacity: slotOpacity(slot),
      scale: 1,
      rotation: 0,
    })
  })
}
