"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Save, Check } from "lucide-react"

export function SettingsFormClient({ initialData }: { initialData: Record<string, string> }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      hotline: initialData.hotline || "",
      zalo: initialData.zalo || "",
      address: initialData.address || "",
      open_hours: initialData.open_hours || "",
      bank_name: initialData.bank_name || "",
      bank_account: initialData.bank_account || "",
      bank_holder: initialData.bank_holder || "",
    }
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setIsSuccess(false)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Save failed")
      
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      alert("Lỗi khi lưu cài đặt!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
        
        {/* Thông tin liên hệ */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">1. Thông tin liên hệ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotline (Hiển thị Header/Footer)</label>
              <input {...register("hotline")} className="w-full px-3 py-2 border rounded-lg focus:ring-[#0066CC] focus:border-[#0066CC]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số Zalo tư vấn</label>
              <input {...register("zalo")} className="w-full px-3 py-2 border rounded-lg focus:ring-[#0066CC] focus:border-[#0066CC]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cửa hàng</label>
              <input {...register("address")} className="w-full px-3 py-2 border rounded-lg focus:ring-[#0066CC] focus:border-[#0066CC]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ mở cửa</label>
              <input {...register("open_hours")} className="w-full px-3 py-2 border rounded-lg focus:ring-[#0066CC] focus:border-[#0066CC]" />
            </div>
          </div>
        </div>

        {/* Cấu hình thanh toán */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">2. Cấu hình Thanh toán Chuyển khoản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngân hàng thụ hưởng</label>
              <input {...register("bank_name")} placeholder="VD: Vietcombank" className="w-full px-3 py-2 border rounded-lg focus:ring-[#0066CC] focus:border-[#0066CC]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
              <input {...register("bank_account")} className="w-full px-3 py-2 border rounded-lg font-mono focus:ring-[#0066CC] focus:border-[#0066CC]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản</label>
              <input {...register("bank_holder")} className="w-full px-3 py-2 border rounded-lg uppercase focus:ring-[#0066CC] focus:border-[#0066CC]" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center gap-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#0066CC] text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Lưu Cài Đặt
          </button>

          {isSuccess && (
            <span className="flex items-center gap-1 text-green-600 font-medium animate-pulse">
              <Check size={18} /> Đã lưu thành công!
            </span>
          )}
        </div>

      </form>
    </div>
  )
}
