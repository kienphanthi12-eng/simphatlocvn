"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { PaymentMethod } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, ClipboardList, CreditCard } from "lucide-react"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import { SimType } from "@prisma/client"

interface CheckoutFormProps {
  sim: { id: string; phone: string; price: number; type: SimType }
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

const PAYMENT_LABELS: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
  MOMO: "Ví Momo",
  ZALOPAY: "Ví ZaloPay",
  STORE_CASH: "Tiền mặt tại cửa hàng",
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

// Step progress indicator
function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: "Thông tin", icon: ClipboardList },
    { num: 2, label: "Xem lại", icon: CreditCard },
    { num: 3, label: "Hoàn tất", icon: CheckCircle2 },
  ]
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const Icon = s.icon
        const isActive = step === s.num
        const isDone = step > s.num
        return (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-gold-deep border-gold-deep text-white"
                    : isActive
                    ? "border-gold-deep bg-gold/10 text-gold-deep"
                    : "border-muted-foreground/30 text-muted-foreground/40"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isActive ? "gold-text" : isDone ? "text-gold-deep/70" : "text-muted-foreground/40"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-[2px] w-12 md:w-20 mx-1 mb-4 transition-all ${
                  step > s.num ? "bg-gold-deep" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CheckoutFormClient({ sim }: CheckoutFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
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

  const handleNext = async () => {
    const valid = await trigger(["customerName", "customerPhone", isPickup ? undefined : "customerAddress"].filter(Boolean) as (keyof OrderFormValues)[])
    if (!valid) return
    const vals = getValues()
    if (vals.customerPhone === sim.phone) {
      setErrorMsg("Số điện thoại liên hệ không được trùng với số sim đang mua.")
      return
    }
    setErrorMsg("")
    setStep(2)
  }

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

  const vals = getValues()

  return (
    <div>
      <StepIndicator step={step === 1 ? 1 : 2} />

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200/60 rounded-xl text-xs font-semibold">
          ⚠ {errorMsg}
        </div>
      )}

      {/* Step 1 — Form */}
      {step === 1 && (
        <div className="space-y-6">
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
                <FieldInput {...register("pickupNote")} placeholder="VD: 15h chiều nay" />
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

          <button
            type="button"
            onClick={handleNext}
            className="w-full lacquer border border-gold-deep rounded-xl py-4 text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:scale-[1.01] transition-all text-gold-soft flex items-center justify-center gap-3"
          >
            ✦ Xem Lại Đơn Hàng
          </button>
        </div>
      )}

      {/* Step 2 — Review */}
      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Order summary */}
          <div className="border border-gold-deep/30 rounded-xl overflow-hidden">
            <div className="lacquer px-5 py-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-soft/70 font-bold">Xem lại đơn hàng</p>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {/* Sim info */}
              <div className="flex justify-between items-center pb-3 border-b border-gold-deep/15">
                <span className="text-ink/60 font-medium">Số sim</span>
                <span className="font-black font-mono text-ink text-base tracking-wider">{formatPhone(sim.phone)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gold-deep/15">
                <span className="text-ink/60 font-medium">Loại sim</span>
                <span className="font-semibold text-ink">{getSimTypeLabel(sim.type)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gold-deep/15">
                <span className="text-ink/60 font-medium">Giá</span>
                <span className="font-bold text-crimson text-base">{formatPrice(sim.price)}</span>
              </div>

              {/* Customer info */}
              <div className="flex justify-between items-center pb-3 border-b border-gold-deep/15">
                <span className="text-ink/60 font-medium">Họ tên</span>
                <span className="font-semibold text-ink">{vals.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gold-deep/15">
                <span className="text-ink/60 font-medium">SĐT liên hệ</span>
                <span className="font-semibold text-ink">{vals.customerPhone}</span>
              </div>
              {!vals.isPickup && vals.customerAddress && (
                <div className="flex justify-between items-start pb-3 border-b border-gold-deep/15 gap-4">
                  <span className="text-ink/60 font-medium shrink-0">Địa chỉ</span>
                  <span className="font-semibold text-ink text-right">{vals.customerAddress}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-3 border-b border-gold-deep/15">
                <span className="text-ink/60 font-medium">Hình thức</span>
                <span className="font-semibold text-ink">{vals.isPickup ? "Đến cửa hàng lấy" : "Giao hàng tận nơi"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink/60 font-medium">Thanh toán</span>
                <span className="font-semibold text-ink">{PAYMENT_LABELS[vals.paymentMethod] ?? vals.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-gold-deep/40 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/60 hover:border-gold-deep/70 transition-all"
            >
              ← Sửa thông tin
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] lacquer border border-gold-deep rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3 text-gold-soft"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isLoading ? "Đang xử lý…" : "✦ Xác Nhận Đặt Hàng"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
