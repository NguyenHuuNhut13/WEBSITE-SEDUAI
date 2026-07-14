import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';

// GET /api/lms/submissions?assignmentId=xxx&studentId=xxx&status=PENDING
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const classId = searchParams.get('classId');

    const where: any = {};
    if (assignmentId) where.assignmentId = assignmentId;
    if (actor.role === 'STUDENT') where.studentId = actor.id;
    else if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (classId) {
      where.assignment = {
        lesson: { subject: { classId } },
      };
    }
    if (actor.role === 'TEACHER') {
      where.assignment = {
        lesson: { subject: { class: { teacherId: actor.id } } },
      };
    }

    const submissions = await prisma.lmsSubmission.findMany({
      where,
      include: {
        student: true,
        assignment: {
          include: { lesson: { include: { subject: true } } },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error: any) {
    console.error('LMS Submissions GET error:', error);
    return lmsErrorResponse(error);
  }
}

// POST /api/lms/submissions — Học sinh nộp bài
export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['STUDENT']);
    const body = await request.json();
    const { assignmentId, content, files } = body;
    const studentId = actor.id;

    if (!assignmentId) {
      return NextResponse.json({ success: false, error: 'assignmentId là bắt buộc' }, { status: 400 });
    }

    const assignment = await prisma.lmsAssignment.findUnique({
      where: { id: assignmentId },
      include: { lesson: { include: { subject: true } } },
    });
    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Bài tập không tồn tại' }, { status: 404 });
    }
    const enrollment = await prisma.lmsClassStudent.findUnique({
      where: {
        classId_studentId: {
          classId: assignment.lesson.subject.classId,
          studentId,
        },
      },
    });
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Học sinh không thuộc lớp được giao bài tập này' }, { status: 403 });
    }
    if (assignment.dueDate && assignment.dueDate.getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: 'Bài tập đã quá hạn nộp' }, { status: 409 });
    }
    const currentSubmission = await prisma.lmsSubmission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } },
      select: { status: true },
    });
    if (currentSubmission && currentSubmission.status !== 'PENDING') {
      return NextResponse.json({ success: false, error: 'Bài đã được chấm, học sinh không thể chỉnh sửa' }, { status: 409 });
    }

    const submission = await prisma.lmsSubmission.upsert({
      where: {
        assignmentId_studentId: { assignmentId, studentId },
      },
      update: {
        content: content || '',
        files: files ? JSON.stringify(files) : null,
        status: 'PENDING',
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId,
        content: content || '',
        files: files ? JSON.stringify(files) : null,
        status: 'PENDING',
      },
      include: { student: true, assignment: true },
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error('LMS Submissions POST error:', error);
    return lmsErrorResponse(error);
  }
}

// PUT /api/lms/submissions — Giáo viên review + cập nhật điểm
export async function PUT(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();
    const { id, grade, teacherReview, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id submission là bắt buộc' }, { status: 400 });
    }
    const existing = await prisma.lmsSubmission.findUnique({
      where: { id },
      include: { assignment: { include: { lesson: { include: { subject: { include: { class: true } } } } } } },
    });
    if (!existing) return NextResponse.json({ success: false, error: 'Bài nộp không tồn tại' }, { status: 404 });
    if (actor.role === 'TEACHER' && existing.assignment.lesson.subject.class.teacherId !== actor.id) {
      return NextResponse.json({ success: false, error: 'Bạn không phụ trách lớp của bài nộp này' }, { status: 403 });
    }
    if (grade !== undefined && (!Number.isFinite(Number(grade)) || Number(grade) < 0 || Number(grade) > 10)) {
      return NextResponse.json({ success: false, error: 'Điểm phải nằm trong khoảng 0-10' }, { status: 400 });
    }
    if (status && status !== 'REVIEWED') {
      return NextResponse.json({ success: false, error: 'Giáo viên chỉ được xác nhận trạng thái REVIEWED' }, { status: 400 });
    }
    if (status === 'REVIEWED' && existing.status !== 'AI_GRADED') {
      return NextResponse.json({ success: false, error: 'Bài phải được SEDUAI chấm trước khi giáo viên review' }, { status: 409 });
    }

    const updated = await prisma.lmsSubmission.update({
      where: { id },
      data: {
        ...(grade !== undefined && { grade: Number(grade) }),
        ...(teacherReview !== undefined && { teacherReview }),
        ...(status && { status }),
      },
      include: { student: true, assignment: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Submissions PUT error:', error);
    return lmsErrorResponse(error);
  }
}
