"use client"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/Sidebar"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isLogin && <AdminSidebar />}
      <main className={`flex-1 ${!isLogin ? 'ml-[220px] p-8' : ''}`}>
        {children}
      </main>
    </div>
  )
}
