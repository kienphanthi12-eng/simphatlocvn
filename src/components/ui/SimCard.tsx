import { Sim } from "@prisma/client";
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils";
import Link from "next/link";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimCardProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price" | "priceOriginal" | "featured">;
  view?: string;
}

const typeColorMap: Record<string, string> = {
  TAM_HOA: "bg-purple-50 text-purple-700 border-purple-200",
  TU_QUY: "bg-red-50 text-red-700 border-red-200",
  TIEN_LEN: "bg-green-50 text-green-700 border-green-200",
  LOC_PHAT: "bg-orange-50 text-orange-700 border-orange-200",
  THAN_TAI: "bg-yellow-50 text-yellow-700 border-yellow-200",
  NAM_SINH: "bg-blue-50 text-blue-700 border-blue-200",
  LAP_KEP: "bg-pink-50 text-pink-700 border-pink-200",
  VIP: "bg-amber-50 text-amber-800 border-amber-300",
}

export function SimCard({ sim }: SimCardProps) {
  const isSale = sim.priceOriginal && sim.priceOriginal > sim.price;
  const badgeColor = typeColorMap[sim.type] ?? "bg-primary/10 text-primary border-primary/20";

  return (
    <TableRow className="group border-b border-border last:border-b-0 cursor-pointer hover:bg-blue-50/50 transition-colors duration-150">
      {/* Số điện thoại */}
      <TableCell className="py-4 px-4">
        <Link href={`/sims/${sim.phone}`} className="block">
          <span className="font-mono text-base font-bold tracking-wide text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {formatPhone(sim.phone)}
          </span>
        </Link>
      </TableCell>

      {/* Loại sim */}
      <TableCell className="py-4 px-4">
        <Badge
          className={`font-semibold border rounded-md px-2.5 py-1 ${badgeColor}`}
        >
          {getSimTypeLabel(sim.type)}
        </Badge>
      </TableCell>

      {/* Giá tiền */}
      <TableCell className="py-4 px-4">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-red-600">
            {formatPrice(sim.price)}
          </span>
          {isSale && (
            <span className="text-xs text-gray-400 line-through opacity-60">
              {formatPrice(sim.priceOriginal!)}
            </span>
          )}
        </div>
      </TableCell>

      {/* Đặt mua */}
      <TableCell className="text-center w-[110px] py-4 px-4">
        <Link
          href={`/checkout?phone=${sim.phone}`}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap"
        >
          Đặt mua
        </Link>
      </TableCell>
    </TableRow>
  );
}
