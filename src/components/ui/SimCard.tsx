import { Sim } from "@prisma/client";
import { formatPhone, formatPrice, getSimTypeLabel } from "@/lib/utils";
import Link from "next/link";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";

interface SimCardProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price" | "priceOriginal" | "featured">;
  view?: "table" | "grid";
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

function getSimAuspiciousMeaning(phone: string, type: string) {
  const last4 = phone.slice(-4);
  const sum = last4.split('').reduce((acc, char) => acc + parseInt(char || '0'), 0);
  
  if (type === "LOC_PHAT") return "Lộc tài quảng tiến, phú quý vinh hiển";
  if (type === "TU_QUY") return "Tứ quý cát tường, vạn thế trường tồn";
  if (type === "THAN_TAI") return "Thần tài phù trợ, kinh doanh đắc lợi";
  if (type === "TIEN_LEN") return "Từng bước thăng tiến, công danh rực rỡ";
  if (type === "TAM_HOA") return "Tam tài tụ hội, phúc lộc song toàn";
  if (type === "NAM_SINH") return "Bản mệnh hanh thông, gia đạo an khang";
  
  const meanings = [
    "Khởi sắc hanh thông, đắc thời đắc thế",
    "Thời lai vận chuyển, danh lợi song toàn",
    "Gia đạo an khang, tài lộc dồi dào",
    "Phú quý tự nhiên, danh chấn tứ hải",
    "Vạn sự như ý, cát tinh cao chiếu"
  ];
  return meanings[sum % meanings.length];
}

export function SimCard({ sim, view = "table" }: SimCardProps) {
  const isSale = sim.priceOriginal && sim.priceOriginal > sim.price;
  const badgeColor = typeColorMap[sim.type] ?? "bg-primary/10 text-primary border-primary/20";
  
  let discountPercent = 0;
  if (isSale && sim.priceOriginal) {
    discountPercent = Math.round((1 - sim.price / sim.priceOriginal) * 100);
  }

  const formattedPhone = formatPhone(sim.phone);
  const auspiciousMeaning = getSimAuspiciousMeaning(sim.phone, sim.type);

  if (view === "grid") {
    return (
      <div className="corner-ornament border border-gold-deep/40 rounded-xl bg-parchment/65 p-6 flex flex-col justify-between transition-all duration-500 hover:border-gold hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/10 relative overflow-hidden group">
        {/* Glow backdrop overlay on top */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="space-y-4 relative z-10">
          {/* Network + Category badges */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold gold-text">
              Vinaphone
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold border border-gold-deep/30 px-2 py-0.5 rounded bg-parchment">
              {getSimTypeLabel(sim.type)}
            </span>
          </div>

          {/* Phone Number */}
          <div className="text-center py-2">
            <Link href={`/sims/${sim.phone}`} className="inline-block">
              <span className="font-serif text-2xl md:text-3xl text-ink tracking-wider font-black hover:text-crimson transition-colors block">
                {formattedPhone}
              </span>
            </Link>
          </div>

          {/* Auspicious Meaning */}
          <p className="text-xs italic text-center text-muted-foreground/90 font-medium">
            &ldquo;{auspiciousMeaning}&rdquo;
          </p>

          {/* Ornate Divider */}
          <div className="ornate-divider !my-3" />
        </div>

        {/* Pricing & CTA */}
        <div className="space-y-4 pt-2 relative z-10">
          <div className="text-center">
            <span className="font-serif text-xl font-bold text-crimson block">
              {formatPrice(sim.price)}
            </span>
            {isSale && (
              <span className="text-xs text-muted-foreground/60 line-through">
                {formatPrice(sim.priceOriginal!)}
              </span>
            )}
          </div>

          <Link
            href={`/checkout?phone=${sim.phone}`}
            className="w-full text-center bg-crimson hover:bg-crimson-deep text-gold-soft border border-gold-deep py-2.5 rounded-lg text-[10px] uppercase font-sans tracking-[0.25em] font-extrabold shadow-md hover:shadow-lg transition-all duration-300 block"
          >
            Thỉnh sim
          </Link>
        </div>
      </div>
    );
  }

  const formattedParts = formattedPhone.split('.');

  return (
    <TableRow className="group border-b border-border last:border-b-0 cursor-pointer hover:bg-gold-soft/20 transition-colors duration-150">
      {/* Số điện thoại */}
      <TableCell className="py-4 px-4">
        <Link href={`/sims/${sim.phone}`} className="flex items-center gap-2">
          <span className="font-mono tracking-wide transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {formattedParts.length === 3 ? (
              <>
                <span className="font-semibold text-foreground/80 group-hover:text-primary/80 text-base">
                  {formattedParts[0]}.{formattedParts[1]}.
                </span>
                <span className="font-extrabold text-primary group-hover:text-primary text-[17px]">
                  {formattedParts[2]}
                </span>
              </>
            ) : (
              <span className="font-bold text-base text-foreground group-hover:text-primary">
                {formattedPhone}
              </span>
            )}
          </span>
          {discountPercent > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-transparent px-1.5 py-0 h-5 text-[10px] font-bold shadow-sm shrink-0">
              -{discountPercent}%
            </Badge>
          )}
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
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap inline-block"
        >
          Đặt mua
        </Link>
      </TableCell>
    </TableRow>
  );
}
