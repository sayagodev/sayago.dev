"use client"

import { useCallback, forwardRef, type MouseEvent, type ReactNode } from "react"
import { Link } from "@/utils/i18n-navigation"
import { usePageTransition } from "@/hooks/use-page-transition"
import { usePathname } from "@/utils/i18n-navigation"

type LinkProps = React.ComponentPropsWithoutRef<typeof Link>

interface TransitionLinkProps extends LinkProps {
  children?: ReactNode
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, onClick, children, ...props }, ref) {
    const { startTransition, state } = usePageTransition()
    const pathname = usePathname()

    const handleClick = useCallback(
      (e: MouseEvent<HTMLAnchorElement>) => {
        // If already transitioning, prevent action
        if (state !== "idle") {
          e.preventDefault()
          return
        }

        // Build target href string
        let targetHref: string | { pathname: string; params?: Record<string, string> }
        if (typeof href === "string") {
          targetHref = href
        } else {
          const params =
            "params" in href && href.params
              ? Object.fromEntries(
                  Object.entries(href.params).map(([key, value]) => [key, String(value)])
                )
              : undefined
          //for dynamic routes, construct the URL with params
          targetHref = {
            pathname: href.pathname,
            ...(params ? { params } : {}),
          }
        }

        // If same page, don't transition
        const currentPath = typeof href === "string" ? href : href.pathname
        if (currentPath === pathname) {
          return
        }

        // Prevent default navigation
        e.preventDefault()

        // Call original onClick if provided
        onClick?.(e)

        // Start transition animation
        startTransition(targetHref)
      },
      [href, onClick, pathname, startTransition, state]
    )

    return (
      <Link href={href} onClick={handleClick} ref={ref} {...props} prefetch={true}>
        {children}
      </Link>
    )
  }
)
