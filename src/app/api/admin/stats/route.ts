import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus, SimStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allSims, allOrders] = await Promise.all([
      prisma.sim.findMany({
        select: { status: true }
      }),
      prisma.order.findMany({
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          customerName: true,
          customerPhone: true,
          sim: { select: { phone: true } }
        }
      })
    ]);

    const totalSims = allSims.filter(s => s.status === 'AVAILABLE').length;
    const soldSims = allSims.filter(s => s.status === 'SOLD').length;
    const pendingOrders = allOrders.filter(o => o.status === 'PENDING').length;
    const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfDay).length;
    
    const monthRevenue = allOrders
      .filter(o => o.status === 'DELIVERED' && new Date(o.createdAt) >= startOfMonth)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      data: {
        totalSims,
        soldSims,
        pendingOrders,
        todayOrders,
        monthRevenue,
        recentOrders
      }
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
