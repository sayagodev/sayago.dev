import { Locale } from "@/lib/i18n"
import { readFile } from "fs/promises"
import { join, resolve, sep } from "path"

/**
 * Loads a markdown file and returns the sections of the file.
 * @param filename - The name of the markdown file to load.
 * @param locale - The locale of the markdown file to load.
 * @param T - The type of the object to return.
 * @returns A promise that resolves to an object with the sections of the markdown file.
 */
export async function loadMarkdownSectionArray<T extends Record<string, string>>(
  filename: string,
  locale: Locale
): Promise<Partial<T>> {
  try {
    const baseDir = join(process.cwd(), "messages", "markdown", "projects")
    const filePath = resolve(baseDir, filename, `${filename}.${locale}.md`)

    if (!filePath.startsWith(baseDir + sep)) {
      throw new Error(`Invalid markdown filename: ${filename}`)
    }

    const content = await readFile(filePath, "utf-8")

    const lines = content.split("\n")
    const sections: Partial<T> = {} as Partial<T>
    let currentTitle = ""
    let currentContent: string[] = []

    for (const line of lines) {
      const titleMatch = line.match(/^#{2,}\s+(.*)$/)

      if (titleMatch) {
        if (currentContent.length > 0 && currentTitle) {
          const normalizedTitle = currentTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") as keyof T

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(sections as any)[normalizedTitle] = currentContent.join("\n").trim()
        }
        currentTitle = titleMatch[1].trim()
        currentContent = []
      } else {
        currentContent.push(line)
      }
    }

    if (currentContent.length > 0 && currentTitle) {
      const normalizedTitle = currentTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") as keyof T

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(sections as any)[normalizedTitle] = currentContent.join("\n").trim()
    }

    return sections
  } catch (error) {
    console.error(`Error loading markdown sections for ${filename}.${locale}.md:`, error)
    return {} as Partial<T>
  }
}
