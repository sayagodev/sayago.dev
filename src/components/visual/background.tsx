'use client'

import { useTheme } from 'next-themes'
import { GRAINIENT_COLORS } from '@/constants'
import dynamic from 'next/dynamic'

const Grainient = dynamic(() => import('./Grainient'), {
  ssr: false,
})

export function Background() {
  const { resolvedTheme } = useTheme()

  const currentColors =
    GRAINIENT_COLORS[(resolvedTheme as keyof typeof GRAINIENT_COLORS) || 'light']

  return (
    <div className="min-w-dvw min-h-dvh absolute -z-999">
      <Grainient
        {...currentColors}
        className="min-h-dvh min-w-dvw"
        timeSpeed={0.25}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
    </div>
  )
}
