import { Link } from '@/components/localized-link'
import { Button } from '@/components/ui/button'
import { useIntlayer } from 'next-intlayer/server'
import './logo.css'

export function Logo() {
  const content = useIntlayer('logo')

  return (
    <div className="logo-container">
      <Button
        variant={'link'}
        aria-label={content.aria.label}
        title={content.aria.title}
        className="logo-button"
      >
        <Link href={'/'}>
          <h2 className="logo-title">sāyago;dev</h2>
        </Link>
      </Button>
    </div>
  )
}
