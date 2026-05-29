'use client'

import { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useIntlayer } from 'next-intlayer'
import { useTheme } from 'next-themes'
import './theme-picker.css'

interface Theme {
  id: string
  name: string
  gradient: [string, string, string]
  tone: 'light' | 'dark'
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
      className="theme-picker"
      data-orientation={orientation}
      aria-label={aria.label}
    >
      <div className="theme-picker__label">
        {activeTheme?.tone === 'light' ? '明' : '暗'}
      </div>

      <div className="theme-picker__circles">
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
                className="theme-option"
                data-active={isCenter}
                style={{
                  '--th-c1': color1,
                  '--th-c2': color2,
                  '--th-c3': color3,
                } as React.CSSProperties}
                variants={getItemVariants(position)}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {isCenter && (
                  <motion.div
                    className="theme-option__glow"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 0.4 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                )}

                {isCenter && (
                  <motion.div
                    className="theme-option__pulse"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                <motion.div
                  className="theme-option__circle"
                  style={{
                    background: `linear-gradient(135deg, var(--th-c1) 0%, var(--th-c2) 50%, var(--th-c3) 100%)`,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="theme-option__shine" />
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme?.id + '-name'}
          initial={{ opacity: 0, y: isVertical ? 8 : 0, x: isVertical ? 0 : 8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: isVertical ? -8 : 0, x: isVertical ? 0 : -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="theme-picker__name"
        >
          {activeTheme?.name}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
