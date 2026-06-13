'use client'

import { useIntlayer } from 'next-intlayer'
import { useCurrentTime } from '@/hooks/use-current-time'
import './footer-clock.css'

export function FooterClock() {
  const { time, periodKey } = useCurrentTime()
  const content = useIntlayer('footer-clock')

  return (
    <footer className="footer-block" aria-hidden="true" role="presentation">
      {/* Mobile Version */}
      <p className="clock-container" data-device="mobile">
        <span className="clock-text" data-version="mobile">
          {time}
        </span>
        <span className="clock-zh">{content[periodKey].zh}</span>
      </p>

      {/* Desktop Version */}
      <p className="clock-container" data-device="desktop">
        <span className="clock-text" data-version="desktop">
          {content[periodKey].message({ time })}
        </span>
        <span className="clock-zh">{content[periodKey].zh}</span>
      </p>
    </footer>
  )
}
