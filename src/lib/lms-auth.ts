import type { NextRequest } from 'next/server';
import type { LmsUser, UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';

const ACCOUNT_API_BASE = 'https://account.nks.vn/api/nks/user';

export class LmsAuthError extends Error {
  constructor(message: string, public status = 401) {
    super(message);
  }
}

export async function requireLmsUser(request: NextRequest, roles?: UserRole[]): Promise<LmsUser> {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const token = bearer || request.cookies.get('seduai_access_token')?.value;
  if (!token) throw new LmsAuthError('Bạn chưa đăng nhập', 401);

  const response = await fetch(ACCOUNT_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: token }),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new LmsAuthError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn', 401);

  const payload = await response.json();
  const account = payload.userInfo || payload.data;
  const username = account?.username;
  if (!username) throw new LmsAuthError('Không xác định được tài khoản NKS', 401);

  const user = await prisma.lmsUser.findUnique({ where: { username } });
  if (!user) throw new LmsAuthError('Tài khoản chưa được cấp quyền vào LMS', 403);
  if (roles && !roles.includes(user.role)) throw new LmsAuthError('Bạn không có quyền thực hiện thao tác này', 403);
  return user;
}

export function lmsErrorResponse(error: unknown) {
  if (error instanceof LmsAuthError) {
    return Response.json({ success: false, error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : 'Lỗi hệ thống LMS';
  return Response.json({ success: false, error: message }, { status: 500 });
}

export async function canAccessClass(user: LmsUser, classId: string) {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'TEACHER') {
    return Boolean(await prisma.lmsClass.findFirst({ where: { id: classId, teacherId: user.id }, select: { id: true } }));
  }
  return Boolean(await prisma.lmsClassStudent.findUnique({ where: { classId_studentId: { classId, studentId: user.id } }, select: { id: true } }));
}
