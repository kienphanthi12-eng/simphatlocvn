"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SimType } from "@prisma/client"
import { getSimTypeLabel } from "@/lib/utils"
import { useState, useEffect } from "react"

const simTypes = Object.values(SimType)
const prefixes = ["0914", "0915", "0916", "0917", "0918", "0919", "0911", "0912", "0913", "0888", "0886", "0885", "0884", "0883"]
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
  const [selectedPrefixes, setSelectedPrefixes] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  useEffect(() => {
    const typeQuery = searchParams.get("type")
    if (typeQuery) {
      setSelectedTypes(typeQuery.split(","))
    } else {
      setSelectedTypes([])
    }

    const prefixQuery = searchParams.get("search")
    if (prefixQuery) {
      setSelectedPrefixes(prefixQuery.split(","))
    } else {
      setSelectedPrefixes([])
    }

    setMinPrice(searchParams.get("minPrice") || "")
    setMaxPrice(searchParams.get("maxPrice") || "")
  }, [searchParams])

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    params.set("page", "1")

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.push(`/sims?${params.toString()}`, { scroll: false })
  }

  const handleTypeToggle = (type: string) => {
    const current = new Set(selectedTypes)
    if (current.has(type)) current.delete(type)
    else current.add(type)
    
    const newValue = Array.from(current).join(",")
    updateUrl({ type: newValue || null })
  }

  const handlePrefixToggle = (prefix: string) => {
    const current = new Set(selectedPrefixes)
    if (current.has(prefix)) current.delete(prefix)
    else current.add(prefix)
    
    const newValue = Array.from(current).join(",")
    updateUrl({ search: newValue || null }) 
  }

  const handlePriceRangeClick = (min: number, max: number | null) => {
    const minStr = min.toString()
    const maxStr = max ? max.toString() : ""
    
    if (minPrice === minStr && maxPrice === maxStr) {
      updateUrl({ minPrice: null, maxPrice: null })
    } else {
      updateUrl({
        minPrice: minStr,
        maxPrice: maxStr || null
      })
    }
  }

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null
    })
  }

  const handleClearFilters = () => {
    router.push("/sims")
  }

  return (
    <div className="bg-white p-5 rounded-[8px] border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F1F5F9]">
        <h2 className="text-[11px] font-[700] tracking-[1px] uppercase text-[#94A3B8]">Bộ lọc tìm kiếm</h2>
        <button 
          onClick={handleClearFilters}
          className="text-[11px] uppercase text-red-500 hover:text-red-600 font-[600]"
        >
          Xoá lọc
        </button>
      </div>

      {/* Khoảng giá */}
      <div className="mb-8">
        <h3 className="text-[11px] font-[700] tracking-[1px] uppercase text-[#94A3B8] mb-3">Khoảng giá</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {priceRanges.map((range, idx) => {
            const minStr = range.min.toString()
            const maxStr = range.max ? range.max.toString() : ""
            const isSelected = minPrice === minStr && maxPrice === maxStr

            return (
              <button
                key={idx}
                onClick={() => handlePriceRangeClick(range.min, range.max)}
                className={`text-center text-[12px] font-[500] py-2 px-1 rounded-[6px] border transition ${
                  isSelected ? "border-[#005BAC] text-[#005BAC] bg-blue-50" : "border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
                }`}
              >
                {range.label}
              </button>
            )
          })}
        </div>
        
        <form onSubmit={handleCustomPriceSubmit} className="flex items-center gap-2 mt-4">
          <input 
            type="number" 
            placeholder="Từ" 
            className="w-full text-[12px] border border-[#E2E8F0] rounded-[6px] px-2.5 py-1.5 focus:outline-none focus:border-[#005BAC]"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-[#94A3B8]">-</span>
          <input 
            type="number" 
            placeholder="Đến" 
            className="w-full text-[12px] border border-[#E2E8F0] rounded-[6px] px-2.5 py-1.5 focus:outline-none focus:border-[#005BAC]"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button type="submit" className="bg-[#F1F5F9] px-3 py-1.5 rounded-[6px] text-[#475569] hover:bg-[#E2E8F0] text-[12px] font-[600] transition">
            Lọc
          </button>
        </form>
      </div>

      {/* Đầu số */}
      <div className="mb-8">
        <h3 className="text-[11px] font-[700] tracking-[1px] uppercase text-[#94A3B8] mb-3">Đầu số</h3>
        <div className="grid grid-cols-3 gap-2">
          {prefixes.map((prefix) => {
            const isSelected = selectedPrefixes.includes(prefix)
            return (
              <button
                key={prefix}
                onClick={() => handlePrefixToggle(prefix)}
                className={`text-[12px] font-[500] py-1.5 border rounded-[6px] transition ${
                  isSelected ? "bg-[#005BAC] text-white border-[#005BAC]" : "bg-white text-[#475569] hover:border-[#CBD5E1] border-[#E2E8F0]"
                }`}
              >
                {prefix}
              </button>
            )
          })}
        </div>
      </div>

      {/* Loại Sim */}
      <div>
        <h3 className="text-[11px] font-[700] tracking-[1px] uppercase text-[#94A3B8] mb-3">Loại Sim</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {simTypes.map((type) => {
            const isSelected = selectedTypes.includes(type)
            return (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#005BAC] focus:ring-[#005BAC]"
                />
                <span className="text-[13.5px] font-[500] text-[#334155] group-hover:text-[#005BAC] transition">
                  {getSimTypeLabel(type)}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
