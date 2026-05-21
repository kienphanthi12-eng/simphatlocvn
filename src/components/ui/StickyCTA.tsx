"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { formatPhone, formatPrice } from "@/lib/utils"
import { useEffect, useState } from "react"

interface Props {
  phone: string
  price: number
}

export function StickyCTA({ phone, price }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-parchment border-t border-gold-deep/40 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-muted-foreground font-medium truncate">Sim {formatPhone(phone)}</p>
          <p className="text-base font-black text-crimson leading-tight">{formatPrice(price)}</p>
        </div>
        <Link
          href={`/checkout?phone=${phone}`}
          className="lacquer border border-gold-deep rounded-xl px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-soft flex items-center gap-2 shrink-0 shadow-lg"
        >
          <ShoppingCart className="h-4 w-4" />
          Đặt mua
        </Link>
      </div>
    </div>
  )
}
