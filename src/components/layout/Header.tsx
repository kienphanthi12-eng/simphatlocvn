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
    <header className="sticky top-0 z-50 bg-white/95 border-b border-amber-200/50 shadow-sm backdrop-blur-md">
      {/* Top bar */}
      <div className="bg-burgundy-gradient text-white border-b border-red-950/20 shadow-inner">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2.5 text-xs font-bold tracking-wide">
          <div className="flex items-center gap-2 text-amber-200">
            <Phone className="h-3.5 w-3.5" />
            <span className="font-mono">0914.123.456</span>
          </div>
          <p className="hidden md:flex text-amber-100/90 font-medium">
            {"Chuyên Sim Vinaphone số đẹp - Đẳng Cấp Hoàng Gia Việt Nam"}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <span className="hidden sm:inline">Trang đại lý</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 gap-4">
        {/* Imperial Seal Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="h-11 w-11 bg-burgundy-gradient flex items-center justify-center shrink-0 rounded-lg relative shadow-md border-2 border-amber-400">
            {/* Elegant inner square borders representing a Royal Seal */}
            <div className="absolute inset-0.5 border border-amber-300/40 rounded-xs pointer-events-none" />
            {/* Royal Gold Crest Emblem */}
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-amber-900 leading-tight font-display tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              Sim Phát Lộc
            </h1>
            <p className="text-[9px] text-amber-800/80 font-bold uppercase tracking-wider leading-none">
              Hoàng Gia Di Sản
            </p>
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md items-center mx-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-amber-800/70" />
          <Input
            type="search"
            placeholder="Tìm sim... VD: 0914, *8888"
            className="h-10 pl-9 pr-24 rounded-lg border-amber-200/50 bg-amber-50/20 text-sm w-full focus:border-amber-400 focus:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-burgundy-gradient text-white hover:bg-red-800 text-xs h-8 font-bold border border-red-950/15"
          >
            Tìm kiếm
          </Button>
        </form>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3.5 py-2 rounded-lg text-sm font-bold text-slate-700 hover:text-red-800 hover:bg-amber-50/40 transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:0914123456"
            className="hidden xl:flex items-center gap-2 bg-burgundy-gradient text-white px-4 py-2 rounded-lg text-sm font-extrabold shadow-sm hover:shadow-md transition-all border border-red-950/20"
          >
            <Phone className="h-4 w-4" />
            0914.123.456
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors text-red-800"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-amber-200/50 bg-white px-4 pb-6 shadow-lg absolute w-full left-0 z-50 bg-parchment" aria-label="Mobile navigation">
          <form onSubmit={handleSearch} className="relative mt-4 mb-3 flex items-center">
            <Input
              type="text"
              placeholder="Tìm sim..."
              className="w-full pr-24 rounded-lg border-amber-200 bg-amber-50/10 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs bg-burgundy-gradient text-white border border-red-950/15"
            >
              Tìm kiếm
            </Button>
          </form>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-bold text-slate-700 hover:text-red-800 border-b border-amber-100/50 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:0914123456"
            className="mt-4 flex items-center justify-center gap-2 bg-burgundy-gradient text-white px-4 py-2.5 rounded-lg text-sm font-extrabold border border-red-950/20"
          >
            <Phone className="h-4 w-4" />
            0914.123.456
          </a>
        </nav>
      )}
    </header>
  )
}
