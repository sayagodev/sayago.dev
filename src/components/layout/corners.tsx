"use client"

import bottomDer from "@/public/images/corners/bottom-der.svg"
import bottomIzq from "@/public/images/corners/bottom-izq.svg"
import topDer from "@/public/images/corners/top-der.svg"
import topIzq from "@/public/images/corners/top-izq.svg"

import { MaskIcon } from "@/utils/mask-icon"

export function Corners() {
  return (
    <div>
      <MaskIcon
        src={topIzq.src}
        className={`bg-corners absolute top-2.5 left-2.5 h-[60px] w-[60px] lg:top-8 lg:left-8`}
      />
      <MaskIcon
        src={topDer.src}
        className={`bg-corners absolute top-2.5 right-2.5 h-[60px] w-[60px] lg:top-8 lg:right-8`}
      />
      <MaskIcon
        src={bottomIzq.src}
        className={`bg-corners absolute bottom-2.5 left-2.5 h-[60px] w-[60px] lg:bottom-8 lg:left-8`}
      />
      <MaskIcon
        src={bottomDer.src}
        className={`bg-corners absolute right-2.5 bottom-2.5 h-[60px] w-[60px] lg:right-8 lg:bottom-8`}
      />
    </div>
  )
}
