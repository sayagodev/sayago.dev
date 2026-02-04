import { readdir, stat } from "fs/promises"
import { join } from "path"
import { loadMarkdownSectionArray } from "../src/utils/markdown-section-loader"
import { Locale } from "@/lib/i18n"

type ProjectSections = {
  description: string
  roles: string
  technologies: string
  objectives: string
}

const REQUIRED_SECTIONS: (keyof ProjectSections)[] = [
  "description",
  "roles",
  "technologies",
  "objectives",
]

const LOCALES = ["en", "es"] as const

async function validateProject(
  projectName: string,
  locale: string
): Promise<{ project: string; locale: string; errors: string[] }> {
  const errors: string[] = []

  try {
    const sections = await loadMarkdownSectionArray<ProjectSections>(projectName, locale as Locale)

    for (const key of REQUIRED_SECTIONS) {
      const value = sections[key]

      if (!value) {
        errors.push(`Missing section: "${key}"`)
      } else if (value.trim() === "") {
        errors.push(`Empty section: "${key}"`)
      }
    }

    const foundSections = Object.keys(sections)
    const normalizedRequired = REQUIRED_SECTIONS.map((k) =>
      String(k)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    )

    const extraSections = foundSections.filter(
      (found) => !normalizedRequired.includes(found.toLowerCase())
    )

    if (extraSections.length > 0) {
      errors.push(
        `Unknown sections found: ${extraSections.join(", ")} (expected: ${REQUIRED_SECTIONS.join(", ")})`
      )
    }
  } catch (error) {
    errors.push(`Failed to load file: ${error instanceof Error ? error.message : String(error)}`)
  }

  return { project: projectName, locale, errors }
}

async function validateAllProjects() {
  const projectsDir = join(process.cwd(), "messages", "markdown", "projects")
  const allErrors: Array<{ project: string; locale: string; errors: string[] }> = []

  try {
    const entries = await readdir(projectsDir, { withFileTypes: true })
    const projectDirs = entries.filter((entry) => entry.isDirectory())

    if (projectDirs.length === 0) {
      console.log("⚠️  No projects found in messages/markdown/projects/")
      return
    }

    console.log(`\n🔍 Validating ${projectDirs.length} project(s)...\n`)

    for (const projectDir of projectDirs) {
      const projectName = projectDir.name

      for (const locale of LOCALES) {
        const filePath = join(projectsDir, projectName, `${projectName}.${locale}.md`)

        try {
          await stat(filePath) // Check that the file exists
        } catch {
          allErrors.push({
            project: projectName,
            locale,
            errors: [`File not found: ${filePath}`],
          })
          continue
        }

        const result = await validateProject(projectName, locale)
        if (result.errors.length > 0) {
          allErrors.push(result)
        } else {
          console.log(`✅ ${projectName}.${locale}.md`)
        }
      }
    }

    if (allErrors.length > 0) {
      console.error("\n❌ Validation failed:\n")

      for (const { project, locale, errors } of allErrors) {
        console.error(`\n📄 ${project}.${locale}.md:`)
        errors.forEach((error) => {
          console.error(`   • ${error}`)
        })
      }

      console.error("\n")
      process.exit(1)
    }

    console.log("\n✅ All markdown files are valid!\n")
  } catch (error) {
    console.error("❌ Error during validation:", error)
    process.exit(1)
  }
}

validateAllProjects()
