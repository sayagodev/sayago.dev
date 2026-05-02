import { ThemeProvider } from "@/components/theme-provider"

export function Providers(props: { children: React.ReactNode }) {
  return <ThemeProvider>{props.children}</ThemeProvider>
}
