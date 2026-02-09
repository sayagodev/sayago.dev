import { Button } from "@/components/ui/button"
import VerticalCutReveal from "@/components/ui/vertical-cut-reveal"
import { getTranslations } from "next-intl/server"

export async function HomeContent() {
  const t = await getTranslations("home")

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-24 text-center">
      <h1 className="font-krypton text-4xl font-bold md:text-5xl">
        <Button href="/" aria-label={t("aria.home")} title={t("aria.homeTitle")}>
          <VerticalCutReveal
            splitBy="lines"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            {"sāyago;dev"}
          </VerticalCutReveal>
        </Button>
      </h1>
      <nav
        aria-label={t("aria.mainNavigation")}
        className="font-argon flex flex-col gap-5 *:font-semibold md:flex-row md:gap-16 lg:gap-44"
      >
        <Button
          className="text-2xl md:text-3xl"
          href="/work"
          aria-label={t("aria.work")}
          title={t("aria.workTitle")}
        >
          <VerticalCutReveal
            splitBy="lines"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
          >
            {t("work")}
          </VerticalCutReveal>
        </Button>
        <Button
          className="font-zi mx-auto w-fit -translate-y-0.5 text-[32px] md:-translate-y-3 lg:-translate-x-1 lg:text-[40px]"
          href="/wo"
          aria-label={t("aria.about")}
          title={t("aria.aboutTitle")}
        >
          <VerticalCutReveal
            splitBy="lines"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.4,
            }}
          >
            我
          </VerticalCutReveal>
        </Button>
        <Button
          className="text-2xl md:text-3xl"
          href="/contact"
          aria-label={t("aria.talk")}
          title={t("aria.talkTitle")}
        >
          <VerticalCutReveal
            splitBy="lines"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.6,
            }}
          >
            {t("talk")}
          </VerticalCutReveal>
        </Button>
      </nav>
    </div>
  )
}
