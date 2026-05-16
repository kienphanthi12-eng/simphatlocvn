import { Sim } from "@prisma/client";
import { formatPhone, formatPrice } from "@/lib/utils";
import { SimTypeBadge } from "./Badge";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface SimCardProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price" | "priceOriginal" | "featured">;
  view?: "grid" | "table";
}

export function SimCard({ sim, view = "grid" }: SimCardProps) {
  const isSale = sim.priceOriginal && sim.priceOriginal > sim.price;

  if (view === "table") {
    return (
      <div className="flex items-center justify-between p-4 bg-white border-b hover:bg-gray-50 transition group">
        <div className="flex items-center gap-6">
          <Link href={`/sims/${sim.phone}`} className="text-phone group-hover:text-[var(--blue-500)] transition">
            {formatPhone(sim.phone)}
          </Link>
          <div className="hidden md:flex gap-2 items-center">
            <span className="text-[11px] font-[600] tracking-[0.8px] uppercase text-white bg-[var(--blue-500)] px-2 py-0.5 rounded">Vina</span>
            <SimTypeBadge type={sim.type} />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-price">{formatPrice(sim.price)}</div>
            {isSale && (
              <div className="text-price-old">{formatPrice(sim.priceOriginal!)}</div>
            )}
          </div>
          <Link 
            href={`/checkout?phone=${sim.phone}`}
            className="hidden sm:flex bg-[var(--blue-500)] text-white px-[18px] py-[8px] rounded-[8px] font-sans text-[13px] font-[700] tracking-[0.3px] hover:bg-[var(--blue-600)] transition items-center gap-2"
          >
            Mua
          </Link>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
      <div className="p-5 text-center relative">
        {sim.featured && (
          <span className="absolute top-3 right-3 text-[10px] uppercase font-bold text-white bg-red-500 px-2 py-0.5 rounded shadow-sm">
            Hot
          </span>
        )}
        <span className="absolute top-3 left-3 text-[11px] font-[600] tracking-[0.8px] uppercase text-[var(--blue-500)] bg-[var(--blue-50)] border border-[var(--blue-100)] px-2 py-0.5 rounded">
          Vinaphone
        </span>
        
        <Link href={`/sims/${sim.phone}`} className="block mt-6 mb-2">
          <h3 className="text-phone group-hover:text-[var(--blue-500)] transition">
            {formatPhone(sim.phone)}
          </h3>
        </Link>
        
        <div className="mb-4">
          <SimTypeBadge type={sim.type} />
        </div>

        <div className="flex flex-col items-center justify-center h-14 mb-4">
          <div className="text-price">{formatPrice(sim.price)}</div>
          {isSale && (
            <div className="text-price-old">{formatPrice(sim.priceOriginal!)}</div>
          )}
        </div>

        <Link 
          href={`/checkout?phone=${sim.phone}`}
          className="flex w-full bg-[var(--blue-500)] text-white py-[8px] px-[18px] rounded-[8px] font-sans text-[13px] font-[700] tracking-[0.3px] hover:bg-[var(--blue-600)] transition items-center justify-center gap-2"
        >
          <ShoppingCart size={18} /> Đặt mua ngay
        </Link>
      </div>
    </div>
  );
}
