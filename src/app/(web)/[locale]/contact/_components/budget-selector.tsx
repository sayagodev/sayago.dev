import { cn } from "@/utils/cn"
import * as motion from "motion/react-client"

interface BudgetSelectorProps {
  options: string[]
  selected: string
  onSelect: (value: string) => void
  hasError?: boolean
}

export function BudgetSelector({ options, selected, onSelect, hasError }: BudgetSelectorProps) {
  return (
    <span className="mx-0 my-2 inline-flex flex-col align-middle md:my-0 md:flex-row md:items-center lg:mx-2">
      <div className="flex flex-wrap items-center justify-start gap-2">
        {options.map((option, index) => {
          const isSelected = selected === option
          return (
            <motion.button
              key={option}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05 + 0.5,
              }}
              whileHover={{
                y: -3,
                scale: 1.05,
                rotateX: 10,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  duration: 0,
                  damping: 25,
                },
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => onSelect(option)}
              aria-pressed={isSelected}
              className={cn(
                "group relative overflow-hidden rounded-full border px-4 py-2 text-base font-medium transition-all duration-300 md:text-lg lg:text-xl",
                isSelected
                  ? "text-background border-primary shadow-lg"
                  : "border-neutral text-neutral hover:border-primary bg-transparent",
                hasError && !selected ? "border-error ring-error animate-pulse ring-1" : ""
              )}
              type="button"
            >
              {/* Background Fill Animation */}
              {isSelected && (
                <motion.div
                  layoutId="activeBudget"
                  className="bg-primary absolute inset-0 z-0"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              {/* Hover Effect */}
              {!isSelected && (
                <div className="bg-primary/10 absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-100" />
              )}

              <span className="relative z-10">{option}</span>
            </motion.button>
          )
        })}
      </div>
    </span>
  )
}
