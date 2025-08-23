import { Sidebar } from "@/components/layout/sidebar"
import { MainNav } from "@/components/layout/main-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <MainNav />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}