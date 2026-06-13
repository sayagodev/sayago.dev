'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, ZapOff } from 'lucide-react'
import { useIntlayer } from 'next-intlayer'
import { useQueryState } from 'nuqs'
import './tldr-button.css'

export function TLDRButton() {
  const content = useIntlayer('wo-page')
  const [tldr, setTldr] = useQueryState('tldr')

  return (
    <div className="tldr-button">
      <h1 className="tldr-button__title">{content.tldrTitle}</h1>
      <ArrowRight className="tldr-button__arrow" aria-hidden="true" />
      <Button
        variant={'link'}
        className="tldr-button__trigger"
        onClick={() => setTldr(tldr ? null : 'true')}
      >
        TL;DR
        <span className="tldr-button__zap">{!tldr ? <ZapOff /> : <Zap />}</span>
      </Button>
    </div>
  )
}
