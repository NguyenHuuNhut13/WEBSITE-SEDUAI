import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LmsRequestError, lmsErrorResponse, requireLmsUser, withClassLock } from '@/lib/lms-auth';
import { requiredText, stringIdList } from '@/lib/lms-input';

type RouteContext = { params: Promise<{ classId: string }> };

// POST /api/lms/classes/[classId]/students — Thêm HS vào lớp
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireLmsUser(request, ['ADMIN']);
    const { classId } = await context.params;
    const body = await request.json();
    const { studentId, studentIds } = body;

    const requestedIds = Array.isArray(studentIds) ? studentIds : (studentId ? [studentId] : []);
    if (requestedIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Cần cung cấp studentId hoặc studentIds' }, { status: 400 });
    }
    const ids = stringIdList(requestedIds, 'Danh sách học sinh', 25);

    const added = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('lms-user-role-management'))`;
      // Serialize roster changes for this class so concurrent requests cannot
      // both pass the capacity check and exceed maxStudents.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${classId}))`;
      const classData = await tx.lmsClass.findUnique({
        where: { id: classId },
        include: { _count: { select: { students: true } } },
      });
      if (!classData) throw new LmsRequestError('Lớp không tồn tại', 404);
      if (classData.status !== 'ACTIVE') throw new LmsRequestError('Không thể thêm học sinh vào lớp đã lưu trữ', 409);

      const existing = await tx.lmsClassStudent.findMany({
        where: { classId, studentId: { in: ids } },
        select: { studentId: true },
      });
      const existingIds = new Set(existing.map((item) => item.studentId));
      const idsToAdd = ids.filter((id) => !existingIds.has(id));
      if (classData._count.students + idsToAdd.length > classData.maxStudents) {
        throw new LmsRequestError(`Lớp đã có ${classData._count.students}/${classData.maxStudents} học sinh`, 409);
      }

      const validStudents = await tx.lmsUser.count({ where: { id: { in: idsToAdd }, role: 'STUDENT' } });
      if (validStudents !== idsToAdd.length) throw new LmsRequestError('Danh sách có tài khoản không phải học sinh');
      if (idsToAdd.length === 0) return [];

      await tx.lmsClassStudent.createMany({
        data: idsToAdd.map((id) => ({ classId, studentId: id })),
        skipDuplicates: true,
      });
      return tx.lmsClassStudent.findMany({
        where: { classId, studentId: { in: idsToAdd } },
        include: { student: { select: { id: true, username: true, name: true, avatar: true, role: true } } },
      });
    });

    return NextResponse.json({
      success: true,
      data: added,
      message: added.length > 0 ? `Đã thêm ${added.length} học sinh` : 'Các học sinh đã có trong lớp',
    });
  } catch (error: any) {
    console.error('LMS Students POST error:', error);
    return lmsErrorResponse(error);
  }
}

// DELETE /api/lms/classes/[classId]/students — Xoá HS khỏi lớp
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireLmsUser(request, ['ADMIN']);
    const { classId } = await context.params;
    const body = await request.json();
    const studentId = requiredText(body.studentId, 'Học sinh', 100);
    await withClassLock(classId, async (tx) => {
      const classData = await tx.lmsClass.findUnique({ where: { id: classId }, select: { status: true } });
      if (!classData) throw new LmsRequestError('Lớp không tồn tại', 404);
      if (classData.status !== 'ACTIVE') throw new LmsRequestError('Không thể thay đổi sĩ số lớp đã lưu trữ', 409);
      await tx.lmsClassStudent.deleteMany({
        where: { classId, studentId },
      });
    });

    return NextResponse.json({ success: true, message: 'Đã xoá học sinh khỏi lớp' });
  } catch (error: any) {
    console.error('LMS Students DELETE error:', error);
    return lmsErrorResponse(error);
  }
}
