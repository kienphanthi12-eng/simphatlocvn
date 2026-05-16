import os

categories = [
    {"slug": "sim-tam-hoa", "title": "Tam Hoa", "type": "TAM_HOA", "price_cond": None},
    {"slug": "sim-tu-quy", "title": "Tứ Quý", "type": "TU_QUY", "price_cond": None},
    {"slug": "sim-tien-len", "title": "Tiến Lên", "type": "TIEN_LEN", "price_cond": None},
    {"slug": "sim-loc-phat", "title": "Lộc Phát", "type": "LOC_PHAT", "price_cond": None},
    {"slug": "sim-than-tai", "title": "Thần Tài", "type": "THAN_TAI", "price_cond": None},
    {"slug": "sim-nam-sinh", "title": "Năm Sinh", "type": "NAM_SINH", "price_cond": None},
    {"slug": "sim-vip", "title": "VIP", "type": "VIP", "price_cond": None},
    {"slug": "sim-duoi-1-trieu", "title": "Dưới 1 Triệu", "type": None, "price_cond": "s.price < 1000000"},
    {"slug": "sim-1-3-trieu", "title": "Từ 1 - 3 Triệu", "type": None, "price_cond": "s.price >= 1000000 && s.price <= 3000000"},
    {"slug": "sim-3-10-trieu", "title": "Từ 3 - 10 Triệu", "type": None, "price_cond": "s.price > 3000000 && s.price <= 10000000"},
    {"slug": "sim-tren-10-trieu", "title": "Trên 10 Triệu", "type": None, "price_cond": "s.price > 10000000"},
]

template = """import prisma from "@/lib/db"
import { SimCard } from "@/components/ui/SimCard"

export const metadata = {
  title: "Sim Vinaphone __TITLE__ Số Đẹp Giá Gốc | Sim Phát Lộc",
  description: "Kho sim Vinaphone __TITLE__ chính hãng, giá rẻ nhất thị trường. Giao sim toàn quốc, đăng ký chính chủ."
}

export default async function CategoryPage() {
  const allSims = await prisma.sim.findMany({ orderBy: { createdAt: "desc" } })
  const sims = allSims.filter(s => s.status === 'AVAILABLE' && (__COND__))

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sim Vinaphone __TITLE__</h1>
          <p className="text-gray-500">Hiện có {sims.length} sim __TITLE__ đang sẵn sàng phục vụ.</p>
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
"""

base_dir = r"C:\Users\Phan Kiên\.gemini\antigravity\scratch\simphatlocvn\src\app\(public)"

for cat in categories:
    folder_path = os.path.join(base_dir, cat["slug"])
    os.makedirs(folder_path, exist_ok=True)
    
    file_path = os.path.join(folder_path, "page.tsx")
    
    if cat["type"]:
        filter_cond = f"s.type === '{cat['type']}'"
    else:
        filter_cond = cat["price_cond"]
        
    content = template.replace("__TITLE__", cat["title"]).replace("__COND__", filter_cond)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Created 11 category pages successfully.")
