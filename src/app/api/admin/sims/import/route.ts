import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isValidVinaphone, classifySimType } from "@/lib/utils";
import { SimStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sims } = body;

    if (!Array.isArray(sims)) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ, yêu cầu mảng sims" }, { status: 400 });
    }

    let added = 0;
    let updated = 0;
    let errors = 0;

    for (const item of sims) {
      if (!item.phone || !isValidVinaphone(item.phone)) {
        errors++;
        continue;
      }

      const prefix = item.phone.substring(0, 4);
      const type = classifySimType(item.phone);

      try {
        const existing = await prisma.sim.findUnique({ where: { phone: item.phone } });
        
        if (existing) {
          await prisma.sim.update({
            where: { phone: item.phone },
            data: {
              price: item.price !== undefined ? item.price : existing.price,
              priceOriginal: item.priceOriginal !== undefined ? item.priceOriginal : existing.priceOriginal,
              description: item.description !== undefined ? item.description : existing.description,
            }
          });
          updated++;
        } else {
          if (item.price === undefined) {
            errors++;
            continue;
          }
          await prisma.sim.create({
            data: {
              phone: item.phone,
              prefix,
              type,
              price: item.price,
              priceOriginal: item.priceOriginal || null,
              description: item.description || null,
              status: 'AVAILABLE',
            }
          });
          added++;
        }
      } catch (err) {
        console.error("Import error on phone", item.phone, err);
        errors++;
      }
    }

    return NextResponse.json({ added, updated, errors });
  } catch (error) {
    console.error("POST /api/admin/sims/import error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
