import prisma from "@/lib/db"
import Link from "next/link"
import { Suspense } from "react"
import { SimCard } from "@/components/ui/SimCard"
import { PhongThuyFinder } from "@/components/home/PhongThuyFinder"

export default async function HomePage() {
  const [featuredSims, newestSims] = await Promise.all([
    prisma.sim.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: "desc" }
    }),
    prisma.sim.findMany({
      take: 6,
      orderBy: { createdAt: "desc" }
    })
  ])

  const categories = [
    { num: "壹", title: "Sim Tam Hoa", desc: "Đại diện cho sự vững chãi, tam tài cát tường phú quý hội tụ.", href: "/sims?type=TAM_HOA" },
    { num: "貳", title: "Sim Tứ Quý", desc: "Bốn mùa no ấm, hưng thịnh vẹn tròn trường tồn cùng thời gian.", href: "/sims?type=TU_QUY" },
    { num: "參", title: "Sim Lộc Phát", desc: "Kích hoạt cung tài lộc, kinh doanh đắc lợi cát khánh vạn sự.", href: "/sims?type=LOC_PHAT" },
    { num: "肆", title: "Sim Tiến Lên", desc: "Thăng tiến không ngừng, công danh hiển đạt vững bước tương lai.", href: "/sims?type=TIEN_LEN" },
    { num: "伍", title: "Sim Thần Tài", desc: "Thần tài gõ cửa, rước lộc chiêu tài kinh doanh hưng thịnh.", href: "/sims?type=THAN_TAI" },
    { num: "陸", title: "Sim Năm Sinh", desc: "Lưu giữ khoảnh khắc bản mệnh, gia đạo an khang hanh thông cát tường.", href: "/sims?type=NAM_SINH" },
  ]

  const commitments = [
    { char: "信", title: "Chữ Tín Hàng Đầu", desc: "Cam kết uy tín tuyệt đối trong từng giao dịch và thủ tục chuyển chủ sở hữu." },
    { char: "實", title: "Giá Trị Đích Thực", desc: "Mức giá tối ưu, phản ánh đúng giá trị phong thủy và độ quý hiếm của SIM." },
    { char: "誠", title: "Phục Vụ Thành Tâm", desc: "Tư vấn tận tình từ tâm, khai mở mệnh lý phong thủy chính xác cho gia chủ." },
    { char: "安", title: "Giao Dịch An Toàn", desc: "Giao SIM tận tay miễn phí, thanh toán an toàn tiện lợi trên toàn quốc." },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-serif">
      {/* Background clouds pattern overlay for the entire homepage */}
      <div className="absolute inset-0 bg-cloud-pattern opacity-[0.03] pointer-events-none z-0" />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-32 text-center overflow-hidden z-10">
        {/* Background Image with object-cover */}
        <div className="absolute inset-0 z-0">
          <img
            src="/dragon-phoenix-hero.jpg"
            alt="SIM Phát Lộc - Hoàng Gia Cát Tường"
            className="w-full h-full object-cover"
          />
          {/* Imperial Crimson deep-to-soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-crimson-deep/65 via-crimson-deep/85 to-parchment" />
        </div>

        {/* Floating Emblems (Hidden on Mobile) */}
        <div className="hidden md:block absolute left-12 lg:left-24 top-1/3 w-[160px] h-[160px] opacity-85 animate-float pointer-events-none z-10">
          <img src="/dragon-emblem.png" alt="Rồng Emblem" className="w-full h-full object-contain" />
        </div>
        <div className="hidden md:block absolute right-12 lg:right-24 top-1/3 w-[160px] h-[160px] opacity-85 animate-float pointer-events-none z-10" style={{ animationDelay: "2s" }}>
          <img src="/phoenix-emblem.png" alt="Phượng Emblem" className="w-full h-full object-contain" />
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-5xl px-4 relative z-20 space-y-6">
          <div className="inline-block border border-gold/60 px-4 py-1.5 rounded bg-crimson-deep/40">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-bold leading-none">
              Phát Lộc Hưng Thịnh – Cát Tường Như Ý
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl text-gold-shimmer font-display font-black leading-none py-2" style={{ fontFamily: "var(--font-display)" }}>
            發祿吉祥
          </h1>

          <p className="text-2xl md:text-3xl font-serif italic text-gold-soft tracking-widest">
            Phát Lộc Cát Tường
          </p>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-gold-soft/80 leading-relaxed font-sans font-medium">
            Khai mở linh khí, thỉnh SIM hoàng gia đệ nhất cát tường. Nơi tinh hoa phong thủy và số đẹp trùng phùng, đem lại phú quý thịnh vượng bền vững cho quý chủ nhân.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/sims"
              className="lacquer border border-gold-deep px-8 py-3.5 rounded-lg text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] shadow-lg transition-transform hover:scale-[1.05]"
            >
              Thỉnh Sim Cát Tường
            </Link>
            <Link
              href="/sim-phong-thuy"
              className="border border-gold text-gold hover:bg-gold-deep/15 px-8 py-3.5 rounded-lg text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] transition-all"
            >
              Khai Quẻ Phong Thủy
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PHONG THỦY FINDER WIDGET */}
      <div className="mx-auto max-w-7xl px-4 relative z-30">
        <PhongThuyFinder />
      </div>

      {/* 3. CATEGORIES SECTION (LỤC PHẨM SIM QUÝ) */}
      <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] gold-text font-sans font-bold">Danh Mục Tuyển Chọn</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-crimson mt-2 mb-4">Lục Phẩm Sim Quý</h2>
          <div className="ornate-divider max-w-md mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="corner-ornament border border-gold-deep/40 bg-parchment/40 p-8 rounded-xl block transition-all duration-300 hover:border-gold hover:bg-parchment group relative overflow-hidden"
            >
              {/* Large ancient Chinese number background */}
              <div className="absolute right-4 bottom-2 text-8xl font-black font-display text-gold-deep/20 transition-all duration-500 group-hover:text-gold-deep/40 group-hover:scale-110 pointer-events-none select-none">
                {cat.num}
              </div>

              <h3 className="text-lg font-serif font-extrabold text-crimson mb-3 group-hover:text-crimson-deep transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground/80 font-sans font-medium pr-12">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SIM LIST SECTION (TUYỂN TẬP SIM QUÝ) */}
      <section className="py-24 max-w-7xl mx-auto px-4 bg-parchment/30 rounded-3xl border border-gold-deep/10 my-12 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] gold-text font-sans font-bold">Cát Tường Linh Số</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-crimson mt-2 mb-4">Tuyển Tập Sim Quý</h2>
          <div className="ornate-divider max-w-md mx-auto" />

          {/* Simple Navigation filter buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <button className="lacquer border border-gold-deep px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.15em] shadow-sm">
              Tất Cả
            </button>
            <Link href="/sims?type=TAM_HOA" className="border border-gold-deep/30 bg-parchment text-ink hover:text-crimson px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.15em] transition-colors">
              Tam Hoa
            </Link>
            <Link href="/sims?type=TU_QUY" className="border border-gold-deep/30 bg-parchment text-ink hover:text-crimson px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.15em] transition-colors">
              Tứ Quý
            </Link>
            <Link href="/sims?type=LOC_PHAT" className="border border-gold-deep/30 bg-parchment text-ink hover:text-crimson px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.15em] transition-colors">
              Lộc Phát
            </Link>
          </div>
        </div>

        {/* Featured Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif font-black text-ink flex items-center gap-2">
              <span className="h-4 w-1 bg-crimson" /> Sim Nổi Bật
            </h3>
            <Link href="/sims?featured=true" className="text-xs uppercase font-sans tracking-widest font-extrabold gold-text hover:text-crimson transition-colors">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSims.map((sim) => (
              <SimCard key={sim.id} sim={sim} view="grid" />
            ))}
          </div>
        </div>

        {/* Newest Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif font-black text-ink flex items-center gap-2">
              <span className="h-4 w-1 bg-crimson" /> Sim Mới Nhất
            </h3>
            <Link href="/sims" className="text-xs uppercase font-sans tracking-widest font-extrabold gold-text hover:text-crimson transition-colors">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newestSims.map((sim) => (
              <SimCard key={sim.id} sim={sim} view="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMMITMENTS SECTION (BỐN LỜI THỆ ƯỚC) */}
      <section className="lacquer py-24 relative overflow-hidden border-t border-b border-gold-deep/30">
        {/* Subtle cloud watermark inside commitments */}
        <div className="absolute inset-0 bg-oriental-subtle opacity-10 pointer-events-none z-0" />

        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans font-bold">Cam Kết Từ Tâm</span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-gold-soft mt-2 mb-4">Bốn Lời Thệ Ước</h2>
            <div className="w-24 h-[1px] bg-gold mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {commitments.map((com, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                {/* 45deg Rotated Square Frame with inside character rotated back -45deg */}
                <div className="h-16 w-16 rotate-45 border border-gold/40 flex items-center justify-center bg-crimson-deep/40 transition-transform duration-300 hover:scale-105">
                  <span className="font-display font-black text-2xl text-gold -rotate-45 leading-none">
                    {com.char}
                  </span>
                </div>

                <h3 className="text-sm font-sans uppercase tracking-widest font-extrabold text-gold-soft pt-2">
                  {com.title}
                </h3>
                <p className="text-xs leading-relaxed text-gold-soft/75 font-sans font-medium max-w-xs">
                  {com.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
