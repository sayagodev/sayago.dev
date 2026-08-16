import { useIntlayer } from 'next-intlayer/server'
import './contact-channels.css'

export function ContactChannels() {
  const content = useIntlayer('contact')

  const channels = [
    {
      label: content.channels.emailLabel,
      value: content.channels.emailValue,
      href: 'mailto:hi@sayago.dev',
    },
    {
      label: content.channels.githubLabel,
      value: content.channels.githubValue,
      href: 'https://github.com/sayagodev',
    },
    {
      label: content.channels.locationLabel,
      value: content.channels.locationValue,
      href: undefined,
    },
  ]

  return (
    <div className="ct-intro contact-channels">
      {channels.map((c) => (
        <div key={c.label} className="contact-channels__item">
          <span className="contact-channels__label">{c.label}</span>
          {c.href ? (
            <a href={c.href} className="contact-channels__link">
              {c.value}
            </a>
          ) : (
            <span className="contact-channels__value">{c.value}</span>
          )}
        </div>
      ))}
    </div>
  )
}
