"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import { useForm, useWatch } from "react-hook-form"

import { ArrowRight } from "lucide-react"
import { BUDGET_OPTIONS } from "../constants"
import { ContactSchema, ContactSchemaType } from "../schema"
import { BudgetSelector } from "./budget-selector"
import { FormDetails } from "./form-details"
import { InlineInput } from "./inline-input"
import { useState, useTransition } from "react"
import { tryCatch } from "@/utils/try-catch"
import { Button as HeadlessButton } from "@headlessui/react"
import { sendEmailAction } from "../actions"
import { SuccessCelebration } from "./success-celebration"
import { ContactTitle } from "./contact-title"
import { ServiceInputWithSuggestions } from "./service-input-with-suggestions"

interface ContactFormProps {
  name: string
  nameLabel: string
  service: string
  serviceLabel: string
  budget: string
  email: string
  emailLabel: string
  details: string
  detailsLabel: string
  submit: string
  onSubmit: string
  contactTitle: {
    title1: string
    title2: string
    messages: string[]
  }
}

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const MotionButton = motion.create(HeadlessButton)

export function ContactForm({
  budget,
  details,
  detailsLabel,
  email,
  emailLabel,
  name,
  nameLabel,
  service,
  serviceLabel,
  submit,
  onSubmit,
  contactTitle,
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      service: "",
      budget: undefined,
      email: "",
      details: "",
    },
  })

  const watchedValues = useWatch({ control })

  const onSubmitHandler = (values: ContactSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(sendEmailAction(values))

      if (error) {
        console.error(error)
        return
      }

      if (result.status === "success") {
        setIsSuccess(true)
      } else if (result.status === "error") {
        console.error(result.message)
        return
      }
    })
  }

  if (isSuccess) {
    return (
      <SuccessCelebration
        name={watchedValues.name || ""}
        service={watchedValues.service || ""}
        email={watchedValues.email || ""}
        onReset={() => {
          setIsSuccess(false)
          reset()
        }}
      />
    )
  }

  return (
    <>
      <ContactTitle {...contactTitle} />

      <form onSubmit={handleSubmit(onSubmitHandler)} className="py-10 md:py-12 lg:py-16">
        <div className="space-y-6 text-xl md:text-2xl lg:text-4xl">
          {/* Sentence 1: Name and Service */}
          <div className="flex flex-wrap items-baseline gap-y-4">
            <span>{name}</span>
            <InlineInput
              label={nameLabel}
              hasError={!!errors.name}
              isSuccess={!errors.name && (watchedValues.name?.length ?? 0) >= 3}
              className="max-w-[245px] min-w-[245px] md:max-w-[300px] md:min-w-[300px] lg:max-w-[365px] lg:min-w-[365px]"
              containerClassName="mx-0 md:mx-3"
              {...register("name")}
            />
            <span>{service}</span>
            <ServiceInputWithSuggestions
              value={watchedValues.service || ""}
              onChange={(value) => {
                setValue("service", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              placeholder={serviceLabel}
              hasError={!!errors.service}
              isSuccess={!errors.service && (watchedValues.service?.length ?? 0) >= 3}
              className="max-w-[270px] min-w-[270px] md:max-w-[330px] md:min-w-[330px] lg:max-w-[400px] lg:min-w-[400px]"
              containerClassName="mx-0 md:mx-3"
            />
          </div>

          {/* Sentence 2: Budget */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
            <span>{budget}</span>
            <BudgetSelector
              options={Array.from(BUDGET_OPTIONS)}
              selected={watchedValues.budget || ""}
              onSelect={(value) => {
                setValue("budget", value as (typeof BUDGET_OPTIONS)[number], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
              hasError={!!errors.budget}
            />
          </div>

          {/* Sentence 3: Email */}
          <div className="flex flex-wrap items-baseline gap-y-4">
            <span>{email}</span>
            <InlineInput
              label={emailLabel}
              type="email"
              hasError={!!errors.email}
              isSuccess={!errors.email && validateEmail(watchedValues.email || "")}
              className="max-w-[230px] min-w-[230px] md:max-w-[290px] md:min-w-[290px] lg:max-w-[350px] lg:min-w-[350px]"
              containerClassName="mx-0 md:mx-3"
              {...register("email")}
            />
          </div>

          {/* Sentence 4: Details */}
          <FormDetails
            detailsValue={watchedValues.details ?? ""}
            details={details}
            detailsLabel={detailsLabel}
            {...register("details")}
            onSave={(value) => {
              setValue("details", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
          />

          {/* Submit Button */}
          <div className="mt-10 flex justify-center md:mt-14 md:justify-start lg:mt-18">
            <MotionButton
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.95,
              }}
              type="submit"
              disabled={isPending}
              className={`group bg-primary/90 text-background shadow-primary/10 relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-full px-5 py-2.5 text-base font-bold tracking-wide shadow-xl md:text-xl ${isPending ? "cursor-wait opacity-90" : "hover:bg-primary"} `}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isPending ? (
                  <>
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                    />
                    {onSubmit}
                  </>
                ) : (
                  <>
                    {submit}
                    <motion.span>
                      <ArrowRight className="size-5 translate-y-px md:size-6" />
                    </motion.span>
                  </>
                )}
              </span>
            </MotionButton>
          </div>
        </div>
      </form>
    </>
  )
}
