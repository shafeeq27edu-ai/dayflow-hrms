'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkIn, checkOut } from '@/app/actions/attendance'

type AttendanceRecord = {
  id: string
  check_in: string | null
  check_out: string | null
  status: string
  worked_minutes: number
}

export function AttendanceWidget({ 
  initialRecord
}: { 
  initialRecord: AttendanceRecord | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState(initialRecord)

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      const result = await checkIn()
      if (result.success) {
        setRecord(result.data as AttendanceRecord)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to check in:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!record || !record.id) return
    setLoading(true)
    try {
      const result = await checkOut(record.id)
      if (result.success) {
        setRecord(result.data as AttendanceRecord)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to check out:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate elapsed time for display if checked in but not out
  const getElapsedString = () => {
    if (!record?.check_in) return '0h 0m'
    if (record.check_out) {
      const hrs = Math.floor((record.worked_minutes || 0) / 60)
      const mins = (record.worked_minutes || 0) % 60
      return `${hrs}h ${mins}m`
    }
    const checkInTime = new Date(record.check_in)
    const now = new Date()
    const diffMins = Math.floor((now.getTime() - checkInTime.getTime()) / 60000)
    const hrs = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hrs}h ${mins}m`
  }

  return (
    <div className="md:col-span-2 bg-surface border border-primary p-gutter relative overflow-hidden group">
      <div className="absolute inset-0 bg-surface-container-low opacity-50 z-0 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full">
        <div>
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Today&apos;s Attendance</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-headline-lg text-headline-lg text-primary">{getElapsedString()}</span>
            {record?.check_in && !record.check_out && (
              <span className="font-label-sm text-label-sm text-secondary bg-error-container px-2 py-1 rounded">Active</span>
            )}
            {record?.check_out && (
              <span className="font-label-sm text-label-sm text-primary bg-surface-variant px-2 py-1 rounded">Completed</span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {record?.check_in 
              ? `Clocked in at ${new Date(record.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
              : 'Not clocked in yet'}
          </p>
        </div>
        <div className="mt-stack-md md:mt-0">
          {!record ? (
            <button 
              onClick={handleCheckIn}
              disabled={loading}
              className="bg-primary text-primary-foreground px-8 py-4 border border-primary font-label-md text-label-md uppercase tracking-wider rounded hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">login</span>
              Check In
            </button>
          ) : !record.check_out ? (
            <button 
              onClick={handleCheckOut}
              disabled={loading}
              className="bg-secondary text-secondary-foreground px-8 py-4 border border-primary font-label-md text-label-md uppercase tracking-wider rounded hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">logout</span>
              Check Out
            </button>
          ) : (
            <div className="bg-surface-variant text-on-surface-variant px-8 py-4 border border-outline-variant font-label-md text-label-md uppercase tracking-wider rounded flex items-center gap-2">
              <span className="material-symbols-outlined">done_all</span>
              Checked Out
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
