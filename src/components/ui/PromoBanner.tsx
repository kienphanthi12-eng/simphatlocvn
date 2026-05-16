import { Wifi, Shield, Truck } from "lucide-react"

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
    <section className="bg-card rounded-xl border border-border overflow-hidden mb-5 shadow-sm">
      <div className="bg-primary/10 px-5 py-4 border-b border-border">
        <h2 className="text-base font-bold text-primary">
          {"Gói Cước Vinaphone Ưu Đãi Hấp Dẫn"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {"Kết nối không giới hạn cùng Sim Phát Lộc"}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {features.map((feature) => (
          <div key={feature.label} className="flex items-center gap-3 px-5 py-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                {feature.label}
              </span>
              <p className="text-sm font-semibold text-foreground">{feature.title}</p>
              <p className="text-xs text-muted-foreground">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 bg-muted/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {"Hotline: "}
          <strong className="text-foreground">0914.123.456</strong>
        </span>
        <button className="text-xs font-semibold text-primary hover:underline">
          {"Kiểm tra ngay"}
        </button>
      </div>
    </section>
  )
}
