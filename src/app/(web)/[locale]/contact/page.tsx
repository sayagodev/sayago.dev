import { Container } from "@/components/layout/container"
import { LogoTitle } from "@/components/layout/logo-title"
import { getTranslations } from "next-intl/server"
import { ShowVersion } from "../_components/show-version"
import { ContactForm } from "./_components/contact-form"

export default async function ContactPage() {
  const t = await getTranslations("contact")

  const contactTitle = {
    title1: t("title1"),
    title2: t("title2"),
    messages: t.raw("messages") as string[],
  }

  const contactForm = {
    name: t("name"),
    nameLabel: t("nameLabel"),
    service: t("service"),
    serviceLabel: t("serviceLabel"),
    budget: t("budget"),
    email: t("email"),
    emailLabel: t("emailLabel"),
    details: t("details"),
    detailsLabel: t("detailsLabel"),
    submit: t("submit"),
    onSubmit: t("onSubmit"),
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center">
      <ShowVersion />
      <Container className="py-[60px] pb-30 sm:pb-0" fullWidth>
        <LogoTitle />

        <ContactForm {...contactForm} contactTitle={contactTitle} />
      </Container>
    </main>
  )
}
