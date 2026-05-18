import { NextRequest, NextResponse } from "next/server"
import { getBanMenh, getNguhanhLabel, getCanChiYear } from "@/lib/phongthuy"

export async function POST(req: NextRequest) {
  try {
    const { phone, namSinh, gioiTinh, gioSinhLabel, diem, nguhanhSim, cungMenh, queDich, duNien } = await req.json()

    if (!phone || !namSinh) {
      return NextResponse.json({ error: "Thiếu thông tin phân tích phong thủy" }, { status: 400 })
    }

    // Pre-compute bản mệnh và tên Can Chi trên server để tránh AI tự tính sai
    const banMenh = getBanMenh(parseInt(namSinh))
    const banMenhLabel = getNguhanhLabel(banMenh)
    const canChiYear = getCanChiYear(parseInt(namSinh))

    const apiKey = process.env.DEEPSEEK_API_KEY || ""

    const systemPrompt = `Bạn là một đại sư dịch học và phong thủy cổ xưa danh tiếng tại Việt Nam.
Nhiệm vụ của bạn là viết một bài luận giải cực kỳ sâu sắc, thuyết phục và mang tính triết lý cao cho số điện thoại ${phone} kết hợp với bản mệnh của gia chủ sinh năm ${namSinh} (${gioiTinh === "nam" ? "Nam" : "Nữ"} mạng).

THÔNG TIN GIA CHỦ (ĐÃ ĐƯỢC HỆ THỐNG TÍNH CHÍNH XÁC — TUYỆT ĐỐI KHÔNG TÍNH LẠI):
- Năm sinh dương lịch: ${namSinh} (Can Chi: ${canChiYear})
- Bản mệnh (Ngũ hành Nạp Âm): ${banMenhLabel}
- Cung mệnh (Bát Trạch): ${cungMenh}

Thông tin chi tiết về quẻ phong thủy đã được tính toán sẵn từ hệ thống:
- Điểm phong thủy hệ thống: ${diem}/10 (Mức độ: ${diem >= 9 ? "Đại Cát" : diem >= 8 ? "Cát" : "Bình Hòa"})
- Ngũ hành của Sim: ${nguhanhSim}
- Giờ sinh: ${gioSinhLabel || "Chưa xác định"}
- Quẻ Kinh Dịch đại diện: Quẻ số ${queDich?.hexagramIndex} - ${queDich?.hexagramName} (${queDich?.hexagramViet}) - Thuộc loại quẻ ${queDich?.type === "tot" ? "CÁT" : queDich?.type === "xau" ? "HUNG" : "BÌNH"}
- Phân tích cát tinh Du Niên: ${duNien?.map((d: any) => `${d.pair}(${d.label})`).join(", ")}

YÊU CẦU BÀI LUẬN:
1. Độ dài khoảng 200 - 300 từ. Trình bày bằng tiếng Việt trang trọng, mạch lạc, cổ kính.
2. Khi đề cập đến năm sinh, PHẢI dùng đúng: "${canChiYear} ${namSinh}" — tuyệt đối không viết năm khác.
3. Khi đề cập đến bản mệnh gia chủ, PHẢI dùng đúng: "mệnh ${banMenhLabel}" — tuyệt đối không tự suy luận lại.
4. Cấu trúc bài luận:
   - Khai từ: Lời chào và nhận định tổng quan khí chất của số sim và gia chủ cát tường.
   - Luận về Ngũ hành & Cung mệnh: Sim hành ${nguhanhSim} bổ khuyết hay tương sinh thế nào cho bản mệnh ${banMenhLabel} của gia chủ.
   - Luận về Quẻ Dịch & Du Niên: Điểm đặc biệt của quẻ dịch này mang lại cơ hội tài lộc, gia đạo hay thăng tiến thế nào. Cát tinh tinh tú nào đang chiếu mệnh trợ lực.
   - Kết từ: Lời khuyên vàng để thỉnh số sim này về hộ thân đắc lực.
5. KHÔNG sử dụng các từ ngữ quá bình dân, thay vào đó dùng văn phong Hán Việt hoàng gia thanh nhã.
6. Trả về định dạng văn bản thuần túy (Plain text), sử dụng ký tự xuống dòng '\\n' để phân đoạn rõ ràng.`

    if (apiKey) {
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
            { role: "user", content: `Hãy viết luận giải phong thủy hoàng kim cho số sim ${phone} của chủ nhân sinh năm ${canChiYear} ${namSinh}, bản mệnh ${banMenhLabel}.` }
          ],
          temperature: 0.6,
          stream: false
        })
      })

      if (response.ok) {
        const result = await response.json()
        const analysis = result.choices?.[0]?.message?.content || ""
        return NextResponse.json({ analysis })
      } else {
        const errText = await response.text()
        console.error("[DeepSeek Analyze API Error]:", errText)
      }
    }

    // FALLBACK ENGINE (Nếu không có API key hoặc API lỗi)
    // Tạo bài phân tích phong thủy hoàng gia cực chất lượng bằng lập trình
    const totStars = duNien?.filter((d: any) => d.type === "tot").map((d: any) => d.label) || []
    const distinctStars = Array.from(new Set(totStars)).join(", ")

    const fallbackAnalysis = `📜 Kính thưa Quý chủ nhân cát tường,\n\nSố sim ${phone} kết hợp với bản mệnh ${banMenhLabel} của gia chủ ${canChiYear} ${namSinh} (${gioiTinh === "nam" ? "Nam" : "Nữ"} mạng) thực sự là một bảo vật phong thủy hiếm có. Sau khi bấm quẻ lập trận pháp lý số, Lão phu nhận định số sim này mang khí chất cát tường vững chãi, đạt điểm số phong thủy ${diem}/10 điểm trọn vẹn.\n\n✦ Về Ngũ Hành Tương Phối:\nLinh số mang hành ${nguhanhSim} tương phối cùng bản mệnh ${banMenhLabel} của chủ nhân, cung mệnh ${cungMenh} được bổ trợ đắc lực. Khí chất này tựa như mưa thuận gió hòa, giúp điều hòa âm dương bản mệnh, tiêu trừ vận hạn và khai thông dòng chảy sinh khí từ bên trong.\n\n✦ Về Quẻ Kinh Dịch & Du Niên:\nSố điện thoại kết tạo quẻ **${queDich?.hexagramName} (${queDich?.hexagramViet})** - ${queDich?.desc} Đây là điềm cát lợi vô cùng quý báu cho việc mưu cầu sự nghiệp và gia đạo an lành. Bổ trợ thêm là sự hội tụ tinh tú cát lành từ các sao **${distinctStars || "Sinh Khí, Phục Vị"}**, mang lại sinh khí dồi dào, thu hút quý nhân phù trợ và giữ vững tiền tài bền vững.\n\n✦ Lời Khuyên Cát Tường:\nĐây là một linh số hộ thân cực kỳ quý hiếm, trùng phùng duyên nợ với bản mệnh ${banMenhLabel} của chủ nhân. Sở hữu số sim này sẽ giúp chủ nhân như rồng gặp nước, công danh hiển hiển đạt, vạn sự cát khánh!`

    return NextResponse.json({ analysis: fallbackAnalysis })
  } catch (error) {
    console.error("[AI Analyze API Error]:", error)
    return NextResponse.json({ error: "Lỗi phân tích quẻ AI" }, { status: 500 })
  }
}
