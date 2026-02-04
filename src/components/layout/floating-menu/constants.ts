export const NAV_BUTTONS = [
  { href: "/work", icon: "作", ariaLabel: "Work" },
  { href: "/wo", icon: "我", ariaLabel: "About me" },
  { href: "/contact", icon: "信", ariaLabel: "Contact" },
] as const

export const menuVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } },
}

export const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

export const menuTransition = {
  delay: 0.3,
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
}

export const bottomTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
}
