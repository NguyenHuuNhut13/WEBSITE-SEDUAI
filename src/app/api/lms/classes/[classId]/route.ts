import { NextRequest, NextResponse } from 'next/server';
import type { ClassStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { LmsRequestError, canAccessClass, lmsErrorResponse, requireLmsUser, withClassLock } from '@/lib/lms-auth';
import { enumValue, optionalText } from '@/lib/lms-input';

type RouteContext = { params: Promise<{ classId: string }> };
const CLASS_STATUSES = ['ACTIVE', 'ARCHIVED'] as const satisfies readonly ClassStatus[];
const userSummarySelect = { id: true, username: true, name: true, avatar: true, role: true } as const;

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
        teacher: { select: userSummarySelect },
        subjects: {
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
            _count: { select: { lessons: true } },
          },
        },
        ...(actor.role !== 'STUDENT' ? {
          students: {
            include: { student: { select: userSummarySelect } },
            orderBy: { enrolledAt: 'asc' as const },
          },
        } : {}),
        examConfigs: {
          include: {
            subject: true,
            _count: {
              select: { results: { where: { finishedAt: { not: null } } } },
            },
          },
        },
      },
    });

    if (!classData) {
      return NextResponse.json({ success: false, error: 'Lớp không tồn tại' }, { status: 404 });
    }

    const examConfigs = classData.examConfigs.map(({ password, ...config }) => ({
      ...config,
      hasPassword: Boolean(password),
    }));
    return NextResponse.json({ success: true, data: { ...classData, examConfigs } });
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
    const name = body.name === undefined ? undefined : optionalText(body.name, 'Tên lớp', 120);
    const teacherId = body.teacherId === undefined ? undefined : optionalText(body.teacherId, 'Giáo viên', 100);
    const status = body.status === undefined ? undefined : enumValue(body.status, 'Trạng thái lớp', CLASS_STATUSES);
    if (!name && !teacherId && !status) throw new LmsRequestError('Không có dữ liệu lớp cần cập nhật');

    const updated = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('lms-user-role-management')) IS NULL`;
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${classId})) IS NULL`;
      if (teacherId) {
        const teacher = await tx.lmsUser.findUnique({ where: { id: teacherId }, select: { role: true } });
        if (!teacher || teacher.role !== 'TEACHER') {
          throw new LmsRequestError('Giáo viên không tồn tại hoặc chưa có vai trò TEACHER');
        }
      }

      return tx.lmsClass.update({
        where: { id: classId },
        data: {
          ...(name ? { name } : {}),
          ...(teacherId ? { teacherId } : {}),
          ...(status ? { status } : {}),
        },
        include: { teacher: { select: userSummarySelect }, subjects: true },
      });
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
    await withClassLock(classId, (tx) => tx.lmsClass.update({
      where: { id: classId },
      data: { status: 'ARCHIVED' },
    }));

    return NextResponse.json({ success: true, message: 'Lớp đã được lưu trữ' });
  } catch (error: any) {
    console.error('LMS Class DELETE error:', error);
    return lmsErrorResponse(error);
  }
}
