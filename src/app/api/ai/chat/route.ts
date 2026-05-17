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

    // Lấy một số sim nổi bật từ DB để làm gợi ý thật nếu AI muốn đề xuất
    const recommendedSims = await prisma.sim.findMany({
      where: { status: "AVAILABLE" },
      take: 5,
      orderBy: { price: "asc" }
    })

    const simListContext = recommendedSims
      .map(s => `- Số: ${s.phone} | Giá: ${s.price.toLocaleString("vi-VN")}đ | Thể loại: ${s.type}`)
      .join("\n")

    const systemPrompt = `Bạn là "Thầy Phong Thủy AI" - Trợ lý tư vấn phong thủy hoàng gia độc quyền của thương hiệu "Sim Phát Lộc" (simphatloc.vn).
Nhiệm vụ của bạn là tư vấn sim số đẹp, tính điểm cát hung, luận giải vận mệnh, ngũ hành, quẻ Kinh Dịch và Du Niên một cách uyên bác, trang trọng và tôn kính.

VĂN PHONG VÀ QUY TẮC ỨNG XỬ:
1. Xưng hô: Gọi người dùng là "Quý chủ nhân" hoặc "Quý khách", xưng là "Lão phu" hoặc "Thầy Phong Thủy AI".
2. Giọng điệu: Uy nghiêm, sâu sắc, lễ độ, mang đậm phong thái của một bậc thầy dịch lý cổ xưa tại Việt Nam. Sử dụng các từ ngữ Hán Việt cát tường hợp lý (ví dụ: cát tường như ý, đại cát đại lợi, hanh thông, sinh khí, chiêu tài,...).
3. Kiến thức phong thủy: Thấu hiểu Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ) tương sinh tương khắc, Bát Quái Kinh Dịch (64 quẻ dịch), Bát tinh Du Niên (Sinh Khí, Thiên Y, Diên Niên, Phục Vị là tốt; Tuyệt Mệnh, Lục Sát, Ngũ Quỷ, Họa Hại là xấu).
4. Thực tế kinh doanh: Gợi ý các sim thực tế đang bán từ danh sách sim hiện có dưới đây khi Quý chủ nhân muốn tìm sim. ĐỪNG tự bịa ra số điện thoại không có trong danh sách này nếu họ hỏi mua:
Danh sách sim hiện có trong kho:
${simListContext}

5. Nếu người dùng hỏi các câu hỏi không liên quan đến phong thủy hoặc chọn sim, hãy khéo léo dẫn dắt họ quay lại chủ đề phong thủy hoàng gia và chọn sim cát tường để kích hoạt vận may.`

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
Để gia tăng cát khí, Lão phu khuyên chủ nhân nên lựa chọn các số sim có hành **Kim** (Kim sinh Thủy - tương sinh tuyệt đối) hoặc hành **Thủy** (bình hòa bổ trợ). 
- Các con số cát tường cho mệnh Thủy: **1, 6, 7**. Tránh con số thuộc hành Thổ tương khắc như **0, 2, 5, 8**.
Lão phu xin đề xuất một số sim cát tường Thủy/Kim đang có sẵn trong kho:
${recommendedSims.slice(0, 3).map(s => `✦ **${s.phone}** (${s.price.toLocaleString("vi-VN")}đ - Thể loại: ${s.type})`).join("\n")}
Chúc Quý chủ nhân sớm thỉnh được linh số hộ thân!`
    } else if (input.includes("tài lộc") || input.includes("lộc phát") || input.includes("thần tài") || input.includes("kinh doanh")) {
      reply = `Kính thưa Quý khách, trong dịch học cổ xưa, cầu tài lộc, chiêu tài tiến bảo là nguyện vọng vô cùng chính đáng.
Để kích hoạt cung tài lộc, chủ nhân nên sở hữu các dòng sim cát tường như:
- **Sim Lộc Phát (đuôi 68, 86)**: Chiêu tài đón lộc, công việc buôn bán hanh thông cát lợi.
- **Sim Thần Tài (đuôi 39, 79)**: Được thần tài gõ cửa gia trì, quý nhân phù trợ trong kinh doanh.
Lão phu xin đề xuất một số bảo số chiêu tài đang hiện hữu trong kho:
${recommendedSims.slice(0, 3).map(s => `✦ **${s.phone}** (${s.price.toLocaleString("vi-VN")}đ)`).join("\n")}
Quý khách có thể bấm trực tiếp vào phần đặt mua số sim này để thỉnh vận may cát tường!`
    } else if (input.includes("mệnh hỏa") || input.includes("mệnh thổ") || input.includes("mệnh kim") || input.includes("mệnh mộc") || input.includes("mệnh thủy")) {
      const menh = input.includes("hỏa") ? "Hỏa" : input.includes("thổ") ? "Thổ" : input.includes("kim") ? "Kim" : input.includes("mộc") ? "Mộc" : "Thủy"
      const sinh = menh === "Hỏa" ? "Mộc (Mộc sinh Hỏa)" : menh === "Thổ" ? "Hỏa (Hỏa sinh Thổ)" : menh === "Kim" ? "Thổ (Thổ sinh Kim)" : menh === "Mộc" ? "Thủy (Thủy sinh Mộc)" : "Kim (Kim sinh Thủy)"
      
      reply = `Quý khách thuộc mệnh **${menh}**. Theo thuyết âm dương ngũ hành hoàng gia, chủ nhân nên dùng sim thuộc hành **${sinh.split(" ")[0]}** để được tương sinh bổ trợ tối đa.
Lão phu khuyên chủ nhân nên chú trọng các con số đại cát của bản mệnh và tránh các số tương khắc hình hại.
Lão phu xin kính dâng các linh số cát tường trợ mệnh đang có trong tầm tay quý khách:
${recommendedSims.slice(0, 2).map(s => `✦ **${s.phone}** (${s.price.toLocaleString("vi-VN")}đ)`).join("\n")}
Hãy chọn một linh số đắc lực nhất để khai mở cung mệnh hoàng kim!`
    } else {
      reply = `Kính chào Quý chủ nhân ghé thăm **Sim Phát Lộc**. Lão phu là Thầy Phong Thủy AI, được thừa hưởng tri thức dịch lý ngàn năm để trợ duyên cho chủ nhân tìm kiếm linh số hộ mệnh.
Quý khách có thể chia sẻ cho Lão phu biết **Năm sinh âm lịch**, **Giới tính** hoặc **Nguyện vọng tài lộc (kinh doanh, gia đạo, thăng tiến...)**, Lão phu sẽ lập tức bấm quẻ cát hung, tìm ra số điện thoại tương sinh đắc lực nhất cho chủ nhân!
Chúc Quý chủ nhân vạn sự hanh thông, đại cát đại lợi!`
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[AI Chat API Error]:", error)
    return NextResponse.json({ error: "Lỗi xử lý yêu cầu AI" }, { status: 500 })
  }
}
