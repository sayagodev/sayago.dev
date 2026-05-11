import { useIntlayer } from 'next-intlayer/server'
import { TLDRButton } from './tldr-button'
import { MarkdownRenderer } from 'next-intlayer/markdown'

export function WoResume() {
  const { resumeL } = useIntlayer('wo-resume')

  return (
    <article className="w-full">
      <TLDRButton />
      <MarkdownRenderer forceBlock tagfilter>
        {resumeL.value}
      </MarkdownRenderer>
    </article>
  )
}
