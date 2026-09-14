import { Logo } from '@/components/widgets/logo'
import { WoBlog } from '../components/wo-blog'
import { WoImage } from '../components/wo-image'
import { WoResume } from '../components/wo-resume'
import { Container } from '@/components/layout/container'
import './wo-page-view.css'

export function WoPageView() {
  return (
    <main className="wo-view">
      <Container fullWidth>
        <Logo />

        <div className="wo-grid">
          <WoImage />
          <WoResume />
        </div>

        <WoBlog />
      </Container>
    </main>
  )
}
