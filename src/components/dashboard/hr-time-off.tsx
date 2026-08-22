import { createClient } from '@/lib/supabase/server'
import { updateLeaveRequestStatus } from '@/app/(dashboard)/time-off/actions'

export async function HrTimeOff() {
  const supabase = createClient()
  
  const { data: allRequests } = await supabase
    .from('leave_requests')
    .select(`
      *,
      employees (full_name, department, avatar_url)
    `)
    .order('created_at', { ascending: false })

  const requests = allRequests || []

  // KPI Calculations
  const pendingRequests = requests.filter(r => r.status === 'pending')
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const approvedThisMonth = requests.filter(r => {
    if (r.status !== 'approved') return false
    const d = new Date(r.start_date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  
  // Calculate total days approved this month
  const approvedDaysThisMonth = approvedThisMonth.reduce((acc, r) => {
    const s = new Date(r.start_date)
    const e = new Date(r.end_date)
    const diffDays = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return acc + diffDays
  }, 0)

  // Upcoming absences (approved, start date in future)
  const now = new Date()
  const upcomingAbsences = requests.filter(r => {
    return r.status === 'approved' && new Date(r.start_date) > now
  }).length

  const calculateDuration = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const diffDays = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-lg gap-stack-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Time Off Requests</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">Review and manage employee leave applications. Ensure team coverage while supporting well-being.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-primary text-primary font-label-md text-label-md rounded hover:bg-surface-variant transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
          </button>
          <button className="px-4 py-2 border border-primary bg-primary text-on-primary font-label-md text-label-md rounded hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        {/* Pending Approval Card */}
        <div className="bg-surface-container-lowest border border-primary p-6 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant">Pending Approval</span>
            <span className="material-symbols-outlined text-secondary">pending_actions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary">{pendingRequests.length}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">requests</span>
          </div>
        </div>

        {/* Approved This Month Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant">Approved This Month</span>
            <span className="material-symbols-outlined text-[#2E7D32]">check_circle</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary">{approvedDaysThisMonth}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">days total</span>
          </div>
        </div>

        {/* Upcoming Absences Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant">Upcoming Absences</span>
            <span className="material-symbols-outlined text-on-surface-variant">event_upcoming</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary">{upcomingAbsences}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">people</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-primary rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-primary bg-surface-bright flex justify-between items-center">
          <h3 className="font-headline-md text-headline-md text-primary">Pending Requests</h3>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
            <select className="bg-transparent border-none text-primary font-label-md text-label-md focus:ring-0 cursor-pointer">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="py-3 px-6 font-label-sm text-label-sm text-primary uppercase tracking-wider">Employee</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-primary uppercase tracking-wider">Leave Type</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-primary uppercase tracking-wider">Dates</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-primary uppercase tracking-wider">Duration</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-primary uppercase tracking-wider hidden lg:table-cell">Reason Snippet</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-primary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {pendingRequests.map(request => (
                <tr key={request.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {request.employees?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={request.employees.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-outline-variant bg-surface-variant flex items-center justify-center font-bold text-primary">
                          {request.employees?.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-label-md text-label-md text-primary">{request.employees?.full_name}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{request.employees?.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-[#E3F2FD] text-[#1565C0] font-data-mono text-data-mono border border-[#90CAF9] capitalize">
                      {request.leave_type} Leave
                    </span>
                  </td>
                  <td className="py-4 px-6 font-body-md text-body-md text-on-surface">
                    {new Date(request.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-4 px-6 font-data-mono text-data-mono text-on-surface">
                    {calculateDuration(request.start_date, request.end_date)} days
                  </td>
                  <td className="py-4 px-6 hidden lg:table-cell">
                    <p className="font-body-md text-body-md text-on-surface-variant truncate max-w-[200px]" title={request.reason}>
                      {request.reason}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <form className="flex justify-end gap-2">
                      <input type="hidden" name="requestId" value={request.id} />
                      <button formAction={updateLeaveRequestStatus.bind(null, request.id, 'rejected')} aria-label="Reject" className="w-8 h-8 rounded border border-outline-variant text-error hover:bg-error-container hover:border-error transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                      <button formAction={updateLeaveRequestStatus.bind(null, request.id, 'approved')} aria-label="Approve" className="w-8 h-8 rounded border border-primary bg-primary text-on-primary hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {pendingRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant font-body-md">
                    No pending requests to approve.
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
