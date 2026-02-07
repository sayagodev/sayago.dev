"use server"

import resend from "@/lib/resend"
import { EmailTemplate } from "./_components/email-template"
import { ContactSchema, ContactSchemaType } from "./schema"
import { APIResponse } from "@/lib/types"

export async function sendEmailAction(values: ContactSchemaType): Promise<APIResponse> {
  try {
    const parsed = ContactSchema.safeParse(values)
    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid form data",
      }
    }

    const result = await resend.emails.send({
      from: "sayago.dev <no-reply@sayago.dev>",
      to: ["contacto@sayago.dev"],
      subject: "[sāyago.dev] Nueva Solicitud de Contacto",
      react: <EmailTemplate {...parsed.data} />,
    })

    if (result.error) {
      return {
        status: "error",
        message: result.error.message,
      }
    }

    return {
      status: "success",
      message: "Email sent successfully",
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
