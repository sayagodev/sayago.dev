'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, ZapOff } from 'lucide-react'
import { useIntlayer } from 'next-intlayer'
import { useQueryState } from 'nuqs'

export function TLDRButton() {
  const content = useIntlayer('wo-page')
  const [tldr, setTldr] = useQueryState('tldr')

  return (
    <div className="mb-4 flex items-center gap-2 place-self-start">
      <h1 className="text-[16px] md:text-xl">{content.tldrTitle}</h1>
      <ArrowRight className="size-3 font-bold md:size-4" aria-hidden="true" />
      <Button
        variant={'link'}
        className="flex items-center justify-center gap-2 text-[16px] font-semibold md:text-xl"
        onClick={() => setTldr(tldr ? null : 'true')}
      >
        TL;DR
        <span>
          {!tldr ? (
            <ZapOff className="text-warning size-4" />
          ) : (
            <Zap className="text-warning size-4" />
          )}
        </span>
      </Button>
    </div>
  )
}
