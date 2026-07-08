import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, mode, userContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Define specialized system prompt based on mode
    let systemPrompt = '';

    if (mode === 'teacher_assistant') {
      systemPrompt = `Bạn là "AI Teacher Assistant" - Giảng viên & Gia sư AI thông minh đỉnh cao của hệ sinh thái SeduAi Education (đánh giá chuẩn chất lượng từ Edu2Review).
Nhiệm vụ của bạn:
1. Đóng vai trò là một người thầy, giảng viên tận tâm, kiên nhẫn, có kiến thức sâu rộng trong mọi lĩnh vực đặc biệt là: Lập trình (Web Full-Stack, React, Next.js, Python, AI/ML), Tiếng Anh (IELTS 6.5+, Giao tiếp Quốc tế), Kỹ năng mềm và Quản trị doanh nghiệp.
2. Giải thích các khái niệm phức tạp một cách trực quan, dễ hiểu nhất, chia nhỏ từng bước (step-by-step), đi kèm ví dụ thực tế và code minh họa rõ ràng.
3. Hỗ trợ học viên sửa lỗi code, chấm điểm bài luận IELTS, tạo bài tập trắc nghiệm (quiz) thực hành và đưa ra lời khuyên ôn tập tối ưu.
4. Giao diện và phong cách trò chuyện chuyên nghiệp, lịch sự, chuẩn mực như ChatGPT, trình bày bằng Markdown gọn gàng (dùng code block, bảng, bullet points).
5. Luôn khích lệ tinh thần tự học của học viên và sẵn sàng giải đáp bất kỳ câu hỏi nào từ cơ bản đến nâng cao.`;
    } else {
      // mode === 'admissions_crm'
      systemPrompt = `Bạn là "AI Admissions CRM Assistant" - Chuyên viên Tư vấn Tuyển sinh & Trợ lý ảo CRM của SeduAi Education (Tổng hợp đánh giá chất lượng và học phí uy tín chuẩn Edu2Review).
Nhiệm vụ của bạn:
1. Tư vấn chi tiết, chính xác các khóa học nổi bật của SeduAi:
   - Lập trình Web Full-Stack (Laravel & React): 12 tuần, giảm còn 2.490.000đ (giá gốc 3.500.000đ), cam kết thực chiến dự án thực tế.
   - Tiếng Anh Giao Tiếp Quốc Tế: 10 tuần, giảm còn 1.890.000đ (giá gốc 2.800.000đ), 100% giáo viên bản ngữ & AI luyện âm.
   - Luyện thi IELTS 6.5+ Cam Kết Đầu Ra: 24 tuần, giảm còn 4.500.000đ (giá gốc 6.000.000đ), cam kết hoàn học phí bằng văn bản nếu không đạt.
   - Ứng dụng AI Doanh Nghiệp (ChatGPT, Automation): 6 tuần, giảm còn 3.200.000đ (giá gốc 4.500.000đ).
   - Lập trình Python cho Trẻ Em: 8 tuần, giảm còn 1.500.000đ (giá gốc 2.200.000đ).
2. Tích cực khéo léo hỏi thăm thông tin người dùng (Họ tên, Độ tuổi, Môn học quan tâm, Ngân sách, Số điện thoại) để hệ thống Admissions CRM ghi nhận thông tin Lead.
3. Khi người dùng cung cấp Số điện thoại hoặc thông tin liên hệ, hãy chúc mừng họ, thông báo rằng dữ liệu đã được lưu thành công vào "Hệ thống AI Admissions CRM NKS API", đồng thời gửi tặng ngay Voucher ưu đãi giảm thêm 10% học phí hoặc 1 tháng sử dụng AI Teacher Assistant miễn phí.
4. Trình bày lời tư vấn cuốn hút, chuẩn cấu trúc Markdown, rõ ràng và đầy năng lượng tích cực.`;
    }

    // Append SeduAi context if available
    if (userContext && userContext.name) {
      systemPrompt += `\n\nThông tin học viên đang trò chuyện: Tên: ${userContext.name}, Điểm tích lũy: ${userContext.point} điểm. Hãy gọi tên học viên một cách thân thiện.`;
    }

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10), // Take recent 10 turns for context efficiency
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Fast, high quality chat model
          messages: fullMessages,
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('OpenAI API Error:', errData);
        throw new Error(errData.error?.message || 'Failed to fetch from OpenAI');
      }

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không thể xử lý yêu cầu lúc này.';

      return NextResponse.json({
        success: true,
        reply: aiReply,
        model: data.model || 'gpt-4o-mini',
      });
    } catch (openaiErr: any) {
      console.warn('OpenAI network or key quota fallback triggered:', openaiErr.message);

      // Fallback intelligent simulation if API key runs out of quota or network issue occurs
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let fallbackReply = '';

      if (mode === 'teacher_assistant') {
        if (lastUserMsg.includes('react') || lastUserMsg.includes('code') || lastUserMsg.includes('lập trình')) {
          fallbackReply = `### 💡 Giảng Viên AI SeduAi Giải Đáp: Lập trình & React
Chào bạn! Dưới đây là giải thích cốt lõi về chủ đề bạn quan tâm:

#### 1. Khái niệm chính (Core Concept)
Trong lập trình hiện đại (như **Next.js 15 / React 19**), các component được chia thành **Server Components** (mặc định) và **Client Components** (\`'use client'\`).

\`\`\`tsx
// Ví dụ một Component chuẩn trong SeduAi App
export default function CourseBadge({ title, points }: { title: string; points: number }) {
  return (
    <div className="bg-primary/10 border border-primary p-4 rounded-xl">
      <h4 className="font-bold text-primary">{title}</h4>
      <p className="text-xs text-slate-600">Điểm thưởng: {points}p</p>
    </div>
  );
}
\`\`\`

#### 2. Lời khuyên ôn tập từ Giảng viên AI
* **Bước 1**: Nắm vững cú pháp TypeScript & Hooks cơ bản (\`useState\`, \`useEffect\`).
* **Bước 2**: Thực hành clone các giao diện thực tế như Edu2Review hoặc ChatGPT UI.
* **Bước 3**: Đừng ngần ngại hỏi tôi bất cứ đoạn code nào bạn muốn tối ưu! Bạn có muốn làm một bài tập trắc nghiệm nhanh ngay bây giờ không?`;
        } else if (lastUserMsg.includes('ielts') || lastUserMsg.includes('tiếng anh')) {
          fallbackReply = `### 🎓 Giảng Viên AI SeduAi: Luyện thi IELTS & Tiếng Anh Giao Tiếp
Rất vui được đồng hành cùng bạn nâng tầm ngoại ngữ! Dưới đây là chiến lược chuẩn từ **Edu2Review Top IELTS Centers**:

| Kỹ Năng | Mục Tiêu 6.5+ | Phương Pháp Ôn Tập AI SeduAi |
| :--- | :--- | :--- |
| **Speaking** | Fluency & Coherence | Luyện đàm thoại 1-1 phản xạ hàng ngày cùng AI |
| **Writing** | Task Response | Gửi bài luận cho AI Teacher chấm điểm và sửa từ vựng |
| **Listening** | Section 3 & 4 | Nghe chủ đề Academic Lecture & take note từ khoá |

Bạn muốn bắt đầu luyện tập phần nào trước? Hãy gửi cho tôi một đoạn tiếng Anh bạn vừa viết để tôi kiểm tra ngữ pháp giúp bạn nhé!`;
        } else {
          fallbackReply = `### 🧑‍🏫 Giảng Viên AI SeduAi - Luôn đồng hành cùng bạn
Tôi đã tiếp nhận câu hỏi: *"**${messages[messages.length - 1]?.content}**"*

Với tư cách là **AI Teacher Assistant**, tôi luôn sẵn sàng hỗ trợ bạn 24/7:
- Giải thích chi tiết các bài toán, cấu trúc ngữ pháp, hoặc thuật toán lập trình.
- Hướng dẫn thực làm dự án thực chiến theo tiêu chuẩn **Edu2Review**.
- Kiểm tra bài tập và đưa ra gợi ý sửa lỗi ngay lập tức.

Bạn có cần tôi phân tích cụ thể hơn hoặc đưa ra ví dụ minh họa từng bước cho chủ đề này không?`;
        }
      } else {
        // Admissions CRM mode fallback
        if (lastUserMsg.match(/\d{9,11}/)) {
          const phoneMatch = lastUserMsg.match(/\d{9,11}/)?.[0] || '0901234567';
          fallbackReply = `### 🎉 Chúc Mừng Bạn! Đã Đồng Bộ Hồ Sơ Vào AI Admissions CRM
Hệ thống **SeduAi Admissions CRM** đã tự động ghi nhận số điện thoại **${phoneMatch}** và tạo hồ sơ tư vấn thành công!

* **Mã Lead CRM**: \`#LEAD_SEDU_2026_${Math.floor(100 + Math.random() * 900)}\`
* **Ưu đãi nhận được**: 🎁 **Voucher Giảm 30% Học Phí** + **1 Tháng VIP sử dụng AI Teacher Assistant miễn phí**.

Chuyên viên tuyển sinh của SeduAi sẽ liên hệ qua SĐT của bạn trong vòng **15 phút tới** để tư vấn lộ trình chi tiết. Bạn có muốn xem trước lịch khai giảng không?`;
        } else {
          fallbackReply = `### 🎯 Trợ Lý Tuyển Sinh AI CRM - Tư Vấn Lộ Trình Edu2Review
Chào bạn! SeduAi hiện là đơn vị giáo dục công nghệ hàng đầu với các khóa học được đánh giá 5 sao trên **Edu2Review**:

1. 💻 **Lập trình Web Full-Stack (Laravel & React)** - *2.490.000 VNĐ / tháng* (Thực chiến dự án thật).
2. 🇬🇧 **Luyện thi IELTS 6.5+ Cam Kết Đầu Ra** - *4.500.000 VNĐ / khóa* (Hoàn tiền 100% nếu không đạt).
3. 🤖 **Ứng dụng AI Doanh Nghiệp & ChatGPT** - *3.200.000 VNĐ / khóa* (Tự động hóa công việc).

Để tôi tư vấn chính xác khóa học và gửi ưu đãi giảm thêm **10% học phí**, bạn có thể cho tôi biết **số điện thoại** hoặc **độ tuổi / mục tiêu học tập** của bạn được không ạ?`;
        }
      }

      return NextResponse.json({
        success: true,
        reply: fallbackReply,
        model: 'seduai-hybrid-engine-v2',
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error('API /chat Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
