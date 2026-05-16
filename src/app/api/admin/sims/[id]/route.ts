import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const { status, featured, price, priceOriginal, description } = body;

    const updatedSim = await prisma.sim.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured }),
        ...(price !== undefined && { price }),
        ...(priceOriginal !== undefined && { priceOriginal }),
        ...(description !== undefined && { description }),
      }
    });

    return NextResponse.json({ data: updatedSim });
  } catch (error) {
    console.error("PATCH /api/admin/sims/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
