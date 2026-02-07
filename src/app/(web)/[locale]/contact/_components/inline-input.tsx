"use client"

import { cn } from "@/utils/cn"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

interface InlineInputPremiumProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hasError?: boolean
  isSuccess?: boolean
  containerClassName?: string
}

export function InlineInput({
  label,
  hasError,
  isSuccess,
  className = "",
  containerClassName = "",
  onFocus,
  onBlur,
  onChange,
  ...props
}: InlineInputPremiumProps) {
  const [isFocused, setIsFocused] = useState(false)

  const getBaseStyles = () => {
    if (hasError) {
      return "bg-error/20 text-neutral/60"
    }
    if (isSuccess) {
      return "bg-success/20 text-neutral/60"
    }

    return "bg-transparent text-neutral placeholder-neutral/40"
  }

  return (
    <div className={cn("group relative mx-3 inline-block align-baseline", containerClassName)}>
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
          type="text"
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInput={(e) => {
            if (onChange) {
              onChange(e as React.ChangeEvent<HTMLInputElement>)
            }
          }}
          onChange={onChange}
          data-state={hasError ? "error" : isSuccess ? "success" : "default"}
          className={cn(
            "relative z-10 rounded-t-sm px-4 py-1 transition-all duration-300 outline-none md:px-6 md:text-2xl lg:px-4 lg:text-3xl",
            getBaseStyles(),
            className,
            "autofill-override"
          )}
          style={{ fieldSizing: "content" }}
          {...props}
        />

        {/* Animated Underline */}
        <div className="bg-neutral/40 absolute bottom-0 left-0 z-0 h-0.5 w-full">
          <motion.div
            className={`h-full ${hasError ? "bg-error" : isSuccess ? "bg-success" : "bg-neutral"}`}
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
    </div>
  )
}
