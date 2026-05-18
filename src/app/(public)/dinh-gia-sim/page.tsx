import { Metadata } from "next"
import { DinhGiaSimClient } from "@/components/sim/DinhGiaSimClient"

export const metadata: Metadata = {
  title: "Định Giá Sim AI - Đọc Vị Phong Thủy Số Điện Thoại | Sim Phát Lộc",
  description: "Công cụ định giá sim thông minh bằng AI. Phân tích giá trị đầu số cổ, ngũ quý, sảnh tiến và phong thủy kinh dịch để đưa ra mức giá thị trường chính xác nhất.",
  openGraph: {
    title: "Định Giá Sim AI - Đọc Vị Phong Thủy Số Điện Thoại",
    description: "Định giá sim thông minh bằng AI. Nhập số điện thoại của bạn để phân tích và xem giá trị ước tính thị trường ngay lập tức.",
  }
}

export default function DinhGiaSimPage() {
  return (
    <div className="min-h-screen bg-parchment bg-cloud-pattern py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-[0.2em]">
              Công nghệ AI độc quyền
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-crimson mb-4 font-serif" style={{ fontFamily: "var(--font-serif)" }}>
            Định Giá Sim AI
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Sử dụng thuật toán phân tích thị trường kết hợp với khoa học phong thủy kinh dịch để đánh giá chính xác giá trị thực tế của mọi số điện thoại Vinaphone.
          </p>
        </div>

        {/* Client Interface */}
        <DinhGiaSimClient />

        {/* SEO / Info Content */}
        <div className="mt-20 max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-amber-200/40 shadow-sm">
          <h2 className="text-2xl font-bold text-crimson-deep mb-6">Tiêu chí định giá sim của hệ thống AI</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gold-deep mb-1">1. Mức độ hiếm của đầu số</h3>
                <p className="text-sm text-slate-600">Đầu số cổ (091, 098...) luôn có giá trị cao hơn các đầu số mới (03, 07...). Đầu số lặp hoặc mang ý nghĩa phong thủy (088 - Song Phát) cũng được AI cộng điểm.</p>
              </div>
              <div>
                <h3 className="font-bold text-gold-deep mb-1">2. Cấu trúc đuôi số đại cát</h3>
                <p className="text-sm text-slate-600">Các thế số VIP như Lục Quý, Ngũ Quý, Tứ Quý, Sảnh Tiến (6789) hay Lộc Phát (6868), Thần Tài (3979) sẽ làm tăng giá trị sim lên gấp hàng chục đến hàng trăm lần.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gold-deep mb-1">3. Sự hài hòa Âm Dương</h3>
                <p className="text-sm text-slate-600">Tỷ lệ số chẵn (Âm) và số lẻ (Dương) cân bằng trong dãy 10 số giúp sim có khí vượng, đem lại giá trị phong thủy tốt và đẩy giá lên cao hơn.</p>
              </div>
              <div>
                <h3 className="font-bold text-gold-deep mb-1">4. Tính quy luật và dễ nhớ</h3>
                <p className="text-sm text-slate-600">Những dãy số có quy luật rõ ràng, dễ đọc, dễ nhớ (như số gánh, số taxi) tạo nên đẳng cấp của người dùng, qua đó định hình mức giá thị trường thực tế.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
