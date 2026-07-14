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

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { success: res.ok, raw: text };
    }

    if (!res.ok && !json.error && !json.message) {
      console.warn(`[Proxy Account] NKS server responded with status ${res.status} for action: ${action || 'root'}`);
      return NextResponse.json({
        success: false,
        code: res.status,
        error: `Máy chủ NKS trả về mã ${res.status}`,
        ...json,
      });
    }

    const response = NextResponse.json(json);
    if (action === 'login' && res.ok) {
      const data = json.data || {};
      const token = json.access_token || json.token || data.access_token || data.token;
      if (token) {
        response.cookies.set('seduai_access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }
    if (action === 'logout') response.cookies.delete('seduai_access_token');
    return response;
  } catch (error: any) {
    console.error('[Proxy Account] Error:', error.message);
    return NextResponse.json({
      success: false,
      error: 'Không thể kết nối đến máy chủ NKS (Timeout hoặc Network Error)',
    });
  }
}
