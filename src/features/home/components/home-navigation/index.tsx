import { Link } from '@/components/localized-link'
import { useIntlayer } from 'next-intlayer/server'

interface NavItemProps {
  children: React.ReactNode
  href: string
  className: string
  isTitle?: boolean
}

function NavItem({ children, href, className, isTitle = false }: NavItemProps) {
  return (
    <button>
      <Link href={href}>
        {isTitle ? (
          <h1 className={className}>{children}</h1>
        ) : (
          <span className={className}>{children}</span>
        )}
      </Link>
    </button >
  )
}

export function HomeNavigation() {
  const content = useIntlayer('home')

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-24 text-center">
      <NavItem isTitle href="/" className="font-krypton text-4xl font-bold md:text-5xl">
        sāyago;dev
      </NavItem>

      <nav className="font-argon flex flex-col gap-5 *:font-semibold md:flex-row md:gap-16 lg:gap-44">
        <NavItem href="/work" className="text-2xl md:text-3xl">
          {content.nav.work}
        </NavItem>
        <NavItem
          href="/wo"
          className="font-zi inline-block mx-auto w-fit -translate-y-0.5 text-[32px] md:-translate-y-2 lg:-translate-x-1 lg:text-[40px]"
        >
          我
        </NavItem>
        <NavItem href="/contact" className="text-2xl md:text-3xl">
          {content.nav.contact}
        </NavItem>
      </nav>
    </div>
  )
}
