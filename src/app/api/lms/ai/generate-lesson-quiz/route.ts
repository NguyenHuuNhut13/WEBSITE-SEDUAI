import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireLmsUser, lmsErrorResponse, canManageActiveClass } from '@/lib/lms-auth';
import { requiredText } from '@/lib/lms-input';
import { generateDraftExamQuestions, storeAttemptQuestions } from '@/lib/lms-exam';

export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();

    const lessonId = requiredText(body.lessonId, 'Mã buổi học', 100);

    // Fetch lesson details to get class context
    const lesson = await prisma.lmsLesson.findUnique({
      where: { id: lessonId },
      include: { subject: { include: { class: true } } },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Buổi học không tồn tại' }, { status: 404 });
    }

    const classId = lesson.subject.classId;
    if (!(await canManageActiveClass(actor, classId))) {
      return NextResponse.json({ success: false, error: 'Bạn không có quyền quản lý lớp học này hoặc lớp đã bị lưu trữ' }, { status: 403 });
    }

    // Check if there is already an LmsExamConfig for this LESSON_QUIZ
    let examConfig = await prisma.lmsExamConfig.findFirst({
      where: {
        subjectId: lesson.subjectId,
        examType: 'LESSON_QUIZ',
        lessonOrder: lesson.orderIndex,
        lessonType: lesson.type,
      },
      include: { subject: true },
    });

    if (!examConfig) {
      // Create new LmsExamConfig for this quiz
      examConfig = await prisma.lmsExamConfig.create({
        data: {
          classId,
          subjectId: lesson.subjectId,
          examType: 'LESSON_QUIZ',
          lessonOrder: lesson.orderIndex,
          lessonType: lesson.type,
          questionCount: 10,
          durationMinutes: 15,
          questionStatus: 'NOT_GENERATED',
        },
        include: { subject: true },
      });
    } else if (examConfig.questionStatus === 'PUBLISHED') {
      return NextResponse.json({ success: false, error: 'Quiz đã được công bố cho học sinh, không thể sinh lại đề' }, { status: 409 });
    }

    // Generate quiz questions from lesson content
    const questions = await generateDraftExamQuestions({
      id: examConfig.id,
      subjectId: examConfig.subjectId,
      examType: 'LESSON_QUIZ',
      questionCount: examConfig.questionCount,
      durationMinutes: examConfig.durationMinutes,
      lessonOrder: examConfig.lessonOrder,
      lessonType: examConfig.lessonType,
      questions: null,
      questionStatus: 'NOT_GENERATED',
      startTime: null,
      endTime: null,
      subject: { name: examConfig.subject.name },
    });

    // Update the exam config with questions
    const updatedConfig = await prisma.lmsExamConfig.update({
      where: { id: examConfig.id },
      data: {
        questions: storeAttemptQuestions(questions),
        questionStatus: 'GENERATED',
        publishedAt: null,
      },
    });

    return NextResponse.json({ success: true, data: { ...updatedConfig, questions } });
  } catch (error: any) {
    console.error('LMS AI Generate Lesson Quiz error:', error);
    return lmsErrorResponse(error);
  }
}
