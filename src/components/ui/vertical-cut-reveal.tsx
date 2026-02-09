"use client"

import { AnimationOptions, motion } from "motion/react"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  isValidElement,
  Children,
} from "react"

import { cn } from "@/utils/cn"

interface TextProps {
  children: React.ReactNode
  reverse?: boolean
  from?: "top" | "bottom" | "left" | "right"
  transition?: AnimationOptions
  splitBy?: "words" | "characters" | "lines" | string
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | "random" | number
  containerClassName?: string
  wordLevelClassName?: string
  elementLevelClassName?: string
  onClick?: () => void
  onStart?: () => void
  onComplete?: () => void
  autoStart?: boolean // Whether to start the animation automatically
}

// Ref interface to allow external control of the animation
export interface VerticalCutRevealRef {
  startAnimation: () => void
  reset: () => void
}

interface WordObject {
  characters: string[]
  needsSpace: boolean
}

const VerticalCutReveal = forwardRef<VerticalCutRevealRef, TextProps>(
  (
    {
      children,
      reverse = false,
      from,
      transition = {
        type: "spring",
        stiffness: 190,
        damping: 22,
      },
      splitBy = "words",
      staggerDuration = 0.2,
      staggerFrom = "first",
      containerClassName,
      wordLevelClassName,
      elementLevelClassName,
      onClick,
      onStart,
      onComplete,
      autoStart = true,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null)
    const [isAnimating, setIsAnimating] = useState(false)

    // Detectar si los children son elementos React o texto
    const isReactElement = useMemo(() => {
      if (typeof children === "string" || typeof children === "number") {
        return false
      }
      if (Array.isArray(children)) {
        return children.some((child) => isValidElement(child))
      }
      return isValidElement(children)
    }, [children])

    const text =
      typeof children === "string"
        ? children
        : typeof children === "number"
          ? String(children)
          : isReactElement
            ? ""
            : children?.toString() || ""

    // Si from no se especifica, usar reverse para determinar la dirección vertical
    const direction = from || (reverse ? "top" : "bottom")

    // handy function to split text into characters with support for unicode and emojis
    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
        return Array.from(segmenter.segment(text), ({ segment }) => segment)
      }
      // Fallback for browsers that don't support Intl.Segmenter
      return Array.from(text)
    }

    // Split text based on splitBy parameter
    const elements = useMemo(() => {
      const words = text.split(" ")
      if (splitBy === "characters") {
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }))
      }
      return splitBy === "words"
        ? text.split(" ")
        : splitBy === "lines"
          ? text.split("\n")
          : text.split(splitBy)
    }, [text, splitBy])

    // Calculate stagger delays based on staggerFrom
    const getStaggerDelay = useCallback(
      (index: number, total?: number) => {
        const totalCount =
          total !== undefined
            ? total
            : splitBy === "characters"
              ? elements.reduce(
                  (acc, word) =>
                    acc +
                    (typeof word === "string"
                      ? 1
                      : word.characters.length + (word.needsSpace ? 1 : 0)),
                  0
                )
              : elements.length
        if (staggerFrom === "first") return index * staggerDuration
        if (staggerFrom === "last") return (totalCount - 1 - index) * staggerDuration
        if (staggerFrom === "center") {
          const center = Math.floor(totalCount / 2)
          return Math.abs(center - index) * staggerDuration
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * totalCount)
          return Math.abs(randomIndex - index) * staggerDuration
        }
        return Math.abs(staggerFrom - index) * staggerDuration
      },
      [elements.length, staggerFrom, staggerDuration, splitBy]
    )

    const startAnimation = useCallback(() => {
      setIsAnimating(true)
      onStart?.()
    }, [onStart])

    // Expose the startAnimation function via ref
    useImperativeHandle(ref, () => ({
      startAnimation,
      reset: () => setIsAnimating(false),
    }))

    // Auto start animation
    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
    }, [autoStart])

    const isHorizontal = direction === "left" || direction === "right"
    const isVertical = direction === "top" || direction === "bottom"

    const variants = {
      hidden: isHorizontal
        ? { x: direction === "left" ? "-100%" : "100%" }
        : { y: direction === "top" ? "-100%" : "100%" },
      visible: (i: number) => ({
        x: isHorizontal ? 0 : undefined,
        y: isVertical ? 0 : undefined,
        transition: {
          ...transition,
          delay: ((transition?.delay as number) || 0) + getStaggerDelay(i),
        },
      }),
    }

    // Si los children son elementos React, renderizarlos con animación
    if (isReactElement) {
      const childrenArray = Children.toArray(children)
      const reactElements = childrenArray.filter((child) => isValidElement(child))
      const totalElements = reactElements.length

      return (
        <span
          className={cn(
            containerClassName,
            "inline-flex flex-wrap items-center",
            splitBy === "lines" && "flex-col"
          )}
          onClick={onClick}
          ref={containerRef}
          {...props}
        >
          {reactElements.map((element, index) => {
            return (
              <span
                key={index}
                className={cn(elementLevelClassName, "relative inline-block overflow-hidden")}
                style={{
                  paddingTop: isVertical ? "0.1em" : 0,
                  paddingBottom: isVertical ? "0.1em" : 0,
                  paddingLeft: isHorizontal ? "0.05em" : 0,
                  paddingRight: isHorizontal ? "0.05em" : 0,
                }}
              >
                <motion.span
                  custom={index}
                  initial="hidden"
                  animate={isAnimating ? "visible" : "hidden"}
                  variants={{
                    hidden: isHorizontal
                      ? { x: direction === "left" ? "-100%" : "100%" }
                      : { y: direction === "top" ? "-100%" : "100%" },
                    visible: {
                      x: isHorizontal ? 0 : undefined,
                      y: isVertical ? 0 : undefined,
                      transition: {
                        ...transition,
                        delay:
                          ((transition?.delay as number) || 0) +
                          getStaggerDelay(index, totalElements),
                      },
                    },
                  }}
                  onAnimationComplete={index === reactElements.length - 1 ? onComplete : undefined}
                  className="inline-block"
                  style={{ willChange: "transform" }}
                >
                  {element}
                </motion.span>
              </span>
            )
          })}
        </span>
      )
    }

    // Comportamiento original para texto
    return (
      <span
        className={cn(
          containerClassName,
          "inline-flex flex-wrap whitespace-pre-wrap",
          splitBy === "lines" && "flex-col"
        )}
        onClick={onClick}
        ref={containerRef}
        {...props}
      >
        <span className="sr-only">{text}</span>

        {(splitBy === "characters"
          ? (elements as WordObject[])
          : (elements as string[]).map((el, i) => ({
              characters: [el],
              needsSpace: i !== elements.length - 1,
            }))
        ).map((wordObj, wordIndex, array) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0)

          return (
            <span
              key={wordIndex}
              aria-hidden="true"
              className={cn("inline-flex", wordLevelClassName)}
            >
              {wordObj.characters.map((char, charIndex) => (
                <span
                  className={cn(
                    elementLevelClassName,
                    "relative inline-block overflow-hidden whitespace-pre-wrap"
                  )}
                  key={charIndex}
                  style={{
                    lineHeight: "1.2em",
                    verticalAlign: "baseline",
                    paddingTop: isVertical ? "0.1em" : 0,
                    paddingBottom: isVertical ? "0.1em" : 0,
                    paddingLeft: isHorizontal ? "0.05em" : 0,
                    paddingRight: isHorizontal ? "0.05em" : 0,
                  }}
                >
                  <motion.span
                    custom={previousCharsCount + charIndex}
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={variants}
                    onAnimationComplete={
                      wordIndex === elements.length - 1 &&
                      charIndex === wordObj.characters.length - 1
                        ? onComplete
                        : undefined
                    }
                    className="inline-block"
                    style={{ willChange: "transform" }}
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
              {wordObj.needsSpace && <span> </span>}
            </span>
          )
        })}
      </span>
    )
  }
)

VerticalCutReveal.displayName = "VerticalCutReveal"
export default VerticalCutReveal
