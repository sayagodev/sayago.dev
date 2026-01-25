export const ANIMATION_TIMING = {
  // Web (fast)
  fast: 0.15, // 150ms - Microinteractions, hover
  normal: 0.2, // 200ms - Standard transitions
  slow: 0.3, // 300ms - Complex transitions

  // Mobile (slower)
  mobile: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.4,
  },

  // Lists
  stagger: 0.08, // 80ms between elements in horizontal lists
  staggerList: 0.025, // 25ms for vertical lists
} as const

export const ANIMATION_EASING = {
  // Ease-in (acceleration at the start) - For elements that stay permanently
  easeInQuad: [0.55, 0.085, 0.68, 0.53] as const,
  easeInCubic: [0.55, 0.055, 0.675, 0.19] as const,
  easeInQuart: [0.895, 0.03, 0.685, 0.22] as const,
  easeInQuint: [0.755, 0.05, 0.855, 0.06] as const,
  easeInExpo: [0.95, 0.05, 0.795, 0.035] as const,
  easeInCirc: [0.6, 0.04, 0.98, 0.335] as const,

  // Ease-out (deceleration at the end) - For elements that appear
  easeOutQuad: [0.25, 0.46, 0.45, 0.94] as const,
  easeOutCubic: [0.215, 0.61, 0.355, 1] as const,
  easeOutQuart: [0.165, 0.84, 0.44, 1] as const,
  easeOutQuint: [0.23, 1, 0.32, 1] as const,
  easeOutExpo: [0.19, 1, 0.22, 1] as const,
  easeOutCirc: [0.075, 0.82, 0.165, 1] as const,

  // Ease-in-out (acceleration and deceleration) - For screen movements
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955] as const,
  easeInOutCubic: [0.645, 0.045, 0.355, 1] as const,
  easeInOutQuart: [0.77, 0, 0.175, 1] as const,
  easeInOutQuint: [0.86, 0, 0.07, 1] as const,
  easeInOutExpo: [1, 0, 0, 1] as const,
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86] as const,

  // Aliases for common use (using quad as default)
  easeIn: [0.55, 0.085, 0.68, 0.53] as const, // ease-in-quad
  easeOut: [0.25, 0.46, 0.45, 0.94] as const, // ease-out-quad
  easeInOut: [0.455, 0.03, 0.515, 0.955] as const, // ease-in-out-quad
} as const

export const ANIMATION_DELAYS = {
  initial: 0.1, // Delay for secondary content
  staggered: 0.08, // Delay for staggered elements
} as const
