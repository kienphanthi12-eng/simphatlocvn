import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { Prisma } from "@prisma/client"
import {
  tinhDiemPhongThuy,
  getBanMenh,
  getCungMenh,
  getNguhanhSim,
  getNguhanhLabel,
  type NguHanh,
} from "@/lib/phongthuy"
import { formatPhone } from "@/lib/utils"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const namSinhStr = searchParams.get("namSinh")
  const gioiTinh = (searchParams.get("gioiTinh") ?? "nam") as "nam" | "nu"
  const filterScore = parseInt(searchParams.get("filterScore") ?? "0")
  const filterType = searchParams.get("filterType") ?? ""
  const minPriceStr = searchParams.get("minPrice") ?? ""
  const maxPriceStr = searchParams.get("maxPrice") ?? ""
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const sort = searchParams.get("sort") ?? "diem_desc"
  const limit = 10

  if (!namSinhStr) {
    return NextResponse.json({ error: "Thiếu năm sinh" }, { status: 400 })
  }

  const namSinh = parseInt(namSinhStr)
  if (isNaN(namSinh) || namSinh < 1940 || namSinh > 2010) {
    return NextResponse.json({ error: "Năm sinh không hợp lệ" }, { status: 400 })
  }

  try {
    // Build Prisma where — do NOT filter by status here (column is text, not PG enum)
    const where: Prisma.SimWhereInput = {}
    if (filterType) where.type = filterType as Prisma.SimWhereInput["type"]
    if (minPriceStr || maxPriceStr) {
      where.price = {}
      if (minPriceStr) (where.price as Prisma.IntFilter).gte = parseInt(minPriceStr)
      if (maxPriceStr) (where.price as Prisma.IntFilter).lte = parseInt(maxPriceStr)
    }

    // Fetch all, then filter AVAILABLE in JS (same pattern as /sims/page.tsx)
    const rawSims = await prisma.sim.findMany({ where })
    const allSims = rawSims.filter(s => s.status === 'AVAILABLE')

    // Tính điểm và enrich data
    let enriched = allSims.map((sim) => {
      const diem = tinhDiemPhongThuy(sim.phone, namSinh)
      const nguhanhSim = getNguhanhSim(sim.phone)
      const phone = sim.phone.replace(/\D/g, "")
      const phoneTail = phone.slice(-3)
      const isSale = sim.priceOriginal != null && sim.priceOriginal > sim.price
      const discountPercent = isSale && sim.priceOriginal
        ? Math.round((1 - sim.price / sim.priceOriginal) * 100)
        : null

      return {
        id: sim.id,
        phone: sim.phone,
        phoneFormatted: formatPhone(sim.phone),
        phoneTail,
        type: sim.type,
        nguhanh: nguhanhSim,
        nguhanhLabel: getNguhanhLabel(nguhanhSim),
        diem,
        price: sim.price,
        priceOriginal: sim.priceOriginal,
        discountPercent,
        featured: sim.featured,
      }
    })

    // Filter theo diem
    if (filterScore > 0) {
      enriched = enriched.filter((s) => s.diem >= filterScore)
    }

    // Sort
    if (sort === "diem_desc") enriched.sort((a, b) => b.diem - a.diem)
    else if (sort === "price_asc") enriched.sort((a, b) => a.price - b.price)
    else if (sort === "price_desc") enriched.sort((a, b) => b.price - a.price)

    const total = enriched.length
    const data = enriched.slice((page - 1) * limit, page * limit)

    const banMenh = getBanMenh(namSinh)
    const cungMenh = getCungMenh(namSinh, gioiTinh)
    const banMenhLabel = getNguhanhLabel(banMenh)

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      banMenh,
      banMenhLabel,
      cungMenh,
    })
  } catch (err) {
    console.error("[sim-phong-thuy] Error:", err)
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
  }
}
