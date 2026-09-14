import Image from 'next/image'

import woImage from '@/public/images/wo.png'
import { useIntlayer } from 'next-intlayer/server'
import { CensorBar } from './censor-bar'
import './wo-image.css'

export function WoImage() {
  const { image } = useIntlayer('wo-image')
  const altText = image.altImage

  return (
    <div className="wo-image">
      <div className="wo-image__wrapper">
        <Image
          src={woImage}
          alt={altText}
          width={500}
          height={400}
          priority
          className="wo-image__img"
        />
        <CensorBar />
      </div>
      <p className="wo-image__caption">{altText}</p>
    </div>
  )
}
