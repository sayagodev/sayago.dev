import { useIntlayer } from 'next-intlayer/server'
import { Button } from '@/components/ui/button'
import './home-navigation.css'

interface NavItemProps {
  children: React.ReactNode
  href: string
  className: string
  isTitle?: boolean
}

function NavItem({ children, href, className, isTitle = false }: NavItemProps) {
  return (
    <Button href={href} variant="link">
      {isTitle ? (
        <h1 className={className}>{children}</h1>
      ) : (
        <span className={className}>{children}</span>
      )}
    </Button>
  )
}

export function HomeNavigation() {
  const content = useIntlayer('home')

  return (
    <div className="home-nav">
      <NavItem isTitle href="/" className="home-nav__title">
        sāyago;dev
      </NavItem>

      <nav className="home-nav__menu">
        <NavItem href="/work" className="home-nav__link">
          {content.nav.work}
        </NavItem>
        <NavItem
          href="/wo"
          className="home-nav__special"
        >
          我
        </NavItem>
        <NavItem href="/contact" className="home-nav__link">
          {content.nav.contact}
        </NavItem>
      </nav>
    </div>
  )
}
