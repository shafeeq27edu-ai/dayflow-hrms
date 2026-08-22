import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HrTimeOff } from '@/components/dashboard/hr-time-off'
import { EmployeeTimeOff } from '@/components/dashboard/employee-time-off'

export default async function TimeOffPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase
    .from('employees')
    .select('role')
    .eq('id', user.id)
    .single()

  const isHrOrAdmin = currentUser?.role === 'hr' || currentUser?.role === 'admin'

  return (
    <div className="flex flex-col h-full w-full max-w-container-max mx-auto pb-stack-lg pt-stack-sm">
      {isHrOrAdmin ? (
        <HrTimeOff />
      ) : (
        <EmployeeTimeOff userId={user.id} />
      )}
    </div>
  )
}
