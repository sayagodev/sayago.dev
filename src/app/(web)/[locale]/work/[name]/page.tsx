import { getLocale, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

import { Container } from "@/components/layout/container"
import { LogoTitle } from "@/components/layout/logo-title"
import { loadMarkdownSectionArray } from "@/utils/markdown-section-loader"
import { ShowVersion } from "../../_components/show-version"
import { ProjectContent } from "./_components/project-content"
import { getProjectMedia } from "./_constants/media"

interface ProjectPageProps {
  params: Promise<{ name: string }>
}

type ProjectSections = {
  description: string
  roles: string
  technologies: string
  objectives: string
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { name } = await params
  const t = await getTranslations("pages.work")
  const locale = await getLocale()
  const sections = await loadMarkdownSectionArray<ProjectSections>(name, locale)
  const media = getProjectMedia(name)

  const projectData = t.raw(`projects.${name}`) as
    | {
        title: string
        year: string
        url: string
      }
    | undefined

  if (!projectData) {
    notFound()
  }

  return (
    <main className="flex min-h-dvh flex-col items-center overflow-hidden">
      <ShowVersion />
      <Container className="py-[60px]" fullWidth>
        <LogoTitle />

        <ProjectContent
          name={projectData.title}
          year={projectData.year}
          url={projectData.url}
          description={sections.description ?? ""}
          roles={sections.roles ?? ""}
          technologies={sections.technologies ?? ""}
          objectives={sections.objectives ?? ""}
          media={media}
          header1={t("cta.header1")}
          header2={t("cta.header2")}
          cta={t("cta.button")}
        />
      </Container>
    </main>
  )
}
