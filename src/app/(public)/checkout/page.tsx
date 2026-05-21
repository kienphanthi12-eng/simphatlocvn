import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import CheckoutFormClient from "./CheckoutFormClient"

export default async function CheckoutPage({ searchParams }: { searchParams: { phone?: string } }) {
  const resolvedParams = await Promise.resolve(searchParams)

  if (!resolvedParams.phone) {
    notFound()
  }

  const sim = await prisma.sim.findFirst({
    where: { phone: resolvedParams.phone },
  })

  if (!sim) {
    notFound()
  }

  return (
    <div className="bg-parchment min-h-screen py-12 relative">
      {/* Background clouds watermark */}
      <div className="absolute inset-0 bg-cloud-pattern opacity-[0.025] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.4em] gold-text font-sans font-bold">Thủ tục sở hữu</span>
          <h1 className="text-3xl font-black text-crimson mt-1 mb-2 font-serif" style={{ fontFamily: "var(--font-serif)" }}>
            Thanh Toán Đặt Hàng
          </h1>
          <div className="flex justify-center">
            <span className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gold-deep to-transparent" />
          </div>
        </div>

        <div className="corner-ornament border border-gold-deep/45 bg-parchment/95 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Sim Info Summary Header */}
          <div className="lacquer border-b border-gold-deep/30 p-6 md:p-8 text-center md:text-left md:flex justify-between items-center relative">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }}
            />
            <div className="relative z-10">
              <p className="text-[9px] uppercase tracking-[0.35em] text-gold-soft/75 mb-1">Số sim chọn mua</p>
              <div className="text-3.5xl md:text-4xl font-black text-gold-soft tracking-widest font-mono">
                {formatPhone(sim.phone)}
              </div>
              <div className="text-xs text-gold-soft/60 mt-1 font-medium">
                Vinaphone · {getSimTypeLabel(sim.type)}
              </div>
            </div>
            <div className="mt-5 md:mt-0 relative z-10 bg-crimson-deep/40 border border-gold-deep/30 rounded-xl px-6 py-3.5 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gold-soft/60 mb-0.5">Giá sở hữu</p>
              <div className="text-2xl font-black text-gold-soft">
                {formatPrice(sim.price)}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <CheckoutFormClient sim={{ id: sim.id, phone: sim.phone, price: sim.price, type: sim.type }} />
          </div>
        </div>

        <p className="text-center text-[10px] text-ink/30 tracking-widest mt-6 uppercase">
          ✦ Sim Phát Lộc · Khai Vận Hoàng Kim ✦
        </p>

      </div>
    </div>
  )
}
