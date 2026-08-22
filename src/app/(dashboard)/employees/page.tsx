import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EmployeesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase
    .from('employees')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'hr') {
    redirect('/dashboard') // unauthorized
  }

  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full w-full max-w-container-max mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      {/* Page Header */}
      <div className="flex items-end justify-between border-b-2 border-primary pb-stack-md mb-stack-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Employees</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">Manage your workforce directory, roles, and status across all departments.</p>
        </div>
        <Link href="/employees/new" className="flex items-center gap-2 bg-secondary text-on-secondary border-2 border-primary px-6 py-3 rounded-DEFAULT font-label-md text-label-md btn-hover-lift h-fit">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Employee
        </Link>
      </div>

      {/* Filter Bar (UI Only for now) */}
      <div className="flex flex-wrap items-center gap-4 mb-stack-lg p-4 bg-surface border border-outline-variant rounded-DEFAULT shadow-sm">
        <div className="flex items-center gap-2 text-primary font-label-md text-label-md mr-2">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
          Filters
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <select className="w-full appearance-none bg-background border border-primary rounded-DEFAULT px-4 py-2.5 font-body-md text-body-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all cursor-pointer">
            <option value="">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
        </div>
        <div className="relative flex-[2] min-w-[300px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full bg-background border border-primary rounded-DEFAULT pl-10 pr-4 py-2.5 font-body-md text-body-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-outline-variant" placeholder="Search by name, ID, or role..." type="text"/>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface border border-primary rounded-DEFAULT shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto w-full flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container border-b border-primary">
                <th className="px-6 py-4 font-label-sm text-label-sm text-primary uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-primary uppercase tracking-widest">Employee ID</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-primary uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-primary uppercase tracking-widest">Designation</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-primary uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-primary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {employees?.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {emp.avatar_url ? (
                        <img className="w-10 h-10 rounded-full border border-outline object-cover" src={emp.avatar_url} alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-outline bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-headline-md font-bold text-sm">
                          {emp.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <Link href={`/profile/${emp.id}`} className="font-label-md text-label-md text-primary group-hover:text-secondary transition-colors block">
                          {emp.full_name}
                        </Link>
                        <p className="font-label-sm text-label-sm text-on-surface-variant lowercase">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-data-mono text-data-mono text-on-surface-variant">{emp.employee_id}</td>
                  <td className="px-6 py-4 font-body-md text-body-md text-primary">{emp.department}</td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface">{emp.designation}</td>
                  <td className="px-6 py-4 font-data-mono text-data-mono text-on-surface-variant capitalize">{emp.role}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/profile/${emp.id}`} className="text-primary hover:text-secondary p-2 transition-colors inline-block">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-surface-container-low border-t border-primary px-6 py-4 flex items-center justify-between mt-auto">
          <p className="font-label-sm text-label-sm text-on-surface-variant">Showing all entries</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-outline-variant rounded-DEFAULT text-on-surface hover:bg-surface hover:border-primary transition-colors font-label-sm text-label-sm disabled:opacity-50" disabled>Previous</button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-DEFAULT font-label-sm text-label-sm">1</button>
            <button className="px-3 py-1 border border-primary rounded-DEFAULT text-primary hover:bg-surface hover:border-secondary hover:text-secondary transition-colors font-label-sm text-label-sm disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
