import { getTranslations } from "next-intl/server"
import { Button } from "../ui/button"
import VerticalCutReveal from "../ui/vertical-cut-reveal"

export async function LogoTitle() {
  const t = await getTranslations("home")

  return (
    <h2 className="font-krypton mb-8 text-center text-2xl font-bold md:text-4xl">
      <Button href="/" aria-label={t("aria.home")} title={t("aria.homeTitle")}>
        <VerticalCutReveal
          splitBy="lines"
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.3,
          }}
        >
          {"sāyago;dev"}
        </VerticalCutReveal>
      </Button>
    </h2>
  )
}
