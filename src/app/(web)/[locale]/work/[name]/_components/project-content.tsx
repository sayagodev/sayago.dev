"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { Locale } from "@/lib/i18n"
import { MarkdownRenderer } from "@/utils/markdown-renderer"
import { useLocale } from "next-intl"
import { ProjectMediaType } from "../_constants/media"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { ANIMATION_EASING } from "@/lib/animations"
import { GoToButton } from "./button"

interface ProjectContentProps {
  name: string
  year: string
  url: string
  description: string
  roles: string
  technologies: string
  objectives: string
  media: ProjectMediaType
  header1: string
  header2: string
  cta: string
}

export function ProjectContent({
  name,
  year,
  url,
  description,
  roles,
  technologies,
  objectives,
  media,
  header1,
  header2,
  cta,
}: ProjectContentProps) {
  const isMobile = useIsMobile()
  const locale = useLocale() as Locale

  const objTitle = locale === "es" ? "Objetivos" : "Objectives"
  const designTitle = locale === "es" ? "Diseño" : "Design"

  return (
    <>
      <header className="mb-8 flex flex-col justify-center gap-6 md:mb-12 md:flex-row md:items-baseline lg:justify-between">
        <div className="flex flex-col items-center md:flex-row md:items-baseline">
          <h1 className="font-argon text-2xl font-bold tracking-tight md:text-5xl">{name}</h1>
          <span className="text-primary font-neon align-top text-xs md:ml-4 md:text-xl">
            {year}
          </span>
        </div>
        {!isMobile && (
          <div className="mt-4 flex items-center gap-2 md:mt-0">
            <span className="bg-error h-5 w-5 animate-pulse rounded-full"></span>
            <a
              className="decoration-primary text-lg underline-offset-4 hover:underline"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          </div>
        )}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-12">
        <div className="border-neutral border-b-2 pb-[15px] md:col-span-7 md:border-r-2 md:border-b-2 md:pr-[15px] md:pb-0 lg:border-b-2 lg:pr-[30px] lg:pb-[30px]">
          <div className="text-sm leading-relaxed wrap-break-word md:text-lg lg:text-xl">
            <MarkdownRenderer content={description} />
          </div>
        </div>
        <div className="pt-[15px] md:col-span-5 md:border-b-2 md:pt-0 md:pl-[15px] lg:border-b-2 lg:pb-[30px] lg:pl-[30px]">
          <div>
            <h3 className="mb-[30px] text-sm font-semibold md:text-lg lg:text-xl">
              Roles: <span className="font-normal">{roles}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {technologies.split(", ").map((technology) => (
                <span
                  key={technology}
                  className="bg-neutral text-background rounded-full px-5 py-[5px] text-sm font-medium lg:text-xl"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className={isMobile ? "mb-6 flex flex-row items-baseline justify-between" : "mb-6"}>
          <h3 className="font-argon text-base font-semibold md:text-lg lg:text-2xl">{objTitle}:</h3>
          {isMobile && (
            <div className="mt-4 flex items-center gap-2 md:mt-0">
              <span className="bg-error h-[15px] w-[15px] rounded-full"></span>
              <a
                className="decoration-primary text-sm underline-offset-4 hover:underline md:text-lg"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </a>
            </div>
          )}
        </div>
        <MarkdownRenderer content={objectives} />
      </section>

      <section className="mt-8">
        <h3 className="font-argon mb-8 text-base font-semibold md:text-lg lg:text-2xl">
          {designTitle}:
        </h3>
        {media.map((m) => {
          const srcString = typeof m.src === "string" ? m.src : m.src.src
          const isVideo = srcString.includes(".webm")

          return (
            <div key={m.alt} className="mb-8 flex justify-center">
              <div
                className={`overflow-hidden rounded border-2 shadow-lg ${isVideo ? "inline-block max-w-full md:mx-16 lg:mx-24" : "w-full md:mx-16 lg:mx-24"}`}
              >
                {isVideo ? (
                  <video
                    src={srcString}
                    autoPlay
                    loop
                    muted
                    playsInline
                    width={m.width}
                    height={m.height}
                    className="block h-auto max-w-full shadow-sm"
                  />
                ) : (
                  <Image
                    src={m.src}
                    alt={m.alt}
                    width={m.width}
                    height={m.height}
                    className="block h-auto w-full shadow-sm"
                    loading="eager"
                  />
                )}
              </div>
            </div>
          )
        })}
      </section>

      <div className="flex justify-center gap-4 py-8 md:gap-60">
        <GoToButton direction="previous">上</GoToButton>
        <GoToButton direction="next">下</GoToButton>
      </div>

      <section className="bg-background-light architecture-grid relative mx-auto mt-8 mb-16 flex max-w-7xl flex-col items-center justify-center overflow-hidden py-12 md:px-4 md:py-28 lg:py-36">
        <div className="wireframe-pattern pointer-events-none absolute inset-0 opacity-50"></div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="font-zi text-primary/10 -translate-y-8 transform text-[20rem] leading-none select-none md:-translate-y-12 md:text-[30rem] lg:-translate-y-15 lg:text-[40rem]">
            建
          </span>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-primary mb-6 text-[10px] tracking-[0.4em] uppercase opacity-60 md:text-xs">
            Manifesto of Design and Structure
          </p>
          <h2 className="font-krypton text-neutral mb-8 text-3xl leading-none font-bold tracking-tighter uppercase md:mb-16 md:text-5xl lg:text-7xl">
            {header1}
            <br />
            {header2}
          </h2>
          <motion.div className="inline-block" whileHover="hover" initial="initial">
            <Button
              href={"/contact"}
              className="border-neutral hover:border-primary hover:text-background relative overflow-hidden border-2 bg-transparent px-6 py-3 text-xs font-medium tracking-[0.25em] uppercase transition-all duration-300 hover:font-bold md:text-lg lg:px-16 lg:py-5 lg:text-xl"
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
              <span className="relative z-10">{cta}</span>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
