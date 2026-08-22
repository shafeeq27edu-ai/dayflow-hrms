'use client'

import { useState } from 'react'
import { submitLeaveRequest } from '../actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewTimeOffPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData(e.currentTarget)
      await submitLeaveRequest(formData)
      router.push('/time-off')
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      <div className="flex items-end justify-between border-b-2 border-primary pb-stack-md mb-stack-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Request Time Off</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Submit a new leave request for approval.</p>
        </div>
        <Link href="/time-off" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded border border-error mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface border border-primary rounded shadow-[4px_4px_0px_0px_rgba(27,28,26,1)] p-stack-lg space-y-6">
        <div>
          <label className="block font-label-sm text-primary mb-2">Leave Type</label>
          <select name="leaveType" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none">
            <option value="">Select leave type</option>
            <option value="casual">Casual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="earned">Earned Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-label-sm text-primary mb-2">Start Date</label>
            <input name="startDate" type="date" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>
          <div>
            <label className="block font-label-sm text-primary mb-2">End Date (Inclusive)</label>
            <input name="endDate" type="date" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block font-label-sm text-primary mb-2">Reason</label>
          <textarea name="reason" rows={4} required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none"></textarea>
        </div>

        <div className="pt-4 border-t border-primary flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-secondary text-secondary-foreground border border-primary rounded hover:bg-primary transition-colors font-label-md disabled:opacity-50 btn-hover-lift">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
