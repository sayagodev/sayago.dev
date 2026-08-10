'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './text-rotate.css'

// handy function to split text into characters with support for unicode and emojis
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  // Fallback for browsers that don't support Intl.Segmenter
  return Array.from(text)
}

interface TextRotateProps {
  /**
   * Array of text strings to rotate through.
   */
  texts: string[]

  /**
   * Time in milliseconds between text rotations.
   * @default 2600
   */
  rotationInterval?: number

  /**
   * Class name for the container element (the static box).
   * @default undefined
   */
  mainClassName?: string
}

const EXIT_DURATION = 0.3
const ENTER_DURATION = 0.35
const CHAR_STAGGER = 0.025
const BOX_DURATION = 0.45

export default function TextRotate({
  texts,
  rotationInterval = 2600,
  mainClassName,
}: TextRotateProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const boxRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const textsRef = useRef(texts)
  const rotationIntervalRef = useRef(rotationInterval)
  const firstRender = useRef(true)
  const pinnedWidthRef = useRef(0)

  useEffect(() => {
    textsRef.current = texts
    rotationIntervalRef.current = rotationInterval
  })

  // Enter animation: box adapts its width, chars rise from below (y: 100%) — skipped on first render
  useGSAP(
    () => {
      if (firstRender.current) {
        firstRender.current = false
        return
      }
      const box = boxRef.current
      const textEl = textRef.current
      if (!box || !textEl) return
      const chars = gsap.utils.toArray<HTMLElement>(box.querySelectorAll('[data-char]'))
      if (!chars.length) return

      const naturalW = textEl.offsetWidth
      const available = box.parentElement?.clientWidth ?? naturalW
      const padding =
        parseFloat(gsap.getProperty(box, 'paddingLeft') as string) +
        parseFloat(gsap.getProperty(box, 'paddingRight') as string)
      const targetW = Math.min(naturalW + padding, available)
      const fromW = pinnedWidthRef.current

      if (Math.abs(targetW - fromW) > 0.5) {
        gsap.to(box, {
          width: targetW,
          duration: BOX_DURATION,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(box, { clearProps: 'width' })
            textEl.style.width = ''
          },
        })
      } else {
        gsap.set(box, { clearProps: 'width' })
        textEl.style.width = ''
      }

      gsap.fromTo(
        chars,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: ENTER_DURATION,
          ease: 'back.out(1.2)',
          stagger: CHAR_STAGGER,
          overwrite: 'auto',
        }
      )
    },
    { scope: boxRef, dependencies: [currentTextIndex] }
  )

  // Auto-rotate: chars exit upward (y: -120%) staggered, then the text swaps
  useGSAP(
    () => {
      const box = boxRef.current
      if (!box) return
      const intervalId = setInterval(() => {
        const chars = gsap.utils.toArray<HTMLElement>(box.querySelectorAll('[data-char]'))
        if (!chars.length) return
        gsap.to(chars, {
          yPercent: -120,
          duration: EXIT_DURATION,
          ease: 'power2.in',
          stagger: CHAR_STAGGER,
          overwrite: 'auto',
          onComplete: () => {
            pinnedWidthRef.current = box.offsetWidth
            gsap.set(box, { width: pinnedWidthRef.current })
            if (textRef.current) textRef.current.style.width = 'max-content'
            setCurrentTextIndex((prev) => (prev + 1) % textsRef.current.length)
          },
        })
      }, rotationIntervalRef.current)
      return () => clearInterval(intervalId)
    },
    { scope: boxRef }
  )

  if (!texts.length) return null

  const currentText = texts[Math.min(currentTextIndex, texts.length - 1)]
  const words = currentText.split(' ')

  return (
    <span ref={boxRef} className={mainClassName}>
      <span className="sr-only">{currentText}</span>
      <span ref={textRef} aria-hidden className="text-rotate__text">
        {words.map((word, wordIndex, array) => (
          <span key={wordIndex} className="text-rotate__word">
            {splitIntoCharacters(word).map((char, charIndex) => (
              <span key={charIndex} data-char className="text-rotate__char">
                {char}
              </span>
            ))}
            {wordIndex !== array.length - 1 && <span className="text-rotate__space"> </span>}
          </span>
        ))}
      </span>
    </span>
  )
}
