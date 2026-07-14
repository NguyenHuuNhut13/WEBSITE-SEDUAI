import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LmsRequestError, lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';
import { requiredText, stringIdList } from '@/lib/lms-input';

const userSummarySelect = { id: true, username: true, name: true, avatar: true, role: true } as const;

// GET /api/lms/classes?teacherId=xxx
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const where = actor.role === 'ADMIN'
      ? {}
      : actor.role === 'TEACHER'
        ? { teacherId: actor.id, status: 'ACTIVE' as const }
        : { students: { some: { studentId: actor.id } }, status: 'ACTIVE' as const };
    const classes = await prisma.lmsClass.findMany({
      where,
      include: {
        teacher: { select: userSummarySelect },
        subjects: true,
        ...(actor.role !== 'STUDENT' ? {
          students: {
            include: { student: { select: userSummarySelect } },
            orderBy: { enrolledAt: 'asc' as const },
          },
        } : {}),
        _count: { select: { students: true, subjects: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const data = classes.map((c) => ({
      ...c,
      studentCount: c._count.students,
      subjectCount: c._count.subjects,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('LMS Classes GET error:', error);
    return lmsErrorResponse(error);
  }
}

// POST /api/lms/classes — Admin tạo lớp mới
export async function POST(request: NextRequest) {
  try {
    await requireLmsUser(request, ['ADMIN']);
    const body = await request.json();
    const name = requiredText(body.name, 'Tên lớp', 120);
    const teacherId = requiredText(body.teacherId, 'Giáo viên', 100);

    // Lọc các môn học hợp lệ (tối đa 4 môn, không rỗng)
    if (!Array.isArray(body.subjects)) throw new LmsRequestError('Danh sách môn học không hợp lệ');
    const subjectInputs = body.subjects as unknown[];
    const validSubjects: string[] = [...new Set(subjectInputs.map((subject) => requiredText(subject, 'Tên môn học', 120)))];
    if (validSubjects.length < 1 || validSubjects.length > 4) {
      throw new LmsRequestError('Mỗi lớp phải có từ 1 đến 4 môn học');
    }

    const uniqueStudentIds = body.studentIds === undefined ? [] : stringIdList(body.studentIds, 'Danh sách học sinh', 25);
    const newClass = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('lms-user-role-management')) IS NULL`;
      const teacher = await tx.lmsUser.findUnique({ where: { id: teacherId }, select: { role: true } });
      if (!teacher || teacher.role !== 'TEACHER') {
        throw new LmsRequestError('Giáo viên không tồn tại hoặc chưa có vai trò TEACHER');
      }
      const studentCount = await tx.lmsUser.count({
        where: { id: { in: uniqueStudentIds }, role: 'STUDENT' },
      });
      if (studentCount !== uniqueStudentIds.length) {
        throw new LmsRequestError('Danh sách lớp có tài khoản không phải học sinh');
      }

      return tx.lmsClass.create({
        data: {
          name,
          teacherId,
          subjects: {
            create: validSubjects.slice(0, 4).map((subjectName) => ({ name: subjectName })),
          },
          students: {
            create: uniqueStudentIds.map((studentId) => ({ studentId })),
          },
        },
        include: {
          teacher: { select: userSummarySelect },
          subjects: true,
          students: { include: { student: { select: userSummarySelect } } },
        },
      });
    });

    return NextResponse.json({ success: true, data: newClass });
  } catch (error: any) {
    console.error('LMS Classes POST error:', error);
    return lmsErrorResponse(error);
  }
}
