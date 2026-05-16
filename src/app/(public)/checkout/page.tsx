import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import CheckoutFormClient from "./CheckoutFormClient"

export default async function CheckoutPage({ searchParams }: { searchParams: { phone?: string } }) {
  const resolvedParams = await Promise.resolve(searchParams);
  
  if (!resolvedParams.phone) {
    notFound()
  }

  const sim = await prisma.sim.findFirst({
    where: { phone: resolvedParams.phone }
  })

  if (!sim) {
    notFound()
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán đặt hàng</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Sim Info Summary */}
          <div className="bg-blue-50 border-b border-blue-100 p-6 text-center md:text-left md:flex justify-between items-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#0066CC] tracking-wider mb-2">
                {formatPhone(sim.phone)}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Vinaphone | {getSimTypeLabel(sim.type)}
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-2xl font-bold text-gray-900">
              {formatPrice(sim.price)}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <CheckoutFormClient sim={{ id: sim.id, phone: sim.phone }} />
          </div>
        </div>
      </div>
    </div>
  )
}
