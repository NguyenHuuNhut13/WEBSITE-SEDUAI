import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { canAccessClass, lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';

type RouteContext = { params: Promise<{ subjectId: string }> };

// GET /api/lms/subjects/[subjectId]
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { subjectId } = await context.params;
    const actor = await requireLmsUser(request);
    const accessSubject = await prisma.lmsSubject.findUnique({ where: { id: subjectId }, select: { classId: true } });
    if (!accessSubject) return NextResponse.json({ success: false, error: 'Môn học không tồn tại' }, { status: 404 });
    if (!(await canAccessClass(actor, accessSubject.classId))) return NextResponse.json({ success: false, error: 'Bạn không có quyền xem môn học này' }, { status: 403 });
    const subject = await prisma.lmsSubject.findUnique({
      where: { id: subjectId },
      include: {
        class: { include: { teacher: true } },
        lessons: {
          include: {
            assignments: {
              include: { _count: { select: { submissions: true } } },
            },
          },
          orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
        },
        examConfigs: {
          include: { _count: { select: { results: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ success: false, error: 'Môn học không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: subject });
  } catch (error: any) {
    console.error('LMS Subject GET error:', error);
    return lmsErrorResponse(error);
  }
}

// PUT /api/lms/subjects/[subjectId]
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { subjectId } = await context.params;
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const accessSubject = await prisma.lmsSubject.findUnique({ where: { id: subjectId }, select: { classId: true } });
    if (!accessSubject || !(await canAccessClass(actor, accessSubject.classId))) return NextResponse.json({ success: false, error: 'Bạn không quản lý môn học này' }, { status: 403 });
    const body = await request.json();
    const { name } = body;

    const updated = await prisma.lmsSubject.update({
      where: { id: subjectId },
      data: { ...(name && { name }) },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Subject PUT error:', error);
    return lmsErrorResponse(error);
  }
}
