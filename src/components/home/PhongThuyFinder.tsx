"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function PhongThuyFinder() {
  const router = useRouter()
  const [namSinh, setNamSinh] = useState("")
  const [gioiTinh, setGioiTinh] = useState("nam")
  const [gioSinh, setGioSinh] = useState("all")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!namSinh) return
    const qs = new URLSearchParams({
      namSinh,
      gioiTinh,
      gioSinh,
    })
    router.push(`/sim-phong-thuy?${qs.toString()}`)
  }

  return (
    <section className="corner-ornament border border-gold-deep/50 border-imperial bg-parchment/95 p-8 md:p-12 max-w-4xl mx-auto rounded-xl relative z-20 shadow-2xl mt-[-4rem]">
      {/* Decorative center logo emblem watermark */}
      <div className="absolute inset-0 bg-cloud-pattern opacity-[0.015] pointer-events-none" />
      
      <div className="text-center mb-8 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.4em] gold-text font-sans font-bold">Kinh Dịch – Du Niên</span>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-crimson mt-2 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          Tầm Long Khai Bản Mệnh
        </h2>
        <div className="flex justify-center">
          <span className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-deep to-transparent" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative z-10">
        {/* Input 1: Năm sinh */}
        <div className="flex flex-col space-y-2">
          <label className="text-[10px] uppercase tracking-[0.25em] gold-text font-sans font-bold">Năm sinh dương lịch</label>
          <input
            type="number"
            required
            min="1950"
            max="2030"
            placeholder="VD: 1995"
            value={namSinh}
            onChange={(e) => setNamSinh(e.target.value)}
            className="w-full bg-transparent border-b-2 border-gold-deep/30 focus:border-gold-deep text-ink text-lg font-serif py-2 outline-none transition-colors placeholder:text-ink/30"
          />
        </div>

        {/* Input 2: Giới tính */}
        <div className="flex flex-col space-y-2">
          <label className="text-[10px] uppercase tracking-[0.25em] gold-text font-sans font-bold">Bản mệnh giới tính</label>
          <select
            value={gioiTinh}
            onChange={(e) => setGioiTinh(e.target.value)}
            className="w-full bg-transparent border-b-2 border-gold-deep/30 focus:border-gold-deep text-ink text-lg font-serif py-2 outline-none transition-colors cursor-pointer"
          >
            <option value="nam" className="bg-parchment text-ink">Nam Mệnh</option>
            <option value="nu" className="bg-parchment text-ink">Nữ Mệnh</option>
          </select>
        </div>

        {/* Input 3: Giờ sinh */}
        <div className="flex flex-col space-y-2">
          <label className="text-[10px] uppercase tracking-[0.25em] gold-text font-sans font-bold">Giờ sinh linh khí</label>
          <select
            value={gioSinh}
            onChange={(e) => setGioSinh(e.target.value)}
            className="w-full bg-transparent border-b-2 border-gold-deep/30 focus:border-gold-deep text-ink text-lg font-serif py-2 outline-none transition-colors cursor-pointer"
          >
            <option value="all" className="bg-parchment text-ink">Chưa rõ (Giờ Đạo)</option>
            <option value="0" className="bg-parchment text-ink">Tý (23h - 1h)</option>
            <option value="2" className="bg-parchment text-ink">Sửu (1h - 3h)</option>
            <option value="4" className="bg-parchment text-ink">Dần (3h - 5h)</option>
            <option value="6" className="bg-parchment text-ink">Mão (5h - 7h)</option>
            <option value="8" className="bg-parchment text-ink">Thìn (7h - 9h)</option>
            <option value="10" className="bg-parchment text-ink">Tỵ (9h - 11h)</option>
            <option value="12" className="bg-parchment text-ink">Ngọ (11h - 13h)</option>
            <option value="14" className="bg-parchment text-ink">Mùi (13h - 15h)</option>
            <option value="16" className="bg-parchment text-ink">Thân (15h - 17h)</option>
            <option value="18" className="bg-parchment text-ink">Dậu (17h - 19h)</option>
            <option value="20" className="bg-parchment text-ink">Tuất (19h - 21h)</option>
            <option value="22" className="bg-parchment text-ink">Hợi (21h - 23h)</option>
          </select>
        </div>

        {/* Submit CTA Button */}
        <div className="md:col-span-3 flex justify-center mt-6">
          <button
            type="submit"
            className="lacquer border border-gold-deep px-10 py-3.5 rounded-lg text-xs font-sans font-bold uppercase tracking-[0.3em] shadow-lg transition-transform hover:scale-[1.03]"
          >
            Khai Quẻ Tìm Sim
          </button>
        </div>
      </form>
    </section>
  )
}
