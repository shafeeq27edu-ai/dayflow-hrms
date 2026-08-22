import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { EmployeeFilters } from '@/components/dashboard/employee-filters'

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
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

  const query = searchParams.q as string || ''
  const dept = searchParams.dept as string || ''

  let sbQuery = supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  if (dept) {
    sbQuery = sbQuery.eq('department', dept)
  }
  
  if (query) {
    sbQuery = sbQuery.or(`full_name.ilike.%${query}%,employee_id.ilike.%${query}%,role.ilike.%${query}%`)
  }

  const { data: employees } = await sbQuery

  return (
    <div className="flex flex-col h-full w-full max-w-container-max mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      {/* Page Header */}
      <div className="flex items-end justify-between border-b-2 border-primary pb-stack-md mb-stack-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Employees</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">Manage your workforce directory, roles, and status across all departments.</p>
        </div>
        <Link href="/employees/new" className="flex items-center gap-2 bg-secondary text-secondary-foreground border-2 border-primary px-6 py-3 rounded-DEFAULT font-label-md text-label-md btn-hover-lift h-fit">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Employee
        </Link>
      </div>

      <EmployeeFilters />

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
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-DEFAULT font-label-sm text-label-sm">1</button>
            <button className="px-3 py-1 border border-primary rounded-DEFAULT text-primary hover:bg-surface hover:border-secondary hover:text-secondary transition-colors font-label-sm text-label-sm disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
