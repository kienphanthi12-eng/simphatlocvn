"use client"

import Link from "next/link"
import { Search, Menu, X, MessageCircle, MapPin, Clock } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/sims?search=${encodeURIComponent(searchQuery)}`)
      setIsMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Sim số đẹp", href: "/sims" },
    { name: "Sim theo giá", href: "/sims?sort=price_asc" },
  ]

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#005BAC] text-white h-8 hidden md:block">
        <div className="container mx-auto px-4 h-full flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-90"><MapPin size={14} /> Số 68, Đường Trần Phú, Ba Đình, HN</span>
            <span className="flex items-center gap-1.5 opacity-90"><Clock size={14} /> 8:00 - 21:00 (T2-CN)</span>
          </div>
          <div className="flex items-center gap-4 opacity-90 font-medium">
            <Link href="/contact" className="hover:text-blue-100 transition">Liên hệ</Link>
            <Link href="/policy" className="hover:text-blue-100 transition">Chính sách</Link>
            <Link href="/admin" className="hover:text-blue-100 transition">Đại lý</Link>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start mr-8 shrink-0">
              <span className="text-[26px] font-[800] tracking-tight leading-none"><span className="text-[#005BAC]">Sim</span> <span className="text-[#0F172A]">Phát Lộc</span></span>
              <span className="text-[11px] font-[400] text-[#64748B] tracking-[1px] uppercase mt-1.5">
                Chuyên Vinaphone
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Tìm số Vinaphone... VD: 0914, *8888, 0914*9999"
                  className="w-full pl-5 pr-12 py-2.5 bg-[#F1F5F9] border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-[#005BAC] focus:ring-1 focus:ring-[#005BAC] transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#005BAC] hover:text-[#004A8F]"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Desktop Hotline */}
            <div className="hidden md:flex flex-col items-end shrink-0 ml-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#005BAC] flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#64748B] font-[600] uppercase tracking-wide">Hotline 24/7</p>
                  <p style={{ fontFamily: 'var(--font-display)' }} className="text-[22px] font-[800] tracking-[0.5px] text-[#005BAC] leading-none mt-0.5">0914 123 456</p>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#005BAC]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 py-3 border-t border-[#F1F5F9]">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[13.5px] font-[500] text-[#334155] hover:text-[#005BAC] hover:font-[700] transition"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 absolute w-full shadow-lg">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Tìm sim..."
                className="w-full pl-4 pr-10 py-2 border-2 border-[#005BAC] rounded-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#005BAC]">
                <Search size={20} />
              </button>
            </form>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="font-medium text-gray-700 block pb-2 border-b border-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-[#005BAC]">Hotline: 0914 123 456</span>
                <a href="https://zalo.me/0914123456" className="text-blue-500 font-medium flex items-center gap-1">
                  <MessageCircle size={18} /> Zalo
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
