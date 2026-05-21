"use client"

import { useState, useMemo } from "react"
import { SimType } from "@prisma/client"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/button"
import { SearchX, Search, X } from "lucide-react"

interface Sim {
  id: string
  phone: string
  type: SimType
  price: number
  priceOriginal: number | null
  featured: boolean
}

interface Props {
  initialSims: Sim[]
  initialType?: string
  initialSearch?: string
  initialMinPrice?: string
  initialMaxPrice?: string
}

const SIM_TYPES: { value: string; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "TAM_HOA", label: "Tam Hoa" },
  { value: "TU_QUY", label: "Tứ Quý" },
  { value: "LOC_PHAT", label: "Lộc Phát" },
  { value: "TIEN_LEN", label: "Tiến Lên" },
  { value: "THAN_TAI", label: "Thần Tài" },
  { value: "NAM_SINH", label: "Năm Sinh" },
]

const typeColorMap: Record<string, string> = {
  TAM_HOA: "bg-purple-50 text-purple-700 border-purple-200",
  TU_QUY: "bg-red-50 text-red-700 border-red-200",
  TIEN_LEN: "bg-green-50 text-green-700 border-green-200",
  LOC_PHAT: "bg-orange-50 text-orange-700 border-orange-200",
  THAN_TAI: "bg-yellow-50 text-yellow-700 border-yellow-200",
  NAM_SINH: "bg-blue-50 text-blue-700 border-blue-200",
  LAP_KEP: "bg-pink-50 text-pink-700 border-pink-200",
  VIP: "bg-amber-50 text-amber-800 border-amber-300",
}

const PAGE_SIZE = 18

export default function SimsGridClient({ initialSims, initialType = "", initialSearch = "", initialMinPrice = "", initialMaxPrice = "" }: Props) {
  const [typeFilter, setTypeFilter] = useState(initialType)
  const [search, setSearch] = useState(initialSearch)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = initialSims
    if (typeFilter) result = result.filter((s) => s.type === typeFilter)
    if (search) {
      const q = search.replace(/\D/g, "")
      result = result.filter((s) => s.phone.includes(q))
    }
    if (minPrice) result = result.filter((s) => s.price >= parseInt(minPrice) * 1_000_000)
    if (maxPrice) result = result.filter((s) => s.price <= parseInt(maxPrice) * 1_000_000)
    return result
  }, [initialSims, typeFilter, search, minPrice, maxPrice])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetFilters() {
    setTypeFilter("")
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    setPage(1)
  }

  function handleFilterChange(fn: () => void) {
    fn()
    setPage(1)
  }

  const hasFilters = typeFilter || search || minPrice || maxPrice

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm số điện thoại..."
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold-deep/30"
            />
            {search && (
              <button onClick={() => handleFilterChange(() => setSearch(""))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Type filter buttons */}
          <div className="flex flex-wrap gap-2">
            {SIM_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleFilterChange(() => setTypeFilter(t.value))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  typeFilter === t.value
                    ? "bg-gold-deep text-white border-gold-deep shadow-sm"
                    : "bg-background border-border text-muted-foreground hover:border-gold-deep/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Price range */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">Giá (triệu VND):</span>
            <input
              type="number"
              placeholder="Từ"
              min={0}
              value={minPrice}
              onChange={(e) => handleFilterChange(() => setMinPrice(e.target.value))}
              className="w-20 px-2 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold-deep/30"
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="number"
              placeholder="Đến"
              min={0}
              value={maxPrice}
              onChange={(e) => handleFilterChange(() => setMaxPrice(e.target.value))}
              className="w-20 px-2 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold-deep/30"
            />
            {hasFilters && (
              <button onClick={resetFilters} className="text-xs text-crimson underline ml-1 hover:text-crimson-deep">
                Xóa bộ lọc
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground font-medium px-1">
        Tìm thấy <span className="font-bold text-foreground">{filtered.length}</span> sim Vinaphone phù hợp
      </div>

      {/* Grid or empty state */}
      {paged.length === 0 ? (
        <Card className="p-12 text-center shadow-sm">
          <div className="flex justify-center mb-4 text-muted-foreground/30">
            <SearchX size={64} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Không tìm thấy sim nào</h3>
          <p className="text-sm text-muted-foreground mb-6">Thử thay đổi bộ lọc hoặc tìm với từ khóa khác.</p>
          <Button variant="outline" onClick={resetFilters}>Xóa tất cả bộ lọc</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((sim) => {
            const badgeColor = typeColorMap[sim.type] ?? "bg-primary/10 text-primary border-primary/20"
            const isSale = sim.priceOriginal && sim.priceOriginal > sim.price
            return (
              <Card key={sim.id} className="border border-gold-deep/30 hover:border-gold-deep hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 overflow-hidden">
                <CardContent className="p-5 flex flex-col gap-3">
                  {/* Type badge */}
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs font-semibold border rounded-md px-2.5 py-0.5 ${badgeColor}`}>
                      {getSimTypeLabel(sim.type)}
                    </Badge>
                    {sim.featured && (
                      <span className="text-[10px] uppercase tracking-wider gold-text font-bold">⭐ Nổi bật</span>
                    )}
                  </div>

                  {/* Phone number */}
                  <Link href={`/sims/${sim.phone}`} className="block text-center py-1">
                    <span className="font-mono text-2xl font-black text-ink hover:text-crimson transition-colors tracking-wider">
                      {formatPhone(sim.phone)}
                    </span>
                  </Link>

                  {/* Price */}
                  <div className="text-center">
                    <span className="text-lg font-bold text-crimson">
                      {formatPrice(sim.price)}
                    </span>
                    {isSale && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        {formatPrice(sim.priceOriginal!)}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/checkout?phone=${sim.phone}`}
                    className="w-full text-center lacquer border border-gold-deep rounded-lg py-2.5 text-[10px] uppercase font-sans tracking-[0.2em] font-extrabold text-gold-soft hover:opacity-90 transition-opacity block mt-1"
                  >
                    Đặt mua
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Trang trước
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Trang {page} / {totalPages}
          </span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Trang sau
          </Button>
        </div>
      )}
    </div>
  )
}
