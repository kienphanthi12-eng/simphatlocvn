"use client"

import Link from "next/link"
import { Phone, Menu, X, Search, ChevronDown, Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Trang Chủ", href: "/" },
  { label: "Sim Phong Thủy", href: "/sim-phong-thuy" },
  { label: "Định Giá Sim", href: "/dinh-gia-sim" },
  { label: "Sim Theo Giá", href: "/sims?sort=price_asc" },
  { label: "Tin Tức", href: "#" },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/sims?search=${encodeURIComponent(searchQuery)}`)
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/85 border-b border-gold-deep/30 shadow-xs backdrop-blur-md">
      {/* Top bar */}
      <div className="lacquer border-b border-gold-deep/20 shadow-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2.5 text-[10px] font-sans uppercase tracking-[0.25em]">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span className="font-mono">0914.123.456</span>
          </div>
          <p className="hidden md:flex font-medium text-gold-soft/90">
            {"Chuyên Sim Vinaphone số đẹp – Đẳng Cấp Hoàng Gia"}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hover:text-gold transition-colors flex items-center gap-1">
              <span>Trang đại lý</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 gap-4">
        {/* Imperial Seal Logo */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
          <div className="h-[52px] w-[52px] shrink-0 rounded-xl overflow-hidden border-2 border-gold-deep/80 shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-[1.05] relative bg-gradient-to-br from-[#7F1D1D] to-[#4a0e0e]">
            {/* Inner gold frame */}
            <div className="absolute inset-[3px] rounded-lg border border-gold-deep/50" />
            {/* Character */}
            <span className="relative z-10 text-[26px] font-black leading-none" style={{ fontFamily: "var(--font-display)", color: "#C9A84C", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              發
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-display font-black text-crimson" style={{ fontFamily: "var(--font-display)" }}>發祿</span>
              <span className="text-sm md:text-base font-serif font-black tracking-wide text-crimson group-hover:text-gold-deep transition-colors duration-300" style={{ fontFamily: "var(--font-serif)" }}>SIM Phát Lộc</span>
            </div>
            <p className="text-[10px] text-gold-deep font-sans font-bold uppercase tracking-[0.22em] mt-1 leading-none">
              Sim Phong Thủy
            </p>
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md items-center mx-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold-deep/70" />
          <Input
            type="search"
            placeholder="Tìm sim... VD: 0914, *8888"
            className="h-10 pl-9 pr-24 rounded-lg border-gold-deep/30 bg-parchment text-sm w-full focus:border-gold-deep"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-crimson text-gold-soft hover:bg-crimson-deep text-[10px] uppercase tracking-[0.15em] h-8 font-bold border border-gold-deep"
          >
            Tra cứu
          </Button>
        </form>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 shrink-0" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative py-2 text-[10px] font-sans font-extrabold uppercase tracking-[0.25em] text-ink hover:text-crimson transition-colors group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold-deep transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:0914123456"
            className="hidden xl:flex items-center gap-2 bg-crimson text-gold-soft px-4 py-2 rounded-lg text-[10px] font-sans font-bold uppercase tracking-[0.25em] shadow-sm hover:shadow-md transition-all border border-gold-deep"
          >
            <Phone className="h-4 w-4" />
            0914.123.456
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gold-soft/40 transition-colors text-crimson"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav 
        className={`md:hidden border-t border-gold-deep/20 px-4 pb-6 shadow-lg absolute w-full left-0 z-50 bg-parchment transition-all duration-300 ease-in-out origin-top transform ${
          mobileOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`} 
        aria-label="Mobile navigation"
      >
        <form onSubmit={handleSearch} className="relative mt-4 mb-3 flex items-center">
          <Input
            type="text"
            placeholder="Tìm sim..."
            className="w-full pr-24 rounded-lg border-gold-deep/30 bg-parchment focus:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs bg-crimson text-gold-soft border border-gold-deep"
          >
            Tra cứu
          </Button>
        </form>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className="block py-3 text-[10px] font-sans font-extrabold uppercase tracking-[0.2em] text-ink hover:text-crimson border-b border-gold-deep/10 last:border-b-0 transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
        <a
          href="tel:0914123456"
          className="mt-4 flex items-center justify-center gap-2 bg-crimson text-gold-soft px-4 py-2.5 rounded-lg text-[10px] font-sans font-bold uppercase tracking-[0.2em] border border-gold-deep interactive-tap"
        >
          <Phone className="h-4 w-4" />
          0914.123.456
        </a>
      </nav>
    </header>
  )
}
