import { NextResponse } from 'next/server';

const ACCOUNT_API_BASE = 'https://account.nks.vn/api/nks/user';

export async function POST(req: Request) {
  try {
    const { action = '', payload = {} } = await req.json();
    const targetUrl = action ? `${ACCOUNT_API_BASE}/${action}` : ACCOUNT_API_BASE;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    // Nếu server NKS trả về lỗi 500 hoặc 4xx, chúng ta đọc text/json hoặc trả lại kết quả an toàn thay vì crash CORS/network
    if (!res.ok) {
      console.warn(`[Proxy Account] NKS server responded with status ${res.status} for action: ${action || 'root'}`);
      return NextResponse.json({
        success: false,
        code: res.status,
        error: `Máy chủ NKS trả về mã ${res.status}`,
      });
    }

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch {
      return NextResponse.json({ success: true, raw: text });
    }
  } catch (error: any) {
    console.error('[Proxy Account] Error:', error.message);
    return NextResponse.json({
      success: false,
      error: 'Không thể kết nối đến máy chủ NKS (Timeout hoặc Network Error)',
    });
  }
}
