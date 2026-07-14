import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateQuizQuestions } from '@/services/ai-grading-service';

// POST /api/lms/exams/generate — AI sinh câu hỏi TN realtime (KHÔNG lưu DB)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examConfigId, subjectId } = body;

    let questionCount = body.questionCount;
    let subjectName = body.subjectName || 'Môn học';

    // Nếu có examConfigId, lấy config từ DB
    if (examConfigId) {
      const config = await prisma.lmsExamConfig.findUnique({
        where: { id: examConfigId },
        include: { subject: true },
      });

      if (!config) {
        return NextResponse.json({ success: false, error: 'Cấu hình thi không tồn tại' }, { status: 404 });
      }

      questionCount = config.questionCount;
      subjectName = config.subject.name;
    }

    if (!questionCount) {
      return NextResponse.json({ success: false, error: 'questionCount là bắt buộc' }, { status: 400 });
    }

    // Lấy nội dung bài học để AI sinh câu hỏi
    let lessonContents: string[] = [];
    const targetSubjectId = subjectId || (examConfigId ? undefined : null);

    if (targetSubjectId) {
      const lessons = await prisma.lmsLesson.findMany({
        where: { subjectId: targetSubjectId },
        select: { content: true },
      });
      lessonContents = lessons.map((l) => l.content || '').filter(Boolean);
    }

    // AI sinh câu hỏi realtime
    const quiz = await generateQuizQuestions(lessonContents, questionCount, subjectName);

    // KHÔNG LƯU VÀO DB — trả về JSON cho frontend
    return NextResponse.json({ success: true, data: quiz });
  } catch (error: any) {
    console.error('LMS Exam Generate error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
