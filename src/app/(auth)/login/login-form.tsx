'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Determine user role and redirect
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (employeeError) {
      setError('Failed to fetch user role')
      setLoading(false)
      return
    }

    if (employeeData.role === 'admin' || employeeData.role === 'hr') {
      router.push('/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-stack-md">
      <div className="border-b border-primary pb-stack-sm mb-stack-md">
        <h2 className="font-label-md text-label-md text-primary uppercase">Secure Sign In</h2>
      </div>
      
      {error && (
        <div className="p-3 bg-error-container text-on-error-container border border-error rounded-DEFAULT text-sm">
          {error}
        </div>
      )}

      {/* Input Group: ID/Email */}
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
          />
        </div>
      </div>

      {/* Input Group: Password */}
      <div className="group">
        <div className="flex justify-between items-center mb-stack-sm">
          <label className="block font-label-sm text-label-sm text-on-surface" htmlFor="password">
            Password
          </label>
          <Link href="/forgot-password" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline decoration-1 underline-offset-2">
            Forgot Password?
          </Link>
        </div>
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

      {/* Action Area */}
      <div className="pt-stack-sm">
        <button
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-DEFAULT border border-primary hover:bg-secondary hover:shadow-[4px_4px_0px_0px_rgba(27,28,26,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 ease-out group/btn disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          {!loading && (
            <span className="material-symbols-outlined ml-2 text-[18px] group-hover/btn:translate-x-1 transition-transform">
              arrow_forward
            </span>
          )}
        </button>
      </div>

      {/* System Notice */}
      <div className="text-center pt-stack-md mt-stack-md border-t border-surface-variant">
        <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px]">shield_lock</span>
          Authorized personnel only
        </p>
      </div>
    </form>
  )
}
