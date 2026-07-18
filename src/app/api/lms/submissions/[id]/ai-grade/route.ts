import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import prisma from '@/lib/prisma';
import {
  AI_GRADING_MARKER_PREFIX,
  AiGradingUnavailableError,
  gradeAssignment,
  isAiGradingMarker,
} from '@/services/ai-grading-service';
import { LmsRequestError, canManageActiveClass, lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';
import { consumeRateLimit } from '@/lib/rate-limit';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/lms/submissions/[id]/ai-grade — AI chấm bài tự động
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const { id } = await context.params;
    const rateLimit = consumeRateLimit(`ai-grade:${actor.id}:${id}`, 5, 60_000);
    if (!rateLimit.allowed) {
      throw new LmsRequestError(`Bạn đã yêu cầu chấm quá nhiều lần. Vui lòng chờ ${rateLimit.retryAfterSeconds} giây.`, 429);
    }

    // Lấy submission + assignment info
    const submission = await prisma.lmsSubmission.findUnique({
      where: { id },
      include: { assignment: { include: { lesson: { include: { subject: { include: { class: true } } } } } } },
    });

    if (!submission) {
      return NextResponse.json({ success: false, error: 'Bài nộp không tồn tại' }, { status: 404 });
    }
    if (actor.role === 'TEACHER' && submission.assignment.lesson.subject.class.teacherId !== actor.id) {
      return NextResponse.json({ success: false, error: 'Bạn không phụ trách lớp của bài nộp này' }, { status: 403 });
    }
    if (!(await canManageActiveClass(actor, submission.assignment.lesson.subject.class.id))) {
      return NextResponse.json({ success: false, error: 'Không thể chấm bài vì lớp đã được lưu trữ' }, { status: 409 });
    }
    if (submission.status !== 'PENDING') {
      return NextResponse.json({ success: false, error: 'Chỉ bài đang chờ chấm mới được gửi cho SEDUAI' }, { status: 409 });
    }

    if (!submission.content) {
      return NextResponse.json({ success: false, error: 'Bài nộp chưa có nội dung' }, { status: 400 });
    }
    if (submission.content.length > 50_000) {
      return NextResponse.json({ success: false, error: 'Bài nộp vượt giới hạn nội dung cho phép chấm AI' }, { status: 413 });
    }

    const staleClaimBefore = new Date(Date.now() - 2 * 60_000);
    if (isAiGradingMarker(submission.aiReview) && submission.updatedAt > staleClaimBefore) {
      throw new LmsRequestError('SEDUAI đang chấm bài nộp này. Vui lòng chờ kết quả.', 409);
    }
    if (submission.aiReview && !isAiGradingMarker(submission.aiReview)) {
      throw new LmsRequestError('Bài nộp có trạng thái nhận xét không nhất quán. Vui lòng tải lại.', 409);
    }

    const gradingMarker = `${AI_GRADING_MARKER_PREFIX}${randomUUID()}`;
    const claim = await prisma.lmsSubmission.updateMany({
      where: {
        id,
        status: 'PENDING',
        updatedAt: submission.updatedAt,
        aiReview: submission.aiReview,
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
      data: { aiReview: gradingMarker },
    });
    if (claim.count !== 1) {
      throw new LmsRequestError('Bài nộp đã thay đổi hoặc đang được SEDUAI chấm. Vui lòng tải lại.', 409);
    }

    let grading;
    try {
      grading = await gradeAssignment(
        submission.assignment.title,
        submission.assignment.rubric || submission.assignment.description || '',
        submission.content
      );
    } catch (error) {
      await prisma.lmsSubmission.updateMany({
        where: { id, status: 'PENDING', aiReview: gradingMarker },
        data: { aiReview: null },
      });
      if (error instanceof AiGradingUnavailableError) throw new LmsRequestError(error.message, 503);
      throw error;
    }

    const completed = await prisma.lmsSubmission.updateMany({
      where: {
        id,
        status: 'PENDING',
        aiReview: gradingMarker,
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
        grade: grading.grade,
        aiReview: grading.aiReview,
        status: 'AI_GRADED',
      },
    });
    if (completed.count !== 1) {
      await prisma.lmsSubmission.updateMany({
        where: { id, status: 'PENDING', aiReview: gradingMarker },
        data: { aiReview: null },
      });
      throw new LmsRequestError('Bài nộp đã thay đổi trong lúc SEDUAI chấm. Vui lòng chấm lại.', 409);
    }
    const updated = await prisma.lmsSubmission.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, username: true, name: true, avatar: true } },
        assignment: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS AI Grade error:', error);
    return lmsErrorResponse(error);
  }
}
