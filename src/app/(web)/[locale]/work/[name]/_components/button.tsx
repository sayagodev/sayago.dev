import { Button } from "@/components/ui/button"
import { ANIMATION_EASING } from "@/lib/animations"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { projects } from "../../constants"

const getHref = (project: string, direction: string) => {
  const index = projects.indexOf(project)

  if (index === project.length - 1) {
    return `/work/${projects.at(0)}`
  }

  if (direction === "previous") {
    return `/work/${projects.at(index - 1)}`
  } else {
    return `/work/${projects.at(index + 1)}`
  }
}

export function GoToButton({
  children,
  direction,
}: {
  children: React.ReactNode
  direction: "previous" | "next"
}) {
  const t = useTranslations("pages.work.goToButton")
  const project = usePathname().split("/").pop()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const href = getHref(project ?? "", direction) as any

  return (
    <motion.div whileHover="hover" initial="initial">
      <Button
        href={href}
        className="border-primary text-primary hover:text-background font-zi group relative rounded border-2 px-10 py-1.5 text-2xl transition-colors duration-300"
      >
        <motion.div
          className="bg-primary absolute inset-0"
          variants={{
            initial: { scaleY: 0 },
            hover: { scaleY: 1 },
          }}
          transition={{ duration: 0.3, ease: ANIMATION_EASING.easeInOut }}
          style={{ originY: 1 }}
        />
        <span className="relative z-10">{children}</span>
        <motion.p
          variants={{
            hover: { opacity: 1, y: 10 },
          }}
          transition={{ duration: 0.3, ease: ANIMATION_EASING.easeInOut, delay: 0.3 }}
          className="font-neon text-foreground pointer-events-none absolute left-1/2 -translate-x-1/2 text-base opacity-0 select-none"
        >
          {direction === "previous" ? t("previous") : t("next")}
        </motion.p>
      </Button>
    </motion.div>
  )
}
