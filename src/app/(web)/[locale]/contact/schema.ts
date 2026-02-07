import z from "zod"
import { BUDGET_OPTIONS } from "./constants"

export const ContactSchema = z.object({
  name: z.string().min(3).max(50),
  service: z.string().min(3).max(50),
  budget: z.enum(BUDGET_OPTIONS),
  email: z.email(),
  details: z.string().max(500).optional(),
})

export type ContactSchemaType = z.infer<typeof ContactSchema>
