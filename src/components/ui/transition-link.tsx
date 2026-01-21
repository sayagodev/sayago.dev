'use client'

import { useCallback, forwardRef, type MouseEvent, type ReactNode } from 'react'
import { Link } from '@/utils/i18n-navigation'
import { usePageTransition } from '@/hooks/use-page-transition'
import { usePathname } from '@/utils/i18n-navigation'

type LinkProps = React.ComponentPropsWithoutRef<typeof Link>

interface TransitionLinkProps extends LinkProps {
    children?: ReactNode
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
    function TransitionLink({ href, onClick, children, ...props }, ref) {
        const { startTransition, state } = usePageTransition()
        const pathname = usePathname()

        const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
            // If already transitioning, prevent action
            if (state !== 'idle') {
                e.preventDefault()
                return
            }

            // If same page, don't transition
            const targetHref = typeof href === 'string' ? href : href.pathname
            if (targetHref === pathname) {
                return
            }

            // Prevent default navigation
            e.preventDefault()

            // Call original onClick if provided
            onClick?.(e)

            // Start transition animation
            startTransition(typeof href === 'string' ? href : href.pathname || '/')
        }, [href, onClick, pathname, startTransition, state])

        return (
            <Link href={href} onClick={handleClick} ref={ref} {...props}>
                {children}
            </Link>
        )
    }
)
