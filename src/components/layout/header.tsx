'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function Header() {
  const supabase = createClient()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: employee } = await supabase
          .from('employees')
          .select('avatar_url')
          .eq('id', user.id)
          .single()
          
        if (employee?.avatar_url) {
          setAvatarUrl(employee.avatar_url)
        }
      }
    }
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="fixed top-0 right-0 md:left-[280px] left-0 h-16 bg-surface border-b-2 border-primary flex items-center justify-between px-margin-desktop w-[calc(100%-280px)] z-10">
      <div className="flex items-center gap-stack-md flex-1">
        <div className="relative w-64 focus-within:ring-2 focus-within:ring-secondary rounded">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container border border-primary rounded font-body-md text-body-md focus:outline-none focus:border-secondary"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-gutter">
        <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button onClick={handleLogout} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors duration-200 group relative">
          <span className="material-symbols-outlined">logout</span>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-lowest border border-primary px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Logout</span>
        </button>
        <Link href="/profile" className="w-10 h-10 rounded-full border border-primary overflow-hidden block">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="User Avatar" className="w-full h-full object-cover" src={avatarUrl} />
          ) : (
            <div className="w-full h-full bg-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}
