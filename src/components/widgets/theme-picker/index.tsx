'use client'

import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useIntlayer } from 'next-intlayer'
import { useTheme } from 'next-themes'

interface Theme {
  id: string
  name: string
  gradient: [string, string, string]
  tone: 'light' | 'dark' // 明 (light) or 暗 (dark)
}

interface ThemePickerProps {
  themes: Theme[]
  orientation?: 'vertical' | 'horizontal'
  onSelect?: (theme: Theme) => void
}

export function ThemePicker({ themes, orientation = 'vertical', onSelect }: ThemePickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { aria } = useIntlayer('theme-picker')
  const { setTheme } = useTheme()

  const changeTheme = (themeName: string) => {
    setTheme(themeName.toLowerCase())
  }

  const getCircularIndex = (index: number) => {
    const len = themes.length
    return ((index % len) + len) % len
  }

  const visibleIndices = [
    getCircularIndex(currentIndex - 1),
    getCircularIndex(currentIndex),
    getCircularIndex(currentIndex + 1),
  ]

  const navigate = (dir: number) => {
    setDirection(dir)
    setCurrentIndex((prev) => getCircularIndex(prev + dir))
    const newIndex = getCircularIndex(currentIndex + dir)
    const selectedTheme = themes[newIndex]
    onSelect?.(selectedTheme)
    changeTheme(selectedTheme.name)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (orientation === 'vertical') {
      if (e.key === 'ArrowUp') navigate(-1)
      if (e.key === 'ArrowDown') navigate(1)
    } else {
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
  }

  const isVertical = orientation === 'vertical'
  const activeTheme = themes[visibleIndices[1]]

  const getItemVariants = (position: number) => {
    const isCenter = position === 1
    const offset = isVertical ? 44 : 52

    const basePosition = (position - 1) * offset
    const enterOffset = direction * offset

    const variants: Variants = {
      initial: {
        x: isVertical ? 0 : basePosition + enterOffset,
        y: isVertical ? basePosition + enterOffset : 0,
        scale: isCenter ? 0.6 : 0.5,
        opacity: 0,
      },
      animate: {
        x: isVertical ? 0 : basePosition,
        y: isVertical ? basePosition : 0,
        scale: isCenter ? 1 : 0.7,
        opacity: isCenter ? 1 : 0.3,
        filter: isCenter ? 'blur(0px)' : 'blur(1px)',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 28,
          mass: 0.8,
        },
      },
      exit: {
        x: isVertical ? 0 : basePosition - direction * offset,
        y: isVertical ? basePosition - direction * offset : 0,
        scale: 0.4,
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 35,
        },
      },
    }

    return variants
  }

  return (
    <div
      role="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`
        relative flex items-center gap-4 outline-none
        px-3! py-4! rounded-2xl
        bg-white/10 backdrop-blur-sm
        border border-black/[0.08]
        shadow-[0_2px_16px_rgba(0,0,0,0.04)]
        ${isVertical ? 'flex-col' : 'flex-row'}
      `}
      aria-label={aria.label}
    >
      {/* Fixed label - tone in hanzi (明/暗) */}
      <div
        className={`
          font-zi text-[11px] tracking-[0.15em] text-black/50 font-medium
          ${isVertical ? 'h-8' : 'w-8 text-center'}
        `}
        style={isVertical ? { writingMode: 'vertical-rl' } : {}}
      >
        {activeTheme?.tone === 'light' ? '明' : '暗'}
      </div>

      {/* Circles container */}
      <motion.div
        className={`
          relative flex items-center justify-center
          ${isVertical ? 'flex-col h-28' : 'flex-row w-32'}
        `}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleIndices.map((themeIndex, position) => {
            const theme = themes[themeIndex]
            const isCenter = position === 1
            const [color1, color2, color3] = theme.gradient

            return (
              <motion.div
                key={`${theme.id}-${position}`}
                role="option"
                aria-selected={isCenter}
                onClick={() => {
                  if (position === 0) navigate(-1)
                  if (position === 2) navigate(1)
                }}
                className={`
                  absolute cursor-pointer
                  ${!isCenter && 'hover:opacity-50'}
                `}
                variants={getItemVariants(position)}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ zIndex: isCenter ? 10 : 5 }}
              >
                {/* Outer glow for active */}
                {isCenter && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 0.4 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    style={{
                      background: `radial-gradient(circle, ${color1}60, transparent 70%)`,
                      filter: 'blur(8px)',
                    }}
                  />
                )}

                {/* Pulse ring for active */}
                {isCenter && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      border: `1px solid ${color1}`,
                    }}
                  />
                )}

                {/* Main circle with gradient */}
                <motion.div
                  className={`
                    relative rounded-full
                    ${isCenter ? 'w-7 h-7' : 'w-7 h-7'}
                  `}
                  style={{
                    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
                    boxShadow: isCenter
                      ? `0 0 20px ${color2}50, 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)`
                      : `0 1px 4px rgba(0,0,0,0.1)`,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {/* Inner shine */}
                  <div
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.5), transparent 60%)',
                    }}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Name label - animated */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme?.id + '-name'}
          initial={{ opacity: 0, y: isVertical ? 8 : 0, x: isVertical ? 0 : 8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: isVertical ? -8 : 0, x: isVertical ? 0 : -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`
            text-[10px] tracking-[0.12em] text-black/60 font-medium lowercase
            ${isVertical ? 'h-fit' : 'w-16 text-left'}
          `}
          style={isVertical ? { writingMode: 'vertical-rl' } : {}}
        >
          {activeTheme?.name}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
