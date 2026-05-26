'use client'

import { forwardRef, Children, cloneElement, isValidElement } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = {
  variant?: 'link' | 'default'
  asChild?: boolean
  className?: string
  children?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', asChild, className, children, ...props }, ref) => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        className: cn(buttonVariants({ variant }), className),
        ...props,
      } as Record<string, unknown>)
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

function buttonVariants({ variant }: { variant: 'link' | 'default' }) {
  const base = 'inline-flex items-center justify-center'
  const variants = {
    link: 'underline-offset-4 hover:underline',
    default: '',
  }
  return cn(base, variants[variant])
}
