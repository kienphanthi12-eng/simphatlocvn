import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Lịch sử trò chuyện không hợp lệ" }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]?.content || ""
    const apiKey = process.env.DEEPSEEK_API_KEY || ""

    // Lấy một số sim nổi bật từ DB để làm gợi ý thật (lọc trong JS tránh lỗi ép kiểu Postgres)
    const rawSims = await prisma.sim.findMany({
      orderBy: { price: "asc" },
      take: 50
    })
    const recommendedSims = rawSims
      .filter(s => s.status === "AVAILABLE")
      .slice(0, 5)

    const simListContext = recommendedSims
      .map(s => `- Số: ${s.phone}`)
      .join("\n")

    const systemPrompt = `Bạn là "Thầy Phong Thủy AI" - Bậc Thầy Dịch Lý & Phong Thủy Hoàng Gia của thương hiệu "Sim Phát Lộc" (simphatloc.vn).
Nhiệm vụ của bạn là xem mệnh lý, luận giải cát hung quẻ dịch và gợi ý cát số hộ mệnh cho gia chủ một cách uyên bác, thâm sâu và tôn kính nhất.

VĂN PHONG VÀ NGUYÊN TẮC QUAN TRỌNG:
1. TUYỆT ĐỐI KHÔNG xưng hô hay nói chuyện như một nhân viên bán hàng (seller) thông thường. Lão phu không được báo giá tiền (ví dụ: 1.500.000đ) hay phân tích các danh mục khô khan (ví dụ: "thể loại Thần Tài"). Thay vào đó, hãy nói về số sim như những "Bảo số trợ mệnh", "Pháp bảo phong thủy" được khai quang tài lộc.
2. Xưng hô: Gọi người dùng là "Quý chủ nhân" hoặc "Quý khách", xưng là "Lão phu" hoặc "Thầy Phong Thủy AI". Giọng văn uy nghiêm, đĩnh đạc, thâm trầm, đậm chất cổ phong truyền thống Việt Nam.
3. Dẫn link thỉnh sim trực tiếp: Khi giới thiệu bất cứ bảo số nào cho gia chủ, hãy lồng ghép đường link đặt mua trực tiếp bằng cú pháp Markdown chuẩn sau đây để gia chủ thỉnh sim lập tức:
👉 **[Thỉnh bảo số 0915.456.379](/checkout?phone=0915456379)** (Nhớ bỏ dấu chấm trong tham số phone ở đường dẫn).
4. Tính tương tác & Gợi mở: Đừng trả lời một chiều. Lão phu luôn luôn phải đặt ra những câu hỏi tương tác tinh tế ở cuối câu để tìm hiểu sâu hơn về Bát Tự của Quý chủ nhân. Hãy hỏi về ngày tháng năm sinh âm lịch, giờ sinh (Tý, Sửu, Dần...), hoặc hỏi xem gia chủ đang muốn tập trung kích hoạt cung vị nào: Cung Tài Lộc (kinh doanh), Cung Quan Lộc (sự nghiệp), hay Cung Gia Đạo (tình duyên, gia quyến).

Danh sách bảo số cát tường hiện có trong kho:
${simListContext}`

    if (apiKey) {
      // Gọi API DeepSeek thật
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.6,
          stream: false
        })
      })

      if (response.ok) {
        const result = await response.json()
        const reply = result.choices?.[0]?.message?.content || ""
        return NextResponse.json({ reply })
      } else {
        const errText = await response.text()
        console.error("[DeepSeek Chat API Error]:", errText)
      }
    }

    // FALLBACK ENGINE (Nếu không có API key hoặc API lỗi)
    // Phân tích từ khóa để trả lời thông minh
    const input = lastMessage.toLowerCase()
    let reply = ""

    if (input.includes("1996") || input.includes("bính tý")) {
      reply = `Chào Quý chủ nhân Bính Tý 1996. Bản mệnh của chủ nhân thuộc **Giản Hạ Thủy** (Nước dưới khe).
Để gia tăng cát khí, Lão phu khuyên chủ nhân nên lựa chọn các cát số thuộc hành **Kim** (Kim sinh Thủy - tương sinh tuyệt đối) hoặc hành **Thủy** (bình hòa bổ trợ) để làm hộ thân bảo số.
Lão phu xin kính dâng các bảo số cát tường trợ mệnh đang có trong kho:
${recommendedSims.slice(0, 3).map(s => `👉 **[Thỉnh bảo số ${s.phone.slice(0, 4)}.${s.phone.slice(4, 7)}.${s.phone.slice(7)}](/checkout?phone=${s.phone})**`).join("\n")}

Quý chủ nhân sinh vào tháng nào âm lịch và đang muốn mưu cầu điều chi cho cung mệnh của mình?`
    } else if (input.includes("tài lộc") || input.includes("lộc phát") || input.includes("thần tài") || input.includes("kinh doanh")) {
      reply = `Kính thưa Quý khách, trong dịch học cổ xưa, chiêu tài tiến bảo, đón rước lộc tài là nguyện vọng vô cùng chính đáng của gia chủ.
Để kích hoạt cung tài lộc mạnh mẽ, Lão phu khuyên chủ nhân nên thỉnh các linh số cát tường mang năng lượng Lộc Phát hoặc Thần Tài đắc cát.
Lão phu xin kính dâng các pháp bảo số cát tường chiêu tài đang có trong tầm tay:
${recommendedSims.slice(0, 3).map(s => `👉 **[Thỉnh bảo số ${s.phone.slice(0, 4)}.${s.phone.slice(4, 7)}.${s.phone.slice(7)}](/checkout?phone=${s.phone})**`).join("\n")}

Quý khách hiện đang kinh doanh lĩnh vực nào và muốn tập trung cầu Tài Lộc thăng tiến hay Cầu Gia Đạo bình an?`
    } else if (input.includes("mệnh hỏa") || input.includes("mệnh thổ") || input.includes("mệnh kim") || input.includes("mệnh mộc") || input.includes("mệnh thủy")) {
      const menh = input.includes("hỏa") ? "Hỏa" : input.includes("thổ") ? "Thổ" : input.includes("kim") ? "Kim" : input.includes("mộc") ? "Mộc" : "Thủy"
      const sinh = menh === "Hỏa" ? "Mộc (Mộc sinh Hỏa)" : menh === "Thổ" ? "Hỏa (Hỏa sinh Thổ)" : menh === "Kim" ? "Thổ (Thổ sinh Kim)" : menh === "Mộc" ? "Thủy (Thủy sinh Mộc)" : "Kim (Kim sinh Thủy)"
      
      reply = `Quý khách thuộc mệnh **${menh}**. Theo dịch học ngũ hành hoàng gia, chủ nhân nên thỉnh pháp bảo số thuộc hành **${sinh.split(" ")[0]}** để được tương sinh, hộ mệnh đắc lực nhất.
Lão phu xin kính dâng các linh số cát tường trợ mệnh đang có trong kho:
${recommendedSims.slice(0, 2).map(s => `👉 **[Thỉnh bảo số ${s.phone.slice(0, 4)}.${s.phone.slice(4, 7)}.${s.phone.slice(7)}](/checkout?phone=${s.phone})**`).join("\n")}

Quý chủ nhân sinh năm bao nhiêu âm lịch để Lão phu có thể lập quẻ dịch chi tiết cát hung trợ duyên cho bạn?`
    } else {
      reply = `Kính chào Quý chủ nhân ghé thăm **Sim Phát Lộc**. Lão phu là Thầy Phong Thủy AI, được thừa hưởng tri thức dịch lý ngàn năm để trợ duyên cho chủ nhân tìm kiếm linh số trợ mệnh.
Quý chủ nhân có thể chia sẻ cho Lão phu biết **Năm sinh âm lịch**, **Giới tính** hoặc **Nguyện vọng cuộc sống (Kinh doanh tài lộc, Quan lộc thăng tiến hay Tình duyên gia đạo)**? 
Lão phu sẽ lập tức bấm quẻ dịch, tìm ra pháp bảo số đắc cát nhất cho chủ nhân!`
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[AI Chat API Error]:", error)
    return NextResponse.json({ error: "Lỗi xử lý yêu cầu AI" }, { status: 500 })
  }
}
