import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export async function EmployeeTimeOff({ userId }: { userId: string }) {
  const supabase = createClient()
  
  const { data: leaveRequests } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('employee_id', userId)
    .order('created_at', { ascending: false })

  const calculateDuration = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const diffTime = Math.abs(e.getTime() - s.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // inclusive
  }

  let approvedDays = 0
  let pendingDays = 0
  const totalRequests = leaveRequests?.length || 0

  leaveRequests?.forEach(r => {
    const duration = calculateDuration(r.start_date, r.end_date)
    if (r.status === 'approved') approvedDays += duration
    if (r.status === 'pending') pendingDays += duration
  })

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-lg gap-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Time Off</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and track your leave balances and history.</p>
        </div>
        <Link href="/time-off/new" className="bg-[#FF5733] text-white border border-primary font-label-md text-label-md py-2.5 px-6 rounded hover-lift flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Request Time Off
        </Link>
      </div>

      {/* Balances Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-xl">
        {/* Approved */}
        <div className="bg-surface-lowest border border-primary rounded p-stack-md flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 border-b border-primary pb-2">
            <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Approved Leave</h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">done_all</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">
                {String(approvedDays).padStart(2, '0')}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Days Approved</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 border border-primary rounded-full overflow-hidden">
              <div className="bg-secondary h-full border-r border-primary w-full"></div>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">Total approved days</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-surface-lowest border border-primary rounded p-stack-md flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 border-b border-primary pb-2">
            <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Pending Leave</h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">pending_actions</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">
                {String(pendingDays).padStart(2, '0')}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Days Pending</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 border border-primary rounded-full overflow-hidden">
              <div className="bg-surface-variant h-full border-r border-primary w-full"></div>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">Awaiting HR approval</p>
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-surface-lowest border border-primary rounded p-stack-md flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 border-b border-primary pb-2">
            <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Total Requests</h3>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">format_list_bulleted</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">
                {String(totalRequests).padStart(2, '0')}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Requests Made</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 border border-primary rounded-full overflow-hidden">
              <div className="bg-primary h-full border-r border-primary w-full"></div>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">All time requests</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-primary rounded overflow-hidden">
        <div className="border-b border-primary p-stack-md bg-surface-bright flex justify-between items-center">
          <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Leave History</h3>
          <button className="text-primary hover:text-secondary transition-colors font-label-sm flex items-center gap-1">
            Filter <span className="material-symbols-outlined text-[16px]">filter_list</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary bg-surface-container-low font-label-sm text-label-sm text-primary uppercase">
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Dates</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-primary divide-y divide-surface-variant">
              {leaveRequests?.map(request => (
                <tr key={request.id} className="hover:bg-surface-bright transition-colors">
                  <td className="p-4 flex items-center gap-2 capitalize">
                    <div className={`w-2 h-2 rounded-full ${request.leave_type === 'casual' ? 'bg-secondary' : request.leave_type === 'sick' ? 'bg-[#FFC300]' : 'bg-primary'}`}></div>
                    {request.leave_type} Leave
                  </td>
                  <td className="p-4">{new Date(request.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="p-4">{calculateDuration(request.start_date, request.end_date)} Days</td>
                  <td className="p-4 text-on-surface-variant max-w-[200px] truncate" title={request.reason}>{request.reason}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border font-label-sm text-[10px] uppercase tracking-wider ${
                      request.status === 'approved' ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]' :
                      request.status === 'rejected' ? 'border-error bg-error-container text-error' :
                      'border-secondary text-secondary bg-secondary-fixed/20'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!leaveRequests || leaveRequests.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant font-body-md">
                    No leave requests found.
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
