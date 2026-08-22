import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HrPayroll } from '@/components/dashboard/hr-payroll'
import { EmployeePayroll } from '@/components/dashboard/employee-payroll'

export default async function PayrollPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase
    .from('employees')
    .select('role')
    .eq('id', user.id)
    .single()

  const isHrOrAdmin = currentUser?.role === 'hr' || currentUser?.role === 'admin'

  let payrollQuery = supabase
    .from('payroll')
    .select(`
      *,
      employees (full_name, employee_id)
    `)
    .order('payroll_month', { ascending: false })

  if (!isHrOrAdmin) {
    payrollQuery = payrollQuery.eq('employee_id', user.id)
  }

  const { data: payrollData } = await payrollQuery

  return (
    <div className="flex flex-col h-full w-full max-w-container-max mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md gap-stack-md border-b-2 border-primary pb-stack-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Payroll</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            {isHrOrAdmin ? 'View organization-wide payroll records and process current cycles.' : 'View your payslips, salary breakdown, and payment history.'}
          </p>
        </div>
      </div>

      {isHrOrAdmin ? (
        <HrPayroll payrollData={payrollData || []} />
      ) : (
        <EmployeePayroll payrollData={payrollData || []} />
      )}
    </div>
  )
}

