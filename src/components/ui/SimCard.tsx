import { Sim } from "@prisma/client";
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils";
import Link from "next/link";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimCardProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price" | "priceOriginal" | "featured">;
  view?: string;
}

const typeColorMap: Record<string, string> = {
  TAM_HOA: "bg-orange-100 text-orange-700 border-orange-200",
  TU_QUY: "bg-red-100 text-red-700 border-red-200",
  TIEN_LEN: "bg-green-100 text-green-700 border-green-200",
  LOC_PHAT: "bg-yellow-100 text-yellow-700 border-yellow-200",
  THAN_TAI: "bg-purple-100 text-purple-700 border-purple-200",
  ONG_DIA: "bg-indigo-100 text-indigo-700 border-indigo-200",
  SO_GANH: "bg-teal-100 text-teal-700 border-teal-200",
  NAM_SINH: "bg-blue-100 text-blue-700 border-blue-200",
  VIP: "bg-rose-100 text-rose-700 border-rose-200",
}

export function SimCard({ sim }: SimCardProps) {
  const isSale = sim.priceOriginal && sim.priceOriginal > sim.price;
  const badgeColor = typeColorMap[sim.type] ?? "bg-primary/10 text-primary border-primary/20";

  return (
    <TableRow className="group border-b border-border transition-colors last:border-b-0 hover:bg-primary/5 cursor-pointer">
      {/* Số điện thoại */}
      <TableCell className="py-3">
        <Link href={`/sims/${sim.phone}`} className="block">
          <span className="font-mono text-base font-bold tracking-wide text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {formatPhone(sim.phone)}
          </span>
        </Link>
      </TableCell>

      {/* Loại sim */}
      <TableCell>
        <Badge
          variant="outline"
          className={`text-[10px] font-semibold border ${badgeColor}`}
        >
          {getSimTypeLabel(sim.type)}
        </Badge>
      </TableCell>

      {/* Giá tiền */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary">
            {formatPrice(sim.price)}
          </span>
          {isSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(sim.priceOriginal!)}
            </span>
          )}
        </div>
      </TableCell>

      {/* Đặt mua */}
      <TableCell className="text-center w-[110px]">
        <Link
          href={`/checkout?phone=${sim.phone}`}
          className={cn(
            buttonVariants({ size: 'sm' }),
            'h-7 bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90'
          )}
        >
          Đặt mua
        </Link>
      </TableCell>
    </TableRow>
  );
}
