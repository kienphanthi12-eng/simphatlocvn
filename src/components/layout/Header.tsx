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
    <header className="sticky top-0 z-50 bg-white/95 border-b border-[#E5DCCB]/60 shadow-xs backdrop-blur-md">
      {/* Top bar */}
      <div className="bg-[#5C1D24] text-white border-b border-red-950/20 shadow-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2.5 text-xs font-bold tracking-wide">
          <div className="flex items-center gap-2 text-[#B3925F]">
            <Phone className="h-3.5 w-3.5" />
            <span className="font-mono">0914.123.456</span>
          </div>
          <p className="hidden md:flex text-amber-100/90 font-medium">
            {"Chuyên Sim Vinaphone số đẹp - Đẳng Cấp Hoàng Gia Việt Nam"}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hover:text-[#B3925F] transition-colors flex items-center gap-1">
              <span className="hidden sm:inline">Trang đại lý</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 gap-4">
        {/* Imperial Seal Logo */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
          <div className="h-[52px] w-[52px] shrink-0 rounded-xl overflow-hidden border border-[#B3925F]/60 shadow-md shadow-[#B3925F]/10 relative bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-[1.05] group-hover:border-[#B3925F] group-hover:shadow-lg group-hover:shadow-[#B3925F]/15">
            <img src="/logo.png" alt="Sim Phát Lộc Logo" className="h-full w-full object-cover scale-[1.08] transition-transform duration-500 group-hover:scale-[1.12]" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-[25px] font-black leading-none font-display tracking-wide flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-[#B3925F] transition-colors duration-300 group-hover:text-[#5C1D24]">Sim</span>
              <span className="text-[#5C1D24] transition-colors duration-300 group-hover:text-[#B3925F]">Phát Lộc</span>
            </h1>
            <p className="text-[9.5px] text-[#8C6D41] font-extrabold uppercase tracking-[0.22em] mt-1.5 leading-none transition-all duration-300 group-hover:tracking-[0.25em]">
              Hoàng Gia Di Sản
            </p>
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md items-center mx-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8C6D41]/70" />
          <Input
            type="search"
            placeholder="Tìm sim... VD: 0914, *8888"
            className="h-10 pl-9 pr-24 rounded-lg border-amber-200/50 bg-[#FBF9F6] text-sm w-full focus:border-[#B3925F] focus:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-[#5C1D24] text-white hover:bg-[#451217] text-xs h-8 font-bold border border-red-950/15"
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
              className="px-3.5 py-2 rounded-lg text-sm font-bold text-slate-700 hover:text-[#5C1D24] hover:bg-amber-50/40 transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:0914123456"
            className="hidden xl:flex items-center gap-2 bg-[#5C1D24] text-white px-4 py-2 rounded-lg text-sm font-extrabold shadow-sm hover:shadow-md transition-all border border-red-950/20"
          >
            <Phone className="h-4 w-4" />
            0914.123.456
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors text-[#5C1D24]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[#E5DCCB]/60 bg-white px-4 pb-6 shadow-lg absolute w-full left-0 z-50 bg-[#FBF9F6]" aria-label="Mobile navigation">
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
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs bg-[#5C1D24] text-white border border-red-950/15"
            >
              Tìm kiếm
            </Button>
          </form>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-bold text-slate-700 hover:text-[#5C1D24] border-b border-amber-100/50 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:0914123456"
            className="mt-4 flex items-center justify-center gap-2 bg-[#5C1D24] text-white px-4 py-2.5 rounded-lg text-sm font-extrabold border border-red-950/20"
          >
            <Phone className="h-4 w-4" />
            0914.123.456
          </a>
        </nav>
      )}
    </header>
  )
}
