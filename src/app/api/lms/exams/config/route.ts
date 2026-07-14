import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/lms/exams/config?classId=xxx&subjectId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');
    const id = searchParams.get('id');

    if (id) {
      const config = await prisma.lmsExamConfig.findUnique({
        where: { id },
        include: {
          subject: true,
          class: true,
          results: { include: { student: true }, orderBy: { score: 'desc' } },
          _count: { select: { results: true } },
        },
      });
      return NextResponse.json({ success: true, data: config });
    }

    const where: any = {};
    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;

    const configs = await prisma.lmsExamConfig.findMany({
      where,
      include: {
        subject: true,
        class: true,
        _count: { select: { results: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: configs });
  } catch (error: any) {
    console.error('LMS Exam Config GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/lms/exams/config — Giáo viên tạo cấu hình thi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subjectId, classId, examType, questionCount, durationMinutes, password, startTime, endTime, lessonOrder } = body;

    if (!subjectId || !classId || !examType || !questionCount || !durationMinutes) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin cấu hình thi' }, { status: 400 });
    }

    const config = await prisma.lmsExamConfig.create({
      data: {
        subjectId,
        classId,
        examType,
        questionCount,
        durationMinutes,
        password: password || null,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        lessonOrder: lessonOrder || null,
      },
      include: { subject: true, class: true },
    });

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    console.error('LMS Exam Config POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
