import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';

type RouteContext = { params: Promise<{ classId: string }> };

// POST /api/lms/classes/[classId]/students — Thêm HS vào lớp
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireLmsUser(request, ['ADMIN']);
    const { classId } = await context.params;
    const body = await request.json();
    const { studentId, studentIds } = body;

    // Kiểm tra lớp tồn tại
    const classData = await prisma.lmsClass.findUnique({
      where: { id: classId },
      include: { _count: { select: { students: true } } },
    });

    if (!classData) {
      return NextResponse.json({ success: false, error: 'Lớp không tồn tại' }, { status: 404 });
    }

    // Xử lý thêm 1 hoặc nhiều HS
    const requestedIds = Array.isArray(studentIds) ? studentIds : (studentId ? [studentId] : []);
    const idsToAdd = [...new Set(requestedIds.filter((id): id is string => typeof id === 'string' && id.trim() !== ''))];

    if (idsToAdd.length === 0) {
      return NextResponse.json({ success: false, error: 'Cần cung cấp studentId hoặc studentIds' }, { status: 400 });
    }

    // Kiểm tra sĩ số tối đa
    if (classData._count.students + idsToAdd.length > classData.maxStudents) {
      return NextResponse.json({
        success: false,
        error: `Lớp đã có ${classData._count.students}/${classData.maxStudents} học sinh. Không thể thêm ${idsToAdd.length} HS nữa.`,
      }, { status: 400 });
    }

    const validStudents = await prisma.lmsUser.count({ where: { id: { in: idsToAdd }, role: 'STUDENT' } });
    if (validStudents !== idsToAdd.length) {
      return NextResponse.json({ success: false, error: 'Danh sách có tài khoản không phải học sinh' }, { status: 400 });
    }

    // Thêm từng HS (skip nếu đã tồn tại)
    const results = await Promise.allSettled(
      idsToAdd.map((sid) =>
        prisma.lmsClassStudent.create({
          data: { classId, studentId: sid },
          include: { student: true },
        })
      )
    );

    const added = results.filter((r) => r.status === 'fulfilled').map((r: any) => r.value);
    const errors = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      data: added,
      message: `Đã thêm ${added.length} học sinh${errors > 0 ? `, ${errors} lỗi (có thể đã tồn tại)` : ''}`,
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
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ success: false, error: 'studentId là bắt buộc' }, { status: 400 });
    }

    await prisma.lmsClassStudent.deleteMany({
      where: { classId, studentId },
    });

    return NextResponse.json({ success: true, message: 'Đã xoá học sinh khỏi lớp' });
  } catch (error: any) {
    console.error('LMS Students DELETE error:', error);
    return lmsErrorResponse(error);
  }
}
