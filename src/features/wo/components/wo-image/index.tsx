import { useIntlayer } from 'next-intlayer/server'
import { ImageFrame } from './image-frame'
import './wo-image.css'

export function WoImage() {
  const { image } = useIntlayer('wo-image')
  const altText = image.altImage

  return (
    <div className="wo-image">
      <ImageFrame alt={altText} />
      <p className="wo-image__caption">{altText}</p>
    </div>
  )
}
