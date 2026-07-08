'use client'

import { useTheme } from 'next-themes'
import { GRAINIENT_COLORS } from '@/lib/constants'
import dynamic from 'next/dynamic'
import './background.css'

const Grainient = dynamic(() => import('../grainient'), {
  ssr: false,
})

export function Background({ c1, c2, c3 }: { c1?: string; c2?: string; c3?: string }) {
  const { resolvedTheme } = useTheme()

  if (!c1 && !c2 && !c3) {
    const currentColors =
      GRAINIENT_COLORS[(resolvedTheme as keyof typeof GRAINIENT_COLORS) || 'light']

    return (
      <div className="background-wrapper">
        <Grainient
          {...currentColors}
          className="background-grainient"
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
  } else {
    return (
      <div className="background-wrapper">
        <Grainient
          color1={c1}
          color2={c2}
          color3={c3}
          className="background-grainient"
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
}
