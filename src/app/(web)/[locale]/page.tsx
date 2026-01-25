import { FooterClock } from "@/components/ui/footer-clock"
import { HomeContent } from "./_components/home-content"
import { ShowVersion } from "./_components/show-version"

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Main Content */}
      <HomeContent />

      {/* Version */}
      <ShowVersion />

      {/* Footer */}
      <FooterClock />
    </main>
  )
}
