import { routing } from "@/proxy"
import { createNavigation } from "next-intl/navigation"

const navigation = createNavigation(routing)

type Router = ReturnType<typeof navigation.useRouter>
type RouterHref = Parameters<Router["replace"]>[0]

type ExtractPathname<T> = T extends string ? T : T extends { pathname: infer P } ? P : never

type AppPathname = ExtractPathname<RouterHref>

export type DynamicPathname = AppPathname extends string
  ? AppPathname extends `${string}[${string}]${string}`
    ? AppPathname
    : never
  : never

type DynamicRouteWithParams = {
  pathname: DynamicPathname
  params: Record<string, string>
  query?: Record<string, string>
}

type TypedHref =
  | RouterHref
  | (RouterHref extends string ? `${RouterHref}?${string}` : never)
  | DynamicRouteWithParams
  | (AppPathname extends string ? `${AppPathname}?${string}` : never)

export const { Link, redirect, usePathname, useRouter: useI18nRouter } = navigation

// Wrapper type-safe
export function useRouter() {
  const router = useI18nRouter()

  const replace = (href: TypedHref, options?: Parameters<Router["replace"]>[1]) => {
    if (typeof href === "string") {
      router.replace(href as RouterHref, options)
    } else if ("pathname" in href && "params" in href) {
      const { pathname, params, query } = href as DynamicRouteWithParams

      if (query) {
        const queryString = new URLSearchParams(query).toString()
        const resolvedPath = Object.entries(params).reduce(
          (path, [key, value]) => path.replace(`[${key}]`, encodeURIComponent(value)),
          pathname as string
        )
        router.replace(`${resolvedPath}?${queryString}` as RouterHref, options)
      } else {
        router.replace({ pathname, params } as RouterHref, options)
      }
    } else {
      router.replace(href as RouterHref, options)
    }
  }

  const push = (href: TypedHref, options?: Parameters<Router["push"]>[1]) => {
    if (typeof href === "string") {
      router.push(href as RouterHref, options)
    } else if ("pathname" in href && "params" in href) {
      const { pathname, params, query } = href as DynamicRouteWithParams

      if (query) {
        const queryString = new URLSearchParams(query).toString()
        const fullPath = `${pathname}?${queryString}`
        router.push(fullPath as RouterHref, options)
      } else {
        router.push({ pathname, params } as RouterHref, options)
      }
    } else {
      router.push(href as RouterHref, options)
    }
  }

  return { ...router, replace, push }
}
