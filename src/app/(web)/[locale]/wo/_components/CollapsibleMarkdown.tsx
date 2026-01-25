"use client"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { ANIMATION_EASING } from "@/lib/animations"
import { cn } from "@/utils/cn"
import { MarkdownRenderer } from "@/utils/markdown-renderer"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cubicBezier, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

interface CollapsibleMarkdownProps {
  content: string
  className?: string
  maxHeight?: number
}

export function CollapsibleMarkdown({
  content,
  className,
  maxHeight = 300,
}: CollapsibleMarkdownProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsCollapse, setNeedsCollapse] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const t = useTranslations("pages.collapsible")

  useEffect(() => {
    if (!isMobile || !maxHeight) {
      setNeedsCollapse(false)
      return
    }

    const checkHeight = () => {
      if (!contentRef.current) return

      // Use requestAnimationFrame to ensure the DOM is updated
      requestAnimationFrame(() => {
        if (!contentRef.current) return
        const contentHeight = contentRef.current.scrollHeight
        setNeedsCollapse(contentHeight > maxHeight)
      })
    }

    const timeoutId = setTimeout(checkHeight, 100)

    // Also check when the content changes with ResizeObserver
    const resizeObserver = new ResizeObserver(checkHeight)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [content, isMobile, maxHeight])

  if (!isMobile) {
    return <MarkdownRenderer content={content} className={className} />
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={contentRef}
        className="w-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: !needsCollapse || isExpanded ? "none" : `${maxHeight}px`,
        }}
      >
        <div className="w-full">
          <MarkdownRenderer content={content} />
        </div>
      </div>

      {/* Fade gradient when collapsed */}
      {needsCollapse && !isExpanded && (
        <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-20 bg-linear-to-t to-transparent" />
      )}

      {needsCollapse && (
        <div className="relative z-10 mt-4 flex items-center justify-center">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col items-center text-sm font-medium"
          >
            {isExpanded ? (
              <>
                {t("viewLess")}
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: cubicBezier(...ANIMATION_EASING.easeInOut),
                  }}
                >
                  <ChevronUp className="size-4" />
                </motion.div>
              </>
            ) : (
              <>
                {t("viewMore")}
                <motion.div
                  animate={{
                    y: [0, 2, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: cubicBezier(...ANIMATION_EASING.easeInOut),
                  }}
                >
                  <ChevronDown className="size-4" />
                </motion.div>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
