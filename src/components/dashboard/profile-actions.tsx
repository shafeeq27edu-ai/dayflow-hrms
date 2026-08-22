'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { editProfile, updateEmployeeHr } from '@/app/(dashboard)/profile/actions'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-on-primary py-3 rounded border-2 border-primary font-label-lg text-label-lg hover:shadow-[4px_4px_0px_0px_rgba(27,28,26,1)] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
    >
      {pending ? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span> : null}
      {label}
    </button>
  )
}

interface EmployeeData {
  id: string
  phone?: string | null
  avatar_url?: string | null
  department?: string | null
  designation?: string | null
  basic_salary?: number | null
  [key: string]: unknown
}

interface ProfileActionsProps {
  isOwner: boolean;
  isHrOrAdmin: boolean;
  employee: EmployeeData;
}

export function ProfileActions({ isOwner, isHrOrAdmin, employee }: ProfileActionsProps) {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditHr, setShowEditHr] = useState(false)
  
  const [profileState, profileAction] = useFormState(editProfile, null)
  const [hrState, hrAction] = useFormState(updateEmployeeHr, null)

  // Success handling - close modal when success is true
  if (profileState?.success && showEditProfile) setShowEditProfile(false)
  if (hrState?.success && showEditHr) setShowEditHr(false)

  return (
    <div className="flex gap-4">
      {isOwner && (
        <button 
          onClick={() => setShowEditProfile(true)}
          className="flex items-center gap-2 bg-surface text-primary border-2 border-primary px-4 py-2 rounded font-label-md text-label-md btn-hover-lift h-fit"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit Profile
        </button>
      )}

      {isHrOrAdmin && (
        <button 
          onClick={() => setShowEditHr(true)}
          className="flex items-center gap-2 bg-secondary text-on-secondary border-2 border-primary px-4 py-2 rounded font-label-md text-label-md btn-hover-lift h-fit"
        >
          <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
          Manage Employee
        </button>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface w-full max-w-md rounded shadow-[8px_8px_0px_0px_rgba(27,28,26,1)] border-2 border-primary overflow-hidden">
            <div className="bg-primary text-on-primary p-4 flex justify-between items-center border-b-2 border-primary">
              <h3 className="font-headline-md">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="hover:opacity-70"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form action={profileAction} className="p-6 flex flex-col gap-4">
              {profileState?.error && <div className="bg-error-container text-error p-3 rounded text-sm">{profileState.error}</div>}
              
              <div>
                <label className="block font-label-md text-primary mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  defaultValue={employee.phone || ''}
                  className="w-full bg-surface-container-lowest border-2 border-primary rounded px-4 py-3 font-body-lg text-primary focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block font-label-md text-primary mb-1">Avatar URL</label>
                <input 
                  type="url" 
                  name="avatarUrl"
                  defaultValue={employee.avatar_url || ''}
                  className="w-full bg-surface-container-lowest border-2 border-primary rounded px-4 py-3 font-body-lg text-primary focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              
              <div className="mt-4">
                <SubmitButton label="Save Changes" />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HR Edit Modal */}
      {showEditHr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface w-full max-w-md rounded shadow-[8px_8px_0px_0px_rgba(27,28,26,1)] border-2 border-primary overflow-hidden">
            <div className="bg-secondary text-on-secondary p-4 flex justify-between items-center border-b-2 border-primary">
              <h3 className="font-headline-md">Manage Employee</h3>
              <button onClick={() => setShowEditHr(false)} className="hover:opacity-70"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form action={hrAction} className="p-6 flex flex-col gap-4">
              {hrState?.error && <div className="bg-error-container text-error p-3 rounded text-sm">{hrState.error}</div>}
              
              <input type="hidden" name="id" value={employee.id} />

              <div>
                <label className="block font-label-md text-primary mb-1">Department</label>
                <input 
                  type="text" 
                  name="department"
                  required
                  defaultValue={employee.department || ''}
                  className="w-full bg-surface-container-lowest border-2 border-primary rounded px-4 py-3 font-body-lg text-primary focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block font-label-md text-primary mb-1">Designation</label>
                <input 
                  type="text" 
                  name="designation"
                  required
                  defaultValue={employee.designation || ''}
                  className="w-full bg-surface-container-lowest border-2 border-primary rounded px-4 py-3 font-body-lg text-primary focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block font-label-md text-primary mb-1">Basic Salary</label>
                <input 
                  type="number" 
                  name="basicSalary"
                  min="0"
                  required
                  defaultValue={employee.basic_salary || 0}
                  className="w-full bg-surface-container-lowest border-2 border-primary rounded px-4 py-3 font-body-lg text-primary focus:outline-none focus:ring-0 focus:border-secondary transition-colors"
                />
              </div>
              
              <div className="mt-4">
                <SubmitButton label="Update Employee" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
