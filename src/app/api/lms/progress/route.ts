import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LmsRequestError, lmsErrorResponse, requireLmsUser } from '@/lib/lms-auth';

export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['STUDENT']);
    const body = await request.json() as Record<string, unknown>;
    const lessonId = typeof body.lessonId === 'string' ? body.lessonId : '';
    const progressPercent = Number(body.progressPercent ?? 0);
    const completed = body.completed === true;
    if (!lessonId) throw new LmsRequestError('lessonId là bắt buộc');
    if (!Number.isInteger(progressPercent) || progressPercent < 0 || progressPercent > 100) {
      throw new LmsRequestError('progressPercent phải nằm trong khoảng 0-100');
    }

    const lesson = await prisma.lmsLesson.findUnique({
      where: { id: lessonId },
      select: { id: true, status: true, subject: { select: { classId: true } } },
    });
    if (!lesson || lesson.status !== 'PUBLISHED') throw new LmsRequestError('Bài học chưa được công bố', 404);
    const enrollment = await prisma.lmsClassStudent.findUnique({
      where: { classId_studentId: { classId: lesson.subject.classId, studentId: actor.id } },
      select: { id: true },
    });
    if (!enrollment) throw new LmsRequestError('Học sinh không thuộc lớp học này', 403);

    const now = new Date();
    const progress = await prisma.lmsLessonProgress.upsert({
      where: { lessonId_studentId: { lessonId, studentId: actor.id } },
      create: {
        lessonId,
        studentId: actor.id,
        progressPercent: completed ? 100 : progressPercent,
        viewedAt: now,
        completedAt: completed ? now : null,
      },
      update: {
        progressPercent: completed ? 100 : progressPercent,
        viewedAt: now,
        ...(completed ? { completedAt: now } : {}),
      },
    });
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    return lmsErrorResponse(error);
  }
}
