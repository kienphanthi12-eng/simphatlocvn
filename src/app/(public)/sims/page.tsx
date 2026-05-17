import { FilterSidebar } from "@/components/sim/FilterSidebar"
import { SimCard } from "@/components/ui/SimCard"
import prisma from "@/lib/db"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody } from "@/components/ui/table"
import { SortSelect } from "@/components/sim/SortSelect"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SearchX } from "lucide-react"

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
    const isDigitsOnlyOrWildcard = /^[0-9*]+$/.test(cleanSearch)
    
    if (isDigitsOnlyOrWildcard) {
      where.phone = { contains: cleanSearch.replace(/\*/g, "") }
    } else {
      where.OR = [
        { phone: { contains: cleanSearch } },
        { description: { contains: cleanSearch, mode: 'insensitive' } }
      ]
    }
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
    <div className="min-h-screen bg-background py-5">
      <div className="mx-auto flex max-w-7xl gap-5 px-4">

        {/* Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Suspense fallback={<div className="w-[230px] min-h-[400px] rounded-lg border border-border bg-card p-4 animate-pulse" />}>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Main Content */}
        <main className="min-w-0 flex-1 space-y-5">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-border bg-card p-3">
            <div className="text-sm text-muted-foreground font-medium px-2">
              Tìm thấy <span className="font-bold text-foreground">{total}</span> sim Vinaphone phù hợp
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sắp xếp:</span>
              <Suspense fallback={<div className="w-[180px] h-9 bg-muted rounded animate-pulse" />}>
                <SortSelect />
              </Suspense>
            </div>
          </div>

          {/* Results */}
          {sims.length === 0 ? (
            <Card className="p-12 text-center shadow-sm">
              <div className="flex justify-center mb-4 text-muted-foreground/30">
                <SearchX size={64} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Không tìm thấy sim nào</h3>
              <p className="text-sm text-muted-foreground mb-6">Thử thay đổi bộ lọc hoặc tìm với từ khóa khác.</p>
              <Link href="/sims" className={cn(buttonVariants({ variant: 'outline' }))}>
                Xóa tất cả bộ lọc
              </Link>
            </Card>
          ) : (
            <Card className="shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-[1fr_130px_150px_110px] items-center border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                  <span>Số điện thoại</span>
                  <span>Loại sim</span>
                  <span className="text-right">Giá bán</span>
                  <span className="text-center">Thao tác</span>
                </div>
                <Table>
                  <TableBody>
                    {sims.map((sim) => (
                      <SimCard key={sim.id} sim={sim} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && sims.length > 0 && (
            <div className="flex justify-center items-center gap-4 pt-2">
              {page > 1 ? (
                <Link href={buildUrl({ page: (page - 1).toString() })} className={cn(buttonVariants({ variant: 'outline' }))}>
                  Trang trước
                </Link>
              ) : (
                <Button variant="outline" disabled>Trang trước</Button>
              )}

              <span className="text-sm font-medium text-muted-foreground">
                Trang {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link href={buildUrl({ page: (page + 1).toString() })} className={cn(buttonVariants({ variant: 'outline' }))}>
                  Trang sau
                </Link>
              ) : (
                <Button variant="outline" disabled>Trang sau</Button>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
