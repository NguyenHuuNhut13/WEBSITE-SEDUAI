import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { canAccessClass, lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';

// GET /api/lms/assignments?lessonId=xxx
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const id = searchParams.get('id');
    const studentId = searchParams.get('studentId');

    if (id) {
      const assignment = await prisma.lmsAssignment.findUnique({
        where: { id },
        include: {
          lesson: { include: { subject: { include: { class: true } } } },
          submissions: { include: { student: true }, orderBy: { submittedAt: 'desc' } },
        },
      });
      if (!assignment) return NextResponse.json({ success: false, error: 'Bài tập không tồn tại' }, { status: 404 });
      if (!(await canAccessClass(actor, assignment.lesson.subject.class.id))) return NextResponse.json({ success: false, error: 'Bạn không có quyền xem bài tập này' }, { status: 403 });
      return NextResponse.json({ success: true, data: assignment });
    }

    if (studentId) {
      if (actor.role !== 'STUDENT' || actor.id !== studentId) return NextResponse.json({ success: false, error: 'Bạn chỉ được xem bài tập của chính mình' }, { status: 403 });
      const assignments = await prisma.lmsAssignment.findMany({
        where: {
          lesson: {
            subject: {
              class: { students: { some: { studentId } } },
            },
          },
        },
        include: {
          lesson: { include: { subject: { include: { class: true } } } },
          submissions: { where: { studentId }, take: 1 },
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      });
      return NextResponse.json({ success: true, data: assignments });
    }

    if (!lessonId) {
      return NextResponse.json({ success: false, error: 'lessonId là bắt buộc' }, { status: 400 });
    }
    const lesson = await prisma.lmsLesson.findUnique({ where: { id: lessonId }, include: { subject: { select: { classId: true } } } });
    if (!lesson || !(await canAccessClass(actor, lesson.subject.classId))) return NextResponse.json({ success: false, error: 'Bạn không có quyền xem bài tập của bài học này' }, { status: 403 });

    const assignments = await prisma.lmsAssignment.findMany({
      where: { lessonId },
      include: { _count: { select: { submissions: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: assignments });
  } catch (error: any) {
    console.error('LMS Assignments GET error:', error);
    return lmsErrorResponse(error);
  }
}

// POST /api/lms/assignments
export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();
    const { lessonId, title, description, dueDate } = body;

    if (!lessonId || !title) {
      return NextResponse.json({ success: false, error: 'lessonId và title là bắt buộc' }, { status: 400 });
    }
    const lesson = await prisma.lmsLesson.findUnique({ where: { id: lessonId }, include: { subject: { select: { classId: true } } } });
    if (!lesson || !(await canAccessClass(actor, lesson.subject.classId))) return NextResponse.json({ success: false, error: 'Bạn không quản lý bài học này' }, { status: 403 });
    const parsedDueDate = dueDate ? new Date(dueDate) : null;
    if (parsedDueDate && Number.isNaN(parsedDueDate.getTime())) return NextResponse.json({ success: false, error: 'Hạn nộp không hợp lệ' }, { status: 400 });

    const assignment = await prisma.lmsAssignment.create({
      data: {
        lessonId,
        title,
        description: description || '',
        dueDate: parsedDueDate,
      },
    });

    return NextResponse.json({ success: true, data: assignment });
  } catch (error: any) {
    console.error('LMS Assignments POST error:', error);
    return lmsErrorResponse(error);
  }
}
