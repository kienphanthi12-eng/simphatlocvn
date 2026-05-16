import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus, SimStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status }
      });

      // Nếu huỷ đơn -> hoàn lại sim về AVAILABLE
      if (status === OrderStatus.CANCELLED) {
        await tx.sim.update({
          where: { id: order.simId },
          data: { status: 'AVAILABLE' }
        });
      }

      // Nếu hoàn thành -> sim thành SOLD
      if (status === OrderStatus.DELIVERED) {
        await tx.sim.update({
          where: { id: order.simId },
          data: { status: 'SOLD' }
        });
      }

      return order;
    });

    return NextResponse.json({ data: updatedOrder });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
