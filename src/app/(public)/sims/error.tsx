"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
        <AlertTriangle size={64} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
        <p className="text-gray-500 mb-6">Hệ thống đang gặp sự cố khi tải dữ liệu. Vui lòng thử lại sau.</p>
        <button
          onClick={() => reset()}
          className="bg-[#0066CC] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full"
        >
          Thử lại
        </button>
      </div>
    </div>
  )
}
