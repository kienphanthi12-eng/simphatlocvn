import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Cột 1 */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="text-[#0066CC]">Sim</span> Phát Lộc
            </h3>
            <p className="mb-4 text-sm leading-relaxed">
              Chuyên cung cấp sim Vinaphone số đẹp toàn quốc. Uy tín, giao sim tận nơi, vào tên chính chủ nhanh chóng.
            </p>
          </div>

          {/* Cột 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li>📍 Số 68, Đường Trần Phú, Ba Đình, Hà Nội</li>
              <li>📞 Hotline: <span className="text-[#0066CC] font-bold">0914 123 456</span></li>
              <li>💬 Zalo: 0914 123 456</li>
              <li>⏰ Giờ mở cửa: 8:00 - 21:00 mỗi ngày</li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Thanh toán</h4>
            <ul className="space-y-3 text-sm">
              <li>🏦 Ngân hàng: <strong className="text-white">Vietcombank</strong></li>
              <li>💳 Số TK: <strong className="text-white tracking-wider">1234 5678 90</strong></li>
              <li>👤 Tên TK: <strong className="text-white">NGUYEN VAN A</strong></li>
              <li className="pt-2 text-xs italic text-gray-400">
                Lưu ý: Nội dung chuyển khoản ghi số điện thoại quý khách muốn mua.
              </li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Tìm kiếm nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sims?type=TAM_HOA" className="hover:text-[#0066CC] transition">Sim Tam Hoa</Link></li>
              <li><Link href="/sims?type=TU_QUY" className="hover:text-[#0066CC] transition">Sim Tứ Quý</Link></li>
              <li><Link href="/sims?type=LOC_PHAT" className="hover:text-[#0066CC] transition">Sim Lộc Phát</Link></li>
              <li><Link href="/sims?type=TIEN_LEN" className="hover:text-[#0066CC] transition">Sim Tiến Lên</Link></li>
              <li><Link href="/sims?type=NAM_SINH" className="hover:text-[#0066CC] transition">Sim Năm Sinh</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sim Phát Lộc. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
