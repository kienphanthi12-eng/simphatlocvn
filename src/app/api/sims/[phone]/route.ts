import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SimStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { phone: string } }
) {
  try {
    const { phone } = params;

    const sim = await prisma.sim.findUnique({
      where: { phone }
    });

    if (!sim) {
      return NextResponse.json({ error: "Sim không tồn tại" }, { status: 404 });
    }

    // Lấy 5 sim cùng loại
    const relatedSims = await prisma.sim.findMany({
      where: {
        type: sim.type,
        status: 'AVAILABLE',
        id: { not: sim.id }
      },
      take: 5,
      select: {
        id: true,
        phone: true,
        prefix: true,
        type: true,
        price: true,
        priceOriginal: true,
        featured: true,
      }
    });

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
