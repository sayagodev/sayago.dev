'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '../actions'

export function AdminLoginForm({
  passwordLabel,
  submitLabel,
  errorMessage,
}: {
  passwordLabel: string
  submitLabel: string
  errorMessage: string
}) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(false)
    const res = await loginAdmin(password)
    setPending(false)
    if (res.ok) {
      setPassword('')
      router.refresh()
    } else {
      setError(true)
    }
  }

  return (
    <form onSubmit={onSubmit} className="notes-admin__login">
      <label className="notes-admin__label">
        {passwordLabel}
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="notes-admin__input"
        />
      </label>
      <button
        type="submit"
        disabled={pending || password.length === 0}
        className="notes-admin__btn"
      >
        {submitLabel}
      </button>
      {error && (
        <p role="alert" className="notes-admin__error">
          {errorMessage}
        </p>
      )}
    </form>
  )
}
