import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function Sidebar() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let role = 'employee'
  if (user) {
    const { data: employee } = await supabase
      .from('employees')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (employee) {
      role = employee.role
    }
  }

  const isAdminOrHr = role === 'admin' || role === 'hr'

  return (
    <nav className="hidden md:flex bg-surface-container border-r-2 border-primary fixed left-0 top-0 h-full w-[280px] flex-col py-stack-lg z-20">
      <div className="px-gutter mb-stack-lg">
        <h1 className="font-headline-md text-headline-md text-primary">Dayflow</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">HR Management System</p>
      </div>
      <ul className="flex flex-col flex-grow">
        <li className="w-full">
          <Link href="/dashboard" className="flex items-center px-gutter py-stack-sm text-secondary font-bold border-l-4 border-secondary bg-surface-variant transition-colors duration-200 ease-in-out font-label-md text-label-md">
            <span className="material-symbols-outlined mr-stack-md" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            Dashboard
          </Link>
        </li>
        {isAdminOrHr && (
          <li className="w-full mt-stack-sm">
            <Link href="/employees" className="flex items-center px-gutter py-stack-sm text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors duration-200 ease-in-out font-label-md text-label-md border-l-4 border-transparent">
              <span className="material-symbols-outlined mr-stack-md">group</span>
              Employees
            </Link>
          </li>
        )}
        <li className="w-full mt-stack-sm">
          <Link href="/attendance" className="flex items-center px-gutter py-stack-sm text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors duration-200 ease-in-out font-label-md text-label-md border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-stack-md">event_available</span>
            Attendance
          </Link>
        </li>
        <li className="w-full mt-stack-sm">
          <Link href="/time-off" className="flex items-center px-gutter py-stack-sm text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors duration-200 ease-in-out font-label-md text-label-md border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-stack-md">event_busy</span>
            Time Off
          </Link>
        </li>
        <li className="w-full mt-stack-sm">
          <Link href="/payroll" className="flex items-center px-gutter py-stack-sm text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors duration-200 ease-in-out font-label-md text-label-md border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-stack-md">payments</span>
            Payroll
          </Link>
        </li>
        <li className="w-full mt-stack-sm">
          <Link href="/settings" className="flex items-center px-gutter py-stack-sm text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors duration-200 ease-in-out font-label-md text-label-md border-l-4 border-transparent">
            <span className="material-symbols-outlined mr-stack-md">settings</span>
            Settings
          </Link>
        </li>
      </ul>
      {isAdminOrHr && (
        <div className="px-gutter mt-auto">
          <Link href="/employees/new" className="block text-center w-full py-stack-sm border border-primary bg-primary text-primary-foreground font-label-md text-label-md rounded hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
            Add New Employee
          </Link>
        </div>
      )}
    </nav>
  )
}
