import { ShieldCheck, Truck, RefreshCw, Award } from "lucide-react"

const badges = [
  { icon: ShieldCheck, label: "Vào tên chính chủ", sub: "Cam kết 100%" },
  { icon: Truck, label: "Giao toàn quốc", sub: "Miễn phí cắt sim" },
  { icon: RefreshCw, label: "Hoàn tiền 7 ngày", sub: "Nếu sim lỗi" },
  { icon: Award, label: "Sim chính hãng", sub: "Vinaphone xác nhận" },
]

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {badges.map((b) => {
        const Icon = b.icon
        return (
          <div
            key={b.label}
            className="flex flex-col items-center text-center gap-1.5 border border-gold-deep/20 rounded-xl p-3 bg-parchment/40"
          >
            <Icon className="h-5 w-5 text-gold-deep" />
            <span className="text-[11px] font-bold text-ink leading-tight">{b.label}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{b.sub}</span>
          </div>
        )
      })}
    </div>
  )
}
