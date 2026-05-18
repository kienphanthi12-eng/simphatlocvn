import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getBanMenh, getNguhanhLabel, getCanChiYear } from "@/lib/phongthuy"

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

    // Phát hiện năm sinh trong toàn bộ lịch sử hội thoại để cung cấp bản mệnh chính xác cho AI
    const allText = messages.map((m: { content: string }) => m.content).join(" ")
    const yearMatch = allText.match(/\b(19[4-9]\d|200\d|201[0-9])\b/)
    let menhContext = ""
    if (yearMatch) {
      const detectedYear = parseInt(yearMatch[1])
      const detectedMenh = getBanMenh(detectedYear)
      const detectedMenhLabel = getNguhanhLabel(detectedMenh)
      const detectedCanChi = getCanChiYear(detectedYear)
      menhContext = `\n\nTHÔNG TIN BẢN MỆNH ĐÃ XÁC ĐỊNH (TUYỆT ĐỐI DÙNG CHÍNH XÁC, KHÔNG TÍNH LẠI):
- Năm sinh: ${detectedYear} (${detectedCanChi})
- Bản mệnh Nạp Âm: ${detectedMenhLabel}`
    }

    const systemPrompt = `Bạn là "Thầy Phong Thủy AI" - Bậc Thầy Dịch Lý & Phong Thủy Hoàng Gia của thương hiệu "Sim Phát Lộc" (simphatloc.vn).
Nhiệm vụ của bạn là xem mệnh lý, luận giải cát hung quẻ dịch và dẫn dắt khéo léo để gia chủ thỉnh bảo số hộ mệnh phù hợp nhất.

VĂN PHONG VÀ NGUYÊN TẮC BẮT BUỘC:
1. NGẮN GỌN & TƯƠNG TÁC (CỰC KỲ QUAN TRỌNG): Tuyệt đối KHÔNG viết câu trả lời dài dòng hay giảng giải phong thủy tràn lan. Mỗi phản hồi của Lão phu chỉ được dài tối đa 60-90 từ (khoảng 2-3 câu ngắn, chia dòng rõ ràng).
2. PHỄU TƯƠNG TÁC 3 BƯỚC ĐỂ PHÂN TÍCH VÀ BÁN HÀNG:
   - Bước 1 (Thu thập Bát Tự): Khi khách chào hỏi hoặc hỏi chung chung, Lão phu trả lời lễ độ, ngắn gọn và hỏi ngay: "Để bấm quẻ chuẩn xác, xin hỏi Quý chủ nhân sinh năm bao nhiêu âm lịch và là Nam hay Nữ mạng?"
   - Bước 2 (Xác định nhu cầu): Khi biết năm sinh, Lão phu nêu ngắn gọn bản mệnh (ví dụ: Giản Hạ Thủy) và hỏi tiếp: "Hiện tại chủ nhân muốn kích hoạt cung vị nào trợ mệnh: Cung Tài Lộc (kinh doanh), Cung Quan Lộc (sự nghiệp), hay Cung Gia Đạo?"
   - Bước 3 (Gợi ý & Chốt đơn): Khi biết nhu cầu, Lão phu giới thiệu ngay 1 đến 2 bảo số trợ mệnh đắc lực nhất từ danh sách bên dưới kèm link checkout trực tiếp và chốt đơn tinh tế: "Lão phu thấy linh số này rất hợp bổ khuyết bản mệnh của ngài. Ngài có muốn thỉnh ngay số này về hộ thân hay cần Lão phu phân tích sâu hơn?"
3. Tuyệt đối không nói chuyện kiểu nhân viên bán hàng (seller), không báo giá tiền thương mại hay phân tích danh mục khô khan. Hãy gọi sim là "Bảo số trợ mệnh", "Linh số cát tường".
4. Đường dẫn thỉnh sim trực tiếp: Dùng cú pháp Markdown chuẩn sau đây:
👉 **[Thỉnh bảo số 0915.456.379](/checkout?phone=0915456379)** (Nhớ bỏ dấu chấm trong tham số phone ở đường dẫn).
5. KHI KHÁCH NÓI NĂM SINH: Bắt buộc dùng đúng bản mệnh đã được hệ thống cung cấp ở phần THÔNG TIN BẢN MỆNH bên dưới — KHÔNG TỰ TÍNH LẠI từ năm sinh vì có thể sai.${menhContext}

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

    // Phát hiện năm sinh trong tin nhắn cuối (ưu tiên) hoặc toàn bộ hội thoại
    const yearInInput = input.match(/\b(19[4-9]\d|200\d|201[0-9])\b/)
    if (yearInInput) {
      const yr = parseInt(yearInInput[1])
      const menh = getBanMenh(yr)
      const menhLabel = getNguhanhLabel(menh)
      const canChi = getCanChiYear(yr)
      // Ngũ hành tương sinh với bản mệnh
      const sinhMap: Record<string, string> = {
        "Kim": "Thổ (Thổ sinh Kim)",
        "Mộc": "Thủy (Thủy sinh Mộc)",
        "Thủy": "Kim (Kim sinh Thủy)",
        "Hỏa": "Mộc (Mộc sinh Hỏa)",
        "Thổ": "Hỏa (Hỏa sinh Thổ)",
      }
      const tuongSinh = sinhMap[menhLabel] ?? "Kim"
      reply = `Kính thưa Quý chủ nhân tuổi **${canChi} ${yr}**, bản mệnh của chủ nhân thuộc **${menhLabel}**.
Để gia tăng cát khí, Lão phu khuyên nên thỉnh cát số thuộc hành **${tuongSinh}** làm hộ thân bảo số.
Lão phu xin kính dâng các bảo số cát tường trợ mệnh đang có trong kho:
${recommendedSims.slice(0, 3).map(s => `👉 **[Thỉnh bảo số ${s.phone.slice(0, 4)}.${s.phone.slice(4, 7)}.${s.phone.slice(7)}](/checkout?phone=${s.phone})**`).join("\n")}

Quý chủ nhân đang muốn mưu cầu điều chi: Tài Lộc, Quan Lộc, hay Gia Đạo?`
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
