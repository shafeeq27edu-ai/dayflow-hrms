import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function HRDashboard({ employee }: { employee: any }) {
  const supabase = createClient()
  
  // Get date for today in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0]
  
  // Fetch KPIs
  const { count: totalEmployees } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })

  const { count: presentToday } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('attendance_date', today)
    .eq('status', 'present')

  const { count: onLeave } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('attendance_date', today)
    .eq('status', 'on_leave')

  const { count: pendingRequests } = await supabase
    .from('leave_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Fetch recent attendance
  const { data: recentAttendance } = await supabase
    .from('attendance')
    .select(`
      *,
      employees ( full_name, department, avatar_url )
    `)
    .eq('attendance_date', today)
    .limit(5)

  // Fetch pending leave requests
  const { data: recentLeaveRequests } = await supabase
    .from('leave_requests')
    .select(`
      *,
      employees ( full_name, avatar_url )
    `)
    .eq('status', 'pending')
    .limit(3)

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Dashboard</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Welcome back, {employee.full_name}. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="font-data-mono text-data-mono text-on-surface-variant">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest border border-primary p-stack-md flex flex-col gap-stack-sm relative overflow-hidden group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">Total Employees</span>
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <div className="font-headline-xl text-headline-xl text-primary">{totalEmployees || 0}</div>
          <div className="w-full h-1 bg-surface-container mt-auto">
            <div className="h-full bg-primary w-[100%]"></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-primary p-stack-md flex flex-col gap-stack-sm relative overflow-hidden group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">Present Today</span>
            <span className="material-symbols-outlined text-secondary">how_to_reg</span>
          </div>
          <div className="font-headline-xl text-headline-xl text-primary">{presentToday || 0}</div>
          <div className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-auto">
            <span className="material-symbols-outlined text-[16px]">check_circle</span> Active
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-primary p-stack-md flex flex-col gap-stack-sm relative overflow-hidden group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">On Leave</span>
            <span className="material-symbols-outlined text-outline">flight_takeoff</span>
          </div>
          <div className="font-headline-xl text-headline-xl text-primary">{onLeave || 0}</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant mt-auto">
            Today
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-primary p-stack-md flex flex-col gap-stack-sm relative overflow-hidden group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-tertiary-fixed-dim/10">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">Pending Requests</span>
            <span className="material-symbols-outlined text-on-tertiary-container">pending_actions</span>
          </div>
          <div className="font-headline-xl text-headline-xl text-primary">{pendingRequests || 0}</div>
          <div className="font-label-sm text-label-sm text-on-tertiary-container mt-auto font-bold">
            Requires review
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Today's Attendance Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-primary flex flex-col">
          <div className="p-stack-md border-b border-primary flex justify-between items-center">
            <h3 className="font-headline-lg text-headline-lg text-primary">Today&apos;s Attendance</h3>
            <Link href="/attendance" className="font-label-md text-label-md text-secondary hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="p-stack-md font-label-sm text-label-sm text-on-surface-variant uppercase">Employee</th>
                  <th className="p-stack-md font-label-sm text-label-sm text-on-surface-variant uppercase">Department</th>
                  <th className="p-stack-md font-label-sm text-label-sm text-on-surface-variant uppercase">Check-in Time</th>
                  <th className="p-stack-md font-label-sm text-label-sm text-on-surface-variant uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance?.map((record) => (
                  <tr key={record.id} className="border-b border-outline-variant hover:bg-surface-bright transition-colors group">
                    <td className="p-stack-md">
                      <div className="flex items-center gap-stack-sm">
                        {record.employees?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt="Employee" className="w-8 h-8 rounded-full border border-primary object-cover" src={record.employees.avatar_url} />
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-primary bg-surface-container flex items-center justify-center font-label-sm text-primary font-bold">
                            {record.employees?.full_name?.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-data-mono text-data-mono text-primary font-bold group-hover:text-secondary transition-colors">{record.employees?.full_name}</span>
                      </div>
                    </td>
                    <td className="p-stack-md font-body-md text-body-md text-on-surface-variant">{record.employees?.department}</td>
                    <td className="p-stack-md font-data-mono text-data-mono text-on-surface-variant">
                      {new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-stack-md">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 font-label-sm text-label-sm rounded-DEFAULT border ${
                        record.status === 'present' ? 'bg-surface-variant text-primary border-primary/20' : 'bg-tertiary-fixed-dim/20 text-on-tertiary-container border-tertiary-fixed-dim/50'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${record.status === 'present' ? 'bg-secondary' : 'bg-tertiary-fixed-dim'}`}></span> 
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!recentAttendance || recentAttendance.length === 0) && (
                  <tr>
                    <td colSpan={4} className="p-stack-md text-center text-on-surface-variant font-body-md">No attendance records yet today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Time-Off Requests */}
        <div className="bg-surface-container-lowest border border-primary flex flex-col">
          <div className="p-stack-md border-b border-primary flex justify-between items-center bg-tertiary-fixed/10">
            <h3 className="font-headline-md text-headline-md text-primary">Pending Requests</h3>
            <span className="bg-secondary text-on-secondary font-label-sm px-2 py-1 rounded">{pendingRequests || 0}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-stack-md flex flex-col gap-stack-md">
            {recentLeaveRequests?.map(request => (
              <div key={request.id} className="border border-outline-variant p-stack-sm rounded-DEFAULT hover:border-primary transition-colors bg-surface-bright">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {request.employees?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="Avatar" className="w-6 h-6 rounded-full border border-primary object-cover" src={request.employees.avatar_url} />
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-primary bg-surface-container flex items-center justify-center font-label-sm text-[10px] text-primary">
                        {request.employees?.full_name?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-label-md text-label-md text-primary">{request.employees?.full_name}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">{request.leave_type} Leave</span>
                </div>
                <p className="font-data-mono text-data-mono text-primary mb-3">
                  {request.start_date} - {request.end_date}
                </p>
                <div className="flex gap-2">
                  <Link href={`/time-off?request=${request.id}`} className="flex-1 text-center bg-secondary text-on-secondary font-label-sm py-1.5 border border-primary rounded hover:bg-primary transition-colors">Review</Link>
                </div>
              </div>
            ))}
            {(!recentLeaveRequests || recentLeaveRequests.length === 0) && (
              <p className="text-center text-on-surface-variant font-body-md py-4">No pending requests.</p>
            )}
          </div>
          <div className="p-3 border-t border-outline-variant text-center bg-surface">
            <Link className="font-label-md text-label-md text-secondary hover:underline" href="/time-off">View All Requests</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
