"use client"

import { useState, useEffect } from "react"
import { X, ShoppingBag } from "lucide-react"

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

    // Show initial notification after 4 seconds
    const initialShowTimer = setTimeout(() => {
      setIsVisible(true)
    }, 4000)

    // Setup cycling interval
    const cycleInterval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % TRANSACTIONS.length)
        setIsVisible(true)
      }, 600)
    }, 18000)

    const autoHideInterval = setInterval(() => {
      setIsVisible(false)
    }, 18000)

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
      className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-45 max-w-[340px] md:max-w-sm transition-all duration-700 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Imperial corner ornament styling with gold line */}
      <div className="bg-parchment border border-gold-deep/30 rounded-xl shadow-2xl relative p-4 pr-9 flex gap-3 overflow-hidden">
        {/* Subtle cloud backdrop inside the card */}
        <div className="absolute inset-0 bg-cloud-pattern opacity-[0.02] pointer-events-none" />
        
        {/* Seal stamp (Triện Cát Tường) - Lacquer Crimson */}
        <div className="h-10 w-10 bg-crimson border border-gold-deep/30 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10">
          <ShoppingBag className="h-4.5 w-4.5 text-gold-soft" />
        </div>

        {/* Transaction Text */}
        <div className="flex flex-col gap-0.5 select-none relative z-10">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] gold-text leading-none">
            Giao Dịch Cát Tường ❖
          </span>
          <p className="text-xs text-ink/80 font-semibold leading-relaxed mt-1.5">
            {tx.name} ({tx.location}) vừa thỉnh:
          </p>
          <p className="text-sm font-extrabold text-ink tracking-wide font-mono mt-0.5">
            {tx.phonePrefix}.
            <span className="text-crimson text-[15px] font-black underline decoration-gold-deep/30 underline-offset-4">
              {tx.phoneSuffix}
            </span>
          </p>
          <span className="text-[9px] text-muted-foreground/60 font-medium italic mt-1 self-start">
            {tx.timeAgo}
          </span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            setIsVisible(false)
            setIsDismissed(true)
          }}
          className="absolute top-2 right-2 text-crimson/60 hover:text-crimson transition-colors p-1 rounded hover:bg-gold-soft/20"
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
