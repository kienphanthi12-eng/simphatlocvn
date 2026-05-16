"use client"

import { useState } from "react"
import { isValidVinaphone } from "@/lib/utils"
import { Loader2, UploadCloud, AlertCircle, Check } from "lucide-react"

export default function AdminImportPage() {
  const [csvText, setCsvText] = useState("")
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<{added: number, updated: number, errors: number} | null>(null)

  const handleParse = () => {
    const lines = csvText.split('\n')
    const parsed = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line || i === 0 && line.toLowerCase().includes('phone')) continue // skip header or empty
      
      const parts = line.split(',')
      const phone = parts[0]?.trim().replace(/\s+/g, '')
      const price = parseInt(parts[1]?.trim() || "0")
      const priceOriginal = parseInt(parts[2]?.trim() || "0") || undefined
      const description = parts[3]?.trim()

      const isValid = isValidVinaphone(phone) && price > 0

      parsed.push({
        phone,
        price,
        priceOriginal,
        description,
        isValid
      })
    }

    setPreviewData(parsed)
    setResult(null)
  }

  const handleImport = async () => {
    const validSims = previewData.filter(s => s.isValid)
    if (validSims.length === 0) return

    setIsImporting(true)
    try {
      const res = await fetch("/api/admin/sims/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sims: validSims })
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setPreviewData([])
        setCsvText("")
      } else {
        alert(data.error || "Import failed")
      }
    } catch (e) {
      alert("Error parsing response")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Import Kho Sim</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Dán dữ liệu CSV</h3>
        <p className="text-sm text-gray-500 mb-4">
          Định dạng: <code>phone,price,priceOriginal,description</code> (Bỏ qua header). 
          Hệ thống sẽ tự động phân loại sim (Tam Hoa, Tứ Quý...).
        </p>
        
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full h-48 p-4 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50 mb-4 bg-gray-50"
          placeholder={"0914123456,2500000,3000000,Sim làm ăn\n0888888888,150000000,200000000,Lục quý VIP"}
        />

        <div className="flex justify-end">
          <button 
            onClick={handleParse}
            disabled={!csvText.trim()}
            className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition disabled:opacity-50"
          >
            Xem trước (Preview)
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-8 flex items-center gap-3">
          <Check size={24} className="text-green-600" />
          <div>
            <p className="font-bold">Import thành công!</p>
            <p className="text-sm">Đã thêm mới: {result.added} | Đã cập nhật giá: {result.updated} | Lỗi: {result.errors}</p>
          </div>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Preview ({previewData.length} dòng)</h3>
            <button 
              onClick={handleImport}
              disabled={isImporting || previewData.filter(s => s.isValid).length === 0}
              className="px-4 py-2 bg-[#0066CC] text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isImporting ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
              Tiến hành Import ({previewData.filter(s => s.isValid).length} hợp lệ)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
                <tr>
                  <th className="px-6 py-3">Số điện thoại</th>
                  <th className="px-6 py-3">Giá bán</th>
                  <th className="px-6 py-3">Giá gốc</th>
                  <th className="px-6 py-3">Ghi chú</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 50).map((sim, i) => (
                  <tr key={i} className={`border-b ${!sim.isValid ? 'bg-red-50/50' : 'bg-white'}`}>
                    <td className="px-6 py-3 font-medium text-gray-900">{sim.phone}</td>
                    <td className="px-6 py-3">{sim.price}</td>
                    <td className="px-6 py-3 text-gray-500">{sim.priceOriginal || '-'}</td>
                    <td className="px-6 py-3 text-gray-500">{sim.description || '-'}</td>
                    <td className="px-6 py-3 text-center">
                      {sim.isValid ? (
                        <span className="text-green-600 font-medium">Hợp lệ</span>
                      ) : (
                        <span className="text-red-600 font-medium flex items-center justify-center gap-1">
                          <AlertCircle size={14} /> Lỗi (Sai đầu số Vinaphone hoặc giá)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {previewData.length > 50 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 font-medium">
                      ... và {previewData.length - 50} dòng khác
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
