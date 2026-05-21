import { FilterSidebar } from "@/components/sim/FilterSidebar"
import prisma from "@/lib/db"
import { Suspense } from "react"
import { SortSelect } from "@/components/sim/SortSelect"
import { Prisma } from "@prisma/client"
import SimsGridClient from "./SimsGridClient"

interface SearchParams {
  sort?: string
  featured?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  search?: string
}

export default async function SimsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams

  let orderBy: Prisma.SimOrderByWithRelationInput = { createdAt: "desc" }
  if (params.sort === "price_asc") orderBy = { price: "asc" }
  else if (params.sort === "price_desc") orderBy = { price: "desc" }
  else if (params.sort === "featured") orderBy = { featured: "desc" }

  const where: Prisma.SimWhereInput = {}
  if (params.featured === "true") where.featured = true

  const allSims = await prisma.sim.findMany({
    where,
    orderBy,
    select: {
      id: true,
      phone: true,
      type: true,
      price: true,
      priceOriginal: true,
      featured: true,
      status: true,
    },
  })

  // Filter AVAILABLE in JS — DB column is text, not a PG enum, so Prisma
  // enum comparisons in WHERE clauses cause "operator does not exist" errors.
  const sims = allSims.filter((s) => s.status === "AVAILABLE")

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

          {/* Sort toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sắp xếp:</span>
              <Suspense fallback={<div className="w-[180px] h-9 bg-muted rounded animate-pulse" />}>
                <SortSelect />
              </Suspense>
            </div>
          </div>

          <SimsGridClient
            initialSims={sims}
            initialType={params.type || ""}
            initialSearch={params.search || ""}
            initialMinPrice={params.minPrice ? String(Math.round(parseInt(params.minPrice) / 1_000_000)) : ""}
            initialMaxPrice={params.maxPrice ? String(Math.round(parseInt(params.maxPrice) / 1_000_000)) : ""}
          />

        </main>
      </div>
    </div>
  )
}
