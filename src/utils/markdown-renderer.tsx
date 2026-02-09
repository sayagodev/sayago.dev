import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { cn } from "./cn"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose w-full max-w-none", className)}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => <h1 className="font-neon mb-4 text-2xl font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="font-neon mb-3 text-xl font-bold">{children}</h2>,
          p: ({ children }) => (
            <p className="font-neon wrap-break-words mb-4 text-sm leading-relaxed md:text-lg lg:text-xl">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="font-neon wrap-break-words mb-4 ml-2 list-inside list-disc space-y-2 text-sm leading-relaxed sm:ml-5 md:text-lg lg:text-xl">
              {children}
            </ul>
          ),
          a: ({ href, children }) => (
            <a
              href={href as string}
              className="text-symbol hover:text-symbol/80 focus-visible:ring-corners break-words underline focus:outline-none focus-visible:ring-2"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={href}
              title={href}
            >
              {children}
            </a>
          ),
          div: ({ children, className: divClassName }) => (
            <div className={cn("w-full", divClassName)}>{children}</div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
