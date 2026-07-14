import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/lms/lessons?subjectId=xxx
export async function GET(request: NextRequest) {
  try {
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
      return NextResponse.json({ success: true, data: lesson });
    }

    if (!subjectId) {
      return NextResponse.json({ success: false, error: 'subjectId là bắt buộc' }, { status: 400 });
    }

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/lms/lessons — Tạo bài học mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subjectId, type, orderIndex, title, content, attachments } = body;

    if (!subjectId || !type || !orderIndex || !title) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bài học' }, { status: 400 });
    }

    const lesson = await prisma.lmsLesson.create({
      data: {
        subjectId,
        type,
        orderIndex,
        title,
        content: content || '',
        attachments: attachments ? JSON.stringify(attachments) : null,
      },
      include: { assignments: true },
    });

    return NextResponse.json({ success: true, data: lesson });
  } catch (error: any) {
    console.error('LMS Lessons POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/lms/lessons — Cập nhật bài học
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, attachments } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id bài học là bắt buộc' }, { status: 400 });
    }

    const updated = await prisma.lmsLesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(attachments !== undefined && { attachments: JSON.stringify(attachments) }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Lessons PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
