import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/lms/exams/results?examConfigId=xxx&studentId=xxx&classId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examConfigId = searchParams.get('examConfigId');
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    const where: any = {};
    if (examConfigId) where.examConfigId = examConfigId;
    if (studentId) where.studentId = studentId;
    if (classId) where.examConfig = { classId };

    const results = await prisma.lmsExamResult.findMany({
      where,
      include: {
        student: true,
        examConfig: { include: { subject: true } },
      },
      orderBy: { finishedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error('LMS Exam Results GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/lms/exams/results — Lưu kết quả thi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examConfigId, studentId, score, correctCount, totalQuestions, answers, startedAt, finishedAt } = body;

    if (!examConfigId || !studentId || score === undefined || !correctCount === undefined || !totalQuestions) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin kết quả thi' }, { status: 400 });
    }

    const result = await prisma.lmsExamResult.upsert({
      where: {
        examConfigId_studentId: { examConfigId, studentId },
      },
      update: {
        score,
        correctCount,
        totalQuestions,
        answers: answers ? JSON.stringify(answers) : null,
        finishedAt: finishedAt ? new Date(finishedAt) : new Date(),
      },
      create: {
        examConfigId,
        studentId,
        score,
        correctCount,
        totalQuestions,
        answers: answers ? JSON.stringify(answers) : null,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        finishedAt: finishedAt ? new Date(finishedAt) : new Date(),
      },
      include: { student: true, examConfig: { include: { subject: true } } },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('LMS Exam Results POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
