import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#161211] text-slate-300 pt-16 pb-8 border-t border-[#B3925F]/20 relative overflow-hidden">
      {/* Subtle traditional clouds watermark pattern inside the footer */}
      <div className="absolute inset-0 bg-cloud-pattern opacity-[0.015] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Cột 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-[#B3925F]/40 shadow-xs bg-[#5C1D24] flex items-center justify-center">
                <img src="/logo.png" alt="Sim Phát Lộc Logo" className="h-full w-full object-cover scale-[1.05]" />
              </div>
              <h3 className="text-2xl font-black text-white font-display tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                <span className="text-[#B3925F]">Sim</span> Phát Lộc
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              Chuyên cung cấp sim Vinaphone số đẹp toàn quốc. Hàng ngàn sim cát tường hợp phong thủy, mang lại may mắn, lộc phát và sự thịnh vượng bền vững cho gia chủ.
            </p>
          </div>

          {/* Cột 2 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#B3925F]/15 pb-2">
              Thông tin liên hệ
            </h4>
            <ul className="space-y-3 text-xs font-medium text-slate-400">
              <li>📍 Số 68, Đường Trần Phú, Ba Đình, Hà Nội</li>
              <li>📞 Hotline: <span className="text-[#B3925F] font-bold font-mono">0914 123 456</span></li>
              <li>💬 Zalo hỗ trợ: 0914 123 456</li>
              <li>⏰ Giờ làm việc: 8:00 - 21:00 mỗi ngày</li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#B3925F]/15 pb-2">
              Thông tin giao dịch
            </h4>
            <ul className="space-y-3 text-xs font-medium text-slate-400">
              <li>🏦 Ngân hàng: <strong className="text-white">Vietcombank</strong></li>
              <li>💳 Số TK: <strong className="text-[#B3925F] tracking-wider font-mono">1234 5678 90</strong></li>
              <li>👤 Tên TK: <strong className="text-white">NGUYEN VAN A</strong></li>
              <li className="pt-2 text-[10px] italic text-slate-500 leading-relaxed">
                Lưu ý: Nội dung chuyển khoản vui lòng ghi số điện thoại quý khách muốn đặt mua.
              </li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#B3925F]/15 pb-2">
              Tìm kiếm nhanh
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/sims?type=TAM_HOA" className="hover:text-[#B3925F] text-slate-400 transition">Sim Tam Hoa</Link></li>
              <li><Link href="/sims?type=TU_QUY" className="hover:text-[#B3925F] text-slate-400 transition">Sim Tứ Quý</Link></li>
              <li><Link href="/sims?type=LOC_PHAT" className="hover:text-[#B3925F] text-slate-400 transition">Sim Lộc Phát</Link></li>
              <li><Link href="/sims?type=TIEN_LEN" className="hover:text-[#B3925F] text-slate-400 transition">Sim Tiến Lên</Link></li>
              <li><Link href="/sims?type=NAM_SINH" className="hover:text-[#B3925F] text-slate-400 transition">Sim Năm Sinh</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 text-center text-xs text-slate-600 font-medium">
          <p>© {new Date().getFullYear()} Sim Phát Lộc - Hoàng Gia Di Sản. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}
