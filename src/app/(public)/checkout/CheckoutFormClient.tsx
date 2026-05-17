"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { PaymentMethod } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface CheckoutFormProps {
  sim: { id: string; phone: string }
}

type OrderFormValues = {
  customerName: string
  customerPhone: string
  isPickup: boolean
  paymentMethod: "COD" | "BANK_TRANSFER" | "MOMO" | "ZALOPAY" | "STORE_CASH"
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

export default function CheckoutFormClient({ sim }: CheckoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      isPickup: false,
      paymentMethod: "COD",
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      pickupNote: "",
      note: "",
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
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200/60 rounded-xl text-xs font-semibold">
          ⚠ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Tên + SĐT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <FieldLabel>Họ và tên *</FieldLabel>
            <FieldInput
              {...register("customerName", { required: "Vui lòng nhập họ tên" })}
              placeholder="Nhập họ và tên..."
              error={errors.customerName?.message}
            />
          </div>

          <div>
            <FieldLabel>SĐT liên hệ *</FieldLabel>
            <FieldInput
              {...register("customerPhone", { required: "Vui lòng nhập số điện thoại" })}
              placeholder="Ví dụ: 09..."
              error={errors.customerPhone?.message}
            />
          </div>
        </div>

        {/* Hình thức nhận */}
        <div>
          <FieldLabel>Hình thức nhận sim *</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              { value: false, label: "🚚 Giao hàng tận nơi", payment: "COD" as const },
              { value: true, label: "🏪 Đến cửa hàng lấy", payment: "STORE_CASH" as const },
            ].map((opt) => (
              <label
                key={String(opt.value)}
                onClick={() => {
                  setValue("isPickup", opt.value)
                  setValue("paymentMethod", opt.payment)
                }}
                className={`flex items-center gap-3 cursor-pointer border rounded-xl p-4 text-sm font-medium transition-all ${
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
                <span className="font-semibold">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Địa chỉ / Ghi chú */}
        {!isPickup ? (
          <div>
            <FieldLabel>Địa chỉ giao hàng *</FieldLabel>
            <FieldInput
              {...register("customerAddress", { required: !isPickup ? "Vui lòng nhập địa chỉ" : false })}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
              error={errors.customerAddress?.message}
            />
          </div>
        ) : (
          <div className="bg-gold/10 border border-gold-deep/25 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-ink/75">📍 <span className="text-ink font-bold">Số 68, Đường Trần Phú, Ba Đình, Hà Nội</span></p>
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
          <select
            {...register("paymentMethod")}
            className="w-full bg-transparent border-0 border-b-2 border-gold-deep/30 focus:border-gold-deep rounded-none h-10 text-sm font-serif px-0 outline-none transition-colors cursor-pointer"
          >
            {!isPickup && <option value={PaymentMethod.COD}>Thanh toán khi nhận hàng (COD)</option>}
            <option value={PaymentMethod.BANK_TRANSFER}>Chuyển khoản ngân hàng</option>
            {isPickup && <option value={PaymentMethod.STORE_CASH}>Tiền mặt tại cửa hàng</option>}
            {!isPickup && <option value={PaymentMethod.MOMO}>Ví Momo</option>}
            {!isPickup && <option value={PaymentMethod.ZALOPAY}>Ví ZaloPay</option>}
          </select>
        </div>

        {/* Ghi chú thêm */}
        <div>
          <FieldLabel>Ghi chú thêm</FieldLabel>
          <textarea
            {...register("note")}
            className="w-full bg-transparent border-2 border-gold-deep/20 focus:border-gold-deep rounded-xl p-3 text-ink text-sm font-serif outline-none transition-colors placeholder:text-ink/30"
            rows={3}
            placeholder="Yêu cầu khác về thời gian giao hàng, cắt sim..."
          />
        </div>

        {/* Nút đặt mua */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full lacquer border border-gold-deep rounded-xl py-4 text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3 text-gold-soft"
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {isLoading ? "Đang xử lý đặt hàng…" : "✦ Xác Nhận Đặt Mua Sim"}
        </button>
      </form>
    </div>
  )
}
