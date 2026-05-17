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
      <div className="bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] relative overflow-hidden border-b-2 border-amber-500/25 shadow-sm">
        {/* Subtle traditional clouds watermark pattern inside the banner */}
        <div className="absolute inset-0 bg-cloud-pattern opacity-[0.03] pointer-events-none" />
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/[0.03] rounded-full blur-xl" />
          <div className="absolute top-4 right-24 w-24 h-24 bg-amber-500/[0.03] rounded-full blur-md" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-500/[0.03] rounded-full blur-lg" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 z-10">
          <div className="flex items-center gap-4.5 mb-3">
            <div className="h-11 w-11 bg-amber-500/20 border border-amber-400/40 rounded-xl flex items-center justify-center shadow-inner">
              <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display" style={{ fontFamily: "var(--font-display)" }}>
                Sim Phong Thủy Vinaphone
              </h1>
              <p className="text-amber-100/90 text-sm mt-0.5 font-medium">
                Tìm sim hợp mệnh theo ngày sinh — Tính điểm phong thủy tự động
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: "Sim hợp mệnh", value: "5.000+" },
              { label: "Loại phong thủy", value: "12 loại" },
              { label: "Điểm tối đa", value: "10/10" },
            ].map(stat => (
              <div key={stat.label} className="bg-amber-950/20 border border-amber-500/25 rounded-xl px-5 py-2.5 text-white text-center min-w-[110px] shadow-inner backdrop-blur-xs">
                <p className="text-xl font-black font-mono leading-none tracking-wide text-amber-300">{stat.value}</p>
                <p className="text-[10px] text-amber-200/90 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-amber-50/15 border-b border-amber-200/20">
        <div className="mx-auto max-w-7xl px-6 py-2.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-red-800 font-bold transition-colors">Trang chủ</Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-800 font-bold">Sim Phong Thủy</span>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-background min-h-screen py-6">
        <SimPhongThuyClient />
      </div>
    </>
  )
}
