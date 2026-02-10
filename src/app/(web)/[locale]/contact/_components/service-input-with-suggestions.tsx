import { cn } from "@/utils/cn"
import {
  Cloud,
  Globe,
  LayoutDashboard,
  Plug,
  Rocket,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { forwardRef, useEffect, useRef, useState } from "react"

interface ServiceInputWithSuggestionsProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  hasError?: boolean
  isSuccess?: boolean
  placeholder?: string
  className?: string
  containerClassName?: string
}

const SERVICE_SUGGESTIONS: { label: string; icon: LucideIcon }[] = [
  {
    label: "Website",
    icon: Globe,
  },
  {
    label: "Ecommerce",
    icon: ShoppingCart,
  },
  {
    label: "App Móvil",
    icon: Smartphone,
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Landing Page",
    icon: Rocket,
  },
  {
    label: "SaaS",
    icon: Cloud,
  },
  {
    label: "API",
    icon: Plug,
  },
]

export const ServiceInputWithSuggestions = forwardRef<
  HTMLInputElement,
  ServiceInputWithSuggestionsProps
>(
  (
    {
      value,
      onChange,
      onBlur,
      hasError,
      isSuccess,
      placeholder = "nombre del servicio",
      className = "",
      containerClassName = "",
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Filter suggestions based on input
    const filteredSuggestions = SERVICE_SUGGESTIONS.filter(
      (s) => s.label.toLowerCase().includes(value.toLowerCase()) || value === ""
    )

    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setShowSuggestions(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleFocus = () => {
      setIsFocused(true)
      setShowSuggestions(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
      onBlur?.()
      // Delay hiding to allow click on suggestion
      setTimeout(() => setShowSuggestions(false), 150)
    }

    const selectSuggestion = (label: string) => {
      onChange(label)
      setShowSuggestions(false)
    }

    const getBaseStyles = () => {
      if (hasError) {
        return "bg-error/20 text-neutral/60"
      }
      if (isSuccess) {
        return "bg-success/20 text-neutral/60"
      }
      return "bg-transparent text-neutral placeholder-neutral/40"
    }

    const getUnderlineColor = () => {
      if (hasError) return "bg-error"
      if (isSuccess) return "bg-success"
      return "bg-neutral"
    }

    return (
      <div
        ref={containerRef}
        className={cn("group relative inline-block align-baseline", containerClassName)}
      >
        <motion.div
          animate={
            hasError
              ? {
                  x: [-5, 5, -5, 5, 0],
                }
              : {
                  x: 0,
                }
          }
          transition={{
            duration: 0.4,
          }}
          className="relative w-full"
        >
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            data-state={hasError ? "error" : isSuccess ? "success" : "default"}
            className={cn(
              "relative z-10 w-full rounded-t-sm px-4 py-1 transition-all duration-300 outline-none md:px-6 md:text-2xl lg:px-4 lg:text-3xl",
              getBaseStyles(),
              className,
              "autofill-override"
            )}
            style={{ fieldSizing: "content" }}
          />

          {/* Animated underline */}
          <div className="bg-neutral/40 absolute bottom-0 left-0 z-0 h-0.5 w-full">
            <motion.div
              className={`h-full ${getUnderlineColor()}`}
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: isFocused || hasError || isSuccess ? 1 : 0,
              }}
              transition={{
                duration: 0.3,
              }}
            />
          </div>

          {/* Error Glow */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="pointer-events-none absolute inset-0 z-20 rounded-md"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="bg-background border-neutral/30 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border shadow-2xl shadow-black/10"
            >
              <div className="p-2">
                <p className="text-neutral/60 px-3 py-2 text-xs font-medium tracking-wider uppercase">
                  Sugerencias
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {filteredSuggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon
                    return (
                      <motion.button
                        key={suggestion.label}
                        type="button"
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.03,
                        }}
                        onClick={() => selectSuggestion(suggestion.label)}
                        className="hover:bg-neutral/5 group hover:border-neutral/20 flex items-center gap-2 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors"
                      >
                        <Icon className="text-neutral/70 group-hover:text-neutral size-4 transition-transform group-hover:scale-110" />
                        <span className="text-neutral/70 group-hover:text-neutral text-sm font-medium">
                          {suggestion.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

ServiceInputWithSuggestions.displayName = "ServiceInputWithSuggestions"
