import { Background } from '@/components/visual/background'
import { HomeNavigation } from '../components/home-navigation'
import { ThemePicker } from '@/components/shared/theme-picker'
import { themes } from '@/lib/constants'

export function HomePageView() {
  return (
    <main className="relative flex flex-col min-h-dvh overflow-hidden">
      <Background />

      <HomeNavigation />

      {/* Theme Picker - RIGHT side on desktop (vertical) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:block">
        <ThemePicker themes={themes} orientation="vertical" />
      </div>

      {/* Theme Picker - TOP on mobile (horizontal) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 md:hidden">
        <ThemePicker themes={themes} orientation="horizontal" />
      </div>
    </main>
  )
}
