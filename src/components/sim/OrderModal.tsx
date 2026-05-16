"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { orderSchema } from "@/lib/validations"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import { Sim, PaymentMethod } from "@prisma/client"
import { useRouter } from "next/navigation"
import { X, Loader2 } from "lucide-react"
import { z } from "zod"

interface OrderModalProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price">
  isOpen: boolean
  onClose: () => void
}

type OrderFormValues = z.infer<typeof orderSchema>

export function OrderModal({ sim, isOpen, onClose }: OrderModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      isPickup: false,
      paymentMethod: PaymentMethod.COD,
    },
  })

  const isPickup = watch("isPickup")

  const onSubmit = async (data: OrderFormValues) => {
    if (data.customerPhone === sim.phone) {
      setErrorMsg("Số điện thoại liên hệ không được trùng với số sim đang mua.")
      return
    }

    setIsLoading(true)
    setErrorMsg("")

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, simId: sim.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Đã xảy ra lỗi khi đặt hàng.")
      }

      onClose()
      router.push(`/dat-hang/thanh-cong?orderCode=${result.data.orderCode}`)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Đặt Mua Sim</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          {/* Sim Info Summary */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-center">
            <div className="text-3xl font-black text-[#0066CC] tracking-wider mb-2">
              {formatPhone(sim.phone)}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Vinaphone | {getSimTypeLabel(sim.type)}
            </div>
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(sim.price)}
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                <input
                  {...register("customerName")}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                  placeholder="Nguyễn Văn A"
                />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SĐT liên hệ *</label>
                <input
                  {...register("customerPhone")}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                  placeholder="09..."
                />
                {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức nhận sim *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" {...register("isPickup", { setValueAs: v => v === 'true' })} defaultChecked className="text-[#0066CC] focus:ring-[#0066CC]" />
                  <span>🚚 Giao tận nơi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register("isPickup", { setValueAs: v => v === 'true' })} className="text-[#0066CC] focus:ring-[#0066CC]" />
                  <span>🏪 Đến cửa hàng</span>
                </label>
              </div>
            </div>

            {!isPickup ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng *</label>
                <input
                  {...register("customerAddress")}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
                />
                {errors.customerAddress && <p className="text-red-500 text-xs mt-1">{errors.customerAddress.message}</p>}
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-sm text-gray-700 font-medium mb-2">📍 Số 68, Đường Trần Phú, Ba Đình, Hà Nội</p>
                <input
                  {...register("pickupNote")}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 text-sm"
                  placeholder="Ghi chú giờ đến lấy (VD: 15h chiều nay)"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán *</label>
              <select
                {...register("paymentMethod")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
              >
                {!isPickup && <option value={PaymentMethod.COD}>Thanh toán khi nhận hàng (COD)</option>}
                <option value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản ngân hàng</option>
                {isPickup && <option value={PaymentMethod.CASH}>Tiền mặt tại cửa hàng</option>}
                {!isPickup && <option value={PaymentMethod.MOMO}>Ví Momo</option>}
                {!isPickup && <option value={PaymentMethod.ZALOPAY}>Ví ZaloPay</option>}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
              <textarea
                {...register("note")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                rows={2}
                placeholder="Yêu cầu khác..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            form="order-form"
            disabled={isLoading}
            className="px-6 py-2 rounded-lg font-bold text-white bg-[#0066CC] hover:bg-blue-700 transition flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận đặt"}
          </button>
        </div>

      </div>
    </div>
  )
}
