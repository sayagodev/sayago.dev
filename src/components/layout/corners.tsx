'use client'

import bottomDer from "@/public/images/corners/bottom-der.svg"
import bottomIzq from "@/public/images/corners/bottom-izq.svg"
import topDer from "@/public/images/corners/top-der.svg"
import topIzq from "@/public/images/corners/top-izq.svg"

import { MaskIcon } from "@/utils/mask-icon"

export function Corners() {
    return (
        <div className="">
            <MaskIcon src={topIzq.src} className={`absolute w-[60px] h-[60px] top-2.5 left-2.5 lg:top-8 lg:left-8 bg-corners`} />
            <MaskIcon src={topDer.src} className={`absolute w-[60px] h-[60px] top-2.5 right-2.5 lg:top-8 lg:right-8 bg-corners`} />
            <MaskIcon src={bottomIzq.src} className={`absolute w-[60px] h-[60px] bottom-2.5 left-2.5 lg:bottom-8 lg:left-8 bg-corners`} />
            <MaskIcon src={bottomDer.src} className={`absolute w-[60px] h-[60px] bottom-2.5 right-2.5 lg:bottom-8 lg:right-8 bg-corners`} />

        </div>
    )
}