'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useIntlayer } from 'next-intlayer'
import './contact-form.css'

type SendState = 'idle' | 'sending' | 'done'

interface FormErrors {
  name?: boolean
  project?: boolean
  email?: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INPUT_PADDING = 16 // 0.5rem por lado

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
  const [budget, setBudget] = useState<string | null>(null)
  const [state, setState] = useState<SendState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})

  const nameRef = useRef<HTMLInputElement>(null)
  const projectRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  usePlaceholderFit(nameRef, content.form.namePlaceholder)
  usePlaceholderFit(projectRef, content.form.projectPlaceholder)
  usePlaceholderFit(emailRef, content.form.emailPlaceholder)

  const { contextSafe } = useGSAP()

  const shake = contextSafe((el: HTMLElement) => {
    gsap.fromTo(el, { x: -6 }, { x: 0, duration: 0.35, ease: 'elastic.out(1, 0.3)' })
  })

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state !== 'idle') return

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const project = String(formData.get('project') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()

    const nextErrors: FormErrors = {
      name: name.length === 0,
      project: project.length === 0,
      email: !EMAIL_RE.test(email),
    }

    setErrors(nextErrors)

    if (nextErrors.name || nextErrors.project || nextErrors.email) {
      const fields: [boolean | undefined, HTMLInputElement | null][] = [
        [nextErrors.name, nameRef.current],
        [nextErrors.project, projectRef.current],
        [nextErrors.email, emailRef.current],
      ]
      fields.forEach(([invalid, el]) => {
        if (invalid && el) shake(el)
      })
      return
    }

    setState('sending')
    setTimeout(() => setState('done'), 2100)
    setTimeout(() => setState('idle'), 5200)
  }

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev))
  }

  const hasErrors = errors.name || errors.project || errors.email

  return (
    <form onSubmit={send} noValidate className="ct-intro contact-form">
      <div className="contact-form__body">
        <p className="contact-form__sentence">
          {content.form.nameStart}{' '}
          <input
            required
            ref={nameRef}
            name="name"
            aria-label={content.form.nameFieldLabel}
            aria-invalid={errors.name || undefined}
            onChange={() => clearError('name')}
            placeholder={content.form.namePlaceholder}
            className={`contact-form__input${errors.name ? ' contact-form__input--error' : ''}`}
          />{' '}
          {content.form.nameMiddle}{' '}
          <input
            required
            ref={projectRef}
            name="project"
            aria-label={content.form.projectFieldLabel}
            aria-invalid={errors.project || undefined}
            onChange={() => clearError('project')}
            placeholder={content.form.projectPlaceholder}
            className={`contact-form__input${errors.project ? ' contact-form__input--error' : ''}`}
          />
          .
        </p>

        <p className="contact-form__sentence">
          <span className="contact-form__label">{content.form.budgetLabel}</span>
          <span
            role="group"
            aria-label={content.form.budgetLabel}
            className="contact-form__budgets"
          >
            {content.form.budgets.map((b) => (
              <button
                type="button"
                key={b.value}
                onClick={() => setBudget(b.value)}
                aria-pressed={budget === b.value}
                className={`contact-form__budget${budget === b.value ? ' contact-form__budget--active' : ''}`}
              >
                {b.value}
              </button>
            ))}
          </span>
        </p>

        <p className="contact-form__sentence">
          {content.form.emailStart}{' '}
          <input
            required
            ref={emailRef}
            type="email"
            name="email"
            aria-label={content.form.emailFieldLabel}
            aria-invalid={errors.email || undefined}
            onChange={() => clearError('email')}
            placeholder={content.form.emailPlaceholder}
            className={`contact-form__input${errors.email ? ' contact-form__input--error' : ''}`}
          />
          .
        </p>

        <div className="contact-form__optional">
          <span className="contact-form__optional-label">{content.form.optionalLabel}</span>
          <textarea
            rows={4}
            aria-label={content.form.optionalLabel}
            placeholder={content.form.optionalPlaceholder}
            className="contact-form__textarea"
          />
        </div>
      </div>

      {hasErrors && (
        <span role="alert" className="contact-form__error">
          {content.form.error}
        </span>
      )}

      <div className="contact-form__footer">
        <button type="submit" disabled={state !== 'idle'} className="contact-form__submit">
          {state === 'idle' && <span>{content.form.submitIdle}</span>}
          {state === 'sending' && (
            <span className="contact-form__submit-sending">
              <span className="contact-blink">▮</span> {content.form.submitSending}
            </span>
          )}
          {state === 'done' && <span>{content.form.submitDone}</span>}
        </button>
        <span className="contact-form__security">{content.form.security}</span>
      </div>
    </form>
  )
}
