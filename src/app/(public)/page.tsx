import { SimCard } from "@/components/ui/SimCard"
import { FilterSidebar } from "@/components/sim/FilterSidebar"
import { PromoBanner } from "@/components/ui/PromoBanner"
import prisma from "@/lib/db"
import Link from "next/link"
import { Suspense } from "react"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function HomePage() {
  const [featuredSims, newestSims] = await Promise.all([
    prisma.sim.findMany({
      where: { featured: true },
      take: 20,
      orderBy: { createdAt: "desc" }
    }),
    prisma.sim.findMany({
      take: 20,
      orderBy: { createdAt: "desc" }
    })
  ])

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

          {/* Banner */}
          <PromoBanner />

          {/* Sim Nổi Bật */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-4">
              <CardTitle className="text-lg font-bold">Sim Nổi Bật</CardTitle>
              <Link href="/sims?featured=true" className="text-sm font-semibold text-brand hover:underline">
                Xem tất cả →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-[1fr_130px_150px_110px] items-center border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                <span>Số điện thoại</span>
                <span>Loại sim</span>
                <span className="text-right">Giá bán</span>
                <span className="text-center">Thao tác</span>
              </div>
              <Table>
                <TableBody>
                  {featuredSims.map(sim => (
                    <SimCard key={sim.id} sim={sim} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Sim Mới Nhất */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-4">
              <CardTitle className="text-lg font-bold">Sim Mới Nhất</CardTitle>
              <Link href="/sims" className="text-sm font-semibold text-brand hover:underline">
                Xem tất cả →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-[1fr_130px_150px_110px] items-center border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                <span>Số điện thoại</span>
                <span>Loại sim</span>
                <span className="text-right">Giá bán</span>
                <span className="text-center">Thao tác</span>
              </div>
              <Table>
                <TableBody>
                  {newestSims.map(sim => (
                    <SimCard key={sim.id} sim={sim} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </main>
      </div>

      {/* Mobile Sidebar Floating Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Filter size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 border-r-0">
            <div className="h-full overflow-y-auto p-4 bg-background">
              <Suspense fallback={<div className="w-full min-h-[400px] rounded-lg border border-border bg-card p-4 animate-pulse" />}>
                <FilterSidebar />
              </Suspense>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
