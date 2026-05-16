import { SimCard } from "@/components/ui/SimCard"
import { FilterSidebar } from "@/components/sim/FilterSidebar"
import prisma from "@/lib/db"
import Link from "next/link"
import { Suspense } from "react"

export default async function HomePage() {
  // Fetch data in parallel
  const [featuredSims, newestSims] = await Promise.all([
    prisma.sim.findMany({
      where: { featured: true },
      take: 20,
      orderBy: { createdAt: "desc" }
    }),
    prisma.sim.findMany({
      take: 20,
      orderBy: { createdAt: "desc" }
    })
  ])

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Layout 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột trái (Sidebar) */}
          <div className="w-full lg:w-[230px] shrink-0">
            <Suspense fallback={<div className="bg-white p-5 rounded-[8px] border border-[#E2E8F0] min-h-[400px]">Đang tải bộ lọc...</div>}>
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Cột phải (Main Content) */}
          <div className="flex-1">
            
            {/* Banner nhỏ */}
            <div className="bg-gradient-to-r from-[#005BAC] to-[#003875] rounded-[12px] h-[160px] flex flex-col justify-center px-8 mb-8 text-white shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
              <h1 className="text-[28px] font-[800] tracking-tight mb-2 relative z-10">Sim Vinaphone Số Đẹp</h1>
              <p className="text-[14px] text-blue-100 max-w-lg relative z-10">
                Kho sim số đẹp chính hãng, giao toàn quốc, đăng ký thông tin chính chủ miễn phí. Mua ngay hôm nay để nhận nhiều ưu đãi!
              </p>
            </div>

            {/* Bảng Sim Nổi Bật */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-[700] text-[#0F172A]">Sim Nổi Bật</h2>
                <Link href="/sims?featured=true" className="text-[13px] font-[600] text-[#005BAC] hover:underline">
                  Xem tất cả &rarr;
                </Link>
              </div>
              
              <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EBF4FF] text-[#005BAC] text-[11px] font-[700] uppercase tracking-[1px] border-b border-[#DBEAFE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Số điện thoại</th>
                      <th className="py-3 px-4 font-semibold">Phân loại</th>
                      <th className="py-3 px-4 font-semibold">Giá bán</th>
                      <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featuredSims.map(sim => (
                      <SimCard key={sim.id} sim={sim} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng Sim Mới Nhất */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-[700] text-[#0F172A]">Sim Mới Nhất</h2>
                <Link href="/sims" className="text-[13px] font-[600] text-[#005BAC] hover:underline">
                  Xem tất cả &rarr;
                </Link>
              </div>
              
              <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EBF4FF] text-[#005BAC] text-[11px] font-[700] uppercase tracking-[1px] border-b border-[#DBEAFE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Số điện thoại</th>
                      <th className="py-3 px-4 font-semibold">Phân loại</th>
                      <th className="py-3 px-4 font-semibold">Giá bán</th>
                      <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newestSims.map(sim => (
                      <SimCard key={sim.id} sim={sim} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
