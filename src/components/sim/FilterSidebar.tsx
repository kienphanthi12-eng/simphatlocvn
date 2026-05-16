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
    // Assuming search represents prefix in this specific sidebar context if it's comma separated, 
    // but the API supports search as generic text. We'll use search for prefix syncing for now.
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
    updateUrl({ search: newValue || null }) // use search param to filter by prefix in API
  }

  const handlePriceRangeClick = (min: number, max: number | null) => {
    updateUrl({
      minPrice: min.toString(),
      maxPrice: max ? max.toString() : null
    })
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
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Bộ lọc tìm kiếm</h2>
        <button 
          onClick={handleClearFilters}
          className="text-sm text-red-500 hover:underline"
        >
          Xoá lọc
        </button>
      </div>

      {/* Khoảng giá */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Khoảng giá</h3>
        <div className="space-y-2 mb-3">
          {priceRanges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => handlePriceRangeClick(range.min, range.max)}
              className="block w-full text-left text-sm py-1.5 px-3 rounded hover:bg-gray-100 text-gray-700 transition"
            >
              {range.label}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleCustomPriceSubmit} className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Từ" 
            className="w-full text-sm border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Đến" 
            className="w-full text-sm border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button type="submit" className="bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 text-sm font-medium">
            Lọc
          </button>
        </form>
      </div>

      {/* Đầu số */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Đầu số</h3>
        <div className="grid grid-cols-3 gap-2">
          {prefixes.map((prefix) => {
            const isSelected = selectedPrefixes.includes(prefix)
            return (
              <button
                key={prefix}
                onClick={() => handlePrefixToggle(prefix)}
                className={`text-sm py-1.5 border rounded transition font-medium ${
                  isSelected ? "bg-[#0066CC] text-white border-[#0066CC]" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
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
        <h3 className="font-semibold text-gray-900 mb-3">Loại Sim</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {simTypes.map((type) => {
            const isSelected = selectedTypes.includes(type)
            return (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0066CC] focus:ring-[#0066CC]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#0066CC] transition">
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
