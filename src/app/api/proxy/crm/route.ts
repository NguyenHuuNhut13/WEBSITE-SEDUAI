import { NextResponse } from 'next/server';

const CRM_API_BASE = 'https://sdata.io.vn/wp-json/scrmai/v1';
const CRM_TOKEN = '01KWKATNQGB5TWXYDPJ671X3X1';

export async function POST(req: Request) {
  try {
    const { endpoint = 'educourses', payload = {} } = await req.json();
    const targetUrl = `${CRM_API_BASE}/${endpoint}`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRM_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined,
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[Proxy CRM] sdata.io.vn returned ${res.status} for endpoint: ${endpoint}`);
      return NextResponse.json({ success: false, data: [], message: `CRM server error ${res.status}` });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error: any) {
    console.error('[Proxy CRM] Error:', error.message);
    return NextResponse.json({ success: false, data: [], message: error.message });
  }
}
