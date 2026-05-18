// ============================================================
// Phong thuy utility functions for SimPhatLoc - Advanced Upgraded
// ============================================================

export type NguHanh = "Kim" | "Moc" | "Thuy" | "Hoa" | "Tho"

// Can Chi mappings
const NAM_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]
const NAM_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]

// Ban menh (Ngu hanh) theo nam sinh (lich am)
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

const CUNG_MENH_NAMES = ["Cấn", "Khảm", "Cấn", "Chấn", "Tốn", "Ly", "Khôn", "Đoài"]

const NGUHANH_DISPLAY: Record<NguHanh, { label: string; color: string; bgColor: string }> = {
  Kim: { label: "Kim", color: "#d4a017", bgColor: "#fffbeb" },
  Moc: { label: "Mộc", color: "#16a34a", bgColor: "#f0fdf4" },
  Thuy: { label: "Thủy", color: "#2563eb", bgColor: "#eff6ff" },
  Hoa: { label: "Hỏa", color: "#dc2626", bgColor: "#fef2f2" },
  Tho: { label: "Thổ", color: "#92400e", bgColor: "#fef3c7" },
}

/** Trả về ngũ hành bản mệnh theo năm sinh dương lịch (Lục Thập Hoa Giáp - Mệnh Nạp Âm chuẩn xác) */
export function getBanMenh(namSinh: number): NguHanh {
  // Thiên Can: Giáp/Ất = 1, Bính/Đinh = 2, Mậu/Kỷ = 3, Canh/Tân = 4, Nhâm/Quý = 5
  const CAN_VALUE: Record<number, number> = {
    0: 4, 1: 4, // Canh, Tân
    2: 5, 3: 5, // Nhâm, Quý
    4: 1, 5: 1, // Giáp, Ất
    6: 2, 7: 2, // Bính, Đinh
    8: 3, 9: 3  // Mậu, Kỷ
  }

  // Địa Chi: Tý/Sửu/Ngọ/Mùi = 0, Dần/Mão/Thân/Dậu = 1, Thìn/Tỵ/Tuất/Hợi = 2
  const CHI_VALUE: Record<number, number> = {
    4: 0, 5: 0, 10: 0, 11: 0, // Tý, Sửu, Ngọ, Mùi
    6: 1, 7: 1, 0: 1, 1: 1,   // Dần, Mão, Thân, Dậu
    8: 2, 9: 2, 2: 2, 3: 2    // Thìn, Tỵ, Tuất, Hợi
  }

  const stemVal = CAN_VALUE[namSinh % 10] ?? 1
  const branchVal = CHI_VALUE[namSinh % 12] ?? 1

  let sum = stemVal + branchVal
  if (sum > 5) sum = sum - 5

  const elements: Record<number, NguHanh> = {
    1: "Kim",
    2: "Thuy",
    3: "Hoa",
    4: "Tho",
    5: "Moc"
  }

  return elements[sum] ?? "Tho"
}

/** Trả về tên cung mệnh (Bát Trạch Cung Phi chuẩn xác 100% cho Đông Tứ Mệnh / Tây Tứ Mệnh) */
export function getCungMenh(namSinh: number, gioiTinh: "nam" | "nu" = "nam"): string {
  const yy = namSinh % 100
  let index = 1

  if (namSinh >= 2000) {
    if (gioiTinh === "nam") {
      index = (99 - yy) % 9
    } else {
      index = (yy + 6) % 9
    }
  } else {
    if (gioiTinh === "nam") {
      index = (100 - yy) % 9
    } else {
      index = (yy + 5) % 9
    }
  }

  // index = 0 -> Ly (9)
  if (index === 0) index = 9

  // Cân bằng Trung Cung (5): Nam quy về Khôn (2), Nữ quy về Cấn (8)
  if (index === 5) {
    return gioiTinh === "nam" ? "Khôn" : "Cấn"
  }

  const mapping: Record<number, string> = {
    1: "Khảm",
    2: "Khôn",
    3: "Chấn",
    4: "Tốn",
    6: "Càn",
    7: "Đoài",
    8: "Cấn",
    9: "Ly"
  }

  return mapping[index] ?? "Khôn"
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

// ============================================================
// DU NIÊN (Eight Wandering Stars)
// ============================================================

export type TinhTu = "Sinh Khi" | "Thien Y" | "Dien Nien" | "Phuc Vi" | "Tuyet Menh" | "Luc Sat" | "Ngu Quy" | "Hoa Hai" | "Trung Tinh"

export interface DuNienPair {
  pair: string
  star: TinhTu
  label: string
  type: "tot" | "xau" | "trungtinh"
  desc: string
}

const DU_NIEN_MAP: Record<string, TinhTu> = {
  // Sinh Khí
  "14": "Sinh Khi", "41": "Sinh Khi", "67": "Sinh Khi", "76": "Sinh Khi",
  "39": "Sinh Khi", "93": "Sinh Khi", "28": "Sinh Khi", "82": "Sinh Khi",
  // Thiên Y
  "13": "Thien Y", "31": "Thien Y", "49": "Thien Y", "94": "Thien Y",
  "68": "Thien Y", "86": "Thien Y", "27": "Thien Y", "72": "Thien Y",
  // Diên Niên
  "19": "Dien Nien", "91": "Dien Nien", "78": "Dien Nien", "87": "Dien Nien",
  "34": "Dien Nien", "43": "Dien Nien", "26": "Dien Nien", "62": "Dien Nien",
  // Phục Vị
  "11": "Phuc Vi", "22": "Phuc Vi", "33": "Phuc Vi", "44": "Phuc Vi",
  "66": "Phuc Vi", "77": "Phuc Vi", "88": "Phuc Vi", "99": "Phuc Vi",
  // Tuyệt Mệnh
  "12": "Tuyet Menh", "21": "Tuyet Menh", "69": "Tuyet Menh", "96": "Tuyet Menh",
  "37": "Tuyet Menh", "73": "Tuyet Menh", "48": "Tuyet Menh", "84": "Tuyet Menh",
  // Lục Sát
  "16": "Luc Sat", "61": "Luc Sat", "47": "Luc Sat", "74": "Luc Sat",
  "38": "Luc Sat", "83": "Luc Sat", "29": "Luc Sat", "92": "Luc Sat",
  // Ngũ Quỷ
  "18": "Ngu Quy", "81": "Ngu Quy", "79": "Ngu Quy", "97": "Ngu Quy",
  "36": "Ngu Quy", "63": "Ngu Quy", "24": "Ngu Quy", "42": "Ngu Quy",
  // Họa Hại
  "17": "Hoa Hai", "71": "Hoa Hai", "89": "Hoa Hai", "98": "Hoa Hai",
  "46": "Hoa Hai", "64": "Hoa Hai", "23": "Hoa Hai", "32": "Hoa Hai",
}

const STAR_DETAILS: Record<TinhTu, { label: string; type: "tot" | "xau" | "trungtinh"; desc: string }> = {
  "Sinh Khi": { label: "Sinh Khí", type: "tot", desc: "Tạo sinh khí dồi dào, phát triển sự nghiệp, tài lộc thịnh vượng." },
  "Thien Y": { label: "Thiên Y", type: "tot", desc: "Chủ về sức khỏe dồi dào, có quý nhân phù trợ, gia đạo yên vui." },
  "Dien Nien": { label: "Diên Niên", type: "tot", desc: "Tốt cho ngoại giao, sự nghiệp vững chắc, gia đình hòa thuận." },
  "Phuc Vi": { label: "Phục Vị", type: "tot", desc: "Mang lại sự bình yên, may mắn nhỏ, hóa giải điềm hung." },
  "Tuyet Menh": { label: "Tuyệt Mệnh", type: "xau", desc: "Hao tổn tài lộc, ảnh hưởng sức khỏe, dễ gặp trắc trở." },
  "Luc Sat": { label: "Lục Sát", type: "xau", desc: "Chủ về tranh chấp, tai tiếng, bất hòa trong các mối quan hệ." },
  "Ngu Quy": { label: "Ngũ Quỷ", type: "xau", desc: "Dễ bị tiểu nhân quấy phá, hao hụt tài sản, tinh thần bất an." },
  "Hoa Hai": { label: "Họa Hại", type: "xau", desc: "Thị phi bủa vây, công việc khó khăn, dễ hao tổn năng lượng." },
  "Trung Tinh": { label: "Trung Tính", type: "trungtinh", desc: "Cân bằng, không mang tính cát hay hung rõ rệt." },
}

/** Phân tích Du Niên cho số điện thoại */
export function getDuNien(soDienThoai: string): DuNienPair[] {
  const digits = soDienThoai.replace(/\D/g, "")
  const pairs: DuNienPair[] = []

  for (let i = 0; i < digits.length - 1; i++) {
    const pair = digits.slice(i, i + 2)
    
    let star: TinhTu = "Trung Tinh"
    if (pair.includes("0")) {
      star = "Trung Tinh"
    } else if (pair.endsWith("5")) {
      // 5 là số trợ lực, biến cặp số thành Phục Vị của số trước nó
      star = "Phuc Vi"
    } else {
      star = DU_NIEN_MAP[pair] ?? "Trung Tinh"
    }

    const details = STAR_DETAILS[star]
    pairs.push({
      pair,
      star,
      label: details.label,
      type: details.type,
      desc: details.desc,
    })
  }

  return pairs
}

// ============================================================
// KINH DỊCH (I Ching Hexagrams)
// ============================================================

export interface QueDichResult {
  upperTrigram: string
  lowerTrigram: string
  hexagramIndex: number
  hexagramName: string
  hexagramViet: string
  type: "tot" | "xau" | "binh"
  desc: string
}

const TRIGRAMS = ["", "Càn (Thiên)", "Đoài (Trạch)", "Ly (Hỏa)", "Chấn (Lôi)", "Tốn (Phong)", "Khảm (Thủy)", "Cấn (Sơn)", "Khôn (Địa)"]

// 64 Hexagrams database (indexed by upper, lower)
const HEXAGRAMS_DB: Record<string, { index: number; name: string; viet: string; type: "tot" | "xau" | "binh"; desc: string }> = {
  "1,1": { index: 1, name: "Thuần Càn", viet: "乾為天", type: "tot", desc: "Quẻ Đại Cát. Tượng trưng cho Trời, sự sáng tạo vô biên, sức mạnh cường thịnh, công danh rộng mở." },
  "8,8": { index: 2, name: "Thuần Khôn", viet: "坤為地", type: "tot", desc: "Quẻ Cát. Tượng trưng cho Đất, sự bao dung, thuận theo tự nhiên, phát triển bền vững." },
  "6,4": { index: 3, name: "Thủy Lôi Truân", viet: "水雷屯", type: "xau", desc: "Quẻ Hung. Khởi đầu gian nan, đầy rẫy khó khăn nguy hiểm, cần kiên trì chờ đợi thời cơ." },
  "7,6": { index: 4, name: "Sơn Thủy Mông", viet: "山水蒙", type: "xau", desc: "Quẻ Hung. Sự non nớt, mơ hồ, chưa có định hướng, cần học hỏi người đi trước để khai thông." },
  "6,1": { index: 5, name: "Thủy Thiên Nhu", viet: "水天需", type: "tot", desc: "Quẻ Cát. Chờ đợi trong sự tự tin, tích lũy năng lượng, thành công sẽ đến tự nhiên." },
  "1,6": { index: 6, name: "Thiên Thủy Tụng", viet: "天水訟", type: "xau", desc: "Quẻ Hung. Tranh chấp kiện tụng, bất hòa, tốt nhất nên nhượng bộ và tránh đối đầu." },
  "8,6": { index: 7, name: "Địa Thủy Sư", viet: "地水師", type: "binh", desc: "Quẻ Bình. Tượng binh lính, cần kỷ luật sắt đá và người lãnh đạo sáng suốt để vượt qua thử thách." },
  "6,8": { index: 8, name: "Thủy Địa Tỷ", viet: "水地比", type: "tot", desc: "Quẻ Cát. Sự gắn kết, hỗ trợ lẫn nhau, liên kết đồng minh mang lại thắng lợi lớn." },
  "5,1": { index: 9, name: "Phong Thiên Tiểu Súc", viet: "風天小畜", type: "binh", desc: "Quẻ Bình. Sự cản trở nhỏ, tích lũy chưa đủ, cần kiên nhẫn tích lũy thêm tài lộc." },
  "1,2": { index: 10, name: "Thiên Trạch Lý", viet: "天澤履", type: "binh", desc: "Quẻ Bình. Bước đi trên băng mỏng, hành xử cẩn trọng, lễ độ sẽ tránh được tai họa." },
  "8,1": { index: 11, name: "Địa Thiên Thái", viet: "地天泰", type: "tot", desc: "Quẻ Đại Cát. Đất trời giao hòa, vạn vật hanh thông, thời kỳ thịnh vượng và hạnh phúc viên mãn." },
  "1,8": { index: 12, name: "Thiên Địa Bĩ", viet: "天地否", type: "xau", desc: "Quẻ Hung. Thời kỳ bế tắc, tiểu nhân đắc chí, công việc đình trệ, nên phòng thủ giữ mình." },
  "1,3": { index: 13, name: "Thiên Hỏa Đồng Nhân", viet: "天火同人", type: "tot", desc: "Quẻ Cát. Đồng tâm hiệp lực, cùng chí hướng, mở rộng hợp tác làm ăn sẽ thu hoạch lớn." },
  "3,1": { index: 14, name: "Hỏa Thiên Đại Hữu", viet: "火天大友", type: "tot", desc: "Quẻ Đại Cát. Sở hữu to lớn, giàu sang phú quý, công danh rực rỡ dưới ánh mặt trời." },
  "8,7": { index: 15, name: "Địa Sơn Khiêm", viet: "地山謙", type: "tot", desc: "Quẻ Cát. Khiêm tốn là đức hạnh quý báu giúp giữ vững thành quả, vạn sự bình an." },
  "4,8": { index: 16, name: "Lôi Địa Dự", viet: "雷地豫", type: "tot", desc: "Quẻ Cát. Niềm vui, sự chuẩn bị chu đáo, tinh thần phấn khởi đón nhận tin vui sắp tới." },
  "2,4": { index: 17, name: "Trạch Lôi Tùy", viet: "澤雷隨", type: "tot", desc: "Quẻ Cát. Thuận theo hoàn cảnh, linh hoạt thích ứng, sẽ gặt hái được sự ủng hộ của mọi người." },
  "7,5": { index: 18, name: "Sơn Phong Cổ", viet: "山風蠱", type: "xau", desc: "Quẻ Hung. Tượng đổ nát, có sự suy thoái từ bên trong, cần cải tổ toàn diện và quyết đoán đổi mới." },
  "8,2": { index: 19, name: "Địa Trạch Lâm", viet: "地澤臨", type: "tot", desc: "Quẻ Cát. Tiếp cận thời cơ, công việc tiến triển mạnh mẽ, tài lộc đang gõ cửa." },
  "5,8": { index: 20, name: "Phong Địa Quán", viet: "風地觀", type: "binh", desc: "Quẻ Bình. Quan sát tình hình, suy ngẫm thấu đáo trước khi đưa ra quyết định hệ trọng." },
  "3,4": { index: 21, name: "Hỏa Lôi Phệ Hạp", viet: "火雷噬嗑", type: "binh", desc: "Quẻ Bình. Vượt qua trở ngại bằng pháp luật, kỷ luật nghiêm minh, giải quyết triệt để khúc mắc." },
  "7,3": { index: 22, name: "Sơn Hỏa Bí", viet: "山火賁", type: "tot", desc: "Quẻ Cát. Trang sức bên ngoài, tô điểm cuộc sống, tốt cho các lĩnh vực nghệ thuật, danh tiếng." },
  "7,8": { index: 23, name: "Sơn Địa Bác", viet: "山地剝", type: "xau", desc: "Quẻ Hung. Sự bóc lột, hao tổn, sụp đổ nền tảng, tốt nhất nên im lặng thủ thế bảo toàn lực lượng." },
  "8,4": { index: 24, name: "Địa Lôi Phục", viet: "地雷復", type: "tot", desc: "Quẻ Cát. Sự hồi sinh, quay trở lại của ánh sáng và hy vọng sau thời kỳ đen tối." },
  "1,4": { index: 25, name: "Thiên Lôi Vô Vọng", viet: "天雷無妄", type: "binh", desc: "Quẻ Bình. Hành xử chân thành, không tham vọng viển vông, thuận theo tự nhiên sẽ an lành." },
  "7,1": { index: 26, name: "Sơn Thiên Đại Súc", viet: "山天大畜", type: "tot", desc: "Quẻ Đại Cát. Tích lũy to lớn, tài lực dồi dào, thời điểm chín muồi để thực hiện chí lớn." },
  "7,4": { index: 27, name: "Sơn Lôi Di", viet: "山雷頤", type: "binh", desc: "Quẻ Bình. Tự nuôi dưỡng bản thân, chú ý lời ăn tiếng nói và chế độ ăn uống giữ gìn sức khỏe." },
  "2,5": { index: 28, name: "Trạch Phong Đại Quá", viet: "澤風大過", type: "xau", desc: "Quẻ Hung. Gánh nặng quá tải, cột kèo lung lay, cần tìm sự hỗ trợ để tránh sụp đổ đột ngột." },
  "6,6": { index: 29, name: "Thuần Khảm", viet: "坎為水", type: "xau", desc: "Quẻ Đại Hung. Trùng trùng hiểm nguy, vực sâu vây hãm, đòi hỏi lòng dũng cảm phi thường để vượt qua." },
  "3,3": { index: 30, name: "Thuần Ly", viet: "離為火", type: "tot", desc: "Quẻ Cát. Sự tươi sáng, văn minh, bám trụ vào cái thiện để phát huy hào quang rực rỡ." },
  "2,7": { index: 31, name: "Trạch Sơn Hàm", viet: "澤山咸", type: "tot", desc: "Quẻ Cát. Sự giao cảm chân thành, tình cảm đôi lứa gắn kết bền chặt, vạn sự hanh thông." },
  "4,5": { index: 32, name: "Lôi Phong Hằng", viet: "雷風恆", type: "tot", desc: "Quẻ Cát. Sự bền bỉ kiên trì, giữ vững lập trường, chung thủy sẽ đạt được thành công lâu dài." },
  "1,7": { index: 33, name: "Thiên Sơn Độn", viet: "天山遯", type: "binh", desc: "Quẻ Bình. Sự rút lui chiến lược, ẩn mình chờ thời, tránh xung đột vô ích với thế lực xấu." },
  "4,1": { index: 34, name: "Lôi Thiên Đại Tráng", viet: "雷天大壯", type: "tot", desc: "Quẻ Cát. Sức mạnh to lớn, thịnh vượng vượt bậc, tuy nhiên cần tránh tự phụ kiêu căng." },
  "3,8": { index: 35, name: "Hỏa Địa Tấn", viet: "火地晉", type: "tot", desc: "Quẻ Đại Cát. Mặt trời mọc lên từ lòng đất, thăng tiến nhanh chóng, công thành danh toại." },
  "8,3": { index: 36, name: "Địa Hỏa Minh Di", viet: "地火明夷", type: "xau", desc: "Quẻ Hung. Ánh sáng bị che lấp, thời kỳ khó khăn gian khổ, cần nhẫn nhịn che giấu tài năng chờ thời." },
  "5,3": { index: 37, name: "Phong Hỏa Gia Nhân", viet: "風火家人", type: "tot", desc: "Quẻ Cát. Tốt cho gia đạo, trong ấm ngoài êm, nền tảng gia đình vững chắc tạo dựng sự nghiệp." },
  "3,2": { index: 38, name: "Hỏa Trạch Khuê", viet: "火澤睽", type: "binh", desc: "Quẻ Bình. Sự bất đồng, trái ngược quan điểm, nên tìm điểm chung thay vì đào sâu dị biệt." },
  "6,7": { index: 39, name: "Thủy Sơn Kiển", viet: "水山蹇", type: "xau", desc: "Quẻ Hung. Gian nan trước mắt, núi chặn sông ngăn, tốt nhất nên quay đầu tìm sự trợ giúp." },
  "4,6": { index: 40, name: "Lôi Thủy Giải", viet: "雷水解", type: "tot", desc: "Quẻ Cát. Giải tỏa áp lực, cởi trói khó khăn, thời cơ hành động đã đến sau cơn mưa giông." },
  "7,2": { index: 41, name: "Sơn Trạch Tổn", viet: "山澤損", type: "binh", desc: "Quẻ Bình. Sự chịu thiệt thòi ban đầu, bớt đi cái thừa để bổ sung cái thiếu, cát lợi về sau." },
  "5,4": { index: 42, name: "Phong Lôi Ích", viet: "風雷益", type: "tot", desc: "Quẻ Đại Cát. Sự gia tăng tài lộc, có lợi cho việc khởi sự lớn, đi xa làm ăn hanh thông." },
  "2,1": { index: 43, name: "Trạch Thiên Quải", viet: "澤天夬", type: "binh", desc: "Quẻ Bình. Sự quyết đoán vạch trần cái xấu, kiên quyết hành động nhưng tránh bạo lực." },
  "1,5": { index: 44, name: "Thiên Phong Cấu", viet: "天風姤", type: "binh", desc: "Quẻ Bình. Cuộc gặp gỡ bất ngờ, có duyên âm thầm, cẩn thận với những cám dỗ nhất thời." },
  "2,8": { index: 45, name: "Trạch Địa Tụy", viet: "澤地萃", type: "tot", desc: "Quẻ Cát. Sự hội tụ của nhân tài và của cải, tinh thần đoàn kết tạo nên sức mạnh vĩ đại." },
  "8,5": { index: 46, name: "Địa Phong Thăng", viet: "地風升", type: "tot", desc: "Quẻ Cát. Sự thăng tiến vững chắc từ dưới lên, tích lũy uy tín bước lên đài vinh quang." },
  "2,6": { index: 47, name: "Trạch Thủy Khốn", viet: "澤水困", type: "xau", desc: "Quẻ Hung. Cực kỳ khốn cùng, cạn kiệt tài lực, thử thách ý chí sắt đá của đấng nam nhi." },
  "6,5": { index: 48, name: "Thủy Phong Tỉnh", viet: "水風井", type: "binh", desc: "Quẻ Bình. Tượng giếng nước, nguồn sống vô tận không bao giờ cạn, cần duy trì giá trị cốt lõi." },
  "2,3": { index: 49, name: "Trạch Hỏa Cách", viet: "澤火革", type: "tot", desc: "Quẻ Cát. Cuộc cách mạng cải cách, đổi mới tư duy loại bỏ cái cũ đem lại thịnh vượng mới." },
  "3,5": { index: 50, name: "Hỏa Phong Đỉnh", viet: "火風鼎", type: "tot", desc: "Quẻ Đại Cát. Tượng vạc đồng ba chân vững chắc, chủ về quyền lực, địa vị cao quý và tài lộc." },
  "4,4": { index: 51, name: "Thuần Chấn", viet: "震為雷", type: "binh", desc: "Quẻ Bình. Sấm truyền vang dội gây kinh sợ nhưng giúp cảnh tỉnh, giữ lòng thành kính sẽ bình an." },
  "7,7": { index: 52, name: "Thuần Cấn", viet: "艮為山", type: "binh", desc: "Quẻ Bình. Giữ vững sự yên tĩnh như ngọn núi, dừng lại đúng lúc đúng chỗ để bảo toàn lực lượng." },
  "5,7": { index: 53, name: "Phong Sơn Tiệm", viet: "風山漸", type: "tot", desc: "Quẻ Cát. Tiến triển tuần tự, chậm mà chắc, như chim hồng bay cao, sự nghiệp bền vững." },
  "4,2": { index: 54, name: "Lôi Trạch Quy Muội", viet: "雷澤歸妹", type: "xau", desc: "Quẻ Hung. Mối quan hệ lệch lạc, vội vã kết hôn hoặc khởi sự sai lầm dẫn đến kết cục không tốt." },
  "4,3": { index: 55, name: "Lôi Hỏa Phong", viet: "雷火豐", type: "tot", desc: "Quẻ Đại Cát. Sự sung túc đỉnh cao, rực rỡ huy hoàng, cần chia sẻ tài lộc để duy trì vận may." },
  "3,7": { index: 56, name: "Hỏa Sơn Lữ", viet: "火山旅", type: "binh", desc: "Quẻ Hung. Tượng lửa trên núi thiêu rụi, sự xê dịch không ổn định, lữ khách cô đơn xa xứ, thiếu chỗ dựa vững chắc." },
  "5,5": { index: 57, name: "Thuần Tốn", viet: "巽為風", type: "binh", desc: "Quẻ Bình. Gió luồn lách nhẹ nhàng, sự nhu thuận khéo léo thích ứng đem lại cát lợi." },
  "2,2": { index: 58, name: "Thuần Đoài", viet: "兌為澤", type: "tot", desc: "Quẻ Cát. Niềm vui sướng hân hoan, sự chia sẻ thảo luận mang lại tiếng cười và hòa khí." },
  "5,6": { index: 59, name: "Phong Thủy Hoán", viet: "風水渙", type: "tot", desc: "Quẻ Cát. Hóa giải ngăn cách, xóa bỏ nghi kỵ, lan tỏa năng lượng tích cực ra khắp muôn phương." },
  "6,2": { index: 60, name: "Thủy Trạch Tiết", viet: "水澤節", type: "binh", desc: "Quẻ Bình. Sự tiết chế chừng mực, lập kế hoạch chi tiêu rõ ràng giúp giữ vững tài chính ổn định." },
  "5,2": { index: 61, name: "Phong Trạch Trung Phu", viet: "風澤中孚", type: "tot", desc: "Quẻ Cát. Uy tín trung thực từ đáy lòng, lay động lòng người, tạo dựng niềm tin tuyệt đối." },
  "4,7": { index: 62, name: "Lôi Sơn Tiểu Quá", viet: "雷山小過", type: "binh", desc: "Quẻ Bình. Sai sót nhỏ, chỉ nên làm việc nhỏ vừa sức, tránh mạo hiểm khởi nghiệp lớn lúc này." },
  "6,3": { index: 63, name: "Thủy Hỏa Ký Tế", viet: "水火既濟", type: "tot", desc: "Quẻ Cát. Đã hoàn thành mục tiêu, vạn sự hanh thông, tuy nhiên cần đề phòng suy thoái sau đỉnh cao." },
  "3,6": { index: 64, name: "Hỏa Thủy Vị Tế", viet: "火水未濟", type: "binh", desc: "Quẻ Bình. Chưa hoàn thành, cơ hội vẫn mở ra phía trước, cần nỗ lực bước tiếp chặng đường mới." },
}

/** Tính toán Quẻ Dịch Kinh Dịch cho số điện thoại */
export function getQueDich(soDienThoai: string): QueDichResult {
  const digits = soDienThoai.replace(/\D/g, "")
  if (digits.length < 10) {
    return {
      upperTrigram: "Chưa xác định",
      lowerTrigram: "Chưa xác định",
      hexagramIndex: 0,
      hexagramName: "Chưa rõ",
      hexagramViet: "",
      type: "binh",
      desc: "Số điện thoại không hợp lệ để lập quẻ.",
    }
  }

  // Chia đôi số điện thoại thành 5 chữ số đầu và 5 chữ số cuối
  const first5 = digits.slice(0, 5).split("").reduce((a, b) => a + parseInt(b), 0)
  const last5 = digits.slice(5, 10).split("").reduce((a, b) => a + parseInt(b), 0)

  let upper = first5 % 8
  if (upper === 0) upper = 8

  let lower = last5 % 8
  if (lower === 0) lower = 8

  const key = `${upper},${lower}`
  const hex = HEXAGRAMS_DB[key] ?? {
    index: 0,
    name: "Quẻ Vô Danh",
    viet: "",
    type: "binh" as const,
    desc: "Không tìm thấy quẻ tương ứng.",
  }

  return {
    upperTrigram: TRIGRAMS[upper] ?? "Càn",
    lowerTrigram: TRIGRAMS[lower] ?? "Khôn",
    hexagramIndex: hex.index,
    hexagramName: hex.name,
    hexagramViet: hex.viet,
    type: hex.type,
    desc: hex.desc,
  }
}

// ============================================================
// HÀM TÍNH ĐIỂM NÂNG CẤP CHI TIẾT
// ============================================================

export interface ScoreBreakdown {
  amDuongScore: number // 0-2
  nguHanhScore: number  // 0-2
  queDichScore: number  // 0-2
  duNienScore: number   // 0-2
  luckyTailScore: number // 0-2
  totalScore: number     // 6-10
  amDuongText: string
  nguHanhText: string
  queDichText: string
  duNienText: string
  luckyTailText: string
}

/**
 * Hàm tính điểm nâng cấp với 5 trụ cột chính (Tổng 10 điểm)
 */
export function tinhDiemPhongThuyChiTiet(
  soDienThoai: string,
  namSinh: number,
  gioiTinh: "nam" | "nu" = "nam"
): ScoreBreakdown {
  const digits = soDienThoai.replace(/\D/g, "")
  if (digits.length !== 10) {
    return {
      amDuongScore: 0,
      nguHanhScore: 0,
      queDichScore: 0,
      duNienScore: 0,
      luckyTailScore: 0,
      totalScore: 6,
      amDuongText: "Số điện thoại không hợp lệ.",
      nguHanhText: "",
      queDichText: "",
      duNienText: "",
      luckyTailText: "",
    }
  }

  // 1. Âm Dương Cân Bằng (Max: 2 điểm)
  const chan = digits.split("").filter(d => parseInt(d) % 2 === 0).length
  const le = 10 - chan
  let amDuongScore = 1
  let amDuongText = `Số có ${chan} số Âm (chẵn) và ${le} số Dương (lẻ). Lệch Âm Dương nhẹ.`
  if (Math.abs(chan - le) === 0) {
    amDuongScore = 2
    amDuongText = `Số có 5 Âm (chẵn) và 5 Dương (lẻ). Âm Dương cân bằng tuyệt đối (Thái Cực Cát).`
  } else if (Math.abs(chan - le) <= 2) {
    amDuongScore = 2
    amDuongText = `Số có ${chan} Âm và ${le} Dương. Âm Dương cân bằng tốt (Cát).`
  } else if (Math.abs(chan - le) >= 6) {
    amDuongScore = 0
    amDuongText = `Số có ${chan} Âm và ${le} Dương. Mất cân bằng Âm Dương nặng.`
  }

  // 2. Ngũ Hành Tương Phối (Max: 2 điểm)
  const banMenh = getBanMenh(namSinh)
  const nhSim = getNguhanhSim(soDienThoai)
  const labelSim = NGUHANH_DISPLAY[nhSim].label
  const labelMenh = NGUHANH_DISPLAY[banMenh].label
  
  let nguHanhScore = 1
  let nguHanhText = `Sim hành ${labelSim} bình hòa với bản mệnh ${labelMenh} của bạn.`
  
  if (TUONG_SINH[banMenh]?.includes(nhSim)) {
    nguHanhScore = 2
    nguHanhText = `Sim hành ${labelSim} tương sinh tuyệt vời cho bản mệnh ${labelMenh} (Đại Cát).`
  } else if (TUONG_KHAC[banMenh]?.includes(nhSim)) {
    nguHanhScore = 0
    nguHanhText = `Sim hành ${labelSim} tương khắc hình hại bản mệnh ${labelMenh} (Hung).`
  }

  // 3. Quẻ Dịch Bát Quái (Max: 2 điểm)
  const qd = getQueDich(soDienThoai)
  let queDichScore = 1
  let queDichText = `Quẻ ${qd.hexagramName} (${qd.hexagramViet}) thuộc loại trung tính, ổn định.`
  if (qd.type === "tot") {
    queDichScore = 2
    queDichText = `Hợp lập quẻ Cát: ${qd.hexagramName} (${qd.hexagramViet}) - ${qd.desc}`
  } else if (qd.type === "xau") {
    queDichScore = 0
    queDichText = `Gặp quẻ Hung: ${qd.hexagramName} (${qd.hexagramViet}) - ${qd.desc}`
  }

  // 4. Bát Tinh Du Niên (Max: 2 điểm)
  const pairs = getDuNien(soDienThoai)
  const totCount = pairs.filter(p => p.type === "tot").length
  const xauCount = pairs.filter(p => p.type === "xau").length
  
  let duNienScore = 1
  let duNienText = `Số sim có sự cân bằng giữa các sao tốt (${totCount}) và sao xấu (${xauCount}).`
  if (totCount > xauCount + 2) {
    duNienScore = 2
    duNienText = `Sao Cát tinh (${totCount}) áp đảo hoàn toàn sao Hung tinh (${xauCount}), cực kỳ hanh thông.`
  } else if (xauCount > totCount) {
    duNienScore = 0
    duNienText = `Nhiều sao Hung tinh (${xauCount}) hơn Cát tinh (${totCount}), dễ tổn hại sinh khí.`
  }

  // 5. Đuôi số & Lặp (Max: 2 điểm)
  const duoi3 = parseInt(digits.slice(-3))
  const duoi2 = parseInt(digits.slice(-2))
  const catDuoi3 = [168, 688, 868, 886, 668, 699, 799, 899, 999, 888, 666, 777].includes(duoi3)
  const catDuoi2 = [68, 88, 99, 86, 66, 69, 79, 89].includes(duoi2)
  const luckyRepeat = /(8{3}|9{3}|6{3}|7{3})/.test(digits)
  
  let luckyTailScore = 0
  let luckyTailText = "Đuôi số bình thường, không chứa bộ số đại cát lộc phát."
  if (catDuoi3 || (catDuoi2 && luckyRepeat)) {
    luckyTailScore = 2
    luckyTailText = "Đuôi số Đại Cát Lộc Phát/Thần Tài siêu đẹp mang lại may mắn tối đa."
  } else if (catDuoi2 || luckyRepeat) {
    luckyTailScore = 1
    luckyTailText = "Chứa bộ số lặp Cát Tường hoặc đuôi số Thần Tài tốt lành."
  }

  const raw = amDuongScore + nguHanhScore + queDichScore + duNienScore + luckyTailScore
  // Đảm bảo điểm số tối thiểu là 6 và tối đa là 10
  const totalScore = Math.min(10, Math.max(6, raw))

  return {
    amDuongScore,
    nguHanhScore,
    queDichScore,
    duNienScore,
    luckyTailScore,
    totalScore,
    amDuongText,
    nguHanhText,
    queDichText,
    duNienText,
    luckyTailText,
  }
}

/** Tương thích ngược: Hàm tính điểm phong thủy cũ */
export function tinhDiemPhongThuy(soDienThoai: string, namSinh: number): number {
  return tinhDiemPhongThuyChiTiet(soDienThoai, namSinh).totalScore
}

/** Label điểm phong thủy */
export function getDiemLabel(diem: number): { label: string; color: string; barColor: string } {
  if (diem >= 9) return { label: "Đại Cát", color: "text-red-600", barColor: "bg-red-600" }
  if (diem >= 8) return { label: "Cát", color: "text-orange-500", barColor: "bg-orange-500" }
  if (diem >= 7) return { label: "Bình Hòa", color: "text-blue-500", barColor: "bg-blue-500" }
  return { label: "Trung bình", color: "text-gray-500", barColor: "bg-gray-500" }
}

/** Trả về tên năm Can Chi (ví dụ: "Giáp Thân" cho năm 2004, "Bính Tuất" cho năm 2006) */
export function getCanChiYear(namSinh: number): string {
  // CAN: offset +6 vì 1900 % 10 = 0 → Canh (index 6 trong mảng)
  const canIdx = (namSinh % 10 + 6) % 10
  // CHI: offset +8 vì 1900 % 12 = 4 → Tý (index 0), công thức: (year%12 + 8) % 12
  const chiIdx = (namSinh % 12 + 8) % 12
  return `${NAM_CAN[canIdx]} ${NAM_CHI[chiIdx]}`
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
