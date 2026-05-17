"use client"

import { useState, useEffect } from "react"
import { Sparkles, X, ShoppingBag } from "lucide-react"

interface Transaction {
  name: string
  location: string
  phonePrefix: string
  phoneSuffix: string
  timeAgo: string
}

const TRANSACTIONS: Transaction[] = [
  { name: "Anh Tuấn", location: "Hà Nội", phonePrefix: "0914.86", phoneSuffix: "88.99", timeAgo: "vừa xong" },
  { name: "Chị Lan", location: "TP.HCM", phonePrefix: "0912.79", phoneSuffix: "79.79", timeAgo: "1 phút trước" },
  { name: "Anh Kiên", location: "Hải Phòng", phonePrefix: "0888.68", phoneSuffix: "68.86", timeAgo: "vừa xong" },
  { name: "Chị Thảo", location: "Đà Nẵng", phonePrefix: "0916.39", phoneSuffix: "79.39", timeAgo: "3 phút trước" },
  { name: "Anh Nam", location: "Cần Thơ", phonePrefix: "0899.99", phoneSuffix: "88.99", timeAgo: "vừa xong" },
  { name: "Chị Hoa", location: "Nghệ An", phonePrefix: "0911.68", phoneSuffix: "68.68", timeAgo: "2 phút trước" },
  { name: "Anh Hùng", location: "Quảng Ninh", phonePrefix: "0888.88", phoneSuffix: "99.99", timeAgo: "vừa xong" },
  { name: "Chị Linh", location: "Bắc Ninh", phonePrefix: "0915.22", phoneSuffix: "88.88", timeAgo: "vừa xong" },
  { name: "Anh Minh", location: "Thanh Hóa", phonePrefix: "0918.55", phoneSuffix: "66.77", timeAgo: "4 phút trước" },
]

export function AuspiciousNotification() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (isDismissed) return

    // Show initial notification after 3 seconds
    const initialShowTimer = setTimeout(() => {
      setIsVisible(true)
    }, 4000)

    // Setup cycling interval
    const cycleInterval = setInterval(() => {
      // First, slide out
      setIsVisible(false)

      // Wait for exit animation, then change index and slide in
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % TRANSACTIONS.length)
        setIsVisible(true)
      }, 600)
    }, 18000) // Shows a new one every 18 seconds

    // Autohide timer: stays on screen for 6.5 seconds
    const autoHideInterval = setInterval(() => {
      setIsVisible(false)
    }, 18000)

    // Setup an initial auto-hide for the first show
    const firstHideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 10500)

    return () => {
      clearTimeout(initialShowTimer)
      clearTimeout(firstHideTimer)
      clearInterval(cycleInterval)
      clearInterval(autoHideInterval)
    }
  }, [isDismissed])

  if (isDismissed) return null

  const tx = TRANSACTIONS[currentIdx]

  return (
    <div
      className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-40 max-w-[340px] md:max-w-sm transition-all duration-700 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Parchment scroll card with double gold borders */}
      <div className="bg-[#FAF9F6] border-double border-4 border-amber-500/35 rounded-xl shadow-lg relative p-4 pr-9 flex gap-3 overflow-hidden">
        {/* Subtle cloud backdrop inside the card */}
        <div className="absolute inset-0 bg-cloud-pattern opacity-[0.02] pointer-events-none" />
        
        {/* Seal stamp (Triện Cát Tường) */}
        <div className="h-10 w-10 bg-red-700 border border-amber-400/40 rounded-full flex items-center justify-center shrink-0 shadow-sm relative relative-z-10 animate-pulse">
          <div className="absolute inset-0.5 border border-dashed border-amber-300/30 rounded-full pointer-events-none" />
          <ShoppingBag className="h-4.5 w-4.5 text-amber-200" />
        </div>

        {/* Transaction Text */}
        <div className="flex flex-col gap-0.5 select-none relative z-10">
          <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-none font-display" style={{ fontFamily: "var(--font-display)" }}>
            Giao Dịch Cát Tường 🌟
          </span>
          <p className="text-xs text-slate-700 font-semibold leading-relaxed mt-1">
            {tx.name} ({tx.location}) vừa đặt mua:
          </p>
          <p className="text-sm font-extrabold text-slate-900 tracking-wide font-mono mt-0.5">
            {tx.phonePrefix}.
            <span className="text-red-700 text-[15px] font-black underline decoration-amber-500/30 underline-offset-4">
              {tx.phoneSuffix}
            </span>
          </p>
          <span className="text-[9px] text-slate-400 font-medium italic mt-1 self-start">
            {tx.timeAgo}
          </span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            setIsVisible(false)
            setIsDismissed(true)
          }}
          className="absolute top-2 right-2 text-amber-700/60 hover:text-red-800 transition-colors p-1 rounded hover:bg-amber-100/40"
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
