import prisma from "@/lib/db"
import { formatPhone, formatPrice, getOrderStatusLabel } from "@/lib/utils"
import { Users, CreditCard, ShoppingCart, DollarSign } from "lucide-react"
export default async function AdminDashboard() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch all to avoid Prisma Enum mismatch with SQLite/Postgres text fields
  const allSims = await prisma.sim.findMany({ select: { status: true } })
  const totalAvailableSims = allSims.filter(s => s.status === 'AVAILABLE').length

  const allOrders = await prisma.order.findMany({ 
    include: { sim: true },
    orderBy: { createdAt: "desc" }
  })

  const pendingOrders = allOrders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length
  const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfDay).length
  
  const monthRevenue = allOrders
    .filter(o => o.status === 'DELIVERED' && new Date(o.createdAt) >= startOfMonth)
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const recentOrders = allOrders.slice(0, 10)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan (Dashboard)</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-[#0066CC] rounded-xl flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Sim còn trong kho</p>
            <p className="text-2xl font-bold text-gray-900">{totalAvailableSims}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đơn chờ xử lý</p>
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đơn hôm nay</p>
            <p className="text-2xl font-bold text-gray-900">{todayOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Doanh thu tháng</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(monthRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Đơn hàng mới nhất</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
              <tr>
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Sim</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Nhận hàng</th>
                <th className="px-6 py-3">Thanh toán</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#0066CC]">
                    {order.orderCode}
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {formatPhone(order.sim.phone)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    {order.isPickup ? "Cửa hàng" : "Giao hàng"}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold bg-gray-100 ${order.status === 'PENDING' ? 'text-amber-600 bg-amber-50' : order.status === 'DELIVERED' ? 'text-green-600 bg-green-50' : ''}`}>
                      {getOrderStatusLabel(order.status as any)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
