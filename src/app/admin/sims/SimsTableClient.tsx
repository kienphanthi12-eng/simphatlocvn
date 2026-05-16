"use client"

import { useState } from "react"
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils"
import { SimType } from "@prisma/client"
import { Loader2, Star, Eye, EyeOff, Edit2, Check, X } from "lucide-react"

export function SimsTableClient({ initialSims }: { initialSims: any[] }) {
  const [sims, setSims] = useState(initialSims)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  // Inline edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [editPriceValue, setEditPriceValue] = useState("")

  // Apply local filters
  let filteredSims = sims
  if (searchTerm) {
    const q = searchTerm.replace(/\s+/g, "")
    filteredSims = filteredSims.filter(s => s.phone.includes(q))
  }
  if (filterType !== "ALL") {
    filteredSims = filteredSims.filter(s => s.type === filterType)
  }
  if (filterStatus !== "ALL") {
    filteredSims = filteredSims.filter(s => s.status === filterStatus)
  }

  // Update wrapper
  const handleUpdate = async (id: string, data: any) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/sims/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update")
      
      setSims(sims.map(s => s.id === id ? { ...s, ...data } : s))
    } catch (e) {
      alert("Lỗi khi cập nhật sim!")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleToggleStatus = (sim: any) => {
    // only allow toggle between AVAILABLE and HIDDEN
    if (sim.status === 'SOLD' || sim.status === 'RESERVED') {
      alert("Không thể ẩn/hiện sim đã bán hoặc đang được giữ!")
      return
    }
    const newStatus = sim.status === 'AVAILABLE' ? 'HIDDEN' : 'AVAILABLE'
    handleUpdate(sim.id, { status: newStatus })
  }

  const handleToggleFeatured = (sim: any) => {
    handleUpdate(sim.id, { featured: !sim.featured })
  }

  const startEditPrice = (sim: any) => {
    setEditingPriceId(sim.id)
    setEditPriceValue(sim.price.toString())
  }

  const saveEditPrice = (sim: any) => {
    const num = parseInt(editPriceValue)
    if (isNaN(num) || num <= 0) {
      alert("Giá không hợp lệ")
      return
    }
    handleUpdate(sim.id, { price: num })
    setEditingPriceId(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Tìm theo số điện thoại..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066CC] text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="ALL">Tất cả Loại</option>
            {Object.keys(SimType).map(t => (
              <option key={t} value={t}>{getSimTypeLabel(t as any)}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="ALL">Tất cả Trạng thái</option>
            <option value="AVAILABLE">Sẵn sàng (Available)</option>
            <option value="RESERVED">Đang giữ (Reserved)</option>
            <option value="SOLD">Đã bán (Sold)</option>
            <option value="HIDDEN">Đang ẩn (Hidden)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
            <tr>
              <th className="px-6 py-3">Số điện thoại</th>
              <th className="px-6 py-3">Loại</th>
              <th className="px-6 py-3 min-w-[150px]">Giá bán</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSims.map((sim) => (
              <tr key={sim.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-lg text-[#0066CC] tracking-wider">
                  {formatPhone(sim.phone)}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {getSimTypeLabel(sim.type)}
                </td>
                <td className="px-6 py-4">
                  {editingPriceId === sim.id ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        value={editPriceValue}
                        onChange={e => setEditPriceValue(e.target.value)}
                        className="w-24 px-2 py-1 border rounded text-sm font-bold focus:outline-none focus:border-[#0066CC]"
                        autoFocus
                      />
                      <button onClick={() => saveEditPrice(sim)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingPriceId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <span className="font-bold text-gray-900">{formatPrice(sim.price)}</span>
                      <button onClick={() => startEditPrice(sim)} className="text-gray-400 hover:text-[#0066CC] opacity-0 group-hover:opacity-100 transition">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold bg-gray-100 ${
                    sim.status === 'AVAILABLE' ? 'text-green-600 bg-green-50' : 
                    sim.status === 'SOLD' ? 'text-gray-500 bg-gray-200' :
                    sim.status === 'RESERVED' ? 'text-amber-600 bg-amber-50' :
                    'text-red-600 bg-red-50'
                  }`}>
                    {sim.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {updatingId === sim.id ? (
                      <Loader2 size={20} className="animate-spin text-[#0066CC]" />
                    ) : (
                      <>
                        <button 
                          onClick={() => handleToggleFeatured(sim)}
                          title="Đánh dấu nổi bật"
                          className={`p-1.5 rounded-lg transition ${sim.featured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          <Star size={18} fill={sim.featured ? "currentColor" : "none"} />
                        </button>
                        
                        {(sim.status === 'AVAILABLE' || sim.status === 'HIDDEN') && (
                          <button 
                            onClick={() => handleToggleStatus(sim)}
                            title={sim.status === 'AVAILABLE' ? 'Ẩn sim' : 'Hiện sim'}
                            className={`p-1.5 rounded-lg transition ${sim.status === 'AVAILABLE' ? 'text-gray-400 hover:bg-gray-100' : 'text-red-500 bg-red-50 hover:bg-red-100'}`}
                          >
                            {sim.status === 'AVAILABLE' ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredSims.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy sim nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
