import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background text-on-background h-full min-h-screen overflow-hidden flex font-body-md">
      <Sidebar />
      <Header />
      <main className="md:ml-[280px] mt-16 flex-1 h-[calc(100vh-64px)] overflow-y-auto p-margin-desktop bg-background w-full relative">
        <div className="max-w-container-max mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
