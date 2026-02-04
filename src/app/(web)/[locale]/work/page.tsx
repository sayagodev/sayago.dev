import { Container } from "@/components/layout/container"
import { LogoTitle } from "@/components/layout/logo-title"
import { getTranslations } from "next-intl/server"
import { ShowVersion } from "../_components/show-version"
import { CardProps } from "./_components/card"
import { WorkContent } from "./_components/work-content"
import { projects } from "./constants"

export default async function WorkPage() {
  const t = await getTranslations("pages.work")

  return (
    <main className="flex min-h-dvh flex-col items-center overflow-hidden">
      <ShowVersion />
      <Container className="container py-[60px] pb-30 sm:pb-0">
        <LogoTitle />

        <WorkContent
          title={t("title")}
          cards={projects.map((project) => {
            const projectData = t.raw(`projects.${project}`) as CardProps

            return {
              avatar: projectData.avatar,
              features: projectData.features,
              subtitle: projectData.subtitle,
              tags: projectData.tags,
              title: projectData.title,
              url: project,
            }
          })}
        />
      </Container>
    </main>
  )
}
