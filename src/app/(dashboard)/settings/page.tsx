import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChangePasswordForm } from './change-password-form'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto gap-stack-lg pb-stack-lg pt-stack-sm">
      <div className="flex items-end justify-between border-b-2 border-primary pb-stack-md mb-stack-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">Settings</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="bg-surface border border-primary p-stack-lg rounded shadow-[4px_4px_0px_0px_rgba(27,28,26,1)]">
        <h3 className="font-headline-md text-primary mb-4 border-b border-outline-variant pb-2">Change Password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
