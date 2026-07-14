import { NextRequest, NextResponse } from 'next/server';
import { consumeRateLimit } from '@/lib/rate-limit';
import { syncLmsUser } from '@/lib/lms-auth';

const ACCOUNT_API_BASE = 'https://account.nks.vn/api/nks/user';
const SESSION_COOKIE = 'seduai_access_token';
const ALLOWED_ACTIONS = new Set(['', 'login', 'logout', 'updateInfo', 'updatePass', 'updateAvatar', 'updateCccd']);

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonObject
    : {};
}

function stringValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const str = typeof value === 'string' ? value.trim() : String(value).trim();
  return str ? str : null;
}

function extractToken(value: unknown): string | null {
  const json = asObject(value);
  const data = asObject(json.data);
  return stringValue(json.access_token)
    || stringValue(json.token)
    || stringValue(data.access_token)
    || stringValue(data.token);
}

function extractAccount(value: unknown): JsonObject {
  const json = asObject(value);
  const data = asObject(json.data);
  const candidates = [
    asObject(json.userInfo),
    asObject(json.user),
    asObject(data.userInfo),
    asObject(data.user),
    data,
  ];
  return candidates.find((candidate) => stringValue(candidate.username)) || {};
}

function upstreamSucceeded(response: Response, value: unknown): boolean {
  const json = asObject(value);
  return response.ok && json.success !== false && !json.error;
}

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

function deleteSessionCookie(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
}

export async function POST(req: NextRequest) {
  let action = '';
  let payload: JsonObject = {};

  try {
    const requestBody = asObject(await req.json());
    action = typeof requestBody.action === 'string' ? requestBody.action : '';
    payload = asObject(requestBody.payload);

    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { success: false, error: 'Thao tác tài khoản không được hỗ trợ' },
        { status: 400 },
      );
    }

    if (action === 'login') {
      const clientAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown';
      const rateLimit = consumeRateLimit(`account-login:${clientAddress}`, 10, 5 * 60_000);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { success: false, error: `Đăng nhập quá nhiều lần. Vui lòng chờ ${rateLimit.retryAfterSeconds} giây.` },
          { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
        );
      }
    }

    const cookieToken = req.cookies.get(SESSION_COOKIE)?.value;
    const suppliedToken = stringValue(payload.access_token);
    const logoutToken = cookieToken || suppliedToken;

    if (action === 'logout') {
      // Expire the browser session in the immediate response. Waiting for NKS
      // here could let a late logout response erase a newer login cookie.
      if (logoutToken) {
        void (async () => {
          try {
            const revokeResponse = await fetch(`${ACCOUNT_API_BASE}/logout`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payload, access_token: logoutToken }),
              cache: 'no-store',
              signal: AbortSignal.timeout(8000),
            });
            if (!revokeResponse.ok) {
              console.warn('[Proxy Account] NKS token revocation was not confirmed:', revokeResponse.status);
            }
          } catch (error) {
            console.warn(
              '[Proxy Account] NKS token revocation failed:',
              error instanceof Error ? error.message : String(error),
            );
          }
        })();
      }

      const response = NextResponse.json({
        success: true,
        revocationScheduled: Boolean(logoutToken),
        message: 'Đã đăng xuất trên thiết bị',
      });
      deleteSessionCookie(response);
      return response;
    }

    const upstreamPayload = payload;
    const targetUrl = action ? `${ACCOUNT_API_BASE}/${action}` : ACCOUNT_API_BASE;

    const upstreamResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(upstreamPayload),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    const text = await upstreamResponse.text();
    let json: unknown;
    let validJson = true;
    try {
      json = JSON.parse(text);
    } catch {
      validJson = false;
      json = {
        success: false,
        error: 'Máy chủ NKS trả về phản hồi không hợp lệ',
      };
    }

    if (!validJson && action !== 'logout') {
      return NextResponse.json(json, { status: 502 });
    }

    const success = upstreamSucceeded(upstreamResponse, json);
    const account = extractAccount(json);
    const responseToken = extractToken(json);
    const operationSucceeded = action === 'login'
      ? Boolean(success && responseToken)
      : action === ''
        ? Boolean(success && stringValue(account.username))
        : success;
    const responseStatus = upstreamResponse.ok
      ? (operationSucceeded ? 200 : (action === '' || action === 'login' ? 401 : 400))
      : upstreamResponse.status;
    if (upstreamResponse.ok && !operationSucceeded) {
      console.warn(
        `[Proxy Account] Upstream OK but validation failed for action "${action}". account:`,
        JSON.stringify(account),
        `hasToken: ${Boolean(responseToken)}`
      );
    }
    const response = NextResponse.json(json, { status: responseStatus });

    if (operationSucceeded && account.username) {
      try {
        await syncLmsUser(account);
      } catch (error) {
        console.warn('[Proxy Account] Database sync failed:', error instanceof Error ? error.message : String(error));
      }
    }

    if (action === 'login') {
      if (operationSucceeded && responseToken) setSessionCookie(response, responseToken);
      else deleteSessionCookie(response);
    }

    // Token validation (the root action) is also the cookie synchronization
    // point used when AuthContext restores a browser session.
    if (action === '' && suppliedToken) {
      if (operationSucceeded) setSessionCookie(response, suppliedToken);
      else if (responseStatus === 401 || responseStatus === 403) deleteSessionCookie(response);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Proxy Account] Error:', message);
    const response = NextResponse.json({
      success: false,
      error: 'Không thể kết nối đến máy chủ NKS (Timeout hoặc Network Error)',
    }, { status: 502 });

    // Even if NKS is unavailable, local logout must complete. A failed restore
    // also expires the server cookie so client and server auth cannot diverge.
    if (action === 'logout') {
      deleteSessionCookie(response);
    }
    return response;
  }
}
