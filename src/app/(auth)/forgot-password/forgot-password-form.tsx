'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function ForgotPasswordForm() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Ensure we use the correct redirect URL for production/local
    const redirectUrl = `${window.location.origin}/auth/callback?next=/reset-password`

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleReset} className="space-y-stack-md">
      <div className="border-b border-primary pb-stack-sm mb-stack-md">
        <h2 className="font-label-md text-label-md text-primary uppercase">Reset Password</h2>
      </div>
      
      {error && (
        <div className="p-3 bg-error-container text-on-error-container border border-error rounded-DEFAULT text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-success-container text-on-success-container border border-success rounded-DEFAULT text-sm">
          Password reset instructions have been sent to your email.
        </div>
      )}

      {/* Input Group: Email */}
      <div className="group">
        <label className="block font-label-sm text-label-sm text-on-surface mb-stack-sm" htmlFor="email">
          Email
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            person
          </span>
          <input
            className="block w-full pl-10 pr-3 py-3 font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-primary rounded-DEFAULT focus:outline-none focus:ring-0 focus:border-tertiary-fixed-dim focus:border-b-2 transition-all duration-200 placeholder:text-on-surface-variant placeholder:opacity-50"
            id="email"
            name="email"
            type="email"
            placeholder="e.g. jdoe@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={success}
          />
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-stack-sm flex flex-col gap-3">
        <button
          disabled={loading || success}
          className="w-full flex justify-center items-center py-3 px-4 bg-primary text-primary-foreground font-label-md text-label-md rounded-DEFAULT border border-primary hover:bg-secondary hover:shadow-[4px_4px_0px_0px_rgba(27,28,26,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 ease-out group/btn disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
        </button>
        <Link href="/login" className="w-full flex justify-center items-center py-3 px-4 bg-transparent text-primary font-label-md text-label-md rounded-DEFAULT border border-transparent hover:bg-surface-variant transition-colors duration-200">
          Back to Sign In
        </Link>
      </div>
    </form>
  )
}
