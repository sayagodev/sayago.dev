import { cn } from '@/lib/utils'

export function Container({
  className,
  children,
  fullWidth,
}: {
  className?: string
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div className={cn('px-7.5! lg:px-40!', fullWidth && 'w-full', className)}>
      <div className={cn(!fullWidth && 'mx-auto max-w-2xl lg:max-w-7xl')}>{children}</div>
    </div>
  )
}
