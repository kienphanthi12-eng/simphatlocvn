"use client"

import Link from "next/link"
import { Phone, Menu, X, ShoppingCart, Search, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Trang Chủ", href: "/" },
  { label: "Sim Phong Thủy", href: "/sims?type=LOC_PHAT,THAN_TAI,ONG_DIA" },
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
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span className="font-semibold">0914.123.456</span>
          </div>
          <p className="hidden md:block text-primary-foreground/90 text-xs">
            {"Chuyên Sim Vinaphone số đẹp - Giao sim miễn phí toàn quốc"}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hover:text-primary-foreground/80 transition-colors flex items-center gap-1 text-xs">
              <span className="hidden sm:inline">Trang đại lý</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary leading-tight">Sim Phát Lộc</h1>
            <p className="text-[10px] text-muted-foreground leading-none">{"Chuyên Sim Vinaphone số đẹp"}</p>
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md items-center mx-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm sim... VD: 0914, *8888"
            className="h-10 pl-9 pr-24 rounded-lg border-border bg-muted/50 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8"
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
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:0914123456"
            className="hidden xl:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Phone className="h-4 w-4" />
            0914.123.456
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-primary"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-card px-4 pb-4 shadow-lg absolute w-full" aria-label="Mobile navigation">
          <form onSubmit={handleSearch} className="relative mt-4 mb-2 flex items-center">
            <Input
              type="text"
              placeholder="Tìm sim..."
              className="w-full pr-24 rounded-lg border-border bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs bg-primary text-primary-foreground"
            >
              Tìm kiếm
            </Button>
          </form>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-foreground/80 hover:text-primary border-b border-border/50 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:0914123456"
            className="mt-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            <Phone className="h-4 w-4" />
            0914.123.456
          </a>
        </nav>
      )}
    </header>
  )
}
