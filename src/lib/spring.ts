/**
 * Minimal spring integrator (semi-implicit Euler).
 *
 * Dependency-free replacement for motion's `useSpring` in the animations
 * ported from `refactor/wo-page`. Config values use the same units, so
 * stiffness/damping/mass can be copied over as-is.
 */
export interface SpringOptions {
  stiffness: number
  damping: number
  mass?: number
}

export class Spring {
  value = 0
  velocity = 0
  target = 0
  private readonly stiffness: number
  private readonly damping: number
  private readonly mass: number

  constructor({ stiffness, damping, mass = 1 }: SpringOptions) {
    this.stiffness = stiffness
    this.damping = damping
    this.mass = mass
  }

  set(target: number): void {
    this.target = target
  }

  snap(value: number): void {
    this.value = value
    this.velocity = 0
    this.target = value
  }

  /**
   * Advances the simulation by `dt` seconds. Returns the new value.
   *
   * Large frames are sub-stepped (max 1/120s each) so stiff springs stay
   * stable even when rAF fires sporadically (background tabs, headless).
   */
  update(dt: number): number {
    const maxStep = 1 / 120
    const steps = Math.max(1, Math.ceil(dt / maxStep))
    const h = dt / steps
    for (let i = 0; i < steps; i++) {
      const acceleration =
        (this.stiffness * (this.target - this.value) - this.damping * this.velocity) / this.mass
      this.velocity += acceleration * h
      this.value += this.velocity * h
    }
    return this.value
  }
}
