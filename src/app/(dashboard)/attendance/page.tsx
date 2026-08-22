import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AttendancePage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: employee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!employee) return <div>User record not found.</div>

  const isAdminOrHr = employee.role === 'admin' || employee.role === 'hr'

  type LogRecord = {
    id: string
    employee_id: string
    attendance_date: string
    check_in: string | null
    check_out: string | null
    status: string
    employees?: {
      full_name: string
      department: string
      avatar_url: string | null
    } | null
  }

  let logs: LogRecord[] = []
  const kpis = {
    daysLogged: 0,
    avgPresent: 0,
    avgAbsent: 0,
    attendanceRate: 0
  }

  if (isAdminOrHr) {
    // Fetch all logs
    const { data: allLogs } = await supabase
      .from('attendance')
      .select(`
        *,
        employees ( full_name, department, avatar_url )
      `)
      .order('attendance_date', { ascending: false })
      .limit(100)
    
    logs = allLogs || []

    // Calculate KPIs
    const uniqueDays = new Set(logs.map(l => l.attendance_date)).size
    kpis.daysLogged = uniqueDays

    const totalPresent = logs.filter(l => l.status === 'present').length
    const totalAbsent = logs.filter(l => l.status === 'absent').length

    if (uniqueDays > 0) {
      kpis.avgPresent = Math.round(totalPresent / uniqueDays)
      kpis.avgAbsent = Math.round(totalAbsent / uniqueDays)
    }

    const total = totalPresent + totalAbsent
    if (total > 0) {
      kpis.attendanceRate = Math.round((totalPresent / total) * 1000) / 10
    }
  } else {
    // Fetch employee logs
    const { data: employeeLogs } = await supabase
      .from('attendance')
      .select(`
        *,
        employees ( full_name, department, avatar_url )
      `)
      .eq('employee_id', employee.id)
      .order('attendance_date', { ascending: false })
      .limit(100)
      
    logs = employeeLogs || []
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary mb-2">Attendance Overview</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {isAdminOrHr ? 'Manage and track company attendance records.' : 'View your personal attendance history.'}
          </p>
        </div>
        
        {isAdminOrHr && (
          <div className="flex gap-4">
            <div className="flex items-center border border-primary bg-surface rounded-DEFAULT p-1">
              <span className="material-symbols-outlined text-on-surface-variant px-2">calendar_month</span>
              <select className="bg-transparent border-none font-label-md text-label-md text-primary focus:ring-0 cursor-pointer pr-8 py-1">
                <option>All Time</option>
              </select>
            </div>
            <div className="flex items-center border border-primary bg-surface rounded-DEFAULT p-1">
              <span className="material-symbols-outlined text-on-surface-variant px-2">filter_list</span>
              <select className="bg-transparent border-none font-label-md text-label-md text-primary focus:ring-0 cursor-pointer pr-8 py-1">
                <option>All Departments</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {isAdminOrHr && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
          <div className="bg-surface border border-primary p-6 rounded-DEFAULT shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Days Logged</span>
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <div className="font-headline-xl text-headline-xl text-primary">{kpis.daysLogged}</div>
          </div>
          <div className="bg-surface border border-primary p-6 rounded-DEFAULT shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Average Present</span>
              <span className="material-symbols-outlined text-primary">person_check</span>
            </div>
            <div className="font-headline-xl text-headline-xl text-primary flex items-baseline gap-2">
              {kpis.avgPresent} <span className="font-label-sm text-label-sm text-on-surface-variant">EMP/DAY</span>
            </div>
          </div>
          <div className="bg-surface border border-primary p-6 rounded-DEFAULT shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Average Absent</span>
              <span className="material-symbols-outlined text-secondary">person_cancel</span>
            </div>
            <div className="font-headline-xl text-headline-xl text-secondary flex items-baseline gap-2">
              {kpis.avgAbsent} <span className="font-label-sm text-label-sm text-on-surface-variant">EMP/DAY</span>
            </div>
          </div>
          <div className="bg-secondary text-on-secondary border border-primary p-6 rounded-DEFAULT shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md uppercase tracking-widest opacity-90">Attendance Rate</span>
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <div className="font-headline-xl text-headline-xl">{kpis.attendanceRate}%</div>
          </div>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-surface border border-primary rounded-DEFAULT">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest rounded-t-DEFAULT">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">Daily Logs</h3>
          {isAdminOrHr && (
            <button className="font-label-md text-label-md text-primary border border-primary px-4 py-2 hover:bg-surface-variant transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">download</span>
              Export Report
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                {isAdminOrHr && <th className="p-4 pl-6 font-semibold">Employee</th>}
                {isAdminOrHr && <th className="p-4 font-semibold">Department</th>}
                <th className="p-4 pl-6 font-semibold">Date</th>
                <th className="p-4 font-semibold">Check In</th>
                <th className="p-4 font-semibold">Check Out</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-on-surface divide-y divide-outline-variant">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors group">
                  {isAdminOrHr && (
                    <td className="p-4 pl-6 flex items-center gap-3">
                      {log.employees?.avatar_url ? (
                        <div className="w-8 h-8 rounded bg-surface-variant border border-primary overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="w-full h-full object-cover" src={log.employees.avatar_url} alt="Avatar" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-surface-variant border border-primary overflow-hidden flex items-center justify-center font-bold text-primary">
                          {log.employees?.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-label-md text-label-md text-primary group-hover:underline cursor-pointer">{log.employees?.full_name}</span>
                    </td>
                  )}
                  {isAdminOrHr && (
                    <td className="p-4 text-on-surface-variant">{log.employees?.department}</td>
                  )}
                  <td className="p-4 pl-6">
                    {new Date(log.attendance_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    {log.check_in ? new Date(log.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </td>
                  <td className="p-4">
                    {log.check_out ? new Date(log.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </td>
                  <td className="p-4">
                    {log.status === 'present' && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7] font-label-sm capitalize">Present</span>
                    )}
                    {log.status === 'absent' && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-error-container text-on-error-container border border-error font-label-sm capitalize">Absent</span>
                    )}
                    {log.status === 'on_leave' && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-surface-container-high text-on-surface-variant border border-outline-variant font-label-sm capitalize">On Leave</span>
                    )}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={isAdminOrHr ? 6 : 4} className="p-6 text-center text-on-surface-variant font-body-md">
                    No attendance records found.
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
