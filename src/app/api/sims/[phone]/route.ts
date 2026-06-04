import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SimStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    const { phone } = await params;

    const sim = await prisma.sim.findUnique({
      where: { phone }
    });

    if (!sim) {
      return NextResponse.json({ error: "Sim không tồn tại" }, { status: 404 });
    }

    // Lấy tất cả sim khác và lọc trong JS để tránh lỗi enum Postgres
    const allSims = await prisma.sim.findMany({
      where: {
        id: { not: sim.id }
      },
      select: {
        id: true,
        phone: true,
        prefix: true,
        type: true,
        price: true,
        priceOriginal: true,
        featured: true,
        status: true,
      }
    });

    const relatedSims = allSims
      .filter((s) => s.type === sim.type && s.status === 'AVAILABLE')
      .slice(0, 5)
      .map(({ status, ...rest }) => rest);

    return NextResponse.json({
      data: {
        ...sim,
        related: relatedSims
      }
    });
  } catch (error) {
    console.error("GET /api/sims/[phone] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
