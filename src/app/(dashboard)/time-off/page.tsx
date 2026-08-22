import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateLeaveRequestStatus } from './actions'

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

  // If HR/Admin, fetch all requests. Else, fetch only this user's requests.
  let requestsQuery = supabase
    .from('leave_requests')
    .select(`
      *,
      employees (full_name)
    `)
    .order('created_at', { ascending: false })

  if (!isHrOrAdmin) {
    requestsQuery = requestsQuery.eq('employee_id', user.id)
  }

  const { data: leaveRequests } = await requestsQuery

  // Calculate balances (dummy logic for employee view based on static rules, 
  // real would sum approved requests of each type against annual quotas)
  const balances = {
    casual: { total: 10, used: leaveRequests?.filter(r => r.leave_type === 'casual' && r.status === 'approved' && !isHrOrAdmin).length || 0 },
    sick: { total: 12, used: leaveRequests?.filter(r => r.leave_type === 'sick' && r.status === 'approved' && !isHrOrAdmin).length || 0 },
    earned: { total: 20, used: leaveRequests?.filter(r => r.leave_type === 'earned' && r.status === 'approved' && !isHrOrAdmin).length || 0 }
  }

  const calculateDuration = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const diffTime = Math.abs(e.getTime() - s.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // inclusive
    return diffDays
  }

  return (
    <div className="flex flex-col h-full w-full max-w-container-max mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md gap-stack-md border-b-2 border-primary pb-stack-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Time Off</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            {isHrOrAdmin ? 'Manage and approve employee leave requests.' : 'Manage and track your leave balances and history.'}
          </p>
        </div>
        {!isHrOrAdmin && (
          <Link href="/time-off/new" className="bg-[#FF5733] text-white border border-primary font-label-md text-label-md py-2.5 px-6 rounded btn-hover-lift flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Request Time Off
          </Link>
        )}
      </div>

      {!isHrOrAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
          {/* Casual Leave Card */}
          <div className="bg-surface-lowest border border-primary rounded p-stack-md flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4 border-b border-primary pb-2">
              <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Casual Leave</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">beach_access</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-headline-lg text-headline-lg font-bold text-primary">{balances.casual.total - balances.casual.used}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Days Available</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 border border-primary rounded-full overflow-hidden">
                <div className="bg-secondary h-full border-r border-primary" style={{ width: `${(balances.casual.used / balances.casual.total) * 100}%` }}></div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">{balances.casual.used} days used / {balances.casual.total} total</p>
            </div>
          </div>

          {/* Sick Leave Card */}
          <div className="bg-surface-lowest border border-primary rounded p-stack-md flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4 border-b border-primary pb-2">
              <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Sick Leave</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">medical_services</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-headline-lg text-headline-lg font-bold text-primary">{balances.sick.total - balances.sick.used}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Days Available</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 border border-primary rounded-full overflow-hidden">
                <div className="bg-[#FFC300] h-full border-r border-primary" style={{ width: `${(balances.sick.used / balances.sick.total) * 100}%` }}></div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">{balances.sick.used} days used / {balances.sick.total} total</p>
            </div>
          </div>

          {/* Earned Leave Card */}
          <div className="bg-surface-lowest border border-primary rounded p-stack-md flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4 border-b border-primary pb-2">
              <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">Earned Leave</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">account_balance_wallet</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-headline-lg text-headline-lg font-bold text-primary">{balances.earned.total - balances.earned.used}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Days Available</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 border border-primary rounded-full overflow-hidden">
                <div className="bg-primary h-full border-r border-primary" style={{ width: `${(balances.earned.used / balances.earned.total) * 100}%` }}></div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">{balances.earned.used} days used / {balances.earned.total} total</p>
            </div>
          </div>
        </div>
      )}

      {/* Leave History Table */}
      <div className="bg-surface border border-primary rounded overflow-hidden flex-1 flex flex-col">
        <div className="border-b border-primary p-stack-md bg-surface-bright flex justify-between items-center">
          <h3 className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">
            {isHrOrAdmin ? 'All Leave Requests' : 'Leave History'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary bg-surface-container-low font-label-sm text-label-sm text-primary uppercase">
                {isHrOrAdmin && <th className="p-4 font-semibold">Employee</th>}
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Dates</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold">Status</th>
                {isHrOrAdmin && <th className="p-4 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-primary divide-y divide-surface-variant">
              {leaveRequests?.map(request => (
                <tr key={request.id} className="hover:bg-surface-bright transition-colors" id={request.id}>
                  {isHrOrAdmin && (
                    <td className="p-4 font-body-md">
                      {request.employees?.full_name}
                    </td>
                  )}
                  <td className="p-4 flex items-center gap-2 capitalize">
                    <div className={`w-2 h-2 rounded-full ${request.leave_type === 'casual' ? 'bg-secondary' : request.leave_type === 'sick' ? 'bg-[#FFC300]' : 'bg-primary'}`}></div>
                    {request.leave_type} Leave
                  </td>
                  <td className="p-4">{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</td>
                  <td className="p-4">{calculateDuration(request.start_date, request.end_date)} Days</td>
                  <td className="p-4 text-on-surface-variant max-w-[200px] truncate" title={request.reason}>{request.reason}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border font-label-sm text-[10px] uppercase tracking-wider ${
                      request.status === 'approved' ? 'border-primary bg-surface-container text-on-primary-fixed-variant' :
                      request.status === 'rejected' ? 'border-error bg-error-container text-error' :
                      'border-secondary text-secondary bg-secondary-fixed/20'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  {isHrOrAdmin && (
                    <td className="p-4 text-right">
                      {request.status === 'pending' && (
                        <form className="inline-flex gap-2">
                          <input type="hidden" name="requestId" value={request.id} />
                          <button formAction={updateLeaveRequestStatus.bind(null, request.id, 'approved')} className="text-secondary hover:underline font-label-sm">Approve</button>
                          <button formAction={updateLeaveRequestStatus.bind(null, request.id, 'rejected')} className="text-error hover:underline font-label-sm">Reject</button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {(!leaveRequests || leaveRequests.length === 0) && (
                <tr>
                  <td colSpan={isHrOrAdmin ? 7 : 5} className="p-8 text-center text-on-surface-variant font-body-md">
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
