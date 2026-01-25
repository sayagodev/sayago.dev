"use client"

import woImage from "@/public/images/wo.png"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface WoImageSectionProps {
  altText: string
}

export function WoImageSection({ altText }: WoImageSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const yRepel = useMotionValue(0)
  const yBase = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springYRepel = useSpring(yRepel, { stiffness: 150, damping: 15 })

  // Combine base floating animation with repulsion
  const y = useTransform([yBase, springYRepel], ([base, repel]: number[]) => base + repel)

  // Base floating animation
  useEffect(() => {
    let animationId: number
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const value = Math.sin(elapsed * Math.PI * 2) * 1
      yBase.set(value)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [yBase])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX
    const mouseY = e.clientY

    // Calculate distance and direction
    const deltaX = mouseX - centerX
    const deltaY = mouseY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    const influenceRadius = 80
    const maxRepel = 8 // Máxima distancia de repulsión

    if (distance < influenceRadius && distance > 0) {
      const force = (1 - distance / influenceRadius) * maxRepel
      const angle = Math.atan2(-deltaY, -deltaX)

      // Apply repulsion in the direction opposite to the cursor
      x.set(Math.cos(angle) * force)
      yRepel.set(Math.sin(angle) * force)
    } else {
      x.set(0)
      yRepel.set(0)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    yRepel.set(0)
  }

  return (
    <div className="mb-8 w-fit space-y-2 lg:sticky lg:top-6">
      <div className="relative w-fit">
        <Image src={woImage} alt={altText} width={500} height={400} className="h-full w-full" />
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            x: springX,
            y: y,
          }}
          className="bg-neutral text-info-content font-zi absolute -right-3 bottom-[36%] -rotate-10 cursor-pointer px-3 py-1 md:px-[3%]"
        >
          她很漂亮
        </motion.div>
      </div>
      <p className="text-[14px] font-medium md:text-sm">{altText}</p>
    </div>
  )
}
