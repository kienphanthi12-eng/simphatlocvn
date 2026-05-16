"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { formatPhone, formatPrice, getOrderStatusLabel } from "@/lib/utils"
import { OrderStatus } from "@prisma/client"
import { Loader2 } from "lucide-react"

export function OrdersTableClient({ initialOrders, currentStatus }: { initialOrders: any[], currentStatus: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState(initialOrders)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const tabs = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'READY_PICKUP', label: 'Chờ lấy' },
    { value: 'DELIVERED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ]

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error("Update failed")
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (error) {
      alert("Cập nhật thất bại!")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) params.set("search", searchTerm)
    else params.delete("search")
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handleTabChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status !== 'ALL') params.set("status", status)
    else params.delete("status")
    router.push(`/admin/orders?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${currentStatus === tab.value ? 'bg-[#0066CC] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-64 flex">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mã đơn, SĐT khách..." 
            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none text-sm"
          />
          <button type="submit" className="bg-gray-100 px-3 py-2 border border-l-0 rounded-r-lg hover:bg-gray-200 text-sm font-medium">
            Tìm
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
            <tr>
              <th className="px-6 py-3">Mã đơn</th>
              <th className="px-6 py-3">Sim</th>
              <th className="px-6 py-3">Khách hàng</th>
              <th className="px-6 py-3">Hình thức</th>
              <th className="px-6 py-3">Tổng tiền</th>
              <th className="px-6 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const options = order.isPickup 
                ? [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.READY_PICKUP, OrderStatus.DELIVERED, OrderStatus.CANCELLED]
                : [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPING, OrderStatus.DELIVERED, OrderStatus.CANCELLED]

              return (
                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#0066CC]">{order.orderCode}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatPhone(order.sim.phone)}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.isPickup ? "🏪 Cửa hàng" : "🚚 Giao tận nơi"}</p>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-red-600">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdating === order.id}
                        className={`px-2 py-1.5 rounded-lg border text-xs font-bold focus:outline-none ${
                          order.status === 'DELIVERED' ? 'bg-green-50 border-green-200 text-green-700' :
                          order.status === 'CANCELLED' ? 'bg-red-50 border-red-200 text-red-700' :
                          'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {options.map(opt => (
                          <option key={opt} value={opt}>{getOrderStatusLabel(opt as any)}</option>
                        ))}
                      </select>
                      {isUpdating === order.id && <Loader2 size={16} className="animate-spin text-[#0066CC]" />}
                    </div>
                  </td>
                </tr>
              )
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
