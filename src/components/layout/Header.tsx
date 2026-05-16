"use client"

import Link from "next/link"
import { Search, Menu, X, MessageCircle } from "lucide-react"
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
    { name: "Liên hệ", href: "/contact" },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start">
            <span className="text-2xl font-bold text-[#0066CC]">Sim Phát Lộc</span>
            <span className="text-xs font-semibold bg-[#0066CC] text-white px-2 py-0.5 rounded-full mt-1">
              Chuyên Vinaphone
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm số Vinaphone... VD: 0914, *8888, 0914*9999"
                className="w-full pl-4 pr-10 py-2.5 border-2 border-[#0066CC] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0066CC]"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Desktop Hotline & Nav */}
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Hotline tư vấn</p>
                <p className="text-lg font-bold text-[#0066CC]">0914 123 456</p>
              </div>
              <a 
                href="https://zalo.me/0914123456" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#0066CC]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="font-medium text-gray-700 hover:text-[#0066CC] transition"
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
              className="w-full pl-4 pr-10 py-2 border-2 border-[#0066CC] rounded-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0066CC]">
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
              <span className="font-bold text-[#0066CC]">Hotline: 0914 123 456</span>
              <a href="https://zalo.me/0914123456" className="text-blue-500 font-medium flex items-center gap-1">
                <MessageCircle size={18} /> Zalo
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
