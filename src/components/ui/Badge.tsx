import { SimType } from "@prisma/client"
import { cn, getSimTypeLabel } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: SimType
}

export function SimTypeBadge({ type, className, ...props }: BadgeProps) {
  const specificColors: Partial<Record<SimType, string>> = {
    TAM_HOA: "bg-purple-100 text-purple-800 border-purple-200",
    TU_QUY: "bg-red-100 text-red-800 border-red-200",
    TIEN_LEN: "bg-green-100 text-green-800 border-green-200",
    LOC_PHAT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    THAN_TAI: "bg-orange-100 text-orange-800 border-orange-200",
    NAM_SINH: "bg-pink-100 text-pink-800 border-pink-200",
    VIP: "bg-[#111] text-[#D4AF37] border-[#D4AF37] font-bold shadow-sm",
  }

  const defaultColor = "bg-gray-100 text-gray-800 border-gray-200"
  const colorClass = specificColors[type] || defaultColor

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        colorClass,
        className
      )}
      {...props}
    >
      {getSimTypeLabel(type)}
    </span>
  )
}
