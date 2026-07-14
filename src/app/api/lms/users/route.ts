import { NextRequest, NextResponse } from 'next/server';
import type { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';
import { LmsRequestError, lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';
import { enumValue, optionalText, requiredText } from '@/lib/lms-input';

const USER_ROLES = ['ADMIN', 'TEACHER', 'STUDENT'] as const satisfies readonly UserRole[];
const userSelect = {
  id: true,
  username: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

// GET /api/lms/users?role=TEACHER|STUDENT|ADMIN
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const username = searchParams.get('username');
    if (actor.role !== 'ADMIN' && username !== actor.username) {
      return NextResponse.json({ success: false, error: 'Bạn chỉ được xem tài khoản LMS của chính mình' }, { status: 403 });
    }

    const parsedRole = role ? enumValue(role, 'Vai trò', USER_ROLES) : undefined;
    const where = actor.role === 'ADMIN'
      ? { ...(parsedRole ? { role: parsedRole } : {}), ...(username ? { username } : {}) }
      : { id: actor.id };
    const users = await prisma.lmsUser.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('LMS Users GET error:', error);
    return lmsErrorResponse(error);
  }
}

// POST /api/lms/users — Tạo hoặc sync user LMS
export async function POST(request: NextRequest) {
  try {
    await requireLmsUser(request, ['ADMIN']);
    const body = await request.json();
    const username = requiredText(body.username, 'Tên đăng nhập', 80);
    const name = requiredText(body.name, 'Họ tên', 160);
    const email = optionalText(body.email, 'Email', 254);
    const phone = optionalText(body.phone, 'Số điện thoại', 30);
    const avatar = optionalText(body.avatar, 'Ảnh đại diện', 2_000);
    const role = body.role === undefined ? 'STUDENT' : enumValue(body.role, 'Vai trò', USER_ROLES);
    if (!/^[A-Za-z0-9._@-]{3,80}$/.test(username)) {
      throw new LmsRequestError('Tên đăng nhập chỉ gồm chữ, số và các ký tự . _ @ -');
    }

    // Provision by exact NKS username. The immutable NKS id is only bound after
    // that account successfully authenticates, never from an admin form.
    const user = await prisma.$transaction(async (tx) => {
      // Serialize role changes so two requests cannot demote the final admins
      // at the same time.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('lms-user-role-management')) IS NULL`;
      const existing = await tx.lmsUser.findUnique({
        where: { username },
        select: {
          id: true,
          role: true,
          _count: { select: { teachingClasses: true, enrollments: true } },
        },
      });

      if (existing && existing.role !== role) {
        if (existing.role === 'ADMIN' && role !== 'ADMIN') {
          const adminCount = await tx.lmsUser.count({ where: { role: 'ADMIN' } });
          if (adminCount <= 1) {
            throw new LmsRequestError('Không thể hạ quyền quản trị viên cuối cùng của LMS', 409);
          }
        }
        if (existing._count.teachingClasses > 0 && role !== 'TEACHER') {
          throw new LmsRequestError('Không thể đổi vai trò khi giáo viên vẫn đang phụ trách lớp', 409);
        }
        if (existing._count.enrollments > 0 && role !== 'STUDENT') {
          throw new LmsRequestError('Không thể đổi vai trò khi học sinh vẫn đang thuộc lớp', 409);
        }
      }

      return tx.lmsUser.upsert({
        where: { username },
        update: { name, email, phone, avatar, role },
        create: { username, name, email, phone, avatar, role },
        select: userSelect,
      });
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('LMS Users POST error:', error);
    return lmsErrorResponse(error);
  }
}
