import { Container } from '@/components/layout/container'
import { Logo } from '@/components/widgets/logo'
import { WorkProjects } from '../components/work-projects'
import './work-page-view.css'

export function WorkPageView() {
  return (
    <main className="work-view">
      <Container fullWidth>
        <Logo />
        <WorkProjects />
      </Container>
    </main>
  )
}
