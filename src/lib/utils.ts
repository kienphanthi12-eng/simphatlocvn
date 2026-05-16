import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SimType, OrderStatus } from "@prisma/client"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function getSimTypeLabel(type: SimType): string {
  const labels: Record<SimType, string> = {
    TAM_HOA: "Tam Hoa",
    TAM_HOA_KEP: "Tam Hoa Kép",
    TU_QUY: "Tứ Quý",
    NGU_QUY: "Ngũ Quý",
    LUC_QUY: "Lục Quý",
    TIEN_LEN: "Tiến Lên",
    NAM_SINH: "Năm Sinh",
    LOC_PHAT: "Lộc Phát",
    DE_NHO: "Dễ Nhớ",
    GANH_DAO: "Gánh Đảo",
    LAP_KEP: "Lặp Kép",
    THAN_TAI: "Thần Tài",
    ONG_DIA: "Ông Địa",
    VIP: "VIP",
    KHAC: "Khác",
  };
  return labels[type] || "Khác";
}

export function getSimTypeColor(type: SimType): string {
  const colors: Record<SimType, string> = {
    TAM_HOA: "bg-blue-100 text-blue-800",
    TAM_HOA_KEP: "bg-indigo-100 text-indigo-800",
    TU_QUY: "bg-purple-100 text-purple-800",
    NGU_QUY: "bg-fuchsia-100 text-fuchsia-800",
    LUC_QUY: "bg-pink-100 text-pink-800",
    TIEN_LEN: "bg-rose-100 text-rose-800",
    NAM_SINH: "bg-orange-100 text-orange-800",
    LOC_PHAT: "bg-amber-100 text-amber-800",
    DE_NHO: "bg-yellow-100 text-yellow-800",
    GANH_DAO: "bg-lime-100 text-lime-800",
    LAP_KEP: "bg-green-100 text-green-800",
    THAN_TAI: "bg-emerald-100 text-emerald-800",
    ONG_DIA: "bg-teal-100 text-teal-800",
    VIP: "bg-red-100 text-red-800 font-bold",
    KHAC: "bg-gray-100 text-gray-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao hàng",
    READY_PICKUP: "Chờ khách đến lấy",
    DELIVERED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    SHIPPING: "bg-indigo-100 text-indigo-800",
    READY_PICKUP: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function generateOrderCode(): string {
  const dateStr = format(new Date(), "yyyyMMdd");
  const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `SPL-${dateStr}-${randomStr}`;
}

export function isValidVinaphone(phone: string): boolean {
  const validPrefixes = [
    "0914", "0915", "0916", "0917", "0918", "0919", 
    "0911", "0912", "0913", 
    "0888", "0886", "0885", "0884", "0883"
  ];
  if (phone.length !== 10) return false;
  const prefix = phone.substring(0, 4);
  return validPrefixes.includes(prefix);
}

export function classifySimType(phone: string): SimType {
  const last3 = phone.slice(-3);
  const next3 = phone.slice(-6, -3);
  
  if (/(\d)\1{5}$/.test(phone)) return SimType.LUC_QUY;
  if (/(\d)\1{4}$/.test(phone)) return SimType.NGU_QUY;
  if (/(\d)\1{3}$/.test(phone)) return SimType.TU_QUY;
  
  if (/(1234|2345|3456|4567|5678|6789)$/.test(phone)) return SimType.TIEN_LEN;
  
  if (last3 === next3 && /(\d)\1{2}/.test(last3)) return SimType.TAM_HOA_KEP;
  if (/(\d)\1{2}$/.test(phone)) return SimType.TAM_HOA;
  
  if (/68$|86$|88$/.test(phone)) return SimType.LOC_PHAT;
  if (/79$|97$|99$/.test(phone)) return SimType.THAN_TAI;
  
  const year = parseInt(phone.slice(-4));
  if (year >= 1950 && year <= 2015) return SimType.NAM_SINH;
  
  if (/(\d{2})\1$/.test(phone)) return SimType.LAP_KEP;
  if (/(\d)(\d)\1\2$/.test(phone)) return SimType.LAP_KEP;
  
  if (/(\d)(\d)\1$/.test(phone) && phone.slice(-1) !== phone.slice(-2, -1)) return SimType.GANH_DAO;

  return SimType.KHAC;
}
