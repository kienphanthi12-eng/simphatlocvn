import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, ChevronRight } from "lucide-react"
import { Suspense } from "react"
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
      <div className="lacquer relative overflow-hidden border-b-4 border-gold-deep shadow-2xl">
        <div className="absolute inset-0 bg-oriental-subtle opacity-20 pointer-events-none mix-blend-color-burn" />
        <div className="absolute inset-0 flex justify-center opacity-10 pointer-events-none mix-blend-overlay">
          <img src="/royal_decorations.png" alt="" className="h-full object-cover scale-150" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-deep/10 to-transparent" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold/10 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gold/10 rounded-full blur-lg" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16 z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-deep/15 border border-gold-deep/30 mb-2 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold-soft">Tính điểm Kinh Dịch hoàng gia</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-wide text-gold-shimmer font-serif drop-shadow-md" style={{ fontFamily: "var(--font-serif)" }}>
              Sim Phong Thủy Vinaphone
            </h1>
            
            <p className="text-gold-soft/90 text-sm md:text-base font-medium max-w-xl leading-relaxed mt-2">
              Tầm long khai bản mệnh. Tra cứu ngay sim Vinaphone hợp phong thủy theo ngày sinh để kích hoạt vượng khí, rước lộc chiêu tài.
            </p>
          </div>

          <div className="flex flex-row md:flex-col justify-center gap-3 w-full md:w-auto shrink-0 flex-wrap">
            {[
              { label: "Kho sim hợp mệnh", value: "5.000+" },
              { label: "Bảng luận phong thủy", value: "12 Loại" },
              { label: "Chuẩn điểm đại cát", value: "10/10" },
            ].map(stat => (
              <div key={stat.label} className="flex-1 md:flex-none flex items-center gap-4 bg-crimson-deep/40 border border-gold-deep/30 rounded-xl px-4 md:px-6 py-3 shadow-inner backdrop-blur-sm group hover:bg-gold-deep/15 transition-all cursor-default">
                <div className="hidden sm:flex h-10 w-10 shrink-0 rounded-full bg-gold-deep/20 items-center justify-center border border-gold-deep/40 group-hover:scale-110 group-hover:bg-gold-deep/40 transition-all duration-300">
                  <span className="text-sm font-black text-gold">✦</span>
                </div>
                <div className="text-center sm:text-left w-full">
                  <p className="text-lg md:text-xl font-black font-sans leading-none tracking-wide text-white drop-shadow-sm">{stat.value}</p>
                  <p className="text-[9px] md:text-[10px] text-gold-soft/80 font-bold uppercase tracking-widest mt-1.5">{stat.label}</p>
                </div>
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

      {/* Page Content — Suspense required for useSearchParams() */}
      <div className="bg-background min-h-screen py-6">
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-2 border-gold-deep border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs uppercase tracking-[0.3em] gold-text">Đang khai quẻ…</p>
              </div>
            </div>
          }
        >
          <SimPhongThuyClient />
        </Suspense>
      </div>
    </>
  )
}
