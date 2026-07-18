import { NextRequest, NextResponse } from 'next/server';
import { Prisma, type SubmissionStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { LmsRequestError, canManageActiveClass, lmsErrorResponse, requireLmsUser, withClassLock } from '@/lib/lms-auth';
import { enumValue, normalizeAttachments, optionalDate, optionalLongText, requiredText } from '@/lib/lms-input';
import { isAiGradingMarker } from '@/services/ai-grading-service';

const SUBMISSION_STATUSES = ['PENDING', 'AI_GRADED', 'REVIEWED'] as const satisfies readonly SubmissionStatus[];
const studentSummarySelect = { id: true, username: true, name: true, avatar: true } as const;

// GET /api/lms/submissions?assignmentId=xxx&studentId=xxx&status=PENDING
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const classId = searchParams.get('classId');

    const filters: Prisma.LmsSubmissionWhereInput[] = [];
    if (assignmentId) filters.push({ assignmentId });
    if (actor.role === 'STUDENT') filters.push({ studentId: actor.id });
    else if (studentId) filters.push({ studentId });
    if (status) filters.push({ status: enumValue(status, 'Trạng thái bài nộp', SUBMISSION_STATUSES) });
    if (classId) filters.push({ assignment: { lesson: { subject: { classId } } } });
    if (actor.role === 'TEACHER') {
      filters.push({ assignment: { lesson: { subject: { class: { teacherId: actor.id } } } } });
    }

    const submissions = await prisma.lmsSubmission.findMany({
      where: filters.length > 0 ? { AND: filters } : {},
      include: {
        student: { select: studentSummarySelect },
        assignment: {
          include: { lesson: { include: { subject: true } } },
        },
      },
      orderBy: { submittedAt: 'desc' },
      take: 200,
    });

    const data = submissions.map((submission) => isAiGradingMarker(submission.aiReview)
      ? { ...submission, aiReview: null, aiGrading: true }
      : submission);
    return NextResponse.json({ success: true, data });
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
    const assignmentId = requiredText(body.assignmentId, 'Bài tập', 100);
    const content = optionalLongText(body.content, 'Nội dung bài làm', 50_000) || '';
    const files = normalizeAttachments(body.files, 'Tệp bài làm');
    const studentId = actor.id;
    if (!content && !files?.length) {
      throw new LmsRequestError('Bài làm cần có nội dung hoặc ít nhất một tệp đính kèm');
    }

    const assignment = await prisma.lmsAssignment.findUnique({
      where: { id: assignmentId },
      include: { lesson: { include: { subject: { include: { class: { select: { status: true } } } } } } },
    });
    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Bài tập không tồn tại' }, { status: 404 });
    }
    const classId = assignment.lesson.subject.classId;
    const submission = await withClassLock(classId, async (tx) => {
      const lockedAssignment = await tx.lmsAssignment.findUnique({
        where: { id: assignmentId },
        include: { lesson: { include: { subject: { include: { class: { select: { status: true } } } } } } },
      });
      if (!lockedAssignment) throw new LmsRequestError('Bài tập không tồn tại', 404);
      if (lockedAssignment.lesson.subject.class.status !== 'ACTIVE') {
        throw new LmsRequestError('Lớp đã được lưu trữ, không thể nộp bài', 409);
      }
      if (lockedAssignment.dueDate && lockedAssignment.dueDate.getTime() < Date.now() && !lockedAssignment.allowLateSubmission) {
        throw new LmsRequestError('Bài tập đã quá hạn nộp', 409);
      }

      const enrollment = await tx.lmsClassStudent.findUnique({
        where: { classId_studentId: { classId, studentId } },
        select: { id: true },
      });
      if (!enrollment) throw new LmsRequestError('Học sinh không thuộc lớp được giao bài tập này', 403);

      const currentSubmission = await tx.lmsSubmission.findUnique({
        where: { assignmentId_studentId: { assignmentId, studentId } },
        select: { id: true, status: true },
      });
      if (currentSubmission && currentSubmission.status !== 'PENDING' && !lockedAssignment.allowResubmission) {
        throw new LmsRequestError('Bài đã được chấm, học sinh không thể chỉnh sửa', 409);
      }
      if (currentSubmission) {
        const updated = await tx.lmsSubmission.updateMany({
          where: { id: currentSubmission.id, status: currentSubmission.status, ...(currentSubmission.status === 'PENDING' ? { aiReview: null } : {}) },
          data: {
            content,
            ...(files !== undefined ? { files: files.length ? JSON.stringify(files) : null } : {}),
            grade: null,
            aiReview: null,
            teacherReview: null,
            status: 'PENDING',
            submittedAt: new Date(),
          },
        });
        if (updated.count !== 1) {
          throw new LmsRequestError('Bài đang được chấm hoặc đã thay đổi. Vui lòng tải lại trạng thái bài nộp.', 409);
        }
      } else {
        await tx.lmsSubmission.create({
          data: {
            assignmentId,
            studentId,
            content,
            files: files?.length ? JSON.stringify(files) : null,
            status: 'PENDING',
          },
        });
      }

      return tx.lmsSubmission.findUnique({
        where: { assignmentId_studentId: { assignmentId, studentId } },
        include: {
          student: { select: studentSummarySelect },
          assignment: true,
        },
      });
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
    const id = requiredText(body.id, 'Bài nộp', 100);
    const grade = Number(body.grade);
    const teacherReview = requiredText(body.teacherReview, 'Nhận xét của giáo viên', 9_500);
    const expectedUpdatedAt = optionalDate(body.expectedUpdatedAt, 'Phiên bản bài nộp');
    if (!expectedUpdatedAt) throw new LmsRequestError('Thiếu phiên bản bài nộp cần review');
    const status = enumValue(body.status, 'Trạng thái bài nộp', ['REVIEWED'] as const);
    const existing = await prisma.lmsSubmission.findUnique({
      where: { id },
      include: { assignment: { include: { lesson: { include: { subject: { include: { class: true } } } } } } },
    });
    if (!existing) return NextResponse.json({ success: false, error: 'Bài nộp không tồn tại' }, { status: 404 });
    if (actor.role === 'TEACHER' && existing.assignment.lesson.subject.class.teacherId !== actor.id) {
      return NextResponse.json({ success: false, error: 'Bạn không phụ trách lớp của bài nộp này' }, { status: 403 });
    }
    if (!(await canManageActiveClass(actor, existing.assignment.lesson.subject.class.id))) {
      return NextResponse.json({ success: false, error: 'Không thể duyệt điểm vì lớp đã được lưu trữ' }, { status: 409 });
    }
    if (!Number.isFinite(grade) || grade < 0 || grade > 10) {
      return NextResponse.json({ success: false, error: 'Điểm phải nằm trong khoảng 0-10' }, { status: 400 });
    }
    const canReviewLegacyFileOnly = existing.status === 'PENDING' && !existing.content && Boolean(existing.files);
    if (!['AI_GRADED', 'REVIEWED'].includes(existing.status) && !canReviewLegacyFileOnly) {
      return NextResponse.json({ success: false, error: 'Bài phải được SEDUAI chấm trước khi giáo viên review' }, { status: 409 });
    }

    const signedReview = `${teacherReview}\n\n— ${actor.name} (@${actor.username}), ${new Date().toISOString()}`;
    const saved = await prisma.lmsSubmission.updateMany({
      where: {
        id,
        status: existing.status,
        updatedAt: expectedUpdatedAt,
        assignment: {
          lesson: {
            subject: {
              class: {
                status: 'ACTIVE',
                ...(actor.role === 'TEACHER' ? { teacherId: actor.id } : {}),
              },
            },
          },
        },
      },
      data: {
        grade,
        teacherReview: signedReview,
        status,
      },
    });
    if (saved.count !== 1) {
      throw new LmsRequestError('Bài nộp đã thay đổi hoặc quyền phụ trách lớp đã được cập nhật. Vui lòng tải lại.', 409);
    }
    const updated = await prisma.lmsSubmission.findUnique({
      where: { id },
      include: { student: { select: studentSummarySelect }, assignment: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Submissions PUT error:', error);
    return lmsErrorResponse(error);
  }
}
