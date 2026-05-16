"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CreditCard, 
  UploadCloud, 
  Settings, 
  LogOut 
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Kho Sim", href: "/admin/sims", icon: CreditCard },
  { name: "Import Sim", href: "/admin/sims/import", icon: UploadCloud },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    // Call an API route to clear cookie or clear it directly if accessible
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  // Hide sidebar on login page
  if (pathname === '/admin/login') return null

  return (
    <div className="w-[220px] bg-gray-900 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0">
      <div className="p-6">
        <Link href="/admin" className="text-xl font-black text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0066CC] rounded-lg flex items-center justify-center">
            <span className="text-sm">SPL</span>
          </div>
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive 
                  ? "bg-[#0066CC] text-white" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition w-full text-left"
        >
          <LogOut size={20} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
