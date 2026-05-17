// ============================================================
// Phong thuy utility functions for SimPhatLoc
// ============================================================

export type NguHanh = "Kim" | "Moc" | "Thuy" | "Hoa" | "Tho"

// Can Chi mappings
const NAM_CAN = ["Giap", "At", "Binh", "Dinh", "Mau", "Ky", "Canh", "Tan", "Nham", "Quy"]
const NAM_CHI = ["Ty", "Suu", "Dan", "Mao", "Thin", "Ti", "Ngo", "Mui", "Than", "Dau", "Tuat", "Hoi"]

// Ban menh (Ngu hanh) theo nam sinh (lich am)
// Based on Can nam: Giap/At=Moc, Binh/Dinh=Hoa, Mau/Ky=Tho, Canh/Tan=Kim, Nham/Quy=Thuy
const BAN_MENH_MAP: Record<number, NguHanh> = {
  0: "Moc",  // Giap
  1: "Moc",  // At
  2: "Hoa",  // Binh
  3: "Hoa",  // Dinh
  4: "Tho",  // Mau
  5: "Tho",  // Ky
  6: "Kim",  // Canh
  7: "Kim",  // Tan
  8: "Thuy", // Nham
  9: "Thuy", // Quy
}

const CUNG_MENH_NAMES = ["Can", "Kham", "Can", "Chan", "Ton", "Ly", "Khon", "Doai"]

const NGUHANH_DISPLAY: Record<NguHanh, { label: string; color: string; bgColor: string }> = {
  Kim: { label: "Kim", color: "#d4a017", bgColor: "#fffbeb" },
  Moc: { label: "Mộc", color: "#16a34a", bgColor: "#f0fdf4" },
  Thuy: { label: "Thủy", color: "#2563eb", bgColor: "#eff6ff" },
  Hoa: { label: "Hỏa", color: "#dc2626", bgColor: "#fef2f2" },
  Tho: { label: "Thổ", color: "#92400e", bgColor: "#fef3c7" },
}

/** Trả về ngũ hành bản mệnh theo năm sinh dương lịch */
export function getBanMenh(namSinh: number): NguHanh {
  const idx = (namSinh - 4) % 10
  const normalIdx = idx < 0 ? idx + 10 : idx
  return BAN_MENH_MAP[normalIdx] ?? "Tho"
}

/** Trả về tên cung mệnh */
export function getCungMenh(namSinh: number, gioiTinh: "nam" | "nu" = "nam"): string {
  // Simplified: dùng năm sinh mod 8
  const base = namSinh % 8
  return CUNG_MENH_NAMES[base] ?? "Khon"
}

/** Trả về ngũ hành của sim dựa vào tổng chữ số */
export function getNguhanhSim(soDienThoai: string): NguHanh {
  const digits = soDienThoai.replace(/\D/g, "")
  const sum = digits.split("").reduce((a, b) => a + parseInt(b), 0)
  const nhMap: NguHanh[] = ["Tho", "Kim", "Thuy", "Moc", "Hoa"]
  return nhMap[sum % 5]
}

/** Màu sắc ngũ hành để hiển thị */
export function getNguhanhInfo(nguhanh: NguHanh) {
  return NGUHANH_DISPLAY[nguhanh]
}

/** Kiểm tra tương sinh: A sinh B */
const TUONG_SINH: Record<NguHanh, NguHanh[]> = {
  Kim: ["Thuy", "Tho"],
  Thuy: ["Moc", "Kim"],
  Moc: ["Hoa", "Thuy"],
  Hoa: ["Tho", "Moc"],
  Tho: ["Kim", "Hoa"],
}

/** Kiểm tra tương khắc: A khắc B */
const TUONG_KHAC: Record<NguHanh, NguHanh[]> = {
  Kim: ["Moc"],
  Moc: ["Tho"],
  Tho: ["Thuy"],
  Thuy: ["Hoa"],
  Hoa: ["Kim"],
}

/**
 * Tính điểm phong thủy cho 1 số điện thoại dựa theo năm sinh (6–10)
 */
export function tinhDiemPhongThuy(soDienThoai: string, namSinh: number): number {
  const digits = soDienThoai.replace(/\D/g, "")
  if (digits.length !== 10) return 6

  const sum = digits.split("").reduce((a, b) => a + parseInt(b), 0)
  const banMenh = getBanMenh(namSinh)
  const nhSim = getNguhanhSim(soDienThoai)

  // 1. Âm Dương cân bằng (+0–1)
  const chan = digits.split("").filter(d => parseInt(d) % 2 === 0).length
  const le = digits.length - chan
  const canBang = Math.abs(chan - le) <= 2 ? 1 : 0

  // 2. Đuôi số may mắn (+0–2)
  const duoi3 = parseInt(digits.slice(-3))
  const duoi2 = parseInt(digits.slice(-2))
  const catDuoi3 = [168, 688, 868, 886, 668, 699, 799, 899, 999, 888, 666, 777].includes(duoi3) ? 2 : 0
  const catDuoi2 = catDuoi3 > 0 ? 0 : [68, 88, 99, 86, 66, 69, 79, 89].includes(duoi2) ? 1 : 0
  const bonusDuoi = catDuoi3 + catDuoi2

  // 3. Tương sinh ngũ hành (+0–2)
  const siSinh = TUONG_SINH[banMenh]?.includes(nhSim) ? 2 : 0

  // 4. Tương khắc trừ điểm (-1)
  const siKhac = TUONG_KHAC[banMenh]?.includes(nhSim) ? -1 : 0

  // 5. Số may mắn lặp lại (888, 999, 666...)
  const luckyRepeat = /(8{3}|9{3}|6{3}|7{3})/.test(digits) ? 1 : 0

  const raw = 5 + canBang + bonusDuoi + siSinh + siKhac + luckyRepeat
  return Math.min(10, Math.max(6, raw))
}

/** Label điểm phong thủy */
export function getDiemLabel(diem: number): { label: string; color: string; barColor: string } {
  if (diem >= 9) return { label: "Đại Cát", color: "text-green-700", barColor: "bg-green-500" }
  if (diem >= 8) return { label: "Cát", color: "text-lime-700", barColor: "bg-lime-500" }
  if (diem >= 7) return { label: "Bình", color: "text-yellow-700", barColor: "bg-yellow-400" }
  return { label: "Trung bình", color: "text-orange-700", barColor: "bg-orange-400" }
}

/** Tên Việt của ngũ hành */
export function getNguhanhLabel(nh: NguHanh): string {
  const labels: Record<NguHanh, string> = {
    Kim: "Kim",
    Moc: "Mộc",
    Thuy: "Thủy",
    Hoa: "Hỏa",
    Tho: "Thổ",
  }
  return labels[nh]
}

export const GIO_SINH_OPTIONS = [
  { value: "ty", label: "Tý (23h–1h)" },
  { value: "suu", label: "Sửu (1h–3h)" },
  { value: "dan", label: "Dần (3h–5h)" },
  { value: "mao", label: "Mão (5h–7h)" },
  { value: "thin", label: "Thìn (7h–9h)" },
  { value: "ti", label: "Tỵ (9h–11h)" },
  { value: "ngo", label: "Ngọ (11h–13h)" },
  { value: "mui", label: "Mùi (13h–15h)" },
  { value: "than", label: "Thân (15h–17h)" },
  { value: "dau", label: "Dậu (17h–19h)" },
  { value: "tuat", label: "Tuất (19h–21h)" },
  { value: "hoi", label: "Hợi (21h–23h)" },
]

export const LOAI_SIM_PHONG_THUY_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "THAN_TAI", label: "Thần Tài" },
  { value: "LOC_PHAT", label: "Lộc Phát" },
  { value: "TAM_HOA", label: "Tam Hoa" },
  { value: "TU_QUY", label: "Tứ Quý" },
  { value: "VIP", label: "Sim VIP" },
  { value: "ONG_DIA", label: "Ông Địa" },
]
