'use client'

import { useState } from 'react'
import { createEmployee } from '../actions'
import Link from 'next/link'

export default function NewEmployeePage() {
  const [result, setResult] = useState<{ success?: boolean, error?: string, message?: string, tempPassword?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const response = await createEmployee(null, formData)
    setResult(response)
    setLoading(false)
    if (response.success) {
      (e.target as HTMLFormElement).reset()
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      <div className="flex items-end justify-between border-b-2 border-primary pb-stack-md mb-stack-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Add Employee</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Provision a new employee and generate a temporary password.</p>
        </div>
        <Link href="/employees" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to List
        </Link>
      </div>

      {result?.success && (
        <div className="bg-surface-container-low border border-primary p-6 rounded shadow-[4px_4px_0px_0px_rgba(27,28,26,1)] mb-6">
          <h3 className="font-headline-md text-primary mb-2">Success!</h3>
          <p className="font-body-md text-on-surface-variant mb-4">{result.message}</p>
          <div className="bg-background border border-primary p-4 rounded font-data-mono text-primary flex justify-between items-center">
            <div>
              <span className="text-on-surface-variant block mb-1">Temporary Password:</span>
              <span className="text-xl">{result.tempPassword}</span>
            </div>
          </div>
          <p className="font-label-sm text-secondary mt-3">Please share this password securely with the employee. It will not be shown again.</p>
        </div>
      )}

      {result?.error && (
        <div className="bg-error-container text-on-error-container p-4 rounded border border-error mb-6">
          {result.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface border border-primary rounded shadow-[4px_4px_0px_0px_rgba(27,28,26,1)] p-stack-lg space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-label-sm text-primary mb-2">Full Name</label>
            <input name="fullName" type="text" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>
          
          <div>
            <label className="block font-label-sm text-primary mb-2">Email Address</label>
            <input name="email" type="email" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>

          <div>
            <label className="block font-label-sm text-primary mb-2">Phone (Optional)</label>
            <input name="phone" type="tel" className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>

          <div>
            <label className="block font-label-sm text-primary mb-2">Date of Joining</label>
            <input name="dateOfJoining" type="date" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>

          <div>
            <label className="block font-label-sm text-primary mb-2">Department</label>
            <input name="department" type="text" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>

          <div>
            <label className="block font-label-sm text-primary mb-2">Designation</label>
            <input name="designation" type="text" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
          </div>

          <div>
            <label className="block font-label-sm text-primary mb-2">Role</label>
            <select name="role" required className="w-full border border-primary rounded px-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none">
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-primary mb-2">Basic Salary (Monthly)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-on-surface-variant">$</span>
              <input name="basicSalary" type="number" min="0" step="0.01" required className="w-full border border-primary rounded pl-8 pr-3 py-2 bg-background focus:ring-2 focus:ring-secondary focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-primary flex justify-end gap-4">
          <Link href="/employees" className="px-6 py-2 border border-primary rounded text-primary hover:bg-surface-variant transition-colors font-label-md">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground border border-primary rounded hover:bg-secondary transition-colors font-label-md disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  )
}
