import { FilterSidebar } from "@/components/sim/FilterSidebar"
import { SimCard } from "@/components/ui/SimCard"
import prisma from "@/lib/db"
import { SimStatus, Prisma } from "@prisma/client"
import { LayoutGrid, List } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  page?: string
  limit?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  search?: string
  sort?: string
  featured?: string
  view?: string // "grid" | "table"
}

export default async function SimsPage({ searchParams }: { searchParams: SearchParams }) {
  // Wait for searchParams resolution in Next.js 15+ (if applicable, but safe to do destructuring here or await)
  // Assuming standard Next.js behavior for searchParams
  const params = await Promise.resolve(searchParams);
  
  const page = parseInt(params.page || "1")
  const limit = parseInt(params.limit || "20")
  const skip = (page - 1) * limit
  const view = (params.view as "grid" | "table") || "grid"

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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Danh Sách Sim Vinaphone</h1>
          <p className="text-gray-500 mt-2">Đang hiển thị {total} sim số đẹp phù hợp</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
                <Link href={buildUrl({ sort: null, page: "1" })} className={`text-sm px-3 py-1.5 rounded-full ${!params.sort || params.sort === 'newest' ? 'bg-[#0066CC] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Mới nhất</Link>
                <Link href={buildUrl({ sort: "price_asc", page: "1" })} className={`text-sm px-3 py-1.5 rounded-full ${params.sort === 'price_asc' ? 'bg-[#0066CC] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Giá tăng dần</Link>
                <Link href={buildUrl({ sort: "price_desc", page: "1" })} className={`text-sm px-3 py-1.5 rounded-full ${params.sort === 'price_desc' ? 'bg-[#0066CC] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Giá giảm dần</Link>
              </div>

              <div className="flex items-center gap-2 border-l pl-4">
                <Link href={buildUrl({ view: "grid" })} className={`p-2 rounded ${view === 'grid' ? 'bg-gray-200 text-[#0066CC]' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <LayoutGrid size={20} />
                </Link>
                <Link href={buildUrl({ view: "table" })} className={`p-2 rounded ${view === 'table' ? 'bg-gray-200 text-[#0066CC]' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <List size={20} />
                </Link>
              </div>
            </div>

            {/* Results */}
            {sims.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sim nào</h3>
                <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm với từ khóa khác.</p>
                <Link href="/sims" className="mt-4 inline-block text-[#0066CC] font-medium hover:underline">
                  Xóa tất cả bộ lọc
                </Link>
              </div>
            ) : (
              <>
                {view === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sims.map((sim) => (
                      <SimCard key={sim.id} sim={sim} view="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {sims.map((sim) => (
                      <SimCard key={sim.id} sim={sim} view="table" />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    {page > 1 && (
                      <Link href={buildUrl({ page: (page - 1).toString() })} className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 font-medium text-gray-700">
                        &larr; Trước
                      </Link>
                    )}
                    
                    <span className="px-4 py-2 text-gray-700 font-medium">
                      Trang {page} / {totalPages}
                    </span>

                    {page < totalPages && (
                      <Link href={buildUrl({ page: (page + 1).toString() })} className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 font-medium text-gray-700">
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
