import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireLmsUser } from '@/lib/lms-auth';
import { gradeQuizAnswers } from '@/services/ai-grading-service';
import {
  finalizeExpiredExamAttempts,
  LmsExamError,
  lmsExamErrorResponse,
  readCompletedAnswers,
  readAttemptQuestions,
  storeCompletedAttempt,
  verifyAttemptToken,
  verifyQuestionsTag,
} from '@/lib/lms-exam';

const SAFE_STUDENT_SELECT = {
  id: true,
  username: true,
  name: true,
  avatar: true,
  role: true,
} as const;

function parseAnswers(
  value: unknown,
  questions: { index: number; options: string[] }[]
): { questionIndex: number; selectedOption: number }[] {
  if (!Array.isArray(value)) {
    throw new LmsExamError('answers phải là một danh sách đáp án', 400);
  }
  if (value.length > questions.length) {
    throw new LmsExamError('Số lượng đáp án vượt quá số câu hỏi', 400);
  }

  const questionByIndex = new Map(questions.map((question) => [question.index, question]));
  const seen = new Set<number>();
  return value.map((answer) => {
    if (typeof answer !== 'object' || answer === null || Array.isArray(answer)) {
      throw new LmsExamError('Đáp án không hợp lệ', 400);
    }

    const questionIndex = 'questionIndex' in answer ? answer.questionIndex : undefined;
    const selectedOption = 'selectedOption' in answer ? answer.selectedOption : undefined;
    if (!Number.isInteger(questionIndex) || !Number.isInteger(selectedOption)) {
      throw new LmsExamError('Chỉ số câu hỏi hoặc lựa chọn không hợp lệ', 400);
    }

    const normalizedQuestionIndex = Number(questionIndex);
    const normalizedSelectedOption = Number(selectedOption);
    const question = questionByIndex.get(normalizedQuestionIndex);
    if (!question) throw new LmsExamError('Đáp án chứa câu hỏi không thuộc đề thi', 400);
    if (seen.has(normalizedQuestionIndex)) {
      throw new LmsExamError('Một câu hỏi không được gửi nhiều đáp án', 400);
    }
    if (normalizedSelectedOption < -1 || normalizedSelectedOption >= question.options.length) {
      throw new LmsExamError('Lựa chọn đáp án không hợp lệ', 400);
    }

    seen.add(normalizedQuestionIndex);
    return {
      questionIndex: normalizedQuestionIndex,
      selectedOption: normalizedSelectedOption,
    };
  });
}

// GET /api/lms/exams/results?examConfigId=xxx&studentId=xxx&classId=xxx
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const { searchParams } = request.nextUrl;
    const examConfigId = searchParams.get('examConfigId');
    const requestedStudentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    if (actor.role === 'STUDENT' && requestedStudentId && requestedStudentId !== actor.id) {
      throw new LmsExamError('Bạn chỉ được xem kết quả thi của chính mình', 403);
    }

    const attemptScope: Prisma.LmsExamResultWhereInput = {
      ...(examConfigId ? { examConfigId } : {}),
      ...(actor.role === 'STUDENT'
        ? { studentId: actor.id }
        : requestedStudentId
          ? { studentId: requestedStudentId }
          : {}),
    };
    const examScope: Prisma.LmsExamConfigWhereInput = {
      ...(classId ? { classId } : {}),
    };
    if (actor.role === 'TEACHER') {
      examScope.class = { teacherId: actor.id };
    } else if (actor.role === 'STUDENT') {
      examScope.class = {
        status: 'ACTIVE',
        students: { some: { studentId: actor.id } },
      };
    }
    if (Object.keys(examScope).length > 0) attemptScope.examConfig = examScope;
    await finalizeExpiredExamAttempts(attemptScope);
    const where: Prisma.LmsExamResultWhereInput = {
      ...attemptScope,
      finishedAt: { not: null },
    };

    const results = await prisma.lmsExamResult.findMany({
      where,
      select: {
        id: true,
        examConfigId: true,
        studentId: true,
        score: true,
        correctCount: true,
        totalQuestions: true,
        answers: true,
        startedAt: true,
        finishedAt: true,
        student: { select: SAFE_STUDENT_SELECT },
        examConfig: {
          select: {
            id: true,
            subjectId: true,
            classId: true,
            examType: true,
            questionCount: true,
            durationMinutes: true,
            startTime: true,
            endTime: true,
            lessonOrder: true,
            subject: { select: { id: true, name: true, classId: true } },
            class: { select: { id: true, name: true, status: true, teacherId: true } },
          },
        },
      },
      orderBy: { finishedAt: 'desc' },
      take: 500,
    });

    const data = results.map((result) => ({
      ...result,
      answers: JSON.stringify(readCompletedAnswers(result.answers)),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error('LMS Exam Results GET error:', error);
    return lmsExamErrorResponse(error);
  }
}

// POST /api/lms/exams/results — học sinh gửi lựa chọn, server xác minh và tự chấm
export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['STUDENT']);
    const body = await request.json() as Record<string, unknown>;
    const { examConfigId, answers, attemptToken } = body;

    if (typeof examConfigId !== 'string' || !examConfigId) {
      throw new LmsExamError('examConfigId là bắt buộc', 400);
    }

    const now = new Date();
    const claims = verifyAttemptToken(attemptToken, now);
    if (claims.examConfigId !== examConfigId || claims.studentId !== actor.id) {
      throw new LmsExamError('attemptToken không thuộc lượt thi hiện tại', 403);
    }

    const config = await prisma.lmsExamConfig.findUnique({
      where: { id: examConfigId },
      include: {
        subject: { select: { id: true, classId: true, name: true } },
        class: { select: { id: true, status: true } },
      },
    });
    if (!config) throw new LmsExamError('Cấu hình bài thi không tồn tại', 404);
    if (config.subject.classId !== config.classId) {
      throw new LmsExamError('Cấu hình bài thi không nhất quán với lớp học', 409);
    }
    if (config.class.status !== 'ACTIVE') {
      throw new LmsExamError('Lớp học đã được lưu trữ', 409);
    }

    const enrollment = await prisma.lmsClassStudent.findUnique({
      where: {
        classId_studentId: {
          classId: config.classId,
          studentId: actor.id,
        },
      },
      select: { id: true },
    });
    if (!enrollment) throw new LmsExamError('Bạn không thuộc lớp của bài thi này', 403);

    const attempt = await prisma.lmsExamResult.findUnique({
      where: {
        examConfigId_studentId: {
          examConfigId: config.id,
          studentId: actor.id,
        },
      },
      select: {
        id: true,
        startedAt: true,
        finishedAt: true,
        totalQuestions: true,
        answers: true,
      },
    });
    if (!attempt) {
      throw new LmsExamError('Không tìm thấy lượt thi đang hoạt động. Vui lòng bắt đầu bài thi trước.', 409);
    }
    if (attempt.finishedAt) {
      throw new LmsExamError('Kết quả bài thi đã được ghi nhận trước đó', 409);
    }
    if (Math.floor(attempt.startedAt.getTime() / 1000) !== claims.issuedAt) {
      throw new LmsExamError('attemptToken không thuộc lượt thi đang hoạt động', 403);
    }

    const questions = readAttemptQuestions(attempt.answers);
    if (attempt.totalQuestions !== questions.length) {
      throw new LmsExamError('Dữ liệu lượt thi không còn nhất quán', 409);
    }
    if (!verifyQuestionsTag(questions, claims.questionsTag)) {
      throw new LmsExamError('Đề thi không khớp với lượt thi đã bắt đầu', 409);
    }
    const studentAnswers = parseAnswers(answers, questions);
    const graded = gradeQuizAnswers(questions, studentAnswers);
    const saved = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${config.classId}))`;
      const [activeClass, activeEnrollment] = await Promise.all([
        tx.lmsClass.findFirst({
          where: { id: config.classId, status: 'ACTIVE' },
          select: { id: true },
        }),
        tx.lmsClassStudent.findUnique({
          where: { classId_studentId: { classId: config.classId, studentId: actor.id } },
          select: { id: true },
        }),
      ]);
      if (!activeClass || !activeEnrollment) {
        throw new LmsExamError('Quyền tham gia bài thi đã thay đổi trước khi nộp bài', 403);
      }
      return tx.lmsExamResult.updateMany({
        where: {
          id: attempt.id,
          examConfigId: config.id,
          studentId: actor.id,
          finishedAt: null,
          startedAt: attempt.startedAt,
          answers: attempt.answers,
        },
        data: {
          score: graded.score,
          correctCount: graded.correctCount,
          totalQuestions: graded.totalQuestions,
          answers: storeCompletedAttempt(questions, graded.gradedAnswers),
          finishedAt: now,
        },
      });
    });
    if (saved.count !== 1) {
      throw new LmsExamError('Kết quả bài thi đã được ghi nhận hoặc lượt thi đã thay đổi', 409);
    }

    const result = await prisma.lmsExamResult.findUnique({
      where: { id: attempt.id },
      select: {
        id: true,
        examConfigId: true,
        studentId: true,
        score: true,
        correctCount: true,
        totalQuestions: true,
        answers: true,
        startedAt: true,
        finishedAt: true,
        student: { select: SAFE_STUDENT_SELECT },
        examConfig: {
          select: {
            id: true,
            subjectId: true,
            classId: true,
            examType: true,
            subject: { select: { id: true, name: true, classId: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: result ? {
        ...result,
        answers: JSON.stringify(readCompletedAnswers(result.answers)),
      } : null,
    });
  } catch (error: unknown) {
    console.error('LMS Exam Results POST error:', error);
    return lmsExamErrorResponse(error);
  }
}
