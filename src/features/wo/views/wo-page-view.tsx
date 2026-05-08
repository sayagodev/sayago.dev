import { Logo } from '@/components/shared/logo'
import { Background } from '@/components/visual/background'

export function WoPageView() {
  return (
    <main className="relative flex flex-col min-h-dvh">
      <Background />
      <Logo />
    </main>
  )
}
