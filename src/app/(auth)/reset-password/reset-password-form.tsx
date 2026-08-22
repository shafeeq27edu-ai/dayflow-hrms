'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleReset} className="space-y-stack-md">
      <div className="border-b border-primary pb-stack-sm mb-stack-md">
        <h2 className="font-label-md text-label-md text-primary uppercase">Set New Password</h2>
      </div>
      
      {error && (
        <div className="p-3 bg-error-container text-on-error-container border border-error rounded-DEFAULT text-sm">
          {error}
        </div>
      )}

      <div className="group">
        <label className="block font-label-sm text-label-sm text-on-surface mb-stack-sm" htmlFor="password">
          New Password
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none">
            lock
          </span>
          <input
            className="block w-full pl-10 pr-3 py-3 font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-primary rounded-DEFAULT focus:outline-none focus:ring-0 focus:border-tertiary-fixed-dim focus:border-b-2 transition-all duration-200"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="group">
        <label className="block font-label-sm text-label-sm text-on-surface mb-stack-sm" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none">
            lock_reset
          </span>
          <input
            className="block w-full pl-10 pr-3 py-3 font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-primary rounded-DEFAULT focus:outline-none focus:ring-0 focus:border-tertiary-fixed-dim focus:border-b-2 transition-all duration-200"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-stack-sm">
        <button
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 bg-primary text-primary-foreground font-label-md text-label-md rounded-DEFAULT border border-primary hover:bg-secondary hover:shadow-[4px_4px_0px_0px_rgba(27,28,26,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 ease-out group/btn disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          <span>{loading ? 'Saving...' : 'Save Password'}</span>
        </button>
      </div>
    </form>
  )
}
