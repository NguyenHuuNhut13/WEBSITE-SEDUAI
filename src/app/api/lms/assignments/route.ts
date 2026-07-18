import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LmsRequestError, canAccessClass, lmsErrorResponse, requireLmsUser, withActiveClassMutation } from '@/lib/lms-auth';
import { optionalDate, optionalText, requiredText } from '@/lib/lms-input';
import { isAiGradingMarker } from '@/services/ai-grading-service';

const studentSummarySelect = { id: true, username: true, name: true, avatar: true } as const;

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
          submissions: actor.role === 'STUDENT'
            ? {
                where: { studentId: actor.id },
                select: {
                  id: true,
                  assignmentId: true,
                  studentId: true,
                  content: true,
                  files: true,
                  grade: true,
                  aiReview: true,
                  teacherReview: true,
                  status: true,
                  submittedAt: true,
                  updatedAt: true,
                },
                take: 1,
              }
            : { include: { student: { select: studentSummarySelect } }, orderBy: { submittedAt: 'desc' } },
        },
      });
      if (!assignment) return NextResponse.json({ success: false, error: 'Bài tập không tồn tại' }, { status: 404 });
      if (!(await canAccessClass(actor, assignment.lesson.subject.class.id))) return NextResponse.json({ success: false, error: 'Bạn không có quyền xem bài tập này' }, { status: 403 });
      const submissions = assignment.submissions.map((submission) => isAiGradingMarker(submission.aiReview)
        ? { ...submission, aiReview: null, aiGrading: true }
        : submission);
      return NextResponse.json({ success: true, data: { ...assignment, submissions } });
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
    const lessonId = requiredText(body.lessonId, 'Bài học', 100);
    const title = requiredText(body.title, 'Tên bài tập', 200);
    const description = optionalText(body.description, 'Yêu cầu bài tập', 20_000) || '';
    const rubric = optionalText(body.rubric, 'Rubric chấm điểm', 20_000) || '';
    const allowLateSubmission = body.allowLateSubmission === true;
    const allowResubmission = body.allowResubmission === true;
    const parsedDueDate = optionalDate(body.dueDate, 'Hạn nộp');
    const lesson = await prisma.lmsLesson.findUnique({ where: { id: lessonId }, include: { subject: { select: { classId: true } } } });
    if (!lesson) return NextResponse.json({ success: false, error: 'Bài học không tồn tại' }, { status: 404 });
    if (parsedDueDate && parsedDueDate.getTime() <= Date.now()) throw new LmsRequestError('Hạn nộp phải ở tương lai');

    const assignment = await withActiveClassMutation(actor, lesson.subject.classId, (tx) => tx.lmsAssignment.create({
      data: {
        lessonId,
        title,
        description,
        rubric,
        allowLateSubmission,
        allowResubmission,
        dueDate: parsedDueDate,
      },
    }));

    return NextResponse.json({ success: true, data: assignment });
  } catch (error: any) {
    console.error('LMS Assignments POST error:', error);
    return lmsErrorResponse(error);
  }
}

// PUT /api/lms/assignments — Giáo viên cập nhật đề bài và hạn nộp
export async function PUT(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();
    const id = requiredText(body.id, 'Bài tập', 100);
    const title = body.title === undefined ? undefined : requiredText(body.title, 'Tên bài tập', 200);
    const description = body.description === undefined ? undefined : optionalText(body.description, 'Yêu cầu bài tập', 20_000) || '';
    const dueDate = body.dueDate === undefined ? undefined : optionalDate(body.dueDate, 'Hạn nộp');
    const rubric = body.rubric === undefined ? undefined : optionalText(body.rubric, 'Rubric chấm điểm', 20_000) || '';
    const allowLateSubmission = body.allowLateSubmission === undefined ? undefined : body.allowLateSubmission === true;
    const allowResubmission = body.allowResubmission === undefined ? undefined : body.allowResubmission === true;
    if (dueDate && dueDate.getTime() <= Date.now()) throw new LmsRequestError('Hạn nộp phải ở tương lai');
    if (title === undefined && description === undefined && dueDate === undefined && rubric === undefined && allowLateSubmission === undefined && allowResubmission === undefined) {
      throw new LmsRequestError('Không có dữ liệu bài tập cần cập nhật');
    }

    const assignment = await prisma.lmsAssignment.findUnique({
      where: { id },
      include: { lesson: { include: { subject: { select: { classId: true } } } } },
    });
    if (!assignment) return NextResponse.json({ success: false, error: 'Bài tập không tồn tại' }, { status: 404 });
    const updated = await withActiveClassMutation(actor, assignment.lesson.subject.classId, (tx) => tx.lmsAssignment.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(dueDate !== undefined ? { dueDate } : {}),
        ...(rubric !== undefined ? { rubric } : {}),
        ...(allowLateSubmission !== undefined ? { allowLateSubmission } : {}),
        ...(allowResubmission !== undefined ? { allowResubmission } : {}),
      },
    }));
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    console.error('LMS Assignments PUT error:', error);
    return lmsErrorResponse(error);
  }
}

// DELETE /api/lms/assignments?id=... — Chỉ xóa đề chưa có bài nộp
export async function DELETE(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const id = requiredText(new URL(request.url).searchParams.get('id'), 'Bài tập', 100);
    const assignment = await prisma.lmsAssignment.findUnique({
      where: { id },
      include: {
        lesson: { include: { subject: { select: { classId: true } } } },
      },
    });
    if (!assignment) return NextResponse.json({ success: false, error: 'Bài tập không tồn tại' }, { status: 404 });
    const deleted = await withActiveClassMutation(actor, assignment.lesson.subject.classId, (tx) => tx.lmsAssignment.deleteMany({
      where: { id, submissions: { none: {} } },
    }));
    if (deleted.count !== 1) {
      throw new LmsRequestError('Không thể xóa bài tập đã có bài nộp', 409);
    }
    return NextResponse.json({ success: true, message: 'Đã xóa bài tập' });
  } catch (error: unknown) {
    console.error('LMS Assignments DELETE error:', error);
    return lmsErrorResponse(error);
  }
}
