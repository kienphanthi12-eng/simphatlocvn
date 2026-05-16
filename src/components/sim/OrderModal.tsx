"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { orderSchema } from "@/lib/validations"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import { Sim, PaymentMethod } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { z } from "zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

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
    control,
    setValue,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl">Đặt Mua Sim</DialogTitle>
        </DialogHeader>

        {/* Sim Info Summary */}
        <div className="bg-brand-light border border-blue-100 rounded-xl p-4 my-2 text-center">
          <div className="text-3xl font-black text-brand tracking-wider mb-2 font-mono">
            {formatPhone(sim.phone)}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Vinaphone | {getSimTypeLabel(sim.type)}
          </div>
          <div className="text-xl font-bold text-red-600">
            {formatPrice(sim.price)}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="customerName">Họ tên *</Label>
              <Input id="customerName" {...register("customerName")} placeholder="Nguyễn Văn A" />
              {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customerPhone">SĐT liên hệ *</Label>
              <Input id="customerPhone" {...register("customerPhone")} placeholder="09..." />
              {errors.customerPhone && <p className="text-red-500 text-xs">{errors.customerPhone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hình thức nhận sim *</Label>
            <div className="flex items-center gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  value="false" 
                  checked={!isPickup} 
                  onChange={() => {
                    setValue("isPickup", false)
                    setValue("paymentMethod", PaymentMethod.COD)
                  }} 
                  className="w-4 h-4 text-brand focus:ring-brand" 
                />
                <span className="text-sm font-medium">🚚 Giao tận nơi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  value="true" 
                  checked={isPickup} 
                  onChange={() => {
                    setValue("isPickup", true)
                    setValue("paymentMethod", PaymentMethod.CASH)
                  }} 
                  className="w-4 h-4 text-brand focus:ring-brand" 
                />
                <span className="text-sm font-medium">🏪 Đến cửa hàng</span>
              </label>
            </div>
          </div>

          {!isPickup ? (
            <div className="space-y-1.5">
              <Label htmlFor="customerAddress">Địa chỉ nhận hàng *</Label>
              <Input id="customerAddress" {...register("customerAddress")} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP" />
              {errors.customerAddress && <p className="text-red-500 text-xs">{errors.customerAddress.message}</p>}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
              <p className="text-sm text-gray-700 font-medium">📍 Số 68, Đường Trần Phú, Ba Đình, Hà Nội</p>
              <div className="space-y-1.5">
                <Label htmlFor="pickupNote" className="text-xs">Ghi chú giờ đến</Label>
                <Input id="pickupNote" {...register("pickupNote")} placeholder="VD: 15h chiều nay" className="h-8 text-sm" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Phương thức thanh toán *</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isPickup && <SelectItem value={PaymentMethod.COD}>Thanh toán khi nhận hàng (COD)</SelectItem>}
                    <SelectItem value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản ngân hàng</SelectItem>
                    {isPickup && <SelectItem value={PaymentMethod.CASH}>Tiền mặt tại cửa hàng</SelectItem>}
                    {!isPickup && <SelectItem value={PaymentMethod.MOMO}>Ví Momo</SelectItem>}
                    {!isPickup && <SelectItem value={PaymentMethod.ZALOPAY}>Ví ZaloPay</SelectItem>}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Ghi chú thêm</Label>
            <Input id="note" {...register("note")} placeholder="Yêu cầu khác..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-brand hover:bg-brand-hover min-w-[120px]">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Xác nhận đặt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
