"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { orderSchema } from "@/lib/validations"
import { PaymentMethod } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { z } from "zod"

interface CheckoutFormProps {
  sim: { id: string, phone: string }
}

type OrderFormValues = z.infer<typeof orderSchema>

export default function CheckoutFormClient({ sim }: CheckoutFormProps) {
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

      router.push(`/checkout/success?orderCode=${result.data.orderCode}`)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
            <input
              {...register("customerName")}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 transition"
              placeholder="Nhập họ và tên..."
            />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SĐT liên hệ *</label>
            <input
              {...register("customerPhone")}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 transition"
              placeholder="Ví dụ: 09..."
            />
            {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Hình thức nhận sim *</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition has-[:checked]:border-[#0066CC] has-[:checked]:bg-blue-50/50">
              <input type="radio" value="false" {...register("isPickup", { setValueAs: v => v === 'true' })} defaultChecked className="text-[#0066CC] focus:ring-[#0066CC] w-5 h-5" />
              <span className="font-medium text-gray-900">🚚 Giao hàng tận nơi</span>
            </label>
            <label className="flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition has-[:checked]:border-[#0066CC] has-[:checked]:bg-blue-50/50">
              <input type="radio" value="true" {...register("isPickup", { setValueAs: v => v === 'true' })} className="text-[#0066CC] focus:ring-[#0066CC] w-5 h-5" />
              <span className="font-medium text-gray-900">🏪 Đến cửa hàng lấy</span>
            </label>
          </div>
        </div>

        {!isPickup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng *</label>
            <input
              {...register("customerAddress")}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 transition"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
            />
            {errors.customerAddress && <p className="text-red-500 text-sm mt-1">{errors.customerAddress.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán *</label>
          <select
            {...register("paymentMethod")}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 transition bg-white"
          >
            {!isPickup && <option value={PaymentMethod.COD}>Thanh toán khi nhận hàng (COD)</option>}
            <option value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản ngân hàng</option>
            {isPickup && <option value={PaymentMethod.CASH}>Tiền mặt tại cửa hàng</option>}
            {!isPickup && <option value={PaymentMethod.MOMO}>Ví Momo</option>}
            {!isPickup && <option value={PaymentMethod.ZALOPAY}>Ví ZaloPay</option>}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú thêm</label>
          <textarea
            {...register("note")}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 transition"
            rows={3}
            placeholder="Yêu cầu khác về thời gian giao hàng, cắt sim..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-4 rounded-xl font-bold text-white text-lg bg-[#0066CC] hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-blue-200"
        >
          {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Xác Nhận Đặt Hàng"}
        </button>
      </form>
    </div>
  )
}
