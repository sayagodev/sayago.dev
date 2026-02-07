import * as motion from "motion/react-client"
interface ProgressBarProps {
  progress: number // 0 to 100
}
export function ProgressBar({ progress }: ProgressBarProps) {
  // Calculate color based on progress
  const getColor = () => {
    if (progress < 30) return "#8B0000" // Red
    if (progress < 70) return "#D97706" // Amber
    return "#059669" // Green
  }
  return (
    <div className="fixed top-0 left-0 z-50 h-1.5 w-full bg-black/5">
      <motion.div
        className="h-full"
        initial={{
          width: 0,
        }}
        animate={{
          width: `${progress}%`,
          backgroundColor: getColor(),
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      />
      <div className="absolute top-4 right-4 font-mono text-xs font-bold text-gray-500 opacity-50">
        {Math.round(progress)}% COMPLETADO
      </div>
    </div>
  )
}
