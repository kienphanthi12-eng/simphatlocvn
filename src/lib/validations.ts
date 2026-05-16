import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const orderSchema = z.object({
  customerName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  customerPhone: z.string().regex(/^(0)[1-9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  customerAddress: z.string().optional(),
  isPickup: z.boolean().default(false),
  pickupNote: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  note: z.string().optional(),
});

export const simFilterSchema = z.object({
  type: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
