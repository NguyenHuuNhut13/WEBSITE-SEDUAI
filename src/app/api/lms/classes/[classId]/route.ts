import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { canAccessClass, lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';

type RouteContext = { params: Promise<{ classId: string }> };

// GET /api/lms/classes/[classId]
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { classId } = await context.params;
    const actor = await requireLmsUser(request);
    if (!(await canAccessClass(actor, classId))) {
      return NextResponse.json({ success: false, error: 'Bạn không thuộc lớp học này' }, { status: 403 });
    }
    const classData = await prisma.lmsClass.findUnique({
      where: { id: classId },
      include: {
        teacher: true,
        subjects: {
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
            _count: { select: { lessons: true } },
          },
        },
        students: {
          include: { student: true },
          orderBy: { enrolledAt: 'asc' },
        },
        examConfigs: {
          include: { subject: true, _count: { select: { results: true } } },
        },
      },
    });

    if (!classData) {
      return NextResponse.json({ success: false, error: 'Lớp không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: classData });
  } catch (error: any) {
    console.error('LMS Class GET error:', error);
    return lmsErrorResponse(error);
  }
}

// PUT /api/lms/classes/[classId]
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireLmsUser(request, ['ADMIN']);
    const { classId } = await context.params;
    const body = await request.json();
    const { name, teacherId, status } = body;

    const updated = await prisma.lmsClass.update({
      where: { id: classId },
      data: {
        ...(name && { name }),
        ...(teacherId && { teacherId }),
        ...(status && { status }),
      },
      include: { teacher: true, subjects: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Class PUT error:', error);
    return lmsErrorResponse(error);
  }
}

// DELETE /api/lms/classes/[classId]
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireLmsUser(request, ['ADMIN']);
    const { classId } = await context.params;
    await prisma.lmsClass.update({
      where: { id: classId },
      data: { status: 'ARCHIVED' },
    });

    return NextResponse.json({ success: true, message: 'Lớp đã được lưu trữ' });
  } catch (error: any) {
    console.error('LMS Class DELETE error:', error);
    return lmsErrorResponse(error);
  }
}
