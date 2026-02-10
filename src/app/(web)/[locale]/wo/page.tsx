import { ConstructionIcon } from "@/components/icons/construction"
import { Container } from "@/components/layout/container"
import { LogoTitle } from "@/components/layout/logo-title"
import { loadMarkdownContent } from "@/utils/markdown-loader"
import { getLocale, getTranslations } from "next-intl/server"
import { ShowVersion } from "../_components/show-version"
import { WoImageSection } from "./_components/WoImageSection"
import { WoResume } from "./_components/WoResume"

export default async function WorkPage() {
  const locale = await getLocale()

  const [t, t2, markdownContent, markdownContentShort] = await Promise.all([
    getTranslations("pages.wo"),
    getTranslations("construction"),
    loadMarkdownContent("wo", locale),
    loadMarkdownContent("rwo", locale),
  ])

  return (
    <main className="flex min-h-dvh flex-col space-y-100">
      <ShowVersion />
      <Container className="py-[60px]" fullWidth>
        <LogoTitle />

        <div className="grid grid-cols-1 place-items-center gap-6 lg:mt-[80px] lg:grid-cols-[auto_auto] lg:place-items-start">
          <WoImageSection altText={t("altImg")} />

          <WoResume mContent={markdownContent} mContentShort={markdownContentShort} />
        </div>

        <section className="pt-[60px] pb-20">
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
    </main>
  )
}
