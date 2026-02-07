import * as motion from "motion/react-client"

interface AnimatedCheckmarkProps {
  className?: string
  size?: number
  color?: string
}

export function AnimatedCheckmark({
  className = "",
  size = 24,
  color = "currentColor",
}: AnimatedCheckmarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M5 13L9 17L19 7"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      />
    </svg>
  )
}
