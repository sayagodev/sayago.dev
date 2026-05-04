'use client'

import { useIntlayer } from 'next-intlayer'
import { useCurrentTime } from '@/hooks/use-current-time'

export function FooterClock() {
  const { time, periodKey } = useCurrentTime()
  const content = useIntlayer('footer-clock')

  return (
    <footer
      className="absolute bottom-2 lg:bottom-4 left-0 w-full flex items-center justify-center"
      aria-hidden="true"
      role="presentation"
    >
      {/* Mobile Version */}
      <p className="flex items-center gap-2 lg:hidden">
        <span className="text-md font-argon font-medium md:text-lg">{time}</span>
        <span className="font-zi -translate-y-0.5 text-[21px] md:text-[26px]">
          {content[periodKey].zh}
        </span>
      </p>

      {/* Desktop Version */}
      <p className="hidden items-center gap-2 lg:flex">
        <span className="font-argon text-xl font-medium">
          {content[periodKey].message({ time })}
        </span>
        <span className="font-zi -translate-y-0.5 text-[21px] md:text-[26px]">
          {content[periodKey].zh}
        </span>
      </p>
    </footer>
  )
}
