import { useIntlayer } from 'next-intlayer/server'
import './wo-blog.css'

interface BarrierIconProps {
  readonly size?: number
}

// Port of `refactor/wo-page` ConstructionIcon. The stripe slide runs on SMIL
// instead of motion, so the icon stays a static server component.
function BarrierIcon({ size = 50 }: BarrierIconProps) {
  return (
    <svg
      fill="none"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="wo-blog-stripes" width="6" height="14" patternUnits="userSpaceOnUse">
          <path d="M-4 -2 L14 30" stroke="currentColor" strokeWidth="2" />
          <animateTransform
            attributeName="patternTransform"
            type="translate"
            from="0 0"
            to="6 0"
            dur="1s"
            repeatCount="indefinite"
          />
        </pattern>
      </defs>
      <rect fill="url(#wo-blog-stripes)" height="8" rx="1" width="20" x="2" y="6" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
    </svg>
  )
}

export function WoBlog() {
  const content = useIntlayer('wo-blog')

  return (
    <section className="wo-blog">
      <h2 className="wo-blog__heading">{content.heading}</h2>

      <div className="wo-blog__body">
        <BarrierIcon />
        <h3 className="wo-blog__title">{content.title}</h3>
        <p className="wo-blog__description">{content.description}</p>
      </div>
    </section>
  )
}
