import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, ChevronRight } from "lucide-react"
import { SimPhongThuyClient } from "@/components/sim/SimPhongThuyClient"

export const metadata: Metadata = {
  title: "Sim Phong Thủy Vinaphone — Tìm Sim Hợp Mệnh | Sim Phát Lộc",
  description:
    "Tìm sim Vinaphone hợp mệnh, hợp phong thủy theo năm sinh. Hàng ngàn sim phong thủy Thần Tài, Lộc Phát, Tam Hoa, Tứ Quý được tính điểm phong thủy chi tiết.",
  keywords: ["sim phong thủy", "sim hợp mệnh", "sim vinaphone phong thủy", "sim thần tài", "sim lộc phát"],
}

export default function SimPhongThuyPage() {
  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[#1a56db] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute top-4 right-24 w-24 h-24 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Sim Phong Thủy Vinaphone
              </h1>
              <p className="text-white/70 text-sm mt-0.5">
                Tìm sim hợp mệnh theo ngày sinh — Tính điểm phong thủy tự động
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-5">
            {[
              { label: "Sim hợp mệnh", value: "5.000+" },
              { label: "Loại phong thủy", value: "12 loại" },
              { label: "Điểm tối đa", value: "10/10" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-lg px-4 py-2 text-white text-center min-w-[100px]">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-[#1a56db] transition-colors">Trang chủ</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Sim Phong Thủy</span>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-background min-h-screen py-6">
        <SimPhongThuyClient />
      </div>
    </>
  )
}
