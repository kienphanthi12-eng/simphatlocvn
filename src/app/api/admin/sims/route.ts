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
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const where: Prisma.SimWhereInput = {};

    if (status) where.status = status as any;
    if (type) where.type = type as any;
    if (featured === "true") where.featured = true;

    if (search) {
      const cleanSearch = search.replace(/\s+/g, "");
      where.phone = { contains: cleanSearch };
    }

    const [data, total] = await Promise.all([
      prisma.sim.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.sim.count({ where })
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("GET /api/admin/sims error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
