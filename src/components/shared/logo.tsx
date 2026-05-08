import { Link } from '@/components/i18n/Link'
import { Button } from '../ui/button'
import { useIntlayer } from 'next-intlayer/server'

export function Logo() {
  const content = useIntlayer('logo')

  return (
    <Button variant={'link'} aria-label={content.aria.label} title={content.aria.title} asChild>
      <Link href={'/'}>
        <h2 className="font-krypton text-center text-2xl font-bold md:text-4xl">sāyago;dev</h2>
      </Link>
    </Button>
  )
}
