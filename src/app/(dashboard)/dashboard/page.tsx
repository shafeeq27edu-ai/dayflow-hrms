import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EmployeeDashboard } from '@/components/dashboard/employee-dashboard'
import { HRDashboard } from '@/components/dashboard/hr-dashboard'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: employee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!employee) {
    return <div>User record not found.</div>
  }

  const isAdminOrHr = employee.role === 'admin' || employee.role === 'hr'

  return isAdminOrHr ? (
    <HRDashboard employee={employee} />
  ) : (
    <EmployeeDashboard employee={employee} />
  )
}
