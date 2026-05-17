import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { getDiemLabel, getNguhanhInfo, type NguHanh } from "@/lib/phongthuy"
import { Badge } from "@/components/ui/Badge"

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
  const diemInfo = getDiemLabel(sim.diem)
  const nhInfo = getNguhanhInfo(sim.nguhanh)
  const badgeClass = SIM_TYPE_BADGE[sim.type] ?? "bg-gray-50 text-gray-700 border-gray-200"
  const typeLabel = SIM_TYPE_LABEL[sim.type] ?? sim.type
  const isSale = sim.priceOriginal != null && sim.priceOriginal > sim.price

  // Split formatted phone into head and tail
  const parts = sim.phoneFormatted.split(".")
  const head = parts.length >= 3 ? `${parts[0]}.${parts[1]}.` : sim.phoneFormatted
  const tail = parts.length >= 3 ? parts[2] : ""

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-blue-50/40 transition-colors duration-150 group cursor-pointer">
      {/* Số điện thoại */}
      <td className="py-4 px-4">
        <Link href={`/sims/${sim.phone}`} className="block">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-base font-semibold text-foreground/80 group-hover:text-[#1a56db]/80">
                {head}
              </span>
              <span className="text-[17px] font-extrabold text-[#1a56db]">
                {tail}
              </span>
            </span>
            {sim.discountPercent && sim.discountPercent > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                -{sim.discountPercent}%
              </span>
            )}
          </div>
          {/* Ngũ hành dòng phụ */}
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: nhInfo.color }}
            />
            <span className="text-[11px] text-muted-foreground">{sim.nguhanhLabel}</span>
          </div>
        </Link>
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
          <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${diemInfo.barColor}`}
              style={{ width: `${(sim.diem / 10) * 100}%` }}
            />
          </div>
          <span className={`text-sm font-bold ${diemInfo.color}`}>{sim.diem}</span>
        </div>
        <p className={`text-[10px] mt-0.5 font-medium ${diemInfo.color}`}>{diemInfo.label}</p>
      </td>

      {/* Giá */}
      <td className="py-4 px-3">
        <div className="flex flex-col">
          <span className="text-base font-bold text-red-600">{formatPrice(sim.price)}</span>
          {isSale && (
            <span className="text-xs text-gray-400 line-through opacity-60">
              {formatPrice(sim.priceOriginal!)}
            </span>
          )}
        </div>
      </td>

      {/* Thao tác */}
      <td className="py-4 px-3 text-center">
        <Link
          href={`/checkout?phone=${sim.phone}`}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap inline-block"
        >
          Đặt mua
        </Link>
      </td>
    </tr>
  )
}
