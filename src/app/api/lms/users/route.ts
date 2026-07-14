import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/lms/users?role=TEACHER|STUDENT|ADMIN
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const where = role ? { role: role as any } : {};
    const users = await prisma.lmsUser.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('LMS Users GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/lms/users — Tạo hoặc sync user LMS
export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
