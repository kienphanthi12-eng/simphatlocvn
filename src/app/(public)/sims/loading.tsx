import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <Loader2 size={48} className="animate-spin text-[#0066CC] mb-4" />
      <p className="text-gray-500 font-medium text-lg animate-pulse">Đang tải dữ liệu...</p>
    </div>
  )
}
