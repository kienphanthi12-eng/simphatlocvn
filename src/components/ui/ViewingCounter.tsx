"use client"

import { useState, useEffect } from "react"
import { Eye } from "lucide-react"

export function ViewingCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    // Random 3–14 on mount, fluctuates ±1 every 8–15s
    const initial = Math.floor(Math.random() * 12) + 3
    setCount(initial)

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === null) return initial
        const delta = Math.random() < 0.5 ? 1 : -1
        return Math.max(2, Math.min(18, prev + delta))
      })
    }, Math.random() * 7000 + 8000)

    return () => clearInterval(interval)
  }, [])

  if (count === null) return null

  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
      <Eye className="h-3.5 w-3.5 animate-pulse" />
      <span>{count} người đang xem sim này</span>
    </div>
  )
}
