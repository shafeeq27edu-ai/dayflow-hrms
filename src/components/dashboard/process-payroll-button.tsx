'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { processPayroll } from '@/app/(dashboard)/payroll/actions'
import { useEffect, useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-secondary text-secondary-foreground border-2 border-primary py-2 px-6 font-label-md text-label-md lift-shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="material-symbols-outlined text-sm">{pending ? 'hourglass_empty' : 'play_arrow'}</span>
      {pending ? 'Processing...' : 'Process Payroll'}
    </button>
  )
}

export function ProcessPayrollButton() {
  const [state, formAction] = useFormState(processPayroll, null)
  const [currentMonth, setCurrentMonth] = useState('')

  useEffect(() => {
    const now = new Date()
    // Default to 1st of current month (e.g. 2023-10-01)
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    setCurrentMonth(monthStr)
  }, [])

  return (
    <div className="flex flex-col items-end gap-2">
      <form action={formAction} className="flex items-center gap-4">
        <input type="hidden" name="payrollMonth" value={currentMonth} />
        <SubmitButton />
      </form>
      {state && (
        <div className={`text-sm font-label-sm ${state.success ? 'text-[#006A60]' : 'text-error'}`}>
          {state.success ? state.message : state.error}
        </div>
      )}
    </div>
  )
}
