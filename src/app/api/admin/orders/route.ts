import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Prisma.OrderWhereInput = {};

    if (status) where.status = status as any;

    if (search) {
      const cleanSearch = search.trim();
      where.OR = [
        { orderCode: { contains: cleanSearch, mode: "insensitive" } },
        { customerPhone: { contains: cleanSearch } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          sim: {
            select: { phone: true, price: true, type: true }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
