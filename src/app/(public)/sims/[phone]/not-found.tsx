import { SearchX } from "lucide-react"
import Link from "next/link"

export default async function NotFound({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
        <SearchX size={64} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sim không tồn tại</h2>
        <p className="text-gray-500 mb-6">Sim này có thể không tồn tại hoặc đã được khách hàng khác mua mất.</p>
        <Link
          href="/"
          className="bg-[#0066CC] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition block w-full"
        >
          Xem các sim khác
        </Link>
      </div>
    </div>
  )
}
