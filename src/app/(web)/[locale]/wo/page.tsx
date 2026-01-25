import { ConstructionIcon } from "@/components/icons/construction"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { FooterClock } from "@/components/ui/footer-clock"
import { getLocale, getTranslations } from "next-intl/server"
import { WoResume } from "./_components/WoResume"
import { loadMarkdownContent } from "@/utils/markdown-loader"
import { WoImageSection } from "./_components/WoImageSection"
import { ShowVersion } from "../_components/show-version"

export default async function WorkPage() {
  const locale = await getLocale()

  // Ejecutar todas las operaciones asíncronas en paralelo
  const [t, t2, markdownContent, markdownContentShort] = await Promise.all([
    getTranslations("pages.wo"),
    getTranslations("construction"),
    loadMarkdownContent("wo", locale),
    loadMarkdownContent("rwo", locale),
  ])

  return (
    <main className="flex min-h-dvh flex-col space-y-40">
      <ShowVersion />
      <Container className="py-[60px]" fullWidth>
        <h1 className="font-krypton mb-8 text-center text-2xl font-bold md:text-4xl">
          <Button href="/">sāyago;dev</Button>
        </h1>

        <div className="grid grid-cols-1 place-items-center gap-6 lg:mt-[80px] lg:grid-cols-[auto_auto] lg:place-items-start">
          <WoImageSection altText={t("altImg")} />

          <WoResume mContent={markdownContent} mContentShort={markdownContentShort} />
        </div>

        <section className="pt-[60px]">
          <h2 className="font-argon mb-20 text-2xl font-bold md:text-3xl">Blog</h2>

          <div className="flex flex-col items-center justify-center">
            <ConstructionIcon size={50} />
            <h2 className="font-neon text-xl font-bold tracking-tight lg:text-2xl">
              {t2("title")}
            </h2>
            <p className="font-neon mt-1 max-w-xs text-center text-sm tracking-tighter lg:max-w-md lg:text-xl">
              {t2("description")}
            </p>
          </div>
        </section>
      </Container>
      <FooterClock animate={false} />
    </main>
  )
}
