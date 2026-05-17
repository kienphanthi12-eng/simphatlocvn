import { useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { getDiemLabel, getNguhanhInfo, type NguHanh } from "@/lib/phongthuy"
import { Badge } from "@/components/ui/Badge"
import { ChevronDown, ChevronUp, Sparkles, Compass, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react"

interface ScoreBreakdown {
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

interface DuNienItem {
  pair: string
  star: string
  label: string
  type: "tot" | "xau" | "trungtinh"
  desc: string
}

interface QueDichItem {
  upperTrigram: string
  lowerTrigram: string
  hexagramIndex: number
  hexagramName: string
  hexagramViet: string
  type: "tot" | "xau" | "binh"
  desc: string
}

interface SimPhongThuyRow {
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
  breakdown?: ScoreBreakdown
  duNien?: DuNienItem[]
  queDich?: QueDichItem
}

const SIM_TYPE_BADGE: Record<string, string> = {
  THAN_TAI: "bg-yellow-50 text-yellow-700 border-yellow-200",
  LOC_PHAT: "bg-green-50 text-green-700 border-green-200",
  TAM_HOA: "bg-purple-50 text-purple-700 border-purple-200",
  TU_QUY: "bg-red-50 text-red-700 border-red-200",
  LAP_KEP: "bg-pink-50 text-pink-700 border-pink-200",
  TIEN_LEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  VIP: "bg-amber-50 text-amber-800 border-amber-300",
  ONG_DIA: "bg-indigo-50 text-indigo-700 border-indigo-200",
  NAM_SINH: "bg-blue-50 text-blue-700 border-blue-200",
}

const SIM_TYPE_LABEL: Record<string, string> = {
  THAN_TAI: "Thần Tài",
  LOC_PHAT: "Lộc Phát",
  TAM_HOA: "Tam Hoa",
  TU_QUY: "Tứ Quý",
  TAM_HOA_KEP: "Tam Hoa Kép",
  LAP_KEP: "Lặp Kép",
  TIEN_LEN: "Tiến Lên",
  NGU_QUY: "Ngũ Quý",
  LUC_QUY: "Lục Quý",
  VIP: "Sim VIP",
  ONG_DIA: "Ông Địa",
  NAM_SINH: "Năm Sinh",
  GANH_DAO: "Gánh Đảo",
  DE_NHO: "Dễ Nhớ",
  KHAC: "Khác",
}

export function PhongThuySimRow({ sim }: { sim: SimPhongThuyRow }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const diemInfo = getDiemLabel(sim.diem)
  const nhInfo = getNguhanhInfo(sim.nguhanh)
  const badgeClass = SIM_TYPE_BADGE[sim.type] ?? "bg-gray-50 text-gray-700 border-gray-200"
  const typeLabel = SIM_TYPE_LABEL[sim.type] ?? sim.type
  const isSale = sim.priceOriginal != null && sim.priceOriginal > sim.price

  // Split formatted phone into head and tail
  const parts = sim.phoneFormatted.split(".")
  const head = parts.length >= 3 ? `${parts[0]}.${parts[1]}.` : sim.phoneFormatted
  const tail = parts.length >= 3 ? parts[2] : ""

  const hasDetails = !!sim.breakdown

  return (
    <>
      <tr 
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
        className={`border-b border-amber-200/20 hover:bg-amber-50/20 transition-all duration-150 group cursor-pointer ${
          isExpanded ? "bg-amber-50/15" : ""
        }`}
      >
        {/* Số điện thoại */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            {hasDetails && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="text-amber-800/60 hover:text-red-800 transition-colors p-0.5 rounded bg-amber-50 hover:bg-amber-100/50"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
            <span className="font-mono tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-base font-semibold text-foreground/80 group-hover:text-red-900/80">
                {head}
              </span>
              <span className="text-[17px] font-extrabold text-red-700 group-hover:text-red-800">
                {tail}
              </span>
            </span>
            {sim.discountPercent && sim.discountPercent > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
                -{sim.discountPercent}%
              </span>
            )}
          </div>
          {/* Ngũ hành dòng phụ */}
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: nhInfo.color }}
            />
            <span className="text-xs text-muted-foreground font-medium">{sim.nguhanhLabel}</span>
            {hasDetails && (
              <span className="text-[9px] text-red-800 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider leading-none">
                Luận giải
              </span>
            )}
          </div>
        </td>

        {/* Loại sim */}
        <td className="py-4 px-3">
          <Badge className={`text-[10px] font-semibold border rounded-full px-2.5 py-0.5 ${badgeClass}`}>
            {typeLabel}
          </Badge>
        </td>

        {/* Điểm phong thủy */}
        <td className="py-4 px-3">
          <div className="flex items-center gap-2">
            <div className="w-16 bg-amber-100/40 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-350 bg-gold-gradient`}
                style={{ width: `${(sim.diem / 10) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-black text-amber-900`}>{sim.diem}</span>
          </div>
          <p className={`text-[10px] mt-0.5 font-bold text-amber-700`}>{diemInfo.label}</p>
        </td>

        {/* Giá */}
        <td className="py-4 px-3">
          {sim.id === "custom" || sim.price === 0 ? (
            <span className="text-xs font-bold text-amber-950 bg-amber-50 px-2 py-1 rounded border border-amber-200/50">
              Số cá nhân
            </span>
          ) : (
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-red-700">{formatPrice(sim.price)}</span>
              {isSale && (
                <span className="text-xs text-gray-400 line-through opacity-60">
                  {formatPrice(sim.priceOriginal!)}
                </span>
              )}
            </div>
          )}
        </td>

        {/* Thao tác */}
        <td className="py-4 px-3 text-center" onClick={(e) => e.stopPropagation()}>
          {sim.id === "custom" || sim.price === 0 ? (
            <span className="text-xs font-bold text-slate-400">Không bán</span>
          ) : (
            <Link
              href={`/checkout?phone=${sim.phone}`}
              className="bg-gold-gradient text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap inline-block border border-amber-600/10"
            >
              Đặt mua
            </Link>
          )}
        </td>
      </tr>

      {/* Expanded Feng Shui Breakdown (Parchement unrolled scroll effect) */}
      {isExpanded && sim.breakdown && (
        <tr className="bg-[#FAF9F5] border-b border-amber-200/30 relative">
          <td colSpan={5} className="py-6 px-6 relative overflow-hidden">
            {/* Wooden/gold side unroll markers */}
            <div className="absolute top-0 bottom-0 left-2 w-1.5 bg-amber-600/25 rounded-full" />
            <div className="absolute top-0 bottom-0 right-2 w-1.5 bg-amber-600/25 rounded-full" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto relative z-10">
              
              {/* Left Column: Premium Circular Score Display */}
              <div className="lg:col-span-3 flex flex-col items-center justify-center bg-white/90 border border-amber-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                {/* Vector Medallion Imperial Dragon Watermark */}
                <svg className="absolute -bottom-4 -left-4 w-32 h-32 text-amber-700/[0.04] pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 85c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm12-45c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  <path d="M50 20c-16.6 0-30 13.4-30 30s13.4 30 30 30c1.7 0 3.3-.1 5-.4 1.1-.2 1.8-1.2 1.6-2.3s-1.2-1.8-2.3-1.6c-1.4.2-2.8.3-4.3.3-14.3 0-26-11.7-26-26s11.7-26 26-26 26 11.7 26 26c0 5.4-1.7 10.5-4.8 14.7-1.1 1.4-.4 3.4 1 4.5s3.4.4 4.5-1C82 62.4 84 56.4 84 50c0-16.6-13.4-30-30-30z" />
                </svg>
                
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" /> Điểm Số Sim
                </span>
                
                {/* Visual circle badge */}
                <div className="w-28 h-28 rounded-full border-4 border-amber-500/20 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50/50 to-white shadow-inner relative my-3">
                  <div className="absolute inset-2 border border-dashed border-amber-300 rounded-full" />
                  <span className="text-3xl font-black text-amber-900 leading-none">
                    {sim.diem}
                  </span>
                  <span className="text-xs text-amber-700/60 font-semibold mt-1">/ 10</span>
                </div>

                <Badge className="bg-burgundy-gradient text-white border-0 font-bold px-3 py-1.5 text-[10px] mt-2 shadow-sm uppercase tracking-wider rounded-sm">
                  {diemInfo.label}
                </Badge>
              </div>

              {/* Middle Column: Detailed Criteria Progress Bars */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <Compass className="h-4 w-4 text-red-700 animate-pulse" /> Chi tiết 5 tiêu chí lý số
                </h4>
                
                {[
                  { label: "Âm Dương Tương Phối", score: sim.breakdown.amDuongScore, max: 2, text: sim.breakdown.amDuongText },
                  { label: "Ngũ Hành Bản Mệnh", score: sim.breakdown.nguHanhScore, max: 2, text: sim.breakdown.nguHanhText },
                  { label: "Kinh Dịch Quẻ Bát Quái", score: sim.breakdown.queDichScore, max: 2, text: sim.breakdown.queDichText },
                  { label: "Du Niên Bát Tinh", score: sim.breakdown.duNienScore, max: 2, text: sim.breakdown.duNienText },
                  { label: "Đuôi Số Cát Tường", score: sim.breakdown.luckyTailScore, max: 2, text: sim.breakdown.luckyTailText },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1 bg-white/80 p-2.5 rounded-xl border border-amber-200/30 shadow-2xs backdrop-blur-xs">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded">{item.score}/{item.max} đ</span>
                    </div>
                    {/* Tiny progress bar */}
                    <div className="w-full bg-amber-100/40 rounded-full h-1.5 overflow-hidden my-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score === 2 ? "bg-emerald-600" : item.score === 1 ? "bg-amber-600" : "bg-red-700"
                        }`}
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column: Quẻ Dịch & Du Niên Stars */}
              <div className="lg:col-span-4 space-y-4">
                {/* Quẻ Dịch */}
                {sim.queDich && (
                  <div className="bg-white/80 border border-amber-200 rounded-xl p-3.5 shadow-2xs space-y-2 backdrop-blur-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        📜 Kinh Dịch Bát Quái
                      </span>
                      <Badge className={`text-[10px] font-bold border-0 px-2 py-0.5 text-white ${
                        sim.queDich.type === "tot" ? "bg-emerald-700" : 
                        sim.queDich.type === "xau" ? "bg-red-700" : "bg-amber-600"
                      }`}>
                        {sim.queDich.type === "tot" ? "Quẻ Cát" : sim.queDich.type === "xau" ? "Quẻ Hung" : "Quẻ Bình"}
                      </Badge>
                    </div>
                    <h5 className="text-sm font-black text-slate-800">
                      Quẻ {sim.queDich.hexagramIndex}: {sim.queDich.hexagramName} ({sim.queDich.hexagramViet})
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                      {sim.queDich.desc}
                    </p>
                  </div>
                )}

                {/* Du Niên */}
                {sim.duNien && (
                  <div className="bg-white/80 border border-amber-200 rounded-xl p-3.5 shadow-2xs space-y-2 backdrop-blur-xs">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      🌟 Bát Tinh Du Niên
                    </span>
                    
                    {/* Stars count badges */}
                    <div className="flex flex-wrap gap-1.5 py-1">
                      <Badge className="bg-green-50 hover:bg-green-50 text-green-700 border border-green-200 font-bold text-[10px]">
                        Cát tinh: {sim.duNien.filter(d => d.type === "tot").length}
                      </Badge>
                      <Badge className="bg-red-50 hover:bg-red-50 text-red-700 border border-red-200 font-bold text-[10px]">
                        Hung tinh: {sim.duNien.filter(d => d.type === "xau").length}
                      </Badge>
                    </div>

                    {/* Small horizontal list of analyzed pairs */}
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                      {sim.duNien.map((item, idx) => (
                        <div 
                          key={idx} 
                          title={`${item.pair}: ${item.label} - ${item.desc}`}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                            item.type === "tot" ? "bg-green-50 text-green-700 border-green-200" :
                            item.type === "xau" ? "bg-red-50/70 text-red-700 border-red-200" :
                            "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          <span className="font-mono">{item.pair}</span>
                          <span className="text-[9px] font-semibold">({item.label})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  )
}
