"use client"

import { MessageCircle } from "lucide-react"
import { usePathname } from "next/navigation"

export function ZaloButton({ zaloNumber = "0914123456" }: { zaloNumber?: string }) {
  const pathname = usePathname()
  
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <a 
      href={`https://zalo.me/${zaloNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 flex items-center group z-50"
    >
      <div className="absolute right-14 bg-white px-4 py-2 rounded-xl shadow-lg border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[#0066CC] font-bold text-sm pointer-events-none origin-right">
        Chat Zalo: {zaloNumber}
      </div>
      <div className="w-14 h-14 bg-[#0066CC] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-300 hover:scale-110 hover:bg-blue-700 transition relative">
        <MessageCircle size={28} className="animate-pulse" />
        <span className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-[#0066CC] animate-ping opacity-50"></span>
      </div>
    </a>
  )
}
