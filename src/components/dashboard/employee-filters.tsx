'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function EmployeeFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSearch = searchParams.get('q') || ''
  const currentDept = searchParams.get('dept') || ''

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-stack-lg p-4 bg-surface border border-outline-variant rounded-DEFAULT shadow-sm relative">
      {isPending && (
        <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant overflow-hidden rounded-t-DEFAULT">
          <div className="h-full bg-primary animate-pulse w-1/3"></div>
        </div>
      )}
      <div className="flex items-center gap-2 text-primary font-label-md text-label-md mr-2">
        <span className="material-symbols-outlined text-[20px]">filter_list</span>
        Filters
      </div>
      <div className="relative flex-1 min-w-[200px]">
        <select 
          value={currentDept}
          onChange={(e) => updateFilters('dept', e.target.value)}
          className="w-full appearance-none bg-background border border-primary rounded-DEFAULT px-4 py-2.5 font-body-md text-body-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all cursor-pointer"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Human Resources">Human Resources</option>
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
      </div>
      <div className="relative flex-[2] min-w-[300px]">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input 
          defaultValue={currentSearch}
          onChange={(e) => {
            // Simple debounce without extra libraries
            const val = e.target.value
            setTimeout(() => {
              updateFilters('q', val)
            }, 300)
          }}
          className="w-full bg-background border border-primary rounded-DEFAULT pl-10 pr-4 py-2.5 font-body-md text-body-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-outline-variant" 
          placeholder="Search by name, ID, or role..." 
          type="text"
        />
      </div>
    </div>
  )
}
