import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Biến môi trường OPENAI_API_KEY chưa được thiết lập trên Vercel / Local.',
        apiKeyConfigured: false
      });
    }

    // Mask key for safety (only show prefix/suffix and length)
    const maskedKey = apiKey.length > 10 
      ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`
      : 'Key quá ngắn hoặc không đúng định dạng';

    // Test request to OpenAI with a lightweight prompt
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          apiKeyConfigured: true,
          keyFormat: maskedKey,
          keyLength: apiKey.length,
          httpStatus: response.status,
          openAiError: data.error || data,
          advice: response.status === 401 
            ? 'Khóa API Key của bạn không hợp lệ hoặc đã bị nhập sai.'
            : response.status === 429 
            ? 'Tài khoản OpenAI của bạn đã hết hạn số dư sử dụng (insufficient_quota) hoặc bị giới hạn rate limit.'
            : 'Yêu cầu không hợp lệ tới OpenAI.'
        });
      }

      return NextResponse.json({
        success: true,
        apiKeyConfigured: true,
        keyFormat: maskedKey,
        keyLength: apiKey.length,
        openAiResponse: data.choices?.[0]?.message?.content || '',
        message: 'Kết nối API OpenAI hoạt động hoàn hảo và sẵn sàng!'
      });
    } catch (apiErr: any) {
      return NextResponse.json({
        success: false,
        apiKeyConfigured: true,
        keyFormat: maskedKey,
        error: 'Lỗi mạng khi kết nối tới OpenAI từ máy chủ.',
        details: apiErr.message
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
