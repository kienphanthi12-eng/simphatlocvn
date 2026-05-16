import { SimCard } from "@/components/ui/SimCard"
import prisma from "@/lib/db"
import { SimType, SimStatus } from "@prisma/client"
import Link from "next/link"
import { Search, CheckCircle, MapPin, Clock, PhoneCall, ShieldCheck, ThumbsUp, RefreshCw } from "lucide-react"

// Types config for categories
const CATEGORIES = [
  { type: SimType.TAM_HOA, name: "Tam Hoa", icon: "🌸" },
  { type: SimType.TU_QUY, name: "Tứ Quý", icon: "🍀" },
  { type: SimType.TIEN_LEN, name: "Tiến Lên", icon: "📈" },
  { type: SimType.LOC_PHAT, name: "Lộc Phát", icon: "💰" },
  { type: SimType.THAN_TAI, name: "Thần Tài", icon: "⛩️" },
  { type: SimType.NAM_SINH, name: "Năm Sinh", icon: "🎂" },
  { type: SimType.DE_NHO, name: "Dễ Nhớ", icon: "🧠" },
  { type: SimType.VIP, name: "Sim VIP", icon: "👑" },
]

export default async function HomePage() {
  // Fetch data in parallel
  const [featuredSims, newestSims, allSims] = await Promise.all([
    prisma.sim.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { createdAt: "desc" }
    }),
    prisma.sim.findMany({
      take: 10,
      orderBy: { createdAt: "desc" }
    }),
    prisma.sim.findMany({
      select: { type: true }
    })
  ])

  const availableSims = allSims.filter(s => s.type !== undefined)

  // Process counts using reduce
  const typeCountMap = availableSims.reduce((acc, sim) => {
    acc[sim.type] = (acc[sim.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      {/* Section 1: Hero */}
      <section className="bg-gradient-to-br from-[#0066CC] to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Sim Vinaphone Số Đẹp <br className="hidden md:block"/> Phát Tài Phát Lộc
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Kho sim Vinaphone chính hãng, giá gốc, giao toàn quốc hoặc nhận tại cửa hàng. Vào tên chính chủ nhanh chóng.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8 bg-white p-2 rounded-full shadow-lg flex items-center">
            <form action="/sims" method="GET" className="flex-1 flex items-center">
              <Search className="text-gray-400 ml-4" size={24} />
              <input 
                type="text" 
                name="search"
                placeholder="Nhập số sim bạn muốn tìm..." 
                className="w-full py-3 px-4 text-gray-900 focus:outline-none bg-transparent text-lg rounded-full"
              />
              <button type="submit" className="bg-[#0066CC] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition hidden sm:block">
                Tìm Kiếm
              </button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base text-blue-50">
            <span className="flex items-center gap-2"><CheckCircle size={18}/> Chính hãng Vinaphone</span>
            <span className="flex items-center gap-2"><CheckCircle size={18}/> Giá gốc</span>
            <span className="flex items-center gap-2"><CheckCircle size={18}/> Giao toàn quốc</span>
          </div>
        </div>
      </section>

      {/* Section 2: Sim nổi bật */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              ✨ Sim Nổi Bật
            </h2>
            <Link href="/sims?featured=true" className="text-[#0066CC] font-semibold hover:underline">
              Xem tất cả &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSims.map(sim => (
              <SimCard key={sim.id} sim={sim} view="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Danh mục loại sim */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Danh Mục Loại Sim</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.type} 
                href={`/sims?type=${cat.type}`}
                className="flex flex-col items-center p-6 border rounded-xl hover:border-[#0066CC] hover:shadow-md transition bg-gray-50 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{typeCountMap[cat.type] || 0} sim</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Lọc nhanh theo giá */}
      <section className="py-12 bg-[#0066CC]/5">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">Tìm Nhanh Theo Giá</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sims?maxPrice=1000000" className="bg-white border border-blue-200 px-6 py-3 rounded-full font-medium text-[#0066CC] hover:bg-[#0066CC] hover:text-white transition shadow-sm">
              Dưới 1 triệu
            </Link>
            <Link href="/sims?minPrice=1000000&maxPrice=3000000" className="bg-white border border-blue-200 px-6 py-3 rounded-full font-medium text-[#0066CC] hover:bg-[#0066CC] hover:text-white transition shadow-sm">
              Từ 1 - 3 triệu
            </Link>
            <Link href="/sims?minPrice=3000000&maxPrice=10000000" className="bg-white border border-blue-200 px-6 py-3 rounded-full font-medium text-[#0066CC] hover:bg-[#0066CC] hover:text-white transition shadow-sm">
              Từ 3 - 10 triệu
            </Link>
            <Link href="/sims?minPrice=10000000" className="bg-white border border-blue-200 px-6 py-3 rounded-full font-medium text-[#0066CC] hover:bg-[#0066CC] hover:text-white transition shadow-sm">
              Trên 10 triệu
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Sim mới nhất */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Sim Mới Nhất</h2>
          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            {newestSims.map(sim => (
              <SimCard key={sim.id} sim={sim} view="table" />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/sims" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0066CC] transition">
              Xem thêm sim Vinaphone &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Mua tại cửa hàng */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100">
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Đến xem trực tiếp —<br/>không mua không sao!</h2>
              <p className="text-gray-600 mb-8">Chúng tôi luôn chào đón quý khách đến tham quan và lựa chọn sim trực tiếp tại cửa hàng với nhiều ưu đãi đặc biệt.</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0066CC] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Địa chỉ cửa hàng</h4>
                    <p className="text-gray-600">Số 68, Đường Trần Phú, Quận Ba Đình, Hà Nội</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0066CC] shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Giờ mở cửa</h4>
                    <p className="text-gray-600">8:00 - 21:00 mỗi ngày (Kể cả T7, CN)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-200 min-h-[300px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.926558661608!2d105.8361136154023!3d21.035624792921516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba15ec15d17%3A0x620e85c2cfe14d4c!2zTMSDbmcgQ2jhu6cgdOG7i2NoIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1689000000000!5m2!1svi!2s" 
                className="absolute inset-0 w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Trust signals */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <ShieldCheck size={40} className="text-[#0066CC] mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Chính hãng Vinaphone</h4>
              <p className="text-sm text-gray-500">Sang tên chính chủ trực tiếp, bảo hành trọn đời.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <ThumbsUp size={40} className="text-[#0066CC] mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Giá gốc tại kho</h4>
              <p className="text-sm text-gray-500">Không qua trung gian, đảm bảo giá tốt nhất thị trường.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <PhoneCall size={40} className="text-[#0066CC] mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h4>
              <p className="text-sm text-gray-500">Luôn sẵn sàng tư vấn chọn số phù hợp phong thuỷ.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <RefreshCw size={40} className="text-[#0066CC] mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Đổi trả 7 ngày</h4>
              <p className="text-sm text-gray-500">Hỗ trợ thu mua lại hoặc đổi số linh hoạt.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
