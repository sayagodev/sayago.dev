import Image from 'next/image'

import woImage from '@/public/images/wo.jpeg'
import { useIntlayer } from 'next-intlayer/server'
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
      </div>
      <p className="wo-image__caption">{altText}</p>
    </div>
  )
}
