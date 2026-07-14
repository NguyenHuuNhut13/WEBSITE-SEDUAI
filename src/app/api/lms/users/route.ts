import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';

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

    const where = {
      ...(role ? { role: role as any } : {}),
      ...(username ? { username } : {}),
    };
    const users = await prisma.lmsUser.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
    const { username, name, email, phone, avatar, role, nksUserId } = body;

    if (!username || !name) {
      return NextResponse.json({ success: false, error: 'username và name là bắt buộc' }, { status: 400 });
    }

    // Upsert: tạo mới hoặc cập nhật nếu đã tồn tại
    const user = await prisma.lmsUser.upsert({
      where: { username },
      update: { name, email, phone, avatar, role: role || undefined, nksUserId },
      create: { username, name, email, phone, avatar, role: role || 'STUDENT', nksUserId },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('LMS Users POST error:', error);
    return lmsErrorResponse(error);
  }
}
