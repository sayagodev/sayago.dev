import { Background } from '@/components/effects/background'
import { HomeNavigation } from '../components/home-navigation'
import './home-page-view.css'

export function HomePageView() {
  return (
    <main className="home-view">
      <Background />

      <HomeNavigation />
    </main>
  )
}
