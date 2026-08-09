'use client'

import { useIntlayer } from 'next-intlayer'
import { useQueryState } from 'nuqs'
import { TLDRButton } from '../tldr-button'
import { MarkdownRenderer } from 'next-intlayer/markdown'
import './wo-resume.css'

export function WoResume() {
  const { resumeL, resumeTLDRL } = useIntlayer('wo-resume')
  const [tldr] = useQueryState('tldr')

  return (
    <article className="wo-resume">
      <TLDRButton />
      <MarkdownRenderer forceBlock tagfilter>
        {tldr === 'true' ? resumeTLDRL.value : resumeL.value}
      </MarkdownRenderer>
    </article>
  )
}
