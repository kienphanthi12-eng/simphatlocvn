"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort") || "newest"

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1") // reset page
    
    if (value === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    router.push(`/sims?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={(val) => handleSortChange(val || "newest")}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Sắp xếp" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Mới nhất</SelectItem>
        <SelectItem value="price_asc">Giá tăng dần</SelectItem>
        <SelectItem value="price_desc">Giá giảm dần</SelectItem>
      </SelectContent>
    </Select>
  )
}
