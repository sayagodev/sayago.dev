import { Background } from '@/components/visual/background'
import { HomeNavigation } from '../components/home-navigation'

export function HomePageView() {
  return (
    <main className="relative flex flex-col min-h-dvh overflow-hidden">
      <Background />

      <HomeNavigation />
    </main>
  )
}
