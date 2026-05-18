"use client"

import { useState } from "react"
import { Search, Sparkles, Loader2, ShieldCheck, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ValuationResult {
  phone: string
  estimatedPrice: number
  breakdown: string[]
}

export function DinhGiaSimClient() {
  const [phone, setPhone] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<ValuationResult | null>(null)
  const [error, setError] = useState("")

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!phone || phone.length < 10) {
      setError("Vui lòng nhập số điện thoại hợp lệ (từ 10-11 số).")
      return
    }

    setIsEvaluating(true)
    setResult(null)

    try {
      const res = await fetch("/api/dinh-gia-sim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra trong quá trình định giá.")
      }

      // Giả lập thời gian loading lâu một chút để hiệu ứng AI quét trông thật hơn
      setTimeout(() => {
        setResult(data)
        setIsEvaluating(false)
      }, 1800)

    } catch (err: any) {
      setError(err.message)
      setIsEvaluating(false)
    }
  }

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)
  }

  // Format phone number (e.g. 0912 345 678)
  const formatPhone = (p: string) => {
    if (p.length === 10) {
      return `${p.slice(0,4)} ${p.slice(4,7)} ${p.slice(7)}`
    }
    return p
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Form Card */}
      <div className="bg-white/95 rounded-3xl border-gold-scroll overflow-hidden shadow-xl mb-8 relative">
        <div className="absolute inset-0 bg-oriental-subtle opacity-[0.03] pointer-events-none" />
        
        <div className="bg-burgundy-gradient text-white px-6 py-5 flex items-center justify-between border-b border-red-950/20">
          <div className="flex items-center gap-3">
            <Cpu className="h-6 w-6 text-gold-soft" />
            <h2 className="text-xl font-bold font-serif tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>Hệ Thống Định Giá Sim AI</h2>
          </div>
          <Sparkles className="h-5 w-5 text-gold-soft opacity-70 animate-pulse" />
        </div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-crimson-deep font-display mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Khám Phá Giá Trị Thực Của Sim
            </h3>
            <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">
              Nhập số sim của bạn để hệ thống AI hoàng cung phân tích phong thủy, độ hiếm đầu số và các bộ đuôi số đại cát.
            </p>
          </div>

          <form onSubmit={handleEvaluate} className="max-w-xl mx-auto space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gold-deep/70 group-focus-within:text-gold-deep transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Nhập số điện thoại (VD: 0914123456)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full h-14 pl-12 pr-4 bg-amber-50/30 border-2 border-gold-deep/30 rounded-xl text-lg font-bold text-center text-ink focus:outline-none focus:border-gold-deep focus:ring-4 focus:ring-gold-deep/10 transition-all placeholder:font-normal placeholder:text-muted-foreground"
                maxLength={11}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isEvaluating || phone.length < 10}
              className="w-full h-14 rounded-xl bg-burgundy-gradient text-gold-soft font-bold text-lg uppercase tracking-[0.15em] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {isEvaluating ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang phân tích AI...
                </span>
              ) : (
                "Định Giá Ngay"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Result Card */}
      {result && !isEvaluating && (
        <div className="bg-parchment rounded-3xl border border-gold-deep/40 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-deep opacity-60 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-deep opacity-60 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-deep opacity-60 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-deep opacity-60 rounded-br-lg pointer-events-none" />
          
          <div className="p-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="h-3.5 w-3.5" /> Thẩm định hoàn tất
            </span>
            
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Sim điện thoại</h4>
            <div className="text-4xl md:text-5xl font-black text-ink mb-6 tracking-tight font-sans">
              {formatPhone(result.phone)}
            </div>

            <div className="relative py-8">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <img src="/royal_decorations.png" alt="" className="h-32 object-contain mix-blend-multiply" />
              </div>
              <h4 className="text-sm font-bold text-gold-deep uppercase tracking-widest mb-3 relative z-10">Giá trị ước tính</h4>
              <div className="text-4xl md:text-6xl font-black text-crimson text-gold-shimmer drop-shadow-sm relative z-10 font-serif" style={{ fontFamily: "var(--font-serif)" }}>
                {formatCurrency(result.estimatedPrice)}
              </div>
            </div>

            <div className="mt-8 bg-white/60 rounded-2xl p-6 border border-amber-200/50 text-left max-w-xl mx-auto shadow-sm">
              <h5 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-4 border-b border-amber-200 pb-2">Báo cáo phân tích AI:</h5>
              <ul className="space-y-3">
                {result.breakdown.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700">
                    <span className="text-gold-deep mt-0.5">✦</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <p className="mt-6 text-xs text-slate-500 italic text-center border-t border-amber-200/50 pt-4">
                * Mức giá mang tính chất tham khảo dựa trên thuật toán thị trường và phong thủy kinh dịch. Giá thực tế có thể thay đổi tùy thuộc vào thời điểm giao dịch.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
