import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus, SimStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalSims,
      soldSims,
      pendingOrders,
      todayOrders,
      monthRevenueData,
      recentOrders
    ] = await Promise.all([
      prisma.sim.count({ where: { status: 'AVAILABLE' } }),
      prisma.sim.count({ where: { status: 'SOLD' } }),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: OrderStatus.DELIVERED,
          createdAt: { gte: startOfMonth }
        }
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          sim: { select: { phone: true } }
        }
      })
    ]);

    return NextResponse.json({
      data: {
        totalSims,
        soldSims,
        pendingOrders,
        todayOrders,
        monthRevenue: monthRevenueData._sum.totalAmount || 0,
        recentOrders
      }
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
