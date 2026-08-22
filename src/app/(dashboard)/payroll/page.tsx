import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
            {isHrOrAdmin ? 'View organization-wide payroll records.' : 'View your payslips and salary details.'}
          </p>
        </div>
      </div>

      <div className="bg-surface border border-primary rounded overflow-hidden flex-1 flex flex-col shadow-[4px_4px_0px_0px_rgba(27,28,26,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary bg-surface-container-low font-label-sm text-label-sm text-primary uppercase">
                {isHrOrAdmin && <th className="p-4 font-semibold">Employee</th>}
                <th className="p-4 font-semibold">Period</th>
                <th className="p-4 font-semibold text-right">Basic Salary</th>
                <th className="p-4 font-semibold text-right">Allowances</th>
                <th className="p-4 font-semibold text-right">Deductions</th>
                <th className="p-4 font-semibold text-right">Net Salary</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-primary divide-y divide-surface-variant">
              {payrollData?.map(record => (
                <tr key={record.id} className="hover:bg-surface-bright transition-colors">
                  {isHrOrAdmin && (
                    <td className="p-4 font-body-md">
                      <div className="font-label-md text-primary">{record.employees?.full_name}</div>
                      <div className="text-on-surface-variant text-sm">{record.employees?.employee_id}</div>
                    </td>
                  )}
                  <td className="p-4 font-semibold">{new Date(record.payroll_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                  <td className="p-4 text-right">${record.basic_salary?.toLocaleString() || '0.00'}</td>
                  <td className="p-4 text-right text-[#006A60]">+${record.allowances?.toLocaleString() || '0.00'}</td>
                  <td className="p-4 text-right text-error">-${record.deductions?.toLocaleString() || '0.00'}</td>
                  <td className="p-4 text-right font-bold font-headline-md text-primary">${record.net_salary?.toLocaleString() || '0.00'}</td>
                </tr>
              ))}
              {(!payrollData || payrollData.length === 0) && (
                <tr>
                  <td colSpan={isHrOrAdmin ? 6 : 5} className="p-8 text-center text-on-surface-variant font-body-md">
                    No payroll records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
