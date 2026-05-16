import { Sim } from "@prisma/client";
import { formatPhone, formatPrice } from "@/lib/utils";
import { SimTypeBadge } from "./Badge";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface SimCardProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price" | "priceOriginal" | "featured">;
}

export function SimCard({ sim }: SimCardProps) {
  const isSale = sim.priceOriginal && sim.priceOriginal > sim.price;

  return (
    <tr className="hover:bg-[#F7FAFF] border-b border-[#E2E8F0] group transition-colors">
      {/* Cột 1: Số điện thoại */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <Link href={`/sims/${sim.phone}`} className="block">
          <div className="text-phone text-[20px] group-hover:text-[#005BAC] transition-colors">{formatPhone(sim.phone)}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">Vinaphone</div>
        </Link>
      </td>
      
      {/* Cột 2: Badges */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex flex-col items-start gap-1.5">
          <span className="text-[10px] font-[600] tracking-[0.5px] uppercase text-white bg-[#005BAC] px-1.5 py-0.5 rounded-[4px]">VINA</span>
          <SimTypeBadge type={sim.type} className="text-[10px] px-1.5 py-0.5 rounded-[4px] tracking-[0.3px]" />
        </div>
      </td>

      {/* Cột 3: Giá tiền */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-price">{formatPrice(sim.price)}</div>
          {isSale && (
            <div className="text-price-old">{formatPrice(sim.priceOriginal!)}</div>
          )}
        </div>
      </td>

      {/* Cột 4: Đặt mua */}
      <td className="py-3.5 px-4 whitespace-nowrap text-right">
        <Link 
          href={`/checkout?phone=${sim.phone}`}
          className="inline-flex items-center gap-1.5 bg-[#005BAC] text-white px-3.5 py-2 rounded-[6px] font-sans text-[12px] font-[600] hover:bg-[#004A8F] transition shadow-sm"
        >
          <ShoppingCart size={14} /> Mua
        </Link>
      </td>
    </tr>
  );
}
