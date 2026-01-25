import { Link } from "@/utils/i18n-navigation"
import { TransitionLink } from "@/components/ui/transition-link"
import { Button as HeadlessButton } from "@headlessui/react"
import { cn } from "@/utils/cn"
import { forwardRef } from "react"

// Este tipo ButtonProps permite que el componente Button acepte un prop `variant` (para diferentes estilos de botón)
// y, usando una unión discriminada, acepta todas las props de `Link` (cuando se usa como enlace)
// o todas las props de `HeadlessButton` (cuando se usa como botón) pero asegurando que en ese caso no tenga `href`.
// Así, Button puede comportarse como un enlace o botón nativo, dependiendo de si recibe `href` o no.

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "link"
  title?: string
  transition?: boolean
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<typeof HeadlessButton> & {
      href?: undefined
    })
)

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant: _variant = "primary", transition = true, className, ...props }, ref) {
    className = cn(
      "focus-visible:ring-2 focus-visible:ring-corners focus:outline-none cursor-pointer",
      className
    )

    if (typeof props.href === "undefined") {
      return (
        <HeadlessButton
          {...props}
          ref={ref as React.Ref<HTMLButtonElement>}
          className={className}
        />
      )
    }

    // Use TransitionLink for animated page transitions
    if (transition) {
      return (
        <TransitionLink
          {...props}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
        />
      )
    }

    return <Link {...props} ref={ref as React.Ref<HTMLAnchorElement>} className={className} />
  }
)
