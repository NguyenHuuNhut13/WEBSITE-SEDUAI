import { NextRequest, NextResponse } from 'next/server';
import type { LessonType } from '@prisma/client';
import prisma from '@/lib/prisma';
import { canAccessClass, lmsErrorResponse, requireLmsUser, withActiveClassMutation } from '@/lib/lms-auth';
import { enumValue, normalizeAttachments, optionalLongText, positiveInteger, requiredText } from '@/lib/lms-input';

const LESSON_TYPES = ['THEORY', 'PRACTICAL'] as const satisfies readonly LessonType[];

// GET /api/lms/lessons?subjectId=xxx
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const lessonId = searchParams.get('id');

    if (lessonId) {
      const lesson = await prisma.lmsLesson.findUnique({
        where: { id: lessonId },
        include: {
          subject: { include: { class: true } },
          assignments: {
            include: { _count: { select: { submissions: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      if (!lesson) return NextResponse.json({ success: false, error: 'Bài học không tồn tại' }, { status: 404 });
      if (!(await canAccessClass(actor, lesson.subject.classId))) return NextResponse.json({ success: false, error: 'Bạn không có quyền xem bài học này' }, { status: 403 });
      return NextResponse.json({ success: true, data: lesson });
    }

    if (!subjectId) {
      return NextResponse.json({ success: false, error: 'subjectId là bắt buộc' }, { status: 400 });
    }
    const subject = await prisma.lmsSubject.findUnique({ where: { id: subjectId }, select: { classId: true } });
    if (!subject || !(await canAccessClass(actor, subject.classId))) return NextResponse.json({ success: false, error: 'Bạn không có quyền xem môn học này' }, { status: 403 });

    const lessons = await prisma.lmsLesson.findMany({
      where: { subjectId },
      include: {
        assignments: { include: { _count: { select: { submissions: true } } } },
      },
      orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
    });

    return NextResponse.json({ success: true, data: lessons });
  } catch (error: any) {
    console.error('LMS Lessons GET error:', error);
    return lmsErrorResponse(error);
  }
}

// POST /api/lms/lessons — Tạo bài học mới
export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();
    const subjectId = requiredText(body.subjectId, 'Môn học', 100);
    const type = enumValue(body.type, 'Loại bài học', LESSON_TYPES);
    const orderIndex = positiveInteger(body.orderIndex, 'Thứ tự buổi học', 1, 100);
    const title = requiredText(body.title, 'Tiêu đề bài học', 200);
    const content = optionalLongText(body.content, 'Nội dung bài học', 100_000) || '';
    const attachments = normalizeAttachments(body.attachments);
    const subject = await prisma.lmsSubject.findUnique({ where: { id: subjectId }, select: { classId: true, theoryLessons: true, practicalLessons: true } });
    if (!subject) return NextResponse.json({ success: false, error: 'Môn học không tồn tại' }, { status: 404 });
    const maxOrder = type === 'THEORY' ? subject.theoryLessons : subject.practicalLessons;
    if (orderIndex > maxOrder) {
      return NextResponse.json({ success: false, error: 'Loại hoặc thứ tự buổi học không hợp lệ' }, { status: 400 });
    }

    const lesson = await withActiveClassMutation(actor, subject.classId, (tx) => tx.lmsLesson.create({
      data: {
        subjectId,
        type,
        orderIndex,
        title,
        content,
        attachments: attachments?.length ? JSON.stringify(attachments) : null,
      },
      include: { assignments: true },
    }));

    return NextResponse.json({ success: true, data: lesson });
  } catch (error: any) {
    console.error('LMS Lessons POST error:', error);
    return lmsErrorResponse(error);
  }
}

// PUT /api/lms/lessons — Cập nhật bài học
export async function PUT(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();
    const id = requiredText(body.id, 'Bài học', 100);
    const title = body.title === undefined ? undefined : requiredText(body.title, 'Tiêu đề bài học', 200);
    const content = body.content === undefined ? undefined : optionalLongText(body.content, 'Nội dung bài học', 100_000) || '';
    const attachments = body.attachments === undefined ? undefined : normalizeAttachments(body.attachments);
    const lesson = await prisma.lmsLesson.findUnique({ where: { id }, include: { subject: { select: { classId: true } } } });
    if (!lesson) return NextResponse.json({ success: false, error: 'Bài học không tồn tại' }, { status: 404 });
    const updated = await withActiveClassMutation(actor, lesson.subject.classId, (tx) => tx.lmsLesson.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(attachments !== undefined && { attachments: attachments.length ? JSON.stringify(attachments) : null }),
      },
    }));

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Lessons PUT error:', error);
    return lmsErrorResponse(error);
  }
}
