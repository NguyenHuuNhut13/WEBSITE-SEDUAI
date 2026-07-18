import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireLmsUser } from '@/lib/lms-auth';
import { consumeRateLimit } from '@/lib/rate-limit';
import { gradeQuizAnswers } from '@/services/ai-grading-service';
import {
  assertExamWindow,
  createAttemptToken,
  createQuestionsTag,
  getAttemptExpiry,
  LmsExamError,
  lmsExamErrorResponse,
  randomizeExamQuestions,
  readAttemptQuestions,
  storeAttemptQuestions,
  storeCompletedAttempt,
  toPublicQuestions,
  verifyExamPassword,
} from '@/lib/lms-exam';

const attemptSelect = {
  id: true,
  startedAt: true,
  finishedAt: true,
  totalQuestions: true,
  answers: true,
} as const;

export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['STUDENT']);
    const body = await request.json() as Record<string, unknown>;
    const examConfigId = typeof body.examConfigId === 'string' ? body.examConfigId : '';
    const password = body.password;
    if (!examConfigId) throw new LmsExamError('examConfigId là bắt buộc', 400);
    if (password !== undefined && typeof password !== 'string') throw new LmsExamError('Mật khẩu bài thi không hợp lệ', 400);
    const rateLimit = consumeRateLimit(`exam-start:${actor.id}:${examConfigId}`, 10, 60_000);
    if (!rateLimit.allowed) throw new LmsExamError(`Bạn đã thử mở bài thi quá nhiều lần. Vui lòng chờ ${rateLimit.retryAfterSeconds} giây.`, 429);

    const config = await prisma.lmsExamConfig.findUnique({
      where: { id: examConfigId },
      include: { subject: { select: { id: true, classId: true, name: true } }, class: { select: { id: true, status: true } } },
    });
    if (!config) throw new LmsExamError('Cấu hình bài thi không tồn tại', 404);
    if (config.subject.classId !== config.classId) throw new LmsExamError('Cấu hình bài thi không nhất quán với lớp học', 409);
    if (config.class.status !== 'ACTIVE') throw new LmsExamError('Lớp học đã được lưu trữ', 409);
    if (!Number.isInteger(config.questionCount) || !Number.isInteger(config.durationMinutes) || config.durationMinutes < 1 || config.durationMinutes > 180) {
      throw new LmsExamError('Cấu hình bài thi không hợp lệ', 409);
    }
    if (config.questionStatus !== 'PUBLISHED' || !config.questions) throw new LmsExamError('Đề thi chưa được giáo viên duyệt và công bố.', 409);
    const publishedQuestions = readAttemptQuestions(config.questions);
    if (publishedQuestions.length !== config.questionCount) throw new LmsExamError('Đề thi đã công bố không khớp số câu hỏi cấu hình.', 409);

    const enrollment = await prisma.lmsClassStudent.findUnique({ where: { classId_studentId: { classId: config.classId, studentId: actor.id } }, select: { id: true } });
    if (!enrollment) throw new LmsExamError('Bạn không thuộc lớp của bài thi này', 403);
    verifyExamPassword(config.password, password);
    assertExamWindow(config, new Date());

    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${config.classId})) IS NULL`;
      const existing = await tx.lmsExamResult.findUnique({ where: { examConfigId_studentId: { examConfigId: config.id, studentId: actor.id } }, select: attemptSelect });
      if (existing?.finishedAt) throw new LmsExamError('Bạn đã hoàn thành bài thi này', 409);
      if (existing) return { attempt: existing, questions: readAttemptQuestions(existing.answers) };
      const startedAt = new Date();
      const questions = randomizeExamQuestions(publishedQuestions);
      const attempt = await tx.lmsExamResult.create({
        data: { examConfigId: config.id, studentId: actor.id, score: 0, correctCount: 0, totalQuestions: questions.length, answers: storeAttemptQuestions(questions), startedAt },
        select: attemptSelect,
      });
      return { attempt, questions };
    });

    const expiresAt = getAttemptExpiry(config, result.attempt.startedAt);
    if (Date.now() > expiresAt.getTime() + 30_000) {
      const expiredGrade = gradeQuizAnswers(result.questions, []);
      await prisma.lmsExamResult.updateMany({ where: { id: result.attempt.id, finishedAt: null }, data: { score: expiredGrade.score, correctCount: expiredGrade.correctCount, totalQuestions: expiredGrade.totalQuestions, answers: storeCompletedAttempt(result.questions, expiredGrade.gradedAnswers), finishedAt: expiresAt } });
      throw new LmsExamError('Lượt thi đã hết thời gian và được ghi nhận là chưa hoàn thành.', 409);
    }

    const attemptToken = createAttemptToken({ examConfigId: config.id, studentId: actor.id, issuedAt: result.attempt.startedAt, expiresAt, questionsTag: createQuestionsTag(result.questions) });
    return NextResponse.json({ success: true, data: { questions: toPublicQuestions(result.questions), attemptToken, startedAt: result.attempt.startedAt.toISOString(), expiresAt: expiresAt.toISOString(), durationMinutes: config.durationMinutes } });
  } catch (error) {
    return lmsExamErrorResponse(error);
  }
}
