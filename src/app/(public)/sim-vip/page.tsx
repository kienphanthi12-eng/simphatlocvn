import prisma from "@/lib/db"
import { SimCard } from "@/components/ui/SimCard"

export const metadata = {
  title: "Sim Vinaphone VIP Số Đẹp Giá Gốc | Sim Phát Lộc",
  description: "Kho sim Vinaphone VIP chính hãng, giá rẻ nhất thị trường. Giao sim toàn quốc, đăng ký chính chủ."
}

export default async function CategoryPage() {
  const allSims = await prisma.sim.findMany({ orderBy: { createdAt: "desc" } })
  const sims = allSims.filter(s => s.status === 'AVAILABLE' && (s.type === 'VIP'))

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sim Vinaphone VIP</h1>
          <p className="text-gray-500">Hiện có {sims.length} sim VIP đang sẵn sàng phục vụ.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {sims.map(sim => <SimCard key={sim.id} sim={sim} view="grid" />)}
        </div>

        {sims.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có sim nào</h3>
            <p className="text-gray-500">Kho sim đang được cập nhật, vui lòng quay lại sau.</p>
          </div>
        )}
      </div>
    </div>
  )
}
