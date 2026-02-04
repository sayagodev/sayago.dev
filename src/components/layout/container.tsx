import { cn } from "@/utils/cn"

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
    <div className={cn("px-[30px] lg:px-[160px]", fullWidth && "w-full", className)}>
      <div className={cn(!fullWidth && "mx-auto max-w-2xl lg:max-w-7xl")}>{children}</div>
    </div>
  )
}
