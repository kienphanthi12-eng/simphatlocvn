import prisma from "@/lib/db"
import { OrdersTableClient } from "./OrdersTableClient"

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string, search?: string } }) {
  const resolvedParams = await Promise.resolve(searchParams)
  
  // Fetch all orders
  let orders = await prisma.order.findMany({
    include: { sim: true },
    orderBy: { createdAt: "desc" }
  })

  // Filter in JS due to possible Enum issues
  if (resolvedParams.status && resolvedParams.status !== 'ALL') {
    orders = orders.filter(o => o.status === resolvedParams.status)
  }

  if (resolvedParams.search) {
    const q = resolvedParams.search.toLowerCase()
    orders = orders.filter(o => 
      o.orderCode.toLowerCase().includes(q) || 
      o.customerPhone.includes(q)
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý đơn hàng</h1>
      <OrdersTableClient initialOrders={orders} currentStatus={resolvedParams.status || 'ALL'} />
    </div>
  )
}
