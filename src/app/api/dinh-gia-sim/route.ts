import { NextResponse } from "next/server"

// Thuật toán giả lập định giá sim
function calculateValuation(phone: string) {
  let estimatedPrice = 500000 // Giá khởi điểm tối thiểu (500k)
  const breakdown = []
  
  // 1. Phân tích đầu số (Prefix)
  const prefix3 = phone.substring(0, 3)
  const prefix4 = phone.substring(0, 4)
  
  const highValuePrefixes = ["098", "099", "090", "091", "088"]
  const mediumValuePrefixes = ["093", "094", "096", "097", "089", "086"]
  
  if (highValuePrefixes.includes(prefix3)) {
    estimatedPrice += 3000000
    breakdown.push("Đầu số cổ/VIP hiếm có (+3,000,000đ)")
  } else if (mediumValuePrefixes.includes(prefix3)) {
    estimatedPrice += 1000000
    breakdown.push("Đầu số đẹp, phổ biến (+1,000,000đ)")
  } else {
    estimatedPrice += 200000
    breakdown.push("Đầu số mới hiện đại (+200,000đ)")
  }

  // 2. Phân tích đuôi số (Tail)
  const tail = phone.substring(phone.length - 4)
  const tail5 = phone.substring(phone.length - 5)
  const tail6 = phone.substring(phone.length - 6)

  // Kiểm tra Lục quý, Ngũ quý, Tứ quý
  const isLucQuy = new Set(tail6).size === 1
  const isNguQuy = new Set(tail5).size === 1 && !isLucQuy
  const isTuQuy = new Set(tail).size === 1 && !isNguQuy

  if (isLucQuy) {
    estimatedPrice += 500000000 // Lục quý cực kỳ đắt
    breakdown.push(`Đuôi Lục Quý ${tail[0]} siêu hiếm (+500,000,000đ)`)
  } else if (isNguQuy) {
    estimatedPrice += 80000000
    breakdown.push(`Đuôi Ngũ Quý ${tail[0]} đại cát (+80,000,000đ)`)
  } else if (isTuQuy) {
    estimatedPrice += 20000000
    breakdown.push(`Đuôi Tứ Quý ${tail[0]} sang trọng (+20,000,000đ)`)
  }

  // Kiểm tra Sảnh tiến
  if (tail === "5678" || tail === "6789" || tail === "3456") {
    estimatedPrice += 35000000
    breakdown.push(`Đuôi Sảnh Tiến ${tail} vinh hoa phú quý (+35,000,000đ)`)
  } else if (tail === "1234" || tail === "2345") {
    estimatedPrice += 10000000
    breakdown.push(`Đuôi Sảnh Tiến cơ bản ${tail} (+10,000,000đ)`)
  }

  // Kiểm tra Thần tài, Lộc phát ở đuôi hoặc thân
  if (phone.includes("6868") || phone.includes("8686")) {
    estimatedPrice += 15000000
    breakdown.push("Chứa cặp Lộc Phát 6868 cực đẹp (+15,000,000đ)")
  } else if (phone.endsWith("68") || phone.endsWith("86")) {
    estimatedPrice += 3000000
    breakdown.push("Đuôi Lộc Phát 68/86 may mắn (+3,000,000đ)")
  }

  if (phone.endsWith("39") || phone.endsWith("79")) {
    estimatedPrice += 2000000
    breakdown.push("Đuôi Thần Tài 39/79 chiêu tài (+2,000,000đ)")
  }
  
  if (phone.endsWith("38") || phone.endsWith("78")) {
    estimatedPrice += 1000000
    breakdown.push("Đuôi Ông Địa 38/78 bình an (+1,000,000đ)")
  }

  // Thêm một chút dao động giá ngẫu nhiên dựa trên các số giữa
  const sumOfMiddle = phone.substring(3, 6).split('').reduce((acc, val) => acc + parseInt(val), 0)
  const randomBump = sumOfMiddle * 50000
  estimatedPrice += randomBump
  
  if (randomBump > 0) {
    breakdown.push(`Hòa hợp các con số giữa mang lại dương khí (+${randomBump.toLocaleString('vi-VN')}đ)`)
  }

  // Round up to nearest 100,000
  estimatedPrice = Math.ceil(estimatedPrice / 100000) * 100000

  return {
    estimatedPrice,
    breakdown
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { phone } = body

    if (!phone || phone.length < 10 || phone.length > 11) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ. Vui lòng nhập số từ 10-11 số." },
        { status: 400 }
      )
    }

    // Làm sạch số (chỉ giữ số)
    const cleanPhone = phone.replace(/\D/g, "")

    const result = calculateValuation(cleanPhone)

    return NextResponse.json({
      phone: cleanPhone,
      estimatedPrice: result.estimatedPrice,
      breakdown: result.breakdown
    })
  } catch (error) {
    console.error("Valuation Error:", error)
    return NextResponse.json({ error: "Lỗi nội bộ server" }, { status: 500 })
  }
}
