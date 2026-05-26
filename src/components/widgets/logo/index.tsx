import { Link } from '@/components/localized-link'
import { Button } from '@/components/ui/button'
import { useIntlayer } from 'next-intlayer/server'

export function Logo() {
  const content = useIntlayer('logo')

  return (
    <div className="flex justify-center mb-8!">
      <Button
        variant={'link'}
        aria-label={content.aria.label}
        title={content.aria.title}
        className="w-fit"
        asChild
      >
        <Link href={'/'}>
          <h2 className="font-krypton text-center text-2xl font-bold md:text-4xl">sāyago;dev</h2>
        </Link>
      </Button>
    </div>
  )
}
