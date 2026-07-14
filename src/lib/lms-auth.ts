import type { NextRequest } from 'next/server';
import type { LmsUser, Prisma, UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';

const ACCOUNT_API_BASE = 'https://account.nks.vn/api/nks/user';

export class LmsAuthError extends Error {
  constructor(message: string, public status = 401) {
    super(message);
    this.name = 'LmsAuthError';
  }
}

export class LmsRequestError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'LmsRequestError';
  }
}

export async function requireLmsUser(request: NextRequest, roles?: UserRole[]): Promise<LmsUser> {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  // The server-managed HttpOnly cookie is authoritative. A Bearer token is only
  // a recovery path for older sessions that have not restored the cookie yet.
  const token = request.cookies.get('seduai_access_token')?.value || bearer;
  if (!token) throw new LmsAuthError('Bạn chưa đăng nhập', 401);

  let response: Response;
  try {
    response = await fetch(ACCOUNT_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new LmsAuthError('Không thể xác minh phiên đăng nhập NKS. Vui lòng thử lại.', 503);
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new LmsAuthError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn', 401);
    }
    if (response.status === 429) {
      throw new LmsAuthError('Dịch vụ NKS đang giới hạn yêu cầu. Vui lòng thử lại sau.', 429);
    }
    throw new LmsAuthError('Dịch vụ xác thực NKS đang tạm thời gián đoạn. Vui lòng thử lại.', 503);
  }

  let payload: Record<string, any>;
  try {
    payload = await response.json() as Record<string, any>;
  } catch {
    throw new LmsAuthError('Dịch vụ NKS trả về phản hồi không hợp lệ. Vui lòng thử lại.', 502);
  }
  if (payload?.success === false || payload?.error) {
    throw new LmsAuthError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn', 401);
  }
  const payloadData = payload && typeof payload.data === 'object' ? payload.data : null;
  const account = payload.userInfo || payload.user || payloadData?.userInfo || payloadData?.user || payloadData;

  let user: LmsUser;
  try {
    user = await syncLmsUser(account);
  } catch (error: any) {
    throw new LmsAuthError(error.message, 400);
  }

  if (roles && !roles.includes(user.role)) throw new LmsAuthError('Bạn không có quyền thực hiện thao tác này', 403);
  return user;
}

export async function syncLmsUser(account: any): Promise<LmsUser> {
  const username = typeof account?.username === 'string' ? account.username.trim() : '';
  if (!username) throw new Error('Không xác định được tài khoản NKS');

  const displayName = String(account.name
    || `${account.lastname || ''} ${account.firstname || ''}`.trim()
    || username).slice(0, 160);
  const nksUserId = account.id !== undefined && account.id !== null ? String(account.id) : null;

  return prisma.$transaction(async (tx) => {
    // A browser can trigger several LMS requests immediately after login. Lock
    // both external identity keys before find/create so only one request can
    // provision or relink the profile at a time.
    const identityLockKeys = [
      `lms-user:username:${username.toLowerCase()}`,
      ...(nksUserId ? [`lms-user:nks:${nksUserId}`] : []),
    ].sort();
    for (const identityLockKey of identityLockKeys) {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${identityLockKey}))`;
    }

    const [byNksId, byUsername] = await Promise.all([
      nksUserId ? tx.lmsUser.findUnique({ where: { nksUserId } }) : Promise.resolve(null),
      tx.lmsUser.findUnique({ where: { username } }),
    ]);

    if (byNksId && byUsername && byNksId.id !== byUsername.id) {
      throw new LmsRequestError('Tài khoản NKS đang xung đột với một hồ sơ LMS khác. Vui lòng liên hệ quản trị viên.', 409);
    }
    if (byUsername?.nksUserId && nksUserId && byUsername.nksUserId !== nksUserId) {
      throw new LmsRequestError('Tên đăng nhập LMS đã được liên kết với một tài khoản NKS khác.', 409);
    }

    const existing = byNksId || byUsername;
    const bootstrapUsername = process.env.LMS_BOOTSTRAP_ADMIN_USERNAME?.trim();
    const shouldBootstrapAdmin = Boolean(
      bootstrapUsername
      && username === bootstrapUsername
      && await tx.lmsUser.count({ where: { role: 'ADMIN' } }) === 0,
    );
    const profile = {
      username,
      name: displayName,
      email: typeof account.email === 'string' ? account.email.slice(0, 254) : undefined,
      phone: typeof account.phone === 'string' ? account.phone.slice(0, 30) : undefined,
      avatar: typeof account.avatar === 'string' ? account.avatar.slice(0, 2_000) : undefined,
      nksUserId: nksUserId || undefined,
    };

    if (existing) {
      return tx.lmsUser.update({
        where: { id: existing.id },
        data: { ...profile, ...(shouldBootstrapAdmin ? { role: 'ADMIN' as const } : {}) },
      });
    }

    // Every newly verified NKS account starts with least privilege. Admin and
    // teacher roles must be provisioned explicitly and are never overwritten.
    return tx.lmsUser.create({
      data: { ...profile, role: shouldBootstrapAdmin ? 'ADMIN' : 'STUDENT' },
    });
  });
}

export function lmsErrorResponse(error: unknown) {
  if (error instanceof LmsAuthError || error instanceof LmsRequestError) {
    return Response.json({ success: false, error: error.message }, { status: error.status });
  }
  if (error instanceof SyntaxError) {
    return Response.json({ success: false, error: 'Dữ liệu gửi lên không phải JSON hợp lệ' }, { status: 400 });
  }
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  if (code === 'P2002') {
    return Response.json({ success: false, error: 'Dữ liệu đã tồn tại trong hệ thống' }, { status: 409 });
  }
  if (code === 'P2025') {
    return Response.json({ success: false, error: 'Không tìm thấy dữ liệu cần xử lý' }, { status: 404 });
  }
  return Response.json({ success: false, error: 'LMS gặp lỗi khi xử lý yêu cầu. Vui lòng thử lại.' }, { status: 500 });
}

export async function canAccessClass(user: LmsUser, classId: string) {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'TEACHER') {
    return Boolean(await prisma.lmsClass.findFirst({ where: { id: classId, teacherId: user.id }, select: { id: true } }));
  }
  return Boolean(await prisma.lmsClassStudent.findUnique({ where: { classId_studentId: { classId, studentId: user.id } }, select: { id: true } }));
}

export async function canManageActiveClass(user: LmsUser, classId: string) {
  if (user.role === 'STUDENT') return false;
  return Boolean(await prisma.lmsClass.findFirst({
    where: {
      id: classId,
      status: 'ACTIVE',
      ...(user.role === 'TEACHER' ? { teacherId: user.id } : {}),
    },
    select: { id: true },
  }));
}

export async function withClassLock<T>(
  classId: string,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${classId}))`;
    return operation(tx);
  });
}

export async function withActiveClassMutation<T>(
  user: LmsUser,
  classId: string,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return withClassLock(classId, async (tx) => {
    const activeClass = await tx.lmsClass.findFirst({
      where: {
        id: classId,
        status: 'ACTIVE',
        ...(user.role === 'TEACHER' ? { teacherId: user.id } : {}),
        ...(user.role === 'STUDENT' ? { id: '__forbidden__' } : {}),
      },
      select: { id: true },
    });
    if (!activeClass) {
      throw new LmsRequestError('Bạn không thể thay đổi lớp này hoặc lớp đã được lưu trữ', 403);
    }
    return operation(tx);
  });
}
