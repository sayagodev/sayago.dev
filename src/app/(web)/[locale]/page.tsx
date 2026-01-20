import { FooterClock } from "@/components/ui/footer-clock";
import { HomeContent } from "./_components/home-content";
import { ShowVersion } from "./_components/show-version";

export default function HomePage() {

  return (
    <main className="flex flex-col min-h-dvh relative overflow-hidden">
      {/* Main Content */}
      <HomeContent />

      {/* Version */}
      <ShowVersion />

      {/* Footer */}
      <FooterClock />
    </main>
  );
}
