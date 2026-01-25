import { ConstructionIcon } from "@/components/icons/construction"
import { FooterClock } from "@/components/ui/footer-clock"
import { useTranslations } from "next-intl"

export default function ContactPage() {
  const t = useTranslations("construction")

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      <ConstructionIcon size={50} />
      <h2 className="font-neon text-xl font-bold tracking-tight lg:text-2xl">{t("title")}</h2>
      <p className="font-neon mt-1 max-w-xs text-center text-sm tracking-tighter lg:max-w-md lg:text-xl">
        {t("description")}
      </p>
      <FooterClock animate={false} />
    </main>
  )
}
