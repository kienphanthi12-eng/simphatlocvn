"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ArrowUpDown, Compass, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { PhongThuySidebar } from "@/components/sim/PhongThuySidebar"
import { PhongThuySimRow } from "@/components/sim/PhongThuySimRow"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type NguHanh } from "@/lib/phongthuy"

const TrigramCompass = ({ className }: { className?: string }) => (
  <svg 
    className={`animate-spin ${className}`} 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer circle with gold border */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="#D97706" strokeWidth="2" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" />
    
    {/* Trigrams (8 directions) */}
    {/* Càn (☰) - Top */}
    <path d="M42 16h16M42 20h16M42 24h16" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
    
    {/* Khôn (☷) - Bottom */}
    <path d="M42 76h6m4 0h6M42 80h6m4 0h6M42 84h6m4 0h6" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
    
    {/* Ly (☲) - Right */}
    <path d="M76 42h16M76 46h6m4 0h6M76 50h16" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
    
    {/* Khảm (☵) - Left */}
    <path d="M8 42h6m4 0h6M8 46h16M8 50h6m4 0h6" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
    
    {/* Inner Taiji (Yin-Yang) symbol at center */}
    <circle cx="50" cy="50" r="12" fill="#FAF9F5" stroke="#B45309" strokeWidth="1.5" />
    <path d="M50 38a6 6 0 0 1 0 12 6 6 0 0 0 0 12" fill="none" stroke="#B45309" strokeWidth="1.5" />
    <path d="M50 38a12 12 0 0 1 0 24A12 12 0 0 0 50 38z" fill="#B45309" opacity="0.15" />
    <circle cx="50" cy="44" r="2" fill="#B45309" />
    <circle cx="50" cy="56" r="2" fill="#FAF9F5" stroke="#B45309" strokeWidth="0.5" />
    
    {/* Compass Needle */}
    <path d="M50 28l4 22h-8z" fill="#991B1B" />
    <path d="M50 72l4-22h-8z" fill="#9CA3AF" />
    <circle cx="50" cy="50" r="3" fill="#D97706" />
  </svg>
)

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
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

  // Đọc initial values từ URL params (truyền từ trang chủ)
  const initialValues = {
    namSinh: searchParams.get("namSinh") ?? "",
    ngaySinh: searchParams.get("ngaySinh") ?? "",
    thangSinh: searchParams.get("thangSinh") ?? "",
    gioiTinh: searchParams.get("gioiTinh") ?? "nam",
    gioSinh: searchParams.get("gioSinh") ?? "",
  }

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

    // Đồng bộ URL tham số để các component con nhận giá trị mới chuẩn xác
    router.replace(`${pathname}?${qs.toString()}`, { scroll: false })

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

  // Tự động tìm kiếm khi có params từ trang chủ
  useEffect(() => {
    if (initialValues.namSinh) {
      doSearch({
        namSinh: initialValues.namSinh,
        ngaySinh: initialValues.ngaySinh,
        thangSinh: initialValues.thangSinh,
        gioiTinh: initialValues.gioiTinh,
        gioSinh: initialValues.gioSinh,
        page: "1",
      }, 1, sort)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-6 py-6 pb-12 bg-parchment bg-cloud-pattern border-gold-scroll rounded-3xl shadow-sm mt-4">

      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <PhongThuySidebar
          onSearch={handleSearch}
          isLoading={isLoading}
          metaInfo={metaInfo}
          initialValues={initialValues}
        />
      </div>

      {/* Mobile: Collapsible sidebar */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileFilterOpen(o => !o)}
          className="w-full flex items-center justify-between bg-burgundy-gradient text-white px-4 py-3 rounded-xl font-bold text-sm border border-red-950/10 shadow-sm"
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
              initialValues={initialValues}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 space-y-4">

        {/* Toolbar */}
        {hasSearched && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 border border-amber-200/50 rounded-xl px-4 py-3 shadow-2xs backdrop-blur-xs">
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              {isLoading ? (
                <>
                  <TrigramCompass className="h-5 w-5 text-amber-700" />
                  <span className="text-amber-900">Đang tầm long chấm điểm phong thủy...</span>
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
          <div className="bg-white/95 rounded-2xl border border-[#B3925F]/35 p-12 text-center shadow-xs relative overflow-hidden">
            {/* Fine royal corner frames */}
            <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t border-l border-[#B3925F]/40 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t border-r border-[#B3925F]/40 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b border-l border-[#B3925F]/40 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b border-r border-[#B3925F]/40 rounded-br-sm pointer-events-none" />
            
            <div className="flex justify-center mb-6">
              <img src="/royal_decorations.png" alt="Rồng Phượng Vương Giả" className="h-28 object-contain mix-blend-multiply opacity-90 transition-transform duration-700 hover:scale-[1.05]" />
            </div>
            <h3 className="text-xl font-black text-[#5C1D24] mb-2.5 font-display tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              Tra Cứu Sim Hợp Mệnh Đại Cát
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
              Nhập giờ sinh và ngày sinh của bạn ở form kế bên để chúng tôi phân tích quẻ dịch hoàng cung và tìm sim Vinaphone hợp phong thủy đại cát nhất.
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
