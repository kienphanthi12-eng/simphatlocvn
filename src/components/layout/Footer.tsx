import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-ink text-gold-soft/80 pt-16 pb-8 border-t border-gold-deep/20 relative overflow-hidden">
      {/* Subtle traditional clouds watermark pattern inside the footer */}
      <div className="absolute inset-0 bg-cloud-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Cột 1: Logo + Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gold-deep/60 shadow-xs bg-white flex items-center justify-center">
                <img src="/logo.png" alt="Sim Phát Lộc Logo" className="h-full w-full object-cover scale-[1.05]" />
              </div>
              <h3 className="text-xl font-black text-gold-soft font-display tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                <span className="text-gold">Long</span> Phụng
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-gold-soft/60 font-medium">
              Nơi hội tụ tinh hoa phong thủy truyền thống Việt Nam. Chúng tôi tuyển chọn hàng ngàn SIM số đẹp Vinaphone Đại Cát, mang lại vạn sự hanh thông, tài lộc hưng thịnh và đẳng cấp di sản bền vững cho quý chủ nhân.
            </p>
          </div>

          {/* Cột 2: Sản phẩm */}
          <div>
            <h4 className="text-gold font-sans font-extrabold text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-gold-deep/20 pb-2">
              Sản phẩm
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/sims?type=TAM_HOA" className="hover:text-gold text-gold-soft/60 transition">Sim Tam Hoa</Link></li>
              <li><Link href="/sims?type=TU_QUY" className="hover:text-gold text-gold-soft/60 transition">Sim Tứ Quý</Link></li>
              <li><Link href="/sims?type=LOC_PHAT" className="hover:text-gold text-gold-soft/60 transition">Sim Lộc Phát</Link></li>
              <li><Link href="/sims?type=TIEN_LEN" className="hover:text-gold text-gold-soft/60 transition">Sim Tiến Lên</Link></li>
              <li><Link href="/sims?type=NAM_SINH" className="hover:text-gold text-gold-soft/60 transition">Sim Năm Sinh</Link></li>
            </ul>
          </div>

          {/* Cột 3: Dịch vụ */}
          <div>
            <h4 className="text-gold font-sans font-extrabold text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-gold-deep/20 pb-2">
              Dịch vụ
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/sim-phong-thuy" className="hover:text-gold text-gold-soft/60 transition">Tra cứu phong thủy</Link></li>
              <li><Link href="/sim-phong-thuy" className="hover:text-gold text-gold-soft/60 transition">Kiểm tra quẻ dịch</Link></li>
              <li><Link href="/sims" className="hover:text-gold text-gold-soft/60 transition">Định giá sim số</Link></li>
              <li><Link href="/sims" className="hover:text-gold text-gold-soft/60 transition">Hướng dẫn đặt thỉnh</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-gold font-sans font-extrabold text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-gold-deep/20 pb-2">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-xs font-medium text-gold-soft/60">
              <li>📍 Số 68, Đường Trần Phú, Ba Đình, Hà Nội</li>
              <li>📞 Hotline: <span className="text-gold font-bold font-mono">0914 123 456</span></li>
              <li>💬 Zalo hỗ trợ: 0914 123 456</li>
              <li>⏰ Giờ làm việc: 8:00 - 21:00 mỗi ngày</li>
            </ul>
          </div>

        </div>

        {/* Ornate Divider at the end */}
        <div className="ornate-divider" />

        <div className="pt-2 text-center text-xs text-gold-soft/40 font-medium font-sans uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Long Phụng Sim Phong Thủy - Hoàng Gia Di Sản. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}
