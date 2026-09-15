'use client'

import Image from 'next/image'
import { useState } from 'react'
import woImage from '@/public/images/wo.png'
import { CensorBar } from './censor-bar'

export function ImageFrame({ alt }: { alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="wo-image__wrapper">
      {!loaded && <div role="status" className="skeleton wo-image__skeleton" />}
      <Image
        src={woImage}
        alt={alt}
        priority
        onLoad={() => setLoaded(true)}
        ref={(img) => {
          if (img?.complete) setLoaded(true)
        }}
        className="wo-image__img"
      />
      <CensorBar />
    </div>
  )
}
