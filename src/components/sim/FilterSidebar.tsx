"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SimType } from "@prisma/client"
import { getSimTypeLabel } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const simTypes = Object.values(SimType)
const priceRanges = [
  { label: "Dưới 1 triệu", min: 0, max: 1000000 },
  { label: "1 - 3 triệu", min: 1000000, max: 3000000 },
  { label: "3 - 10 triệu", min: 3000000, max: 10000000 },
  { label: "Trên 10 triệu", min: 10000000, max: null },
]

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  useEffect(() => {
    const typeQuery = searchParams.get("type")
    if (typeQuery) {
      setSelectedTypes(typeQuery.split(","))
    } else {
      setSelectedTypes([])
    }

    setMinPrice(searchParams.get("minPrice") || "")
    setMaxPrice(searchParams.get("maxPrice") || "")
  }, [searchParams])

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1")
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key)
      else params.set(key, value)
    })
    router.push(`/sims?${params.toString()}`, { scroll: false })
  }

  const handleTypeToggle = (type: string) => {
    const current = new Set(selectedTypes)
    if (current.has(type)) current.delete(type)
    else current.add(type)
    
    updateUrl({ type: Array.from(current).join(",") || null })
  }

  const handlePriceRangeClick = (min: number, max: number | null) => {
    const minStr = min.toString()
    const maxStr = max ? max.toString() : ""
    
    if (minPrice === minStr && maxPrice === maxStr) {
      updateUrl({ minPrice: null, maxPrice: null })
    } else {
      updateUrl({ minPrice: minStr, maxPrice: maxStr || null })
    }
  }

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ minPrice: minPrice || null, maxPrice: maxPrice || null })
  }

  const handleClearFilters = () => router.push("/sims")

  return (
    <aside className="w-[230px] flex-shrink-0 space-y-5 sticky top-24">
      <div className="flex items-center justify-between px-1 mb-1">
        <h2 className="text-sm font-bold tracking-[1px] uppercase text-gray-800">Bộ Lọc</h2>
        <button onClick={handleClearFilters} className="text-[11px] uppercase text-destructive hover:text-destructive/80 font-semibold">Xoá lọc</button>
      </div>

      {/* Price filter */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Sim Theo Giá</h3>
        </div>
        <div className="p-2">
          {priceRanges.map((range, idx) => {
            const isSelected = minPrice === range.min.toString() && maxPrice === (range.max ? range.max.toString() : "")
            return (
              <button
                key={idx}
                onClick={() => handlePriceRangeClick(range.min, range.max)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                  isSelected ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <span>{range.label}</span>
                <svg
                  className={`h-3.5 w-3.5 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )
          })}
          
          <form onSubmit={handleCustomPriceSubmit} className="flex items-center gap-2 mt-2 px-1">
            <Input type="number" placeholder="Từ" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-8 text-xs bg-muted/50" />
            <span className="text-muted-foreground">-</span>
            <Input type="number" placeholder="Đến" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-8 text-xs bg-muted/50" />
            <Button type="submit" variant="secondary" size="sm" className="h-8 text-xs font-semibold">Lọc</Button>
          </form>
        </div>
      </div>

      {/* Sim categories */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="font-semibold text-sm">Danh Mục Sim</h3>
        </div>
        <div className="p-2 space-y-0.5">
          {simTypes.map((type) => {
            const isSelected = selectedTypes.includes(type)
            return (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                  isSelected ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <span>{getSimTypeLabel(type)}</span>
                <svg
                  className={`h-3.5 w-3.5 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
