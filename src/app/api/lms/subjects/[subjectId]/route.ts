import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { canAccessClass, lmsErrorResponse, requireLmsUser, withActiveClassMutation } from '@/lib/lms-auth';
import { requiredText } from '@/lib/lms-input';

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
        class: {
          include: {
            teacher: {
              select: { id: true, username: true, name: true, avatar: true, role: true },
            },
          },
        },
        lessons: {
          include: {
            assignments: {
              include: { _count: { select: { submissions: true } } },
            },
          },
          orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
        },
        examConfigs: {
          include: {
            _count: {
              select: { results: { where: { finishedAt: { not: null } } } },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ success: false, error: 'Môn học không tồn tại' }, { status: 404 });
    }

    const examConfigs = subject.examConfigs.map(({ password, ...config }) => ({
      ...config,
      hasPassword: Boolean(password),
    }));
    return NextResponse.json({ success: true, data: { ...subject, examConfigs } });
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
    if (!accessSubject) return NextResponse.json({ success: false, error: 'Môn học không tồn tại' }, { status: 404 });
    const body = await request.json();
    const name = requiredText(body.name, 'Tên môn học', 120);

    const updated = await withActiveClassMutation(actor, accessSubject.classId, (tx) => tx.lmsSubject.update({
      where: { id: subjectId },
      data: { name },
    }));

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Subject PUT error:', error);
    return lmsErrorResponse(error);
  }
}
