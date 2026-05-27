import { Background } from '@/components/effects/background'
import { HomeNavigation } from '../components/home-navigation'
import { ThemePicker } from '@/components/widgets/theme-picker'
import { themes } from '@/lib/constants'
import './home-page-view.css'

export function HomePageView() {
  return (
    <main className="home-view">
      <Background />

      <HomeNavigation />

      {/* Theme Picker - RIGHT side on desktop (vertical) */}
      <div className="theme-picker-desktop">
        <ThemePicker themes={themes} orientation="vertical" />
      </div>

      {/* Theme Picker - TOP on mobile (horizontal) */}
      <div className="theme-picker-mobile">
        <ThemePicker themes={themes} orientation="horizontal" />
      </div>
    </main>
  )
}
