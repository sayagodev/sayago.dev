import { Button } from "@/components/ui/button"

export interface CardProps {
  avatar: string
  title: string
  subtitle: string
  url: string
  features: string[]
  tags: string[]
}

export function Card({ avatar, features, url, subtitle, tags, title }: CardProps) {
  return (
    <Button
      href={{ pathname: "/work/[name]", params: { name: url } }}
      className="block h-full text-left"
    >
      <article className="border-base-content relative flex h-full flex-col gap-4 border p-5">
        <div className="flex items-start gap-4">
          <div className="font-krypton lg:text-l bg-avatar text-avatar-content border-foreground flex h-10 w-10 shrink-0 items-center justify-center border text-sm font-bold md:h-12 md:w-12 md:text-base lg:h-14 lg:w-14">
            {avatar}
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm leading-tight font-bold uppercase md:text-base lg:text-lg">
              {title}
            </h3>
            <span>
              <span className="hover:text-symbol text-[10px] md:text-xs lg:text-sm">
                {subtitle}
              </span>
            </span>
          </div>
        </div>
        <div className="text-[11px] leading-relaxed uppercase opacity-85 md:text-xs lg:text-sm">
          <ul className="space-y-1">
            {features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="hover:text-symbol border px-[6px] py-px text-[10px] uppercase md:text-xs lg:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Button>
  )
}
