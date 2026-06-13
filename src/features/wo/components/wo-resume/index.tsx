import { useIntlayer } from 'next-intlayer/server'
import { TLDRButton } from '../tldr-button'
import { MarkdownRenderer } from 'next-intlayer/markdown'
import './wo-resume.css'

export function WoResume() {
  const { resumeL } = useIntlayer('wo-resume')

  return (
    <article className="wo-resume">
      <TLDRButton />
      <MarkdownRenderer forceBlock tagfilter>
        {resumeL.value}
      </MarkdownRenderer>
    </article>
  )
}
