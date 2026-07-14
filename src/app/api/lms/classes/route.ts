import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/lms/classes?teacherId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    const where = (teacherId && teacherId !== 'null' && teacherId !== 'undefined' && teacherId.trim() !== '')
      ? { teacherId }
      : {};
    const classes = await prisma.lmsClass.findMany({
      where,
      include: {
        teacher: true,
        subjects: true,
        students: { include: { student: true } },
        _count: { select: { students: true, subjects: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = classes.map((c: any) => ({
      ...c,
      studentCount: c._count.students,
      subjectCount: c._count.subjects,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('LMS Classes GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/lms/classes — Admin tạo lớp mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, teacherId, subjects } = body;

    if (!name || !teacherId) {
      return NextResponse.json({ success: false, error: 'name và teacherId là bắt buộc' }, { status: 400 });
    }

    // Kiểm tra teacher tồn tại và có role TEACHER
    const teacher = await prisma.lmsUser.findUnique({ where: { id: teacherId } });
    if (!teacher || teacher.role !== 'TEACHER') {
      return NextResponse.json({ success: false, error: 'Giáo viên không tồn tại hoặc không có quyền' }, { status: 400 });
    }

    // Lọc các môn học hợp lệ (tối đa 4 môn, không rỗng)
    const validSubjects = (subjects || [])
      .map((s: any) => (typeof s === 'string' ? s.trim() : ''))
      .filter(Boolean);

    // Tạo lớp + 4 môn học
    const newClass = await prisma.lmsClass.create({
      data: {
        name,
        teacherId,
        subjects: {
          create: validSubjects.slice(0, 4).map((subjectName: string) => ({
            name: subjectName,
          })),
        },
      },
      include: {
        teacher: true,
        subjects: true,
      },
    });

    return NextResponse.json({ success: true, data: newClass });
  } catch (error: any) {
    console.error('LMS Classes POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
