import { Locale } from "@/lib/i18n"
import { readFile } from "fs/promises"
import { join } from "path"

export async function loadMarkdownContent(filename: string, locale: Locale): Promise<string> {
  try {
    const filePath = join(process.cwd(), "messages", "markdown", `${filename}.${locale}.md`)
    return await readFile(filePath, "utf-8")
  } catch (error) {
    console.error(`Error loading markdown ${filename}.${locale}.md:`, error)
    return ""
  }
}
