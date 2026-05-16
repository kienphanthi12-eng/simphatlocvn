import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { orderSchema } from "@/lib/validations";
import { generateOrderCode } from "@/lib/utils";
import { SimStatus } from "@prisma/client";
import { z, ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const simId = body.simId;
    if (!simId) return NextResponse.json({ error: "Thiếu simId" }, { status: 400 });

    const validatedData = orderSchema.parse(body);

    const order = await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra sim
      const sim = await tx.sim.findUnique({ where: { id: simId } });
      
      if (!sim) {
        throw new Error("Sim không tồn tại");
      }
      if (sim.status !== 'AVAILABLE') {
        throw new Error("Sim đã được đặt hoặc đã bán");
      }

      // 2. Cập nhật trạng thái sim
      await tx.sim.update({
        where: { id: sim.id },
        data: { status: 'RESERVED' }
      });

      // 3. Tạo order
      const orderCode = generateOrderCode();
      const newOrder = await tx.order.create({
        data: {
          ...validatedData,
          simId: sim.id,
          orderCode,
          totalAmount: sim.price
        }
      });

      return newOrder;
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
