import { NextRequest, NextResponse } from 'next/server';
import { consumeRateLimit } from '@/lib/rate-limit';

const CRM_API_BASE = 'https://sdata.io.vn/wp-json/scrmai/v1';
const ALLOWED_ENDPOINTS = new Set(['educourses', 'lead/create']);
const LEAD_FIELDS = new Set([
  'name', 'phone', 'email', 'zalo', 'demand', 'company', 'position',
  'comsize', 'source', 'status', 'note', 'source_id',
]);

function asObject(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function normalizeLeadPayload(value: unknown) {
  const payload = asObject(value);
  const normalized: Record<string, string | number> = {};
  for (const [key, fieldValue] of Object.entries(payload)) {
    if (!LEAD_FIELDS.has(key)) continue;
    if (typeof fieldValue === 'number' && Number.isFinite(fieldValue)) {
      normalized[key] = fieldValue;
      continue;
    }
    if (typeof fieldValue === 'string') {
      normalized[key] = fieldValue.trim().slice(0, key === 'note' || key === 'demand' ? 5_000 : 500);
    }
  }
  if (typeof normalized.name !== 'string' || !normalized.name) {
    throw new Error('Họ tên là bắt buộc');
  }
  if (typeof normalized.phone !== 'string' || !/^[+\d][\d\s().-]{7,24}$/.test(normalized.phone)) {
    throw new Error('Số điện thoại không hợp lệ');
  }
  return normalized;
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 100_000) {
      return NextResponse.json({ success: false, error: 'Dữ liệu gửi lên quá lớn' }, { status: 413 });
    }

    const body = asObject(await req.json());
    const endpoint = typeof body.endpoint === 'string' ? body.endpoint : 'educourses';
    if (!ALLOWED_ENDPOINTS.has(endpoint)) {
      return NextResponse.json({ success: false, error: 'Endpoint CRM không được hỗ trợ' }, { status: 400 });
    }

    const clientAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';
    const rateLimit = consumeRateLimit(
      `crm:${endpoint}:${clientAddress}`,
      endpoint === 'lead/create' ? 5 : 30,
      60_000,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Yêu cầu quá nhiều. Vui lòng chờ ${rateLimit.retryAfterSeconds} giây.` },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
      );
    }

    const token = process.env.CRM_API_TOKEN;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Dịch vụ CRM chưa được cấu hình' }, { status: 503 });
    }
    const payload = endpoint === 'lead/create' ? normalizeLeadPayload(body.payload) : null;
    const upstream = await fetch(`${CRM_API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });

    let json: unknown;
    try {
      json = await upstream.json();
    } catch {
      return NextResponse.json({ success: false, error: 'CRM trả về phản hồi không hợp lệ' }, { status: 502 });
    }
    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, error: 'CRM chưa thể xử lý yêu cầu' },
        { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 },
      );
    }
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể kết nối CRM';
    const isValidationError = message === 'Họ tên là bắt buộc' || message === 'Số điện thoại không hợp lệ';
    if (!isValidationError) console.error('[Proxy CRM] Error:', message);
    return NextResponse.json(
      { success: false, error: isValidationError ? message : 'Không thể kết nối CRM' },
      { status: isValidationError ? 400 : 502 },
    );
  }
}
