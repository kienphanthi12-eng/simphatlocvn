"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { orderSchema } from "@/lib/validations"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import { Sim, PaymentMethod } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller as Ctrl } from "react-hook-form"

interface OrderModalProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price">
  isOpen: boolean
  onClose: () => void
}

interface OrderFormValues {
  customerName: string
  customerPhone: string
  isPickup: boolean
  paymentMethod: PaymentMethod
  customerAddress?: string
  pickupNote?: string
  note?: string
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold gold-text mb-1.5">
    {children}
  </label>
)

const FieldInput = ({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) => (
  <div>
    <input
      {...props}
      className="w-full bg-transparent border-b-2 border-gold-deep/30 focus:border-gold-deep text-ink text-sm font-serif py-2 outline-none transition-colors placeholder:text-ink/30"
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
)

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
    resolver: zodResolver(orderSchema) as any,
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
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto bg-parchment border-0 p-0 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="lacquer px-6 py-4 rounded-t-2xl relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-gold-soft/70 mb-0.5">Hoàng Gia Thỉnh Cầu</p>
              <h2 className="text-lg font-black text-gold-soft font-serif tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
                Đặt Mua Số Phát Lộc
              </h2>
            </div>
            <button onClick={onClose} className="text-gold-soft/60 hover:text-gold-soft transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sim highlight */}
        <div className="mx-6 mt-5 corner-ornament border border-gold-deep/40 bg-parchment rounded-xl p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
          <p className="text-[9px] uppercase tracking-[0.35em] gold-text mb-1">Số sim chọn mua</p>
          <div className="text-3xl font-black text-crimson tracking-widest font-mono mb-1">
            {formatPhone(sim.phone)}
          </div>
          <p className="text-xs text-ink/50 mb-2">Vinaphone · {getSimTypeLabel(sim.type)}</p>
          <div className="inline-block bg-crimson/10 border border-crimson/20 rounded-lg px-4 py-1">
            <span className="text-lg font-black text-crimson">{formatPrice(sim.price)}</span>
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200/60 rounded-lg text-xs text-red-700">
            ⚠ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">

          {/* Tên + SĐT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <FieldLabel>Họ và tên *</FieldLabel>
              <FieldInput
                {...register("customerName")}
                placeholder="Nguyễn Văn A"
                error={errors.customerName?.message}
              />
            </div>
            <div>
              <FieldLabel>SĐT liên hệ *</FieldLabel>
              <FieldInput
                {...register("customerPhone")}
                placeholder="Ví dụ: 09..."
                error={errors.customerPhone?.message}
              />
            </div>
          </div>

          {/* Hình thức nhận */}
          <div>
            <FieldLabel>Hình thức nhận sim *</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {[
                { value: false, label: "🚚 Giao hàng tận nơi", payment: PaymentMethod.COD },
                { value: true, label: "🏪 Đến cửa hàng lấy", payment: PaymentMethod.STORE_CASH },
              ].map((opt) => (
                <label
                  key={String(opt.value)}
                  onClick={() => { setValue("isPickup", opt.value); setValue("paymentMethod", opt.payment) }}
                  className={`flex items-center gap-2.5 cursor-pointer border rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isPickup === opt.value
                      ? "border-gold-deep bg-gold/10 text-ink shadow-sm"
                      : "border-gold-deep/20 bg-white/50 text-ink/60 hover:border-gold-deep/40"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isPickup === opt.value ? "border-gold-deep" : "border-ink/20"
                  }`}>
                    {isPickup === opt.value && <span className="w-2 h-2 rounded-full bg-gold-deep" />}
                  </span>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Địa chỉ / Ghi chú cửa hàng */}
          {!isPickup ? (
            <div>
              <FieldLabel>Địa chỉ nhận hàng *</FieldLabel>
              <FieldInput
                {...register("customerAddress")}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
                error={errors.customerAddress?.message}
              />
            </div>
          ) : (
            <div className="bg-gold/10 border border-gold-deep/25 rounded-xl p-4 space-y-3">
              <p className="text-xs font-medium text-ink/70">📍 <span className="text-ink">Số 68, Đường Trần Phú, Ba Đình, Hà Nội</span></p>
              <div>
                <FieldLabel>Ghi chú giờ đến</FieldLabel>
                <FieldInput
                  {...register("pickupNote")}
                  placeholder="VD: 15h chiều nay"
                />
              </div>
            </div>
          )}

          {/* Thanh toán */}
          <div>
            <FieldLabel>Phương thức thanh toán *</FieldLabel>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-transparent border-0 border-b-2 border-gold-deep/30 focus:border-gold-deep rounded-none h-9 text-sm font-serif px-0 shadow-none">
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent className="bg-parchment border-gold-deep/30">
                    {!isPickup && <SelectItem value={PaymentMethod.COD}>Thanh toán khi nhận hàng (COD)</SelectItem>}
                    <SelectItem value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản ngân hàng</SelectItem>
                    {isPickup && <SelectItem value={PaymentMethod.STORE_CASH}>Tiền mặt tại cửa hàng</SelectItem>}
                    {!isPickup && <SelectItem value={PaymentMethod.MOMO}>Ví Momo</SelectItem>}
                    {!isPickup && <SelectItem value={PaymentMethod.ZALOPAY}>Ví ZaloPay</SelectItem>}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Ghi chú */}
          <div>
            <FieldLabel>Ghi chú thêm</FieldLabel>
            <FieldInput {...register("note")} placeholder="Yêu cầu đặc biệt..." />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gold-deep/15 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gold-deep/30 rounded-xl py-3 text-xs font-bold uppercase tracking-[0.2em] text-ink/60 hover:border-gold-deep/60 hover:text-ink transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] lacquer border border-gold-deep rounded-xl py-3 text-xs font-bold uppercase tracking-[0.25em] shadow-md hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Đang xử lý…" : "✦ Xác Nhận Đặt Sim"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
