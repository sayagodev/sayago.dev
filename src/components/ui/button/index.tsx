import { Link } from '@/components/localized-link'
import type { ComponentPropsWithoutRef } from 'react'
import './button.css'

type ButtonVariant = 'primary' | 'secondary' | 'link'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  href?: string
  variant?: ButtonVariant
}

export function Button({ href, variant = 'primary', className, children, ...props }: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={className} data-variant={variant}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} data-variant={variant} {...props}>
      {children}
    </button>
  )
}
