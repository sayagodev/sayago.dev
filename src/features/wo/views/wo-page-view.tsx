import { Logo } from '@/components/shared/logo'
import { Background } from '@/components/visual/background'
import { WoImage } from '../components/wo-image'
import { WoResume } from '../components/wo-resume'
import { Container } from '@/components/layout/container'

export function WoPageView() {
  return (
    <main className="relative flex flex-col min-h-dvh">
      <Background />
      <Container fullWidth>
        <Logo />

        <div className="grid grid-cols-1 place-items-center gap-6 lg:mt-20! lg:grid-cols-[auto_auto]">
          <WoImage />
          <WoResume />
        </div>
      </Container>
    </main>
  )
}
