'use server'

import { resend } from '@/lib/resend'
import { tryCatch } from '@/lib/try-catch'
import { COOLDOWN_MS, getServerCooldownUntil, registerSend } from '@/lib/cooldown'
import { ContactNotificationEmail } from './emails/contact-notification'

export type SendContactErrorCode = 'validation' | 'cooldown' | 'resend' | 'server'

export interface SendContactPayload {
  name: string
  email: string
  project: string
  budget: string
  details: string
  theme: string
  locale: string
}

export interface SendContactState {
  status: 'success' | 'cooldown' | 'error'
  errorCode?: SendContactErrorCode
  cooldownUntil?: number
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SendResponse = Awaited<ReturnType<typeof resend.emails.send>>

export async function sendContact(payload: SendContactPayload): Promise<SendContactState> {
  const { name, email, project, budget, details, theme, locale } = payload

  if (!name.trim() || !project.trim() || !EMAIL_RE.test(email)) {
    return { status: 'error', errorCode: 'validation' }
  }

  const serverCooldownUntil = getServerCooldownUntil(email)
  if (serverCooldownUntil > 0) {
    return { status: 'cooldown', cooldownUntil: serverCooldownUntil }
  }

  const from = process.env.EMAIL_FROM || 'no-reply@sayago.dev'
  const to = process.env.CONTACT_EMAIL || 'hi@sayago.dev'

  const submittedAt = new Date().toLocaleString(locale === 'es' ? 'es-MX' : 'en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  })

  const { data, error } = await tryCatch<SendResponse>(
    resend.emails.send({
      from,
      to: [to],
      subject: `Nuevo mensaje — ${project}`,
      react: ContactNotificationEmail({
        name,
        email,
        project,
        budget,
        details,
        themeName: theme,
        submittedAt,
      }),
    })
  )

  if (error) {
    console.error('[sendContact] Resend transport error:', error)
    return { status: 'error', errorCode: 'server' }
  }

  if (data.error) {
    console.error('[sendContact] Resend API error:', data.error)
    return { status: 'error', errorCode: 'resend' }
  }

  const now = Date.now()
  const cooldownUntil = now + COOLDOWN_MS
  registerSend(email, now)

  return { status: 'success', cooldownUntil }
}
