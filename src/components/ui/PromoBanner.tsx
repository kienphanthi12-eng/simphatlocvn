import { Wifi, Shield, Truck } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Wifi,
    title: "5G 4GB/Ngày",
    subtitle: "160k/tháng",
    label: "160B",
  },
  {
    icon: Shield,
    title: "MXH 1.5GB/Ngày",
    subtitle: "150k/tháng",
    label: "150",
  },
  {
    icon: Truck,
    title: "5G 12GB/Ngày",
    subtitle: "330k/tháng",
    label: "330B",
  },
]

export function PromoBanner() {
  return (
    <section className="bg-card rounded-xl border border-border overflow-hidden mb-5 shadow-xs">
      <div className="bg-primary/5 px-5 py-4 border-b border-border">
        <h2 className="text-base font-bold text-primary font-display" style={{ fontFamily: "var(--font-display)" }}>
          {"Gói Cước Vinaphone Ưu Đãi Hấp Dẫn"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          {"Kết nối không giới hạn cùng Sim Phát Lộc"}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {features.map((feature) => (
          <Link
            key={feature.label}
            href={`/sims?search=${feature.label}`}
            className="flex items-center gap-3 px-5 py-4.5 hover:bg-amber-50/20 active:scale-[0.99] border-r border-transparent hover:border-[#B3925F]/20 transition-all group"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:border-[#B3925F]/30 group-hover:bg-[#5C1D24]/5 transition-all">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="inline-block bg-[#5C1D24] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1 tracking-wider">
                {feature.label}
              </span>
              <p className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">{feature.title}</p>
              <p className="text-xs text-slate-500 font-medium">{feature.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="px-5 py-3.5 bg-muted/30 flex items-center justify-between border-t border-border">
        <span className="text-xs text-slate-500 font-medium">
          {"Hotline hỗ trợ đăng ký: "}
          <strong className="text-[#5C1D24] font-bold font-mono">0914.123.456</strong>
        </span>
        <Link
          href="/sims?search=gói cước"
          className="text-xs font-black text-primary hover:text-primary-hover underline underline-offset-4 decoration-primary/20 hover:decoration-primary/60 transition-all font-display"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {"Kiểm tra ngay"}
        </Link>
      </div>
    </section>
  )
}
