import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileActions } from '@/components/dashboard/profile-actions'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: employee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!employee) {
    redirect('/dashboard')
  }

  const { data: currentUser } = await supabase
    .from('employees')
    .select('role')
    .eq('id', user.id)
    .single()

  const isOwner = user.id === employee.id
  const isHrOrAdmin = currentUser?.role === 'hr' || currentUser?.role === 'admin'

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      <div className="flex items-end justify-between border-b-2 border-primary pb-stack-md mb-stack-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Profile</h2>
        </div>
        <ProfileActions isOwner={isOwner} isHrOrAdmin={isHrOrAdmin} employee={employee} />
      </div>

      <div className="bg-surface border border-primary p-stack-lg rounded shadow-[4px_4px_0px_0px_rgba(27,28,26,1)]">
        <div className="flex items-center gap-6 mb-8">
          {employee?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={employee.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-primary object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-primary bg-surface-container flex items-center justify-center text-3xl font-bold text-primary">
              {employee?.full_name?.substring(0,2).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-headline-lg text-primary">{employee?.full_name}</h3>
            <p className="font-body-lg text-on-surface-variant">{employee?.designation} • {employee?.department}</p>
            <p className="font-data-mono text-secondary mt-1">{employee?.employee_id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-label-sm text-on-surface-variant mb-1">Email</label>
            <p className="font-body-md border-b border-outline-variant pb-2">{employee?.email}</p>
          </div>
          <div>
            <label className="block font-label-sm text-on-surface-variant mb-1">Phone</label>
            <p className="font-body-md border-b border-outline-variant pb-2">{employee?.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block font-label-sm text-on-surface-variant mb-1">Date of Joining</label>
            <p className="font-body-md border-b border-outline-variant pb-2">{employee?.date_of_joining}</p>
          </div>
          <div>
            <label className="block font-label-sm text-on-surface-variant mb-1">Role</label>
            <p className="font-body-md border-b border-outline-variant pb-2 capitalize">{employee?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
