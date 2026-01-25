import clsx from "clsx"

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
    <div className={clsx(className, "px-[30px] lg:px-[160px]")}>
      <div className={clsx(!fullWidth && "mx-auto max-w-2xl lg:max-w-7xl")}>{children}</div>
    </div>
  )
}
