import prisma from "@/lib/db"
import { PaymentMethod } from "@prisma/client"
import { MessageCircle, Home, FileText, Scroll } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"

export default async function SuccessPage({ searchParams }: { searchParams: { orderCode?: string } }) {
  const resolvedParams = await Promise.resolve(searchParams)

  if (!resolvedParams.orderCode) {
    notFound()
  }

  const order = await prisma.order.findUnique({
    where: { orderCode: resolvedParams.orderCode },
    include: { sim: true },
  })

  if (!order) {
    notFound()
  }

  const isBankTransfer = order.paymentMethod === PaymentMethod.BANK_TRANSFER

  return (
    <div className="bg-parchment min-h-screen py-12 relative">
      {/* Subtle oriental bg */}
      <div className="absolute inset-0 bg-cloud-pattern opacity-[0.025] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-xl relative z-10">

        {/* Main card */}
        <div className="corner-ornament border border-gold-deep/40 bg-parchment/95 rounded-2xl shadow-2xl overflow-hidden">

          {/* Lacquer header */}
          <div className="lacquer px-8 py-6 text-center relative">
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(45deg,currentColor 0,currentColor 1px,transparent 0,transparent 50%)", backgroundSize: "8px 8px" }}
            />
            <div className="relative z-10">
              <p className="text-[9px] uppercase tracking-[0.5em] text-gold-soft/70 mb-2">Phát Lộc Viên Mãn</p>
              {/* Auspicious seal icon */}
              <div className="flex justify-center mb-3">
                <div className="relative w-16 h-16">
                  {/* Outer ring */}
                  <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full" fill="none">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="text-gold-soft/40" />
                    <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1" className="text-gold-soft/25" />
                    {/* Check mark */}
                    <polyline points="20,33 28,41 44,24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gold-soft" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-black text-gold-soft font-serif tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
                Đặt Hàng Thành Công
              </h1>
              <p className="text-gold-soft/70 text-xs mt-1 tracking-wide">大吉大利 · Đại Cát Đại Lợi</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7">

            {/* Greeting */}
            <p className="text-center text-sm text-ink/70 mb-6 leading-relaxed">
              Cảm ơn quý khách{" "}
              <strong className="text-crimson font-bold">{order.customerName}</strong>.
              {" "}Chúng tôi sẽ liên hệ trong vòng{" "}
              <span className="font-semibold text-ink">30 phút</span>{" "}
              (8:00 – 21:00) để xác nhận đơn hàng.
            </p>

            {/* Order summary card */}
            <div className="border border-gold-deep/30 rounded-xl overflow-hidden mb-6">
              {/* Card header */}
              <div className="bg-gold/10 border-b border-gold-deep/20 px-4 py-2.5 flex items-center gap-2">
                <Scroll className="h-4 w-4 text-gold-deep" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] gold-text">Thông tin đơn hàng</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gold-deep/10">
                {[
                  {
                    label: "Mã đơn hàng",
                    value: <span className="font-mono font-bold text-crimson text-sm">{order.orderCode}</span>,
                  },
                  {
                    label: "Sim đặt mua",
                    value: (
                      <div className="text-right">
                        <div className="font-black text-ink font-mono tracking-widest">{formatPhone(order.sim.phone)}</div>
                        <div className="text-[10px] text-ink/40">Vinaphone · {getSimTypeLabel(order.sim.type)}</div>
                      </div>
                    ),
                  },
                  {
                    label: "Tổng thanh toán",
                    value: <span className="font-black text-crimson text-lg">{formatPrice(order.totalAmount)}</span>,
                  },
                  {
                    label: "Hình thức nhận",
                    value: <span className="text-sm font-medium text-ink">{order.isPickup ? "🏪 Lấy tại cửa hàng" : "🚚 Giao hàng tận nơi"}</span>,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-ink/50 shrink-0">{label}</span>
                    {value}
                  </div>
                ))}
              </div>
            </div>

            {/* Bank transfer info */}
            {isBankTransfer && (
              <div className="border border-gold-deep/30 rounded-xl overflow-hidden mb-6">
                <div className="bg-gold/10 border-b border-gold-deep/20 px-4 py-2.5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] gold-text">Thông tin chuyển khoản</span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <p className="text-xs text-ink/60 mb-3">Vui lòng chuyển khoản với nội dung là <strong className="text-ink">Mã đơn hàng</strong> để chúng tôi xác nhận nhanh nhất.</p>
                  {[
                    { label: "Ngân hàng", value: "Vietcombank" },
                    { label: "Số tài khoản", value: "1234 5678 90" },
                    { label: "Chủ tài khoản", value: "NGUYEN VAN A" },
                    { label: "Nội dung CK", value: order.orderCode, highlight: true },
                    { label: "Số tiền", value: formatPrice(order.totalAmount) },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-ink/50 text-xs">{label}:</span>
                      <span className={`font-bold text-sm ${highlight ? "text-crimson bg-crimson/8 px-2 py-0.5 rounded-md font-mono" : "text-ink"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="ornate-divider my-5" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://zalo.me/0914123456"
                target="_blank"
                rel="noreferrer"
                className="flex-1 lacquer border border-gold-deep rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.25em] shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 text-gold-soft"
              >
                <MessageCircle className="h-4 w-4" />
                Chat Zalo Ngay
              </a>
              <Link
                href="/"
                className="flex-1 border border-gold-deep/30 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/70 hover:border-gold-deep/60 hover:text-ink transition-all flex items-center justify-center gap-2.5"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Link>
            </div>

          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-ink/30 tracking-widest mt-6 uppercase">
          ✦ Sim Phát Lộc · Hoàng Gia Vinaphone ✦
        </p>
      </div>
    </div>
  )
}
