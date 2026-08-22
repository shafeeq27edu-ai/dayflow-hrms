'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Password updated successfully')
      setPassword('')
      setConfirm('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      {message && <div className="p-3 bg-surface-variant border border-primary text-primary text-sm rounded">{message}</div>}
      {error && <div className="p-3 bg-error-container border border-error text-error text-sm rounded">{error}</div>}
      
      <div>
        <label className="block font-label-sm text-primary mb-1">New Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" 
        />
      </div>
      <div>
        <label className="block font-label-sm text-primary mb-1">Confirm Password</label>
        <input 
          type="password" 
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required 
          className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" 
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground border border-primary rounded hover:bg-secondary transition-colors font-label-md">
        Update Password
      </button>
    </form>
  )
}
