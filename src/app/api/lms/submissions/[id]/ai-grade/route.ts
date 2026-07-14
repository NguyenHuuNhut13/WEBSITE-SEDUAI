import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gradeAssignment } from '@/services/ai-grading-service';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/lms/submissions/[id]/ai-grade — AI chấm bài tự động
export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Lấy submission + assignment info
    const submission = await prisma.lmsSubmission.findUnique({
      where: { id },
      include: { assignment: true },
    });

    if (!submission) {
      return NextResponse.json({ success: false, error: 'Bài nộp không tồn tại' }, { status: 404 });
    }

    if (!submission.content) {
      return NextResponse.json({ success: false, error: 'Bài nộp chưa có nội dung' }, { status: 400 });
    }

    // Gọi AI chấm bài
    const { grade, aiReview } = await gradeAssignment(
      submission.assignment.title,
      submission.assignment.description || '',
      submission.content
    );

    // Cập nhật kết quả
    const updated = await prisma.lmsSubmission.update({
      where: { id },
      data: {
        grade,
        aiReview,
        status: 'AI_GRADED',
      },
      include: { student: true, assignment: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS AI Grade error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
