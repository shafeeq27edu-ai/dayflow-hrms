import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AttendanceWidget } from './attendance-widget'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function EmployeeDashboard({ employee }: { employee: any }) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  // Fetch today's attendance
  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employee.id)
    .eq('attendance_date', today)
    .single()

  // Fetch recent time off
  const { data: timeOffData } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('employee_id', employee.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch latest payroll
  const { data: payrollData } = await supabase
    .from('payroll')
    .select('*')
    .eq('employee_id', employee.id)
    .order('payroll_month', { ascending: false })
    .limit(2)

  // Calculate taken leave days
  const { data: approvedLeaves } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('employee_id', employee.id)
    .eq('status', 'approved')

  let takenLeaveDays = 0
  if (approvedLeaves) {
    approvedLeaves.forEach(req => {
      const start = new Date(req.start_date)
      const end = new Date(req.end_date)
      // +1 because same day leave is 1 day
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      takenLeaveDays += diffDays
    })
  }

  // Date formatting helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div>
      <header className="mb-stack-lg">
        <h2 className="font-headline-xl text-headline-xl text-primary">Good morning, {employee.full_name?.split(' ')[0] || 'there'}.</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Here is your daily overview for {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg mb-stack-lg">
        {/* Primary Action Card: Attendance */}
        <AttendanceWidget initialRecord={attendanceData} employeeId={employee.id} />

        {/* Status Card: Next Pay */}
        <div className="bg-surface border border-primary p-gutter flex flex-col justify-between">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-primary pb-2 mb-stack-sm">Latest Pay</h3>
          <div className="flex-grow flex items-center justify-center py-stack-md">
            <span className="font-headline-lg text-headline-lg text-primary">
              {payrollData?.[0]?.payroll_month ? new Date(payrollData[0].payroll_month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="font-label-sm text-label-sm">Net</span>
            <span className="font-data-mono text-data-mono">
              ${payrollData?.[0]?.net_salary?.toLocaleString() || '0.00'}
            </span>
          </div>
        </div>

        <div className="bg-surface border border-primary p-gutter flex flex-col justify-between">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-primary pb-2 mb-stack-sm">Leave Taken</h3>
          <div className="flex-grow flex items-center justify-center py-stack-md">
            <div className="text-center">
              <span className="font-headline-xl text-headline-xl text-primary block">{takenLeaveDays}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Days Approved</span>
            </div>
          </div>
          <Link href="/time-off" className="block text-center w-full py-2 border border-primary text-primary font-label-md text-label-md hover:bg-surface-container transition-colors">
            Request Time Off
          </Link>
        </div>

        {/* Recent Activity List - For now just empty or static since there's no dedicated activity table */}
        <div className="md:col-span-2 bg-surface border border-primary p-gutter">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-primary pb-2 mb-stack-sm">Recent Activity</h3>
          <ul className="flex flex-col gap-4 mt-stack-md">
            {timeOffData?.[0] && (
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">approval</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-primary">
                    <span className="font-semibold">Leave Request {timeOffData[0].status}</span> for {formatDate(timeOffData[0].start_date)}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{new Date(timeOffData[0].created_at).toLocaleDateString()}</p>
                </div>
              </li>
            )}
            {payrollData?.[0] && (
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant flex-shrink-0 border border-primary">
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-primary"><span className="font-semibold">Payslip Available</span> for {new Date(payrollData[0].payroll_month).toLocaleDateString('en-US', { month: 'long' })}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{new Date(payrollData[0].created_at).toLocaleDateString()}</p>
                </div>
              </li>
            )}
            {!timeOffData?.[0] && !payrollData?.[0] && (
              <p className="text-on-surface-variant font-body-md">No recent activity.</p>
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg">
        {/* Recent Time Off Table */}
        <div className="bg-surface border border-primary p-gutter">
          <div className="flex justify-between items-center border-b border-primary pb-2 mb-stack-md">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Recent Time Off</h3>
            <Link className="font-label-sm text-label-sm text-secondary hover:underline" href="/time-off">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container-high">
                  <th className="py-2 font-label-sm text-label-sm text-on-surface-variant font-normal">Type</th>
                  <th className="py-2 font-label-sm text-label-sm text-on-surface-variant font-normal">Dates</th>
                  <th className="py-2 font-label-sm text-label-sm text-on-surface-variant font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md">
                {timeOffData?.map(leave => (
                  <tr key={leave.id} className="border-b border-surface-container-high group hover:bg-surface-container-low transition-colors">
                    <td className="py-3 capitalize">{leave.leave_type} Leave</td>
                    <td className="py-3 font-data-mono text-data-mono">{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2 py-1 font-label-sm text-label-sm rounded border ${
                        leave.status === 'approved' 
                          ? 'bg-surface-container text-on-surface-variant border-outline-variant' 
                          : leave.status === 'pending'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed-dim'
                            : 'bg-error-container text-on-error-container border-error'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!timeOffData || timeOffData.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-on-surface-variant">No recent time off requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payroll Summary Table */}
        <div className="bg-surface border border-primary p-gutter">
          <div className="flex justify-between items-center border-b border-primary pb-2 mb-stack-md">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Payroll Summary</h3>
            <Link href="/payroll" className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">visibility</span> View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container-high">
                  <th className="py-2 font-label-sm text-label-sm text-on-surface-variant font-normal">Period</th>
                  <th className="py-2 font-label-sm text-label-sm text-on-surface-variant font-normal text-right">Gross</th>
                  <th className="py-2 font-label-sm text-label-sm text-on-surface-variant font-normal text-right">Net</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md">
                {payrollData?.map(payroll => (
                  <tr key={payroll.id} className="border-b border-surface-container-high group hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-semibold">{new Date(payroll.payroll_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                    <td className="py-3 font-data-mono text-data-mono text-right">
                      ${((payroll.basic_salary || 0) + (payroll.allowances || 0)).toLocaleString()}
                    </td>
                    <td className="py-3 font-data-mono text-data-mono text-right font-semibold">
                      ${payroll.net_salary?.toLocaleString() || '0.00'}
                    </td>
                  </tr>
                ))}
                {(!payrollData || payrollData.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-on-surface-variant">No payroll records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
