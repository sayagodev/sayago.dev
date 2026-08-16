'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useForm, useSelector } from '@tanstack/react-form'
import { Check, Lock } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useIntlayer, useLocale } from 'next-intlayer'
import { useTheme } from 'next-themes'
import {
  clearCooldown,
  formatCountdown,
  getRemainingMs,
  readCooldownUntil,
  subscribeCooldown,
  writeCooldownUntil,
} from '@/lib/cooldown'
import { tryCatch } from '@/lib/try-catch'
import { sendContact, type SendContactErrorCode } from '../../actions'
import './contact-form.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INPUT_PADDING = 16 // 0.5rem por lado

const requiredRule = ({ value }: { value: string }) => (value.trim() ? undefined : 'required')
const emailRule = ({ value }: { value: string }) => (EMAIL_RE.test(value) ? undefined : 'invalid')

// Mide el ancho real del placeholder (misma fuente) y ajusta el input:
// texto + mismo espacio a izquierda y derecha
function usePlaceholderFit(ref: React.RefObject<HTMLInputElement | null>, placeholder: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const cs = getComputedStyle(el)
      const probe = document.createElement('span')
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;top:0;left:0;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};font-size:${cs.fontSize};letter-spacing:${cs.letterSpacing}`
      probe.textContent = placeholder
      document.body.appendChild(probe)
      const width = probe.offsetWidth
      probe.remove()
      el.style.width = `${Math.ceil(width) + INPUT_PADDING}px`
    }

    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [ref, placeholder])
}

export function ContactForm() {
  const content = useIntlayer('contact')
  const { locale } = useLocale()
  const { theme } = useTheme()
  const [now, setNow] = useState(() => Date.now())
  const [serverError, setServerError] = useState<SendContactErrorCode | null>(null)

  const cooldownUntil = useSyncExternalStore(subscribeCooldown, readCooldownUntil, () => 0)

  const nameRef = useRef<HTMLInputElement>(null)
  const projectRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const lastAttemptsRef = useRef(0)

  usePlaceholderFit(nameRef, content.form.namePlaceholder)
  usePlaceholderFit(projectRef, content.form.projectPlaceholder)
  usePlaceholderFit(emailRef, content.form.emailPlaceholder)

  const { contextSafe } = useGSAP()

  const shake = contextSafe((el: HTMLElement) => {
    gsap.fromTo(el, { x: -6 }, { x: 0, duration: 0.35, ease: 'elastic.out(1, 0.3)' })
  })

  const nonoShake = contextSafe((el: HTMLElement) => {
    gsap.fromTo(el, { x: 0 }, { x: -7, duration: 0.07, repeat: 3, yoyo: true, ease: 'sine.inOut' })
  })

  const form = useForm({
    defaultValues: { name: '', project: '', email: '', budget: '', details: '' },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const { data, error } = await tryCatch(
        sendContact({ ...value, theme: theme ?? 'light', locale })
      )

      if (error) {
        setServerError('server')
        return
      }

      if (data.status === 'success' || data.status === 'cooldown') {
        const until = data.cooldownUntil ?? readCooldownUntil()
        if (until > 0) writeCooldownUntil(until)
        if (data.status === 'success') form.reset()
        return
      }

      setServerError(data.errorCode ?? 'server')
    },
  })

  // Tick del countdown
  useEffect(() => {
    if (cooldownUntil <= 0) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [cooldownUntil])

  // Expira el cooldown con un timeout exacto
  useEffect(() => {
    if (cooldownUntil <= 0) return
    const delay = cooldownUntil - Date.now()
    const id = window.setTimeout(() => clearCooldown(), delay)
    return () => window.clearTimeout(id)
  }, [cooldownUntil])

  const submissionAttempts = useSelector(form.store, (s) => s.submissionAttempts)
  const isSubmitting = useSelector(form.store, (s) => s.isSubmitting)
  const errorFields = useSelector(form.store, (s) =>
    Object.entries(s.fieldMeta)
      .filter(([, meta]) => meta.errors.length > 0)
      .map(([name]) => name)
  )

  // Shake de los campos inválidos en cada intento de envío fallido
  useEffect(() => {
    if (submissionAttempts <= lastAttemptsRef.current || errorFields.length === 0) return
    lastAttemptsRef.current = submissionAttempts
    const refs: Record<string, HTMLInputElement | null> = {
      name: nameRef.current,
      project: projectRef.current,
      email: emailRef.current,
    }
    errorFields.forEach((name) => {
      const el = refs[name]
      if (el) shake(el)
    })
  }, [submissionAttempts, errorFields, shake])

  const attempted = submissionAttempts > 0
  const remaining = cooldownUntil > 0 ? getRemainingMs(cooldownUntil, now) : 0
  const locked = remaining > 0

  const errorMessages: Record<SendContactErrorCode, string> = {
    validation: content.form.error,
    cooldown: content.form.errorCooldown,
    server: content.form.errorServer,
    resend: content.form.errorResend,
  }

  const bannerMessage = serverError
    ? errorMessages[serverError]
    : attempted && errorFields.length > 0
      ? content.form.error
      : null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    void form.handleSubmit()
  }

  const handleLockedClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!locked) return
    const lock = e.currentTarget.querySelector<HTMLElement>('.contact-form__lock')
    if (lock) nonoShake(lock)
  }

  const lockIcon = <Lock className="contact-form__lock" strokeWidth={3} aria-hidden />

  return (
    <form onSubmit={handleSubmit} noValidate className="ct-intro contact-form">
      <div className="contact-form__body">
        <p className="contact-form__sentence">
          {content.form.nameStart}{' '}
          <span
            className={`contact-form__field${locked ? ' contact-form__field--locked' : ''}`}
            onClick={handleLockedClick}
          >
            <form.Field name="name" validators={{ onChange: requiredRule }}>
              {(field) => {
                const hasErr = attempted && field.state.meta.errors.length > 0
                return (
                  <input
                    required
                    disabled={locked}
                    ref={nameRef}
                    name={field.name}
                    aria-label={content.form.nameFieldLabel}
                    aria-invalid={hasErr || undefined}
                    onChange={(e) => {
                      setServerError(null)
                      field.handleChange(e.target.value)
                    }}
                    onBlur={field.handleBlur}
                    placeholder={content.form.namePlaceholder}
                    className={`contact-form__input${hasErr ? ' contact-form__input--error' : ''}`}
                  />
                )
              }}
            </form.Field>
            {locked && lockIcon}
          </span>{' '}
          {content.form.nameMiddle}{' '}
          <span
            className={`contact-form__field${locked ? ' contact-form__field--locked' : ''}`}
            onClick={handleLockedClick}
          >
            <form.Field name="project" validators={{ onChange: requiredRule }}>
              {(field) => {
                const hasErr = attempted && field.state.meta.errors.length > 0
                return (
                  <input
                    required
                    disabled={locked}
                    ref={projectRef}
                    name={field.name}
                    aria-label={content.form.projectFieldLabel}
                    aria-invalid={hasErr || undefined}
                    onChange={(e) => {
                      setServerError(null)
                      field.handleChange(e.target.value)
                    }}
                    onBlur={field.handleBlur}
                    placeholder={content.form.projectPlaceholder}
                    className={`contact-form__input${hasErr ? ' contact-form__input--error' : ''}`}
                  />
                )
              }}
            </form.Field>
            {locked && lockIcon}
          </span>
          .
        </p>

        <form.Field name="budget">
          {(field) => (
            <p
              className={`contact-form__sentence${locked ? ' contact-form__sentence--locked' : ''}`}
              onClick={handleLockedClick}
            >
              <span className="contact-form__label">
                {content.form.budgetLabel}
                {locked && lockIcon}
              </span>
              <span
                role="group"
                aria-label={content.form.budgetLabel}
                className="contact-form__budgets"
              >
                {content.form.budgets.map((b) => (
                  <button
                    type="button"
                    key={b.value}
                    disabled={locked}
                    onClick={() => {
                      setServerError(null)
                      field.handleChange(b.value)
                    }}
                    aria-pressed={field.state.value === b.value}
                    className={`contact-form__budget${field.state.value === b.value ? ' contact-form__budget--active' : ''}`}
                  >
                    {b.value}
                  </button>
                ))}
              </span>
            </p>
          )}
        </form.Field>

        <form.Field name="email" validators={{ onChange: emailRule }}>
          {(field) => {
            const hasErr = attempted && field.state.meta.errors.length > 0
            return (
              <p className="contact-form__sentence">
                {content.form.emailStart}{' '}
                <span
                  className={`contact-form__field${locked ? ' contact-form__field--locked' : ''}`}
                  onClick={handleLockedClick}
                >
                  <input
                    required
                    disabled={locked}
                    ref={emailRef}
                    type="email"
                    name={field.name}
                    aria-label={content.form.emailFieldLabel}
                    aria-invalid={hasErr || undefined}
                    onChange={(e) => {
                      setServerError(null)
                      field.handleChange(e.target.value)
                    }}
                    onBlur={field.handleBlur}
                    placeholder={content.form.emailPlaceholder}
                    className={`contact-form__input${hasErr ? ' contact-form__input--error' : ''}`}
                  />
                  {locked && lockIcon}
                </span>
                .
              </p>
            )
          }}
        </form.Field>

        <form.Field name="details">
          {(field) => (
            <div
              className={`contact-form__optional${locked ? ' contact-form__optional--locked' : ''}`}
              onClick={handleLockedClick}
            >
              <span className="contact-form__optional-label">
                {content.form.optionalLabel}
                {locked && lockIcon}
              </span>
              <textarea
                rows={4}
                disabled={locked}
                name={field.name}
                aria-label={content.form.optionalLabel}
                onChange={(e) => {
                  setServerError(null)
                  field.handleChange(e.target.value)
                }}
                onBlur={field.handleBlur}
                placeholder={content.form.optionalPlaceholder}
                className="contact-form__textarea"
              />
            </div>
          )}
        </form.Field>
      </div>

      {bannerMessage && (
        <span role="alert" className="contact-form__error">
          {bannerMessage}
        </span>
      )}

      <div className="contact-form__footer">
        {locked ? (
          <div
            className="contact-form__cooldown"
            role="status"
            aria-live="polite"
            aria-label={content.form.cooldownAriaLabel}
          >
            <span className="contact-form__cooldown-check">
              <Check size={18} strokeWidth={2.5} aria-hidden />
            </span>
            <span>{content.form.submitDone}</span>
            <span className="contact-form__cooldown-time">
              {content.form.cooldownMessage.replace('{time}', formatCountdown(remaining))}
            </span>
          </div>
        ) : (
          <button type="submit" disabled={isSubmitting} className="contact-form__submit">
            {isSubmitting ? (
              <span className="contact-form__submit-sending">
                <span className="contact-blink">▮</span> {content.form.submitSending}
              </span>
            ) : (
              <span>{content.form.submitIdle}</span>
            )}
          </button>
        )}
        <span className="contact-form__security">{content.form.security}</span>
      </div>
    </form>
  )
}
