import { ConstructionIcon } from "@/components/icons/construction";
import { FooterClock } from "@/components/ui/footer-clock";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations("construction")

    return (
        <main className="flex flex-col min-h-dvh items-center justify-center relative overflow-hidden">
            <ConstructionIcon size={50} />
            <h2 className="text-xl lg:text-2xl font-bold font-neon tracking-tight">{t("title")}</h2>
            <p className="text-sm lg:text-xl lg:max-w-md font-neon text-center max-w-xs tracking-tighter mt-1">{t("description")}</p>
            <FooterClock animate={false} />
        </main>
    )
}