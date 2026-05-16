import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { adminLoginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/jwt";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = adminLoginSchema.parse(body);

    const admin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    const token = await signJWT({ id: admin.id, email: admin.email, name: admin.name });

    const response = NextResponse.json({ success: true, user: { id: admin.id, name: admin.name, email: admin.email } });
    
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin Auth Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
