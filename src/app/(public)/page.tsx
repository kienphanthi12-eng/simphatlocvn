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

          {/* Royal Heritage Intro Plaque */}
          <div className="bg-[#5C1D24] text-[#FAF9F5] rounded-2xl p-6 md:p-8 text-center relative overflow-hidden border border-[#B3925F]/60 shadow-lg shadow-[#5C1D24]/10 bg-cloud-pattern group transition-all duration-300 hover:border-[#B3925F]">
            {/* Fine royal corner gold ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#B3925F]/50 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#B3925F]/50 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#B3925F]/50 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#B3925F]/50 rounded-br-sm pointer-events-none" />

            {/* Faint gold dragon backdrops on the far left and far right (Quiet Luxury style) */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 opacity-10 mix-blend-screen pointer-events-none select-none transition-all duration-700 group-hover:scale-105 group-hover:opacity-15">
              <img src="/royal_decorations.png" alt="Dragon Back" className="w-full h-full object-contain scale-[1.6]" />
            </div>
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-48 opacity-10 mix-blend-screen pointer-events-none select-none transition-all duration-700 group-hover:scale-105 group-hover:opacity-15">
              <img src="/royal_decorations.png" alt="Phoenix Back" className="w-full h-full object-contain scale-[1.6] -scale-x-100" />
            </div>

            {/* Central content */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-[#B3925F]/60 shadow-md bg-white flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
                <img src="/logo.png" alt="Sim Phát Lộc" className="h-full w-full object-cover scale-[1.08]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black tracking-[0.05em] font-display flex items-center justify-center gap-2 mb-2 text-white" style={{ fontFamily: "var(--font-display)" }}>
                <span className="text-[#B3925F]">Sim</span> Phát Lộc
              </h2>
              
              <p className="text-[10px] md:text-xs text-[#B3925F] font-black uppercase tracking-[0.3em] mb-4">
                Hoàng Gia Di Sản
              </p>

              {/* Soaring Ornaments divider */}
              <div className="flex justify-center items-center mb-4 opacity-90 select-none pointer-events-none max-w-[200px] md:max-w-[250px] transition-transform duration-500 group-hover:scale-[1.03]">
                <img src="/royal_decorations.png" alt="Dragon & Phoenix Divider" className="h-8 object-contain mix-blend-screen" />
              </div>

              <p className="text-xs md:text-sm text-amber-50/80 max-w-xl mx-auto leading-relaxed font-medium">
                Nơi hội tụ tinh hoa phong thủy truyền thống Việt Nam. Chúng tôi tuyển chọn hàng ngàn SIM số đẹp Vinaphone Đại Cát, mang lại vạn sự hanh thông, tài lộc hưng thịnh và đẳng cấp di sản bền vững cho quý chủ nhân.
              </p>
            </div>
          </div>

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
          <SheetTrigger render={
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Filter size={24} />
            </button>
          } />
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
