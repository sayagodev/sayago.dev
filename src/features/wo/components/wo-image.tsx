import Image from 'next/image'

import woImage from '@/public/images/wo.jpeg'
import { useIntlayer } from 'next-intlayer/server'

export function WoImage() {
  const content = useIntlayer('wo-page')
  const altText = content.image.altImage

  return (
    <div className="mb-8 w-fit space-y-2! lg:sticky! lg:top-6">
      <div className="relative mx-auto w-full max-w-125">
        <Image src={woImage} alt={altText} width={500} height={400} priority className=""></Image>
      </div>
      <p className="text-[14px] font-medium md:text-sm">{altText}</p>
    </div>
  )
}
