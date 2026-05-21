import { MapPin, Phone, Clock, ShieldCheck } from "lucide-react"

export function TrustBar() {
  return (
    <div className="bg-[#1a0a0a] border-b border-gold-deep/20 py-1.5 px-4 hidden sm:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] font-sans">
        <div className="flex items-center gap-5 text-gold-soft/70">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-gold-deep shrink-0" />
            Số 68, Đường Trần Phú, Ba Đình, Hà Nội
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-gold-deep shrink-0" />
            Mở cửa 8:00 – 21:00 mỗi ngày
          </span>
        </div>
        <div className="flex items-center gap-5 text-gold-soft/70">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-gold-deep shrink-0" />
            <a href="tel:0914123456" className="hover:text-gold-soft transition-colors">
              0914 123 456
            </a>
          </span>
          <span className="flex items-center gap-1.5 text-green-400/80">
            <ShieldCheck className="h-3 w-3 shrink-0" />
            ĐKKD: 0123456789 – Sở KH&ĐT Hà Nội
          </span>
        </div>
      </div>
    </div>
  )
}
