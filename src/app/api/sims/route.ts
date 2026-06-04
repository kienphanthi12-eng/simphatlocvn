import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma, SimStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    const where: Prisma.SimWhereInput = {};
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (search) {
      const cleanSearch = search.replace(/\s+/g, "");
      where.phone = { contains: cleanSearch };
    }

    let orderBy: Prisma.SimOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "featured") orderBy = { featured: "desc" };

    const allSims = await prisma.sim.findMany({
      where,
      orderBy,
      select: {
        id: true,
        phone: true,
        prefix: true,
        type: true,
        price: true,
        priceOriginal: true,
        featured: true,
        status: true,
        createdAt: true,
      }
    });

    // Filter in JS to avoid Postgres enum mismatch errors
    const filteredSims = allSims.filter((s) => {
      if (s.status !== 'AVAILABLE') return false;
      if (type && s.type !== type) return false;
      return true;
    });

    const paginatedData = filteredSims.slice(skip, skip + limit);
    const total = filteredSims.length;

    // Remove status field from the return data to match client expectations
    const data = paginatedData.map(({ status, ...rest }) => rest);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("GET /api/sims error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
