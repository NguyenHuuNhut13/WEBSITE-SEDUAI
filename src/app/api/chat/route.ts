import { NextResponse } from 'next/server';

// -------------------------------------------------------------
// 1. PROVIDER CALL HELPERS
// -------------------------------------------------------------

async function callGemini(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

  // Format message structure for Gemini (alternating user/model)
  const formattedContents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || '' }]
  }));

  // Endpoint for Gemini 1.5 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini API returned an empty candidate list');
  return text;
}

async function callGroq(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not defined');

  // Format message structure for OpenAI-compatible Groq API
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role || 'user',
      content: m.content || ''
    }))
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', // High speed, reliable free tier model
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1200
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq API returned an empty completion response');
  return text;
}

async function callOpenAI(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role || 'user',
      content: m.content || ''
    }))
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1200
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API returned status ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI API returned an empty completion response');
  return text;
}

// -------------------------------------------------------------
// 2. MAIN POST ROUTE HANDLER
// -------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const { messages, mode, userContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

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

    const recentMessages = messages.slice(-10); // Take recent 10 turns for context efficiency

    // -----------------------------------------------------------
    // TRIPLE-LAYERED FAILSAFE CHAIN ROUTING
    // -----------------------------------------------------------

    // Layer 1: Google Gemini API (Primary free provider)
    if (process.env.GEMINI_API_KEY) {
      try {
        const reply = await callGemini(recentMessages, systemPrompt);
        return NextResponse.json({
          success: true,
          reply,
          provider: 'google-gemini-flash'
        });
      } catch (geminiErr: any) {
        console.warn('Gemini API failed or rate-limited. Trying Groq fallback...', geminiErr.message);
      }
    }

    // Layer 2: Groq Cloud API (Secondary free provider)
    if (process.env.GROQ_API_KEY) {
      try {
        const reply = await callGroq(recentMessages, systemPrompt);
        return NextResponse.json({
          success: true,
          reply,
          provider: 'groq-llama-3.1-instant'
        });
      } catch (groqErr: any) {
        console.warn('Groq API failed or rate-limited. Trying OpenAI fallback...', groqErr.message);
      }
    }

    // Layer 3: OpenAI API (Tertiary paid provider)
    if (process.env.OPENAI_API_KEY) {
      try {
        const reply = await callOpenAI(recentMessages, systemPrompt);
        return NextResponse.json({
          success: true,
          reply,
          provider: 'openai-gpt-4o-mini'
        });
      } catch (openaiErr: any) {
        console.warn('OpenAI API failed or quota exhausted. Falling back to offline simulator...', openaiErr.message);
      }
    }

    // Layer 4: SeduAi Hybrid Fallback Engine v2 (Offline simulator - NEVER fails)
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let fallbackReply = '';

    const lowerMsg = lastUserMsg.toLowerCase();
    if (lowerMsg.includes('nguyên tố') || lowerMsg.includes('prime')) {
      fallbackReply = `### 💡 Giảng Viên AI SeduAi Giải Đáp: Kiểm tra số nguyên tố trong Python
Chào bạn! Đây là hàm kiểm tra số nguyên tố tối ưu bằng ngôn ngữ **Python** (độ phức tạp thời gian là $O(\\sqrt{N})$):

\`\`\`python
def is_prime_optimal(n):
    # Các số nhỏ hơn hoặc bằng 1 không phải số nguyên tố
    if n <= 1:
        return False
    # 2 và 3 là số nguyên tố
    if n <= 3:
        return True
    # Loại bỏ các số chẵn và số chia hết cho 3
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Kiểm tra các ước số từ 5 đến căn bậc hai của n
    # Bước nhảy i += 6 vì các số nguyên tố lớn hơn 3 đều có dạng 6k +/- 1
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
        
    return True

# Minh họa chạy thử:
print(is_prime_optimal(29))  # Kết quả: True
print(is_prime_optimal(15))  # Kết quả: False
\`\`\`

#### 🔍 Giải thích tính tối ưu:
1. **Giới hạn căn bậc hai ($\\sqrt{N}$)**: Nếu số $N$ chia hết cho một số $d$, thì ước còn lại là $N/d$. Một trong hai ước chắc chắn phải $\\le \\sqrt{N}$. Do đó ta chỉ cần chạy vòng lặp đến $\\sqrt{N}$.
2. **Quy luật dạng số $6k \\pm 1$**: Loại bỏ sớm ước chia hết cho 2 và 3, vòng lặp tăng bước nhảy lên 6 giúp giảm số lần kiểm tra đi đáng kể.

Bạn có muốn chạy thử thuật toán này với ngôn ngữ khác (như JavaScript, C++) không?`;
    } else if (lowerMsg.includes('minh họa') || lowerMsg.includes('ví dụ') || lowerMsg.includes('bài tập')) {
      fallbackReply = `### 💡 Bài tập Minh Họa Lập Trình (Ví dụ thực tế)
Chào học viên SeduAi! Dưới đây là bài tập minh họa về cách xây dựng một ứng dụng đếm số đơn giản bằng **React** sử dụng Hooks:

\`\`\`tsx
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-slate-900 text-white rounded-2xl text-center">
      <h3 className="text-xl font-bold">Bộ đếm học tập</h3>
      <p className="text-3xl my-4 font-black text-primary">{count}</p>
      <div className="flex justify-center gap-3">
        <button onClick={() => setCount(count - 1)} className="px-4 py-2 bg-red-500 rounded-lg">- Giảm</button>
        <button onClick={() => setCount(count + 1)} className="px-4 py-2 bg-emerald-500 rounded-lg">+ Tăng</button>
      </div>
    </div>
  );
}
\`\`\`

Bạn có muốn giải thích chi tiết cấu trúc code này không, hay bạn muốn chuyển sang ngôn ngữ lập trình khác?`;
    } else if (lowerMsg.includes('react') || lowerMsg.includes('code') || lowerMsg.includes('lập trình') || lowerMsg.includes('python') || lowerMsg.includes('javascript') || lowerMsg.includes('thuật toán') || lowerMsg.includes('hàm')) {
      fallbackReply = `### 💡 Giảng Viên AI SeduAi Giải Đáp: Lập trình & Thuật toán
Chào học viên! Lập trình hiện đại đòi hỏi khả năng tối ưu hóa cả về mặt logic lẫn cấu trúc ứng dụng. Dưới đây là giải thích cốt lõi về chủ đề bạn quan tâm:

#### 1. Khái niệm chính (Core Concept)
Trong lập trình ứng dụng (như **React / Next.js**), việc tối ưu hóa hiệu năng render là vô cùng quan trọng:
* **Server Components** (mặc định): Chạy hoàn toàn trên server để tải trang nhanh nhất.
* **Client Components** (\`'use client'\`): Được tải và thực thi ở Client để hỗ trợ tương tác người dùng.

#### 2. Lời khuyên học tập từ Giảng viên AI
* **Bước 1**: Tập trung nắm vững logic giải quyết bài toán cơ bản (thuật toán sắp xếp, lọc, vòng lặp) trước khi làm thư viện.
* **Bước 2**: Thực hành viết code hàng ngày và hỏi tôi bất cứ đoạn code nào bạn muốn tối ưu! Bạn có cần tôi đưa ra bài tập ví dụ minh họa cụ thể nào cho ngôn ngữ của bạn không?`;
    } else if (lowerMsg.includes('ielts') || lowerMsg.includes('tiếng anh')) {
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

Bạn có cần tôi phân tích cụ thể hơn, đưa ra ví dụ minh họa hay bài tập chạy thử cho chủ đề lập trình hay tiếng Anh này không?`;
    }

    // If in CRM mode and user entered a phone number
    if (mode === 'admissions_crm') {
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
      fallback: true
    });

  } catch (error: any) {
    console.error('API /chat Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
