import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, XCircle, MessageCircle, Info } from "lucide-react"
import { SimCard } from "@/components/ui/SimCard"
import { SimTypeBadge } from "@/components/ui/Badge"
import { OrderButton } from "@/components/sim/OrderButton"

interface Props {
  params: Promise<{ phone: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phone } = await params;
  const sim = await prisma.sim.findUnique({ where: { phone } })
  if (!sim) return { title: "Không tìm thấy Sim" }

  const label = getSimTypeLabel(sim.type)
  const price = formatPrice(sim.price)

  return {
    title: `Sim Vinaphone ${formatPhone(sim.phone)} — ${label} Giá ${price} | Sim Phát Lộc`,
    description: `Mua sim Vinaphone ${formatPhone(sim.phone)}, loại ${label}, giá ${price}. Chính hãng, giá gốc. Giao toàn quốc hoặc đến lấy tại cửa hàng. Hotline: 0914 123 456`,
  }
}

export default async function SimDetailPage({ params }: Props) {
  const { phone } = await params;
  const sim = await prisma.sim.findUnique({ where: { phone } })
  
  if (!sim) {
    notFound()
  }

  // Get related sims
  const allRelatedSims = await prisma.sim.findMany({
    where: {
      id: { not: sim.id }
    }
  })
  
  const relatedSims = allRelatedSims
    .filter(s => s.type === sim.type && s.status === 'AVAILABLE')
    .slice(0, 5)

  // Phong thủy đơn giản
  const totalScore = sim.phone.split('').reduce((sum, char) => sum + parseInt(char), 0) % 10
  const scoreLabel = totalScore === 9 || totalScore === 8 ? "Đại Cát" : totalScore >= 5 ? "Tốt" : "Bình hoà"

  const isAvailable = sim.status === 'AVAILABLE'

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `Sim Vinaphone ${formatPhone(sim.phone)}`,
    "description": sim.description || `Sim số đẹp Vinaphone loại ${getSimTypeLabel(sim.type)}`,
    "offers": {
      "@type": "Offer",
      "price": sim.price,
      "priceCurrency": "VND",
      "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#0066CC]">Trang chủ</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/sims" className="hover:text-[#0066CC]">Sim Vinaphone</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">{formatPhone(sim.phone)}</span>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            
            {/* Left: Sim Display */}
            <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-gray-100 bg-gradient-to-br from-white to-blue-50/50">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-bold text-white bg-[#0066CC] px-2 py-1 rounded">VINAPHONE</span>
                <SimTypeBadge type={sim.type} />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-[#0066CC] tracking-widest mb-6">
                {formatPhone(sim.phone)}
              </h1>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(sim.price)}</span>
                {sim.priceOriginal && sim.priceOriginal > sim.price && (
                  <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(sim.priceOriginal)}</span>
                )}
              </div>

              {isAvailable ? (
                <div className="flex items-center gap-2 text-green-600 font-medium mb-8 bg-green-50 px-4 py-2 rounded-full">
                  <CheckCircle size={20} /> ✓ Còn hàng
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 font-medium mb-8 bg-red-50 px-4 py-2 rounded-full">
                  <XCircle size={20} /> Đã bán / Đang giữ
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {isAvailable ? (
                  <Link 
                    href={`/checkout?phone=${sim.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--blue-500)] text-white px-[18px] py-[8px] rounded-[8px] font-sans text-[13px] font-[700] tracking-[0.3px] hover:bg-[var(--blue-600)] transition shadow-sm"
                  >
                    🛒 Đặt mua ngay
                  </Link>
                ) : (
                  <button disabled className="flex-1 bg-gray-300 text-gray-600 py-3.5 rounded-xl font-bold cursor-not-allowed">
                    Hết hàng
                  </button>
                )}
                <a 
                  href="https://zalo.me/0914123456" 
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 border border-[var(--blue-500)] text-[var(--blue-500)] px-[18px] py-[8px] rounded-[8px] text-[14px] font-[600] tracking-[0.2px] hover:bg-[var(--blue-50)] transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} /> Zalo tư vấn
                </a>
              </div>
            </div>

            {/* Right: Info */}
            <div className="p-8 md:p-12 md:w-2/5">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info size={20} className="text-[#0066CC]" /> Thông tin chi tiết
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                  <span className="text-gray-500">Mạng di động</span>
                  <span className="font-medium text-gray-900">Vinaphone (0914)</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                  <span className="text-gray-500">Phân loại</span>
                  <span className="font-medium text-gray-900">{getSimTypeLabel(sim.type)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                  <span className="text-gray-500">Tổng nút</span>
                  <span className="font-medium text-gray-900">{totalScore} nút ({scoreLabel})</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                  <span className="text-gray-500">Cam kết</span>
                  <span className="font-medium text-green-600">Vào tên chính chủ</span>
                </div>
              </div>

              {sim.description && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 italic">"{sim.description}"</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Sims */}
        {relatedSims.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sim Vinaphone tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedSims.map(s => (
                <SimCard key={s.id} sim={s} view="grid" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
