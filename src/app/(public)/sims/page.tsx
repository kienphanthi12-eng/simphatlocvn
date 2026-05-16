import { FilterSidebar } from "@/components/sim/FilterSidebar"
import { SimCard } from "@/components/ui/SimCard"
import prisma from "@/lib/db"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { Suspense } from "react"

interface SearchParams {
  page?: string
  limit?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  search?: string
  sort?: string
  featured?: string
}

export default async function SimsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  
  const page = parseInt(params.page || "1")
  const limit = parseInt(params.limit || "20")
  const skip = (page - 1) * limit

  // Build where clause
  const where: Prisma.SimWhereInput = {}

  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) where.price.gte = parseInt(params.minPrice)
    if (params.maxPrice) where.price.lte = parseInt(params.maxPrice)
  }

  if (params.featured === "true") {
    where.featured = true
  }

  if (params.search) {
    const cleanSearch = params.search.replace(/\s+/g, "")
    where.phone = { contains: cleanSearch }
  }

  // Build order by
  let orderBy: Prisma.SimOrderByWithRelationInput = { createdAt: "desc" }
  if (params.sort === "price_asc") orderBy = { price: "asc" }
  else if (params.sort === "price_desc") orderBy = { price: "desc" }
  else if (params.sort === "featured") orderBy = { featured: "desc" }

  // Fetch all and filter in memory
  const allSims = await prisma.sim.findMany({
    where,
    orderBy,
  })

  let filtered = allSims.filter(s => s.status === 'AVAILABLE')

  if (params.type) {
    const types = params.type.split(",")
    filtered = filtered.filter(s => types.includes(s.type))
  }

  const total = filtered.length
  const sims = filtered.slice(skip, skip + limit)

  const totalPages = Math.ceil(total / limit)

  // Helper to build URL params
  const buildUrl = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v) newParams.set(k, v)
    })
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null) newParams.delete(k)
      else newParams.set(k, v)
    })
    return `/sims?${newParams.toString()}`
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-[800] tracking-tight text-[#0F172A]">Danh Sách Sim Vinaphone</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Đang hiển thị {total} sim số đẹp phù hợp</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-[230px] shrink-0">
            <Suspense fallback={<div className="bg-white p-5 rounded-[8px] border border-[#E2E8F0] min-h-[400px]">Đang tải bộ lọc...</div>}>
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-[8px] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 mb-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-[500] text-[#64748B] mr-2">Sắp xếp:</span>
                <Link href={buildUrl({ sort: null, page: "1" })} className={`text-[13px] font-[500] px-3.5 py-1.5 rounded-full transition ${!params.sort || params.sort === 'newest' ? 'bg-[#005BAC] text-white' : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'}`}>Mới nhất</Link>
                <Link href={buildUrl({ sort: "price_asc", page: "1" })} className={`text-[13px] font-[500] px-3.5 py-1.5 rounded-full transition ${params.sort === 'price_asc' ? 'bg-[#005BAC] text-white' : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'}`}>Giá tăng dần</Link>
                <Link href={buildUrl({ sort: "price_desc", page: "1" })} className={`text-[13px] font-[500] px-3.5 py-1.5 rounded-full transition ${params.sort === 'price_desc' ? 'bg-[#005BAC] text-white' : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'}`}>Giá giảm dần</Link>
              </div>
            </div>

            {/* Results */}
            {sims.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-[8px] border border-[#E2E8F0] shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-[18px] font-[700] text-[#0F172A] mb-2">Không tìm thấy sim nào</h3>
                <p className="text-[14px] text-[#64748B]">Thử thay đổi bộ lọc hoặc tìm với từ khóa khác.</p>
                <Link href="/sims" className="mt-4 inline-block text-[13.5px] text-[#005BAC] font-[600] hover:underline">
                  Xóa tất cả bộ lọc
                </Link>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#EBF4FF] text-[#005BAC] text-[11px] font-[700] uppercase tracking-[1px] border-b border-[#DBEAFE]">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Số điện thoại</th>
                        <th className="py-3 px-4 font-semibold">Phân loại</th>
                        <th className="py-3 px-4 font-semibold">Giá bán</th>
                        <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sims.map((sim) => (
                        <SimCard key={sim.id} sim={sim} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    {page > 1 && (
                      <Link href={buildUrl({ page: (page - 1).toString() })} className="px-4 py-2 border border-[#E2E8F0] rounded-[8px] bg-white hover:bg-[#F8FAFC] text-[13.5px] font-[500] text-[#334155] transition">
                        &larr; Trước
                      </Link>
                    )}
                    
                    <span className="px-4 py-2 text-[#475569] text-[13.5px] font-[500]">
                      Trang {page} / {totalPages}
                    </span>

                    {page < totalPages && (
                      <Link href={buildUrl({ page: (page + 1).toString() })} className="px-4 py-2 border border-[#E2E8F0] rounded-[8px] bg-white hover:bg-[#F8FAFC] text-[13.5px] font-[500] text-[#334155] transition">
                        Sau &rarr;
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
