import { cn } from '@/lib/utils'
import './container.css'

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
    <div className={cn('container-outer', className)} data-full-width={fullWidth || undefined}>
      <div className="container-inner">{children}</div>
    </div>
  )
}
