"use client"

import { useState, useEffect } from "react"
import { X, ShoppingBag } from "lucide-react"
import { formatPhone } from "@/lib/utils"

interface Transaction {
  name: string
  location: string
  phone: string
  timeAgo: string
}

const FALLBACK: Transaction[] = [
  { name: "Anh Tuấn", location: "Hà Nội", phone: "0914868899", timeAgo: "vừa xong" },
  { name: "Chị Lan", location: "TP.HCM", phone: "0912797979", timeAgo: "1 phút trước" },
  { name: "Anh Kiên", location: "Hải Phòng", phone: "0888686886", timeAgo: "vừa xong" },
  { name: "Chị Thảo", location: "Đà Nẵng", phone: "0916397939", timeAgo: "3 phút trước" },
  { name: "Anh Nam", location: "Cần Thơ", phone: "0899998899", timeAgo: "vừa xong" },
  { name: "Chị Hoa", location: "Nghệ An", phone: "0911686868", timeAgo: "2 phút trước" },
]

const VIETNAMESE_NAMES = [
  ["Anh Tuấn", "Hà Nội"],
  ["Chị Lan", "TP.HCM"],
  ["Anh Kiên", "Hải Phòng"],
  ["Chị Thảo", "Đà Nẵng"],
  ["Anh Nam", "Cần Thơ"],
  ["Chị Hoa", "Nghệ An"],
  ["Anh Hùng", "Quảng Ninh"],
  ["Chị Linh", "Bắc Ninh"],
]

const TIME_LABELS = ["vừa xong", "1 phút trước", "2 phút trước", "3 phút trước", "vừa xong", "4 phút trước", "vừa xong", "5 phút trước"]

export function AuspiciousNotification() {
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Fetch 8 random sims on mount
  useEffect(() => {
    fetch("/api/sims?limit=8&sort=featured")
      .then((r) => r.json())
      .then((json) => {
        const data = json.data
        if (Array.isArray(data) && data.length > 0) {
          const txns: Transaction[] = data.map((sim: { phone: string }, i: number) => ({
            name: VIETNAMESE_NAMES[i % VIETNAMESE_NAMES.length][0],
            location: VIETNAMESE_NAMES[i % VIETNAMESE_NAMES.length][1],
            phone: sim.phone,
            timeAgo: TIME_LABELS[i % TIME_LABELS.length],
          }))
          setTransactions(txns)
        }
      })
      .catch(() => {
        // fallback already set as default state
      })
  }, [])

  useEffect(() => {
    if (isDismissed) return

    const initialShowTimer = setTimeout(() => setIsVisible(true), 4000)

    const cycleInterval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % transactions.length)
        setIsVisible(true)
      }, 600)
    }, 4000)

    const firstHideTimer = setTimeout(() => setIsVisible(false), 10500)

    return () => {
      clearTimeout(initialShowTimer)
      clearTimeout(firstHideTimer)
      clearInterval(cycleInterval)
    }
  }, [isDismissed, transactions.length])

  if (isDismissed) return null

  const tx = transactions[currentIdx]
  const formattedPhone = formatPhone(tx.phone)
  const parts = formattedPhone.split(".")

  return (
    <div
      className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-45 max-w-[340px] md:max-w-sm transition-all duration-700 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-parchment border border-gold-deep/30 rounded-xl shadow-2xl relative p-4 pr-9 flex gap-3 overflow-hidden">
        <div className="absolute inset-0 bg-cloud-pattern opacity-[0.02] pointer-events-none" />

        <div className="h-10 w-10 bg-crimson border border-gold-deep/30 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10">
          <ShoppingBag className="h-4.5 w-4.5 text-gold-soft" />
        </div>

        <div className="flex flex-col gap-0.5 select-none relative z-10">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] gold-text leading-none">
            Giao Dịch Cát Tường ❖
          </span>
          <p className="text-xs text-ink/80 font-semibold leading-relaxed mt-1.5">
            {tx.name} ({tx.location}) vừa thỉnh:
          </p>
          <p className="text-sm font-extrabold text-ink tracking-wide font-mono mt-0.5">
            {parts.length === 3 ? (
              <>
                {parts[0]}.{parts[1]}.
                <span className="text-crimson text-[15px] font-black underline decoration-gold-deep/30 underline-offset-4">
                  {parts[2]}
                </span>
              </>
            ) : (
              <span className="text-crimson">{formattedPhone}</span>
            )}
          </p>
          <span className="text-[9px] text-muted-foreground/60 font-medium italic mt-1 self-start">
            {tx.timeAgo}
          </span>
        </div>

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
