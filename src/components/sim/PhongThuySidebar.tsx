"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, SlidersHorizontal, User, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GIO_SINH_OPTIONS, LOAI_SIM_PHONG_THUY_OPTIONS, getBanMenh, getNguhanhLabel, getCungMenh } from "@/lib/phongthuy"

interface PhongThuySidebarProps {
  onSearch: (params: Record<string, string>) => void
  isLoading?: boolean
  metaInfo?: {
    banMenhLabel: string
    cungMenh: string
    total: number
    namSinh: number
  } | null
  initialValues?: {
    namSinh?: string
    ngaySinh?: string
    thangSinh?: string
    gioiTinh?: string
    gioSinh?: string
  }
}

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const years = Array.from({ length: 71 }, (_, i) => 2010 - i)

const SCORE_OPTIONS = [
  { value: "", label: "Tất cả điểm" },
  { value: "9", label: "9–10 (Đại Cát)" },
  { value: "8", label: "8+ (Cát)" },
  { value: "7", label: "7+ (Bình)" },
]

const NGUHANH_OPTIONS = [
  { value: "", label: "Tất cả ngũ hành" },
  { value: "Kim", label: "Kim" },
  { value: "Moc", label: "Mộc" },
  { value: "Thuy", label: "Thủy" },
  { value: "Hoa", label: "Hỏa" },
  { value: "Tho", label: "Thổ" },
]

export function PhongThuySidebar({ onSearch, isLoading, metaInfo, initialValues }: PhongThuySidebarProps) {
  const [activeTab, setActiveTab] = useState<"tuoi" | "sim">("tuoi")

  // Tab Theo tuoi — khởi tạo từ initialValues nếu có
  const [gioSinh, setGioSinh] = useState(initialValues?.gioSinh ?? "")
  const [ngaySinh, setNgaySinh] = useState(initialValues?.ngaySinh ?? "")
  const [thangSinh, setThangSinh] = useState(initialValues?.thangSinh ?? "")
  const [namSinh, setNamSinh] = useState(initialValues?.namSinh ?? "")
  const [gioiTinh, setGioiTinh] = useState<"nam" | "nu">((initialValues?.gioiTinh as "nam" | "nu") ?? "nam")

  // Tab Xem phong thuy sim
  const [soSimInput, setSoSimInput] = useState("")

  // Filters
  const [filterScore, setFilterScore] = useState("")
  const [filterType, setFilterType] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const handleSearchByTuoi = () => {
    if (!namSinh) return
    onSearch({
      namSinh,
      ngaySinh,
      thangSinh,
      gioSinh,
      gioiTinh,
      filterScore,
      filterType,
      minPrice,
      maxPrice,
      page: "1",
    })
  }

  const handleSearchBySim = () => {
    if (!soSimInput || !namSinh) return
    onSearch({
      namSinh,
      gioiTinh,
      soSim: soSimInput.replace(/\D/g, ""),
      filterScore,
      filterType,
      page: "1",
    })
  }

  const handleClearFilters = () => {
    setFilterScore("")
    setFilterType("")
    setMinPrice("")
    setMaxPrice("")
  }

  // Preview ban menh khi user chọn năm sinh
  const previewBanMenh = namSinh ? getNguhanhLabel(getBanMenh(parseInt(namSinh))) : null
  const previewCungMenh = namSinh ? getCungMenh(parseInt(namSinh), gioiTinh) : null

  return (
    <aside className="w-[260px] flex-shrink-0 space-y-5 sticky top-24">

      {/* Card 1: Form tìm sim hợp mệnh */}
      <div className="bg-white/95 rounded-2xl border-gold-scroll overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-burgundy-gradient text-white px-4 py-3 flex items-center gap-2 border-b border-red-950/15">
          <Sparkles className="h-4 w-4" />
          <h3 className="font-bold text-sm">Tìm sim hợp mệnh</h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-amber-200/40 bg-amber-50/10">
          <button
            onClick={() => setActiveTab("tuoi")}
            className={`flex-1 py-2.5 text-xs font-bold transition-all ${
              activeTab === "tuoi"
                ? "text-red-800 border-b-2 border-red-700 bg-amber-50/30"
                : "text-muted-foreground hover:text-slate-700"
            }`}
          >
            Theo tuổi
          </button>
          <button
            onClick={() => setActiveTab("sim")}
            className={`flex-1 py-2.5 text-xs font-bold transition-all ${
              activeTab === "sim"
                ? "text-red-800 border-b-2 border-red-700 bg-amber-50/30"
                : "text-muted-foreground hover:text-slate-700"
            }`}
          >
            Xem phong thủy sim
          </button>
        </div>

        <div className="p-4 space-y-3">
          {activeTab === "tuoi" ? (
            <>
              {/* Giờ sinh */}
              <div className="space-y-1">
                <Label className="text-xs">Giờ sinh</Label>
                <Select value={gioSinh} onValueChange={(val) => setGioSinh(val || "")}>
                  <SelectTrigger className="h-9 text-xs bg-muted/40">
                    <SelectValue placeholder="Chọn giờ sinh" />
                  </SelectTrigger>
                  <SelectContent>
                    {GIO_SINH_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ngày / Tháng / Năm */}
              <div className="space-y-1">
                <Label className="text-xs">Ngày sinh (dương lịch)</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  <Select value={ngaySinh} onValueChange={(val) => setNgaySinh(val || "")}>
                    <SelectTrigger className="h-9 text-xs bg-muted/40">
                      <SelectValue placeholder="Ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(d => (
                        <SelectItem key={d} value={String(d)} className="text-xs">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={thangSinh} onValueChange={(val) => setThangSinh(val || "")}>
                    <SelectTrigger className="h-9 text-xs bg-muted/40">
                      <SelectValue placeholder="Tháng" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(m => (
                        <SelectItem key={m} value={String(m)} className="text-xs">Tháng {m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={namSinh} onValueChange={(val) => setNamSinh(val || "")}>
                    <SelectTrigger className="h-9 text-xs bg-muted/40">
                      <SelectValue placeholder="Năm" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {years.map(y => (
                        <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Giới tính */}
              <div className="space-y-1">
                <Label className="text-xs">Giới tính</Label>
                <div className="flex gap-4">
                  {(["nam", "nu"] as const).map(gt => (
                    <label key={gt} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        value={gt}
                        checked={gioiTinh === gt}
                        onChange={() => setGioiTinh(gt)}
                        className="w-3.5 h-3.5 accent-[#1a56db]"
                      />
                      <span className="text-xs font-medium">{gt === "nam" ? "Nam" : "Nữ"}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview ban menh */}
              {previewBanMenh && (
                <div className="bg-amber-50/70 border border-amber-200/50 rounded-lg px-3 py-2 text-xs">
                  <span className="text-amber-900/70">Bản mệnh: </span>
                  <span className="font-bold text-red-800">{previewBanMenh}</span>
                  {previewCungMenh && (
                    <>
                      <span className="text-amber-900/70 ml-2">Cung: </span>
                      <span className="font-bold text-red-800">{previewCungMenh}</span>
                    </>
                  )}
                </div>
              )}

              <Button
                onClick={handleSearchByTuoi}
                disabled={!namSinh || isLoading}
                className="w-full bg-burgundy-gradient text-white font-bold text-sm h-10 shadow-md hover:shadow-lg transition-all border border-red-950/20"
              >
                {isLoading ? "Đang tìm..." : "Tìm sim hợp tuổi"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Số điện thoại cần xem</Label>
                <Input
                  placeholder="VD: 0914123456"
                  value={soSimInput}
                  onChange={e => setSoSimInput(e.target.value)}
                  className="h-9 text-sm bg-muted/40"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Năm sinh của bạn</Label>
                <Select value={namSinh} onValueChange={(val) => setNamSinh(val || "")}>
                  <SelectTrigger className="h-9 text-xs bg-muted/40">
                    <SelectValue placeholder="Chọn năm sinh" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {years.map(y => (
                      <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearchBySim}
                disabled={!soSimInput || !namSinh || isLoading}
                className="w-full bg-gold-gradient text-white font-bold text-sm h-10 shadow-md hover:shadow-lg transition-all border border-amber-600/20"
              >
                {isLoading ? "Đang xem..." : "Xem phong thủy"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Royal Dragon & Phoenix Divider */}
      <div className="flex justify-center items-center py-1.5 opacity-90 select-none pointer-events-none transition-transform duration-500 hover:scale-[1.05]">
        <img src="/royal_decorations.png" alt="Rồng Phượng Vương Giả" className="h-10 object-contain mix-blend-multiply" />
      </div>

      {/* Card 2: Bộ lọc kết quả */}
      <div className="bg-white/95 rounded-2xl border-gold-scroll overflow-hidden shadow-sm">
        <div className="bg-burgundy-gradient text-white px-4 py-3 flex items-center gap-2 border-b border-red-950/15">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="font-bold text-sm">Bộ lọc kết quả</h3>
        </div>
        <div className="p-4 space-y-3">
          {/* Điểm PT */}
          <div className="space-y-1">
            <Label className="text-xs">Điểm phong thủy</Label>
            <Select value={filterScore} onValueChange={(val) => setFilterScore(val || "")}>
              <SelectTrigger className="h-9 text-xs bg-muted/40">
                <SelectValue placeholder="Tất cả điểm" />
              </SelectTrigger>
              <SelectContent>
                {SCORE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value || "all"} value={opt.value || "all"} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loại sim */}
          <div className="space-y-1">
            <Label className="text-xs">Loại sim</Label>
            <Select value={filterType} onValueChange={(val) => setFilterType(val || "")}>
              <SelectTrigger className="h-9 text-xs bg-muted/40">
                <SelectValue placeholder="Tất cả loại" />
              </SelectTrigger>
              <SelectContent>
                {LOAI_SIM_PHONG_THUY_OPTIONS.map(opt => (
                  <SelectItem key={opt.value || "all"} value={opt.value || "all"} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Khoảng giá */}
          <div className="space-y-1">
            <Label className="text-xs">Khoảng giá (VNĐ)</Label>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Từ"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="h-8 text-xs bg-muted/40"
              />
              <span className="text-muted-foreground text-xs shrink-0">–</span>
              <Input
                type="number"
                placeholder="Đến"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="h-8 text-xs bg-muted/40"
              />
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
          >
            <X className="h-3 w-3" /> Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Card 3: Thông tin mệnh */}
      {metaInfo && (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="bg-[#1a56db] text-white px-4 py-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            <h3 className="font-semibold text-sm">Thông tin mệnh</h3>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {[
              { label: "Năm sinh", value: String(metaInfo.namSinh) },
              { label: "Bản mệnh", value: metaInfo.banMenhLabel },
              { label: "Cung mệnh", value: metaInfo.cungMenh },
              { label: "Sim tìm được", value: `${metaInfo.total} sim` },
            ].map(item => (
              <div key={item.label} className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                <p className="text-sm font-bold text-[#1a56db] mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
