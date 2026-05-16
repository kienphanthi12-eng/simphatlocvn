import prisma from "@/lib/db"
import { PaymentMethod } from "@prisma/client"
import { CheckCircle, MessageCircle, Home, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"

export default async function SuccessPage({ searchParams }: { searchParams: { orderCode?: string } }) {
  // Await searchParams in Next.js 15
  const resolvedParams = await Promise.resolve(searchParams);

  if (!resolvedParams.orderCode) {
    notFound()
  }

  const order = await prisma.order.findUnique({
    where: { orderCode: resolvedParams.orderCode },
    include: { sim: true }
  })

  if (!order) {
    notFound()
  }

  const isBankTransfer = order.paymentMethod === PaymentMethod.BANK_TRANSFER

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
          
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-500 mb-8">
            Cảm ơn quý khách <strong>{order.customerName}</strong>. Chúng tôi sẽ liên hệ trong vòng 30 phút (8:00 - 21:00) để xác nhận đơn hàng.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3">
              <FileText size={20} className="text-[#0066CC]" /> Thông tin đơn hàng
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-bold text-[#0066CC]">{order.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sim đặt mua:</span>
                <span className="font-bold text-gray-900">
                  {formatPhone(order.sim.phone)} ({getSimTypeLabel(order.sim.type)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="font-bold text-red-600 text-lg">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 mt-3">
                <span className="text-gray-500">Hình thức nhận:</span>
                <span className="font-medium text-gray-900">
                  {order.isPickup ? "🏪 Lấy tại cửa hàng" : "🚚 Giao hàng tận nơi"}
                </span>
              </div>
            </div>
          </div>

          {isBankTransfer && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left mb-8">
              <h3 className="font-bold text-[#0066CC] mb-4">Thông tin chuyển khoản</h3>
              <p className="text-sm text-gray-700 mb-4">Vui lòng chuyển khoản với nội dung là <strong>Mã đơn hàng</strong> để chúng tôi xác nhận nhanh nhất.</p>
              
              <ul className="space-y-2 text-sm">
                <li>Ngân hàng: <strong className="text-gray-900">Vietcombank</strong></li>
                <li>Số tài khoản: <strong className="text-gray-900 text-lg tracking-wider">1234 5678 90</strong></li>
                <li>Chủ tài khoản: <strong className="text-gray-900">NGUYEN VAN A</strong></li>
                <li>Nội dung CK: <strong className="text-red-600 bg-red-50 px-2 py-1 rounded">{order.orderCode}</strong></li>
                <li>Số tiền: <strong className="text-gray-900">{formatPrice(order.totalAmount)}</strong></li>
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://zalo.me/0914123456" 
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Chat Zalo Ngay
            </a>
            <Link 
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Home size={20} /> Về trang chủ
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
