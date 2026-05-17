"use client"

import { useState, useCallback } from "react"
import { ArrowUpDown, Compass, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { PhongThuySidebar } from "@/components/sim/PhongThuySidebar"
import { PhongThuySimRow } from "@/components/sim/PhongThuySimRow"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type NguHanh } from "@/lib/phongthuy"

interface SimResult {
  id: string
  phone: string
  phoneFormatted: string
  phoneTail: string
  type: string
  nguhanh: NguHanh
  nguhanhLabel: string
  diem: number
  price: number
  priceOriginal: number | null
  discountPercent: number | null
  breakdown?: {
    amDuongScore: number
    nguHanhScore: number
    queDichScore: number
    duNienScore: number
    luckyTailScore: number
    totalScore: number
    amDuongText: string
    nguHanhText: string
    queDichText: string
    duNienText: string
    luckyTailText: string
  }
  duNien?: { pair: string; star: string; label: string; type: "tot" | "xau" | "trungtinh"; desc: string }[]
  queDich?: { upperTrigram: string; lowerTrigram: string; hexagramIndex: number; hexagramName: string; hexagramViet: string; type: "tot" | "xau" | "binh"; desc: string }
}

interface ApiResponse {
  data: SimResult[]
  total: number
  page: number
  totalPages: number
  banMenh: NguHanh
  banMenhLabel: string
  cungMenh: string
}

const SORT_OPTIONS = [
  { value: "diem_desc", label: "Điểm cao nhất" },
  { value: "price_asc", label: "Giá thấp → cao" },
  { value: "price_desc", label: "Giá cao → thấp" },
]

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {[1, 2, 3, 4, 5].map(i => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-muted rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export function SimPhongThuyClient() {
  const [results, setResults] = useState<SimResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [metaInfo, setMetaInfo] = useState<{
    banMenhLabel: string
    cungMenh: string
    total: number
    namSinh: number
  } | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState("diem_desc")
  const [lastParams, setLastParams] = useState<Record<string, string>>({})
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const doSearch = useCallback(async (params: Record<string, string>, page = 1, sortVal = sort) => {
    setIsLoading(true)
    setHasSearched(true)
    setLastParams(params)
    setCurrentPage(page)

    const qs = new URLSearchParams({
      ...params,
      page: String(page),
      sort: sortVal,
    })

    // Handle "all" values from select
    if (qs.get("filterScore") === "all") qs.delete("filterScore")
    if (qs.get("filterType") === "all") qs.delete("filterType")

    try {
      const res = await fetch(`/api/sim-phong-thuy?${qs.toString()}`)
      const json: ApiResponse = await res.json()

      setResults(json.data ?? [])
      setTotalPages(json.totalPages ?? 1)
      setMetaInfo({
        banMenhLabel: json.banMenhLabel,
        cungMenh: json.cungMenh,
        total: json.total,
        namSinh: parseInt(params.namSinh),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [sort])

  const handleSearch = (params: Record<string, string>) => {
    doSearch(params, 1, sort)
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    if (hasSearched && Object.keys(lastParams).length > 0) {
      doSearch(lastParams, 1, newSort)
    }
  }

  const handlePageChange = (page: number) => {
    doSearch(lastParams, page, sort)
    window.scrollTo({ top: 200, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full max-w-7xl mx-auto px-4 pb-10">

      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <PhongThuySidebar
          onSearch={handleSearch}
          isLoading={isLoading}
          metaInfo={metaInfo}
        />
      </div>

      {/* Mobile: Collapsible sidebar */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileFilterOpen(o => !o)}
          className="w-full flex items-center justify-between bg-[#1a56db] text-white px-4 py-3 rounded-xl font-semibold text-sm"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Tìm sim hợp mệnh
          </span>
          {mobileFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {mobileFilterOpen && (
          <div className="mt-2">
            <PhongThuySidebar
              onSearch={(p) => { handleSearch(p); setMobileFilterOpen(false) }}
              isLoading={isLoading}
              metaInfo={metaInfo}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 space-y-4">

        {/* Toolbar */}
        {hasSearched && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {isLoading ? (
                <>
                  <Compass className="h-4 w-4 animate-spin text-[#1a56db]" />
                  <span>Đang tầm long chấm điểm phong thủy...</span>
                </>
              ) : (
                <>
                  Tìm thấy{" "}
                  <span className="font-bold text-[#1a56db]">{metaInfo?.total ?? 0}</span>{" "}
                  sim phong thủy phù hợp
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sort} onValueChange={(val) => handleSortChange(val || "")}>
                <SelectTrigger className="w-[180px] h-9 text-sm bg-muted/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-sm">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Empty state: chưa tìm */}
        {!hasSearched && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="flex justify-center mb-4">
              <Compass className="h-16 w-16 text-[#1a56db]/20" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Tìm sim hợp mệnh của bạn</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Nhập ngày sinh và thông tin cá nhân vào form bên {" "}
              <span className="hidden lg:inline">trái</span>
              <span className="lg:hidden">trên</span>
              {" "}để chúng tôi tìm sim Vinaphone hợp phong thủy cho bạn.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && (
          <>
            {results.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Không tìm thấy sim phù hợp. Hãy thử thay đổi bộ lọc hoặc giảm điểm phong thủy tối thiểu.
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <th className="py-3 px-4 text-left">Số điện thoại</th>
                        <th className="py-3 px-3 text-left">Loại sim</th>
                        <th className="py-3 px-3 text-left">Điểm PT</th>
                        <th className="py-3 px-3 text-left">Giá bán</th>
                        <th className="py-3 px-3 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(sim => (
                        <PhongThuySimRow key={sim.id} sim={sim} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && results.length > 0 && (
              <div className="flex justify-center items-center gap-3 pt-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={cn(buttonVariants({ variant: "outline" }), "disabled:opacity-40")}
                >
                  Trang trước
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={cn(buttonVariants({ variant: "outline" }), "disabled:opacity-40")}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
