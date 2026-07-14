import { NextRequest, NextResponse } from 'next/server';
import type { QuizQuestion } from '@/types/lms-types';
import prisma from '@/lib/prisma';
import { requireLmsUser } from '@/lib/lms-auth';
import { consumeRateLimit } from '@/lib/rate-limit';
import { gradeQuizAnswers } from '@/services/ai-grading-service';
import {
  assertExamWindow,
  buildExamQuestions,
  createAttemptToken,
  createQuestionsTag,
  EXAM_GENERATING_MARKER,
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

const GENERATION_STALE_MS = 2 * 60_000;

interface StoredAttempt {
  id: string;
  startedAt: Date;
  finishedAt: Date | null;
  totalQuestions: number;
  answers: string | null;
}

type AttemptDecision =
  | { state: 'ready'; attempt: StoredAttempt; questions: QuizQuestion[] }
  | { state: 'generate'; attempt: StoredAttempt }
  | { state: 'wait' }
  | { state: 'completed' };

const attemptSelect = {
  id: true,
  startedAt: true,
  finishedAt: true,
  totalQuestions: true,
  answers: true,
} as const;

// POST /api/lms/exams/generate — bắt đầu hoặc tiếp tục một lượt thi đã xác thực
export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['STUDENT']);
    const body = await request.json() as Record<string, unknown>;
    const { examConfigId, password } = body;

    if (typeof examConfigId !== 'string' || !examConfigId) {
      throw new LmsExamError('examConfigId là bắt buộc', 400);
    }
    if (password !== undefined && typeof password !== 'string') {
      throw new LmsExamError('Mật khẩu bài thi không hợp lệ', 400);
    }
    if (typeof password === 'string' && password.length > 128) {
      throw new LmsExamError('Mật khẩu bài thi không được vượt quá 128 ký tự', 400);
    }
    const rateLimit = consumeRateLimit(`exam-start:${actor.id}:${examConfigId}`, 10, 60_000);
    if (!rateLimit.allowed) {
      throw new LmsExamError(`Bạn đã thử mở bài thi quá nhiều lần. Vui lòng chờ ${rateLimit.retryAfterSeconds} giây.`, 429);
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
    if (
      !Number.isInteger(config.questionCount)
      || config.questionCount < 1
      || config.questionCount > 100
      || !Number.isInteger(config.durationMinutes)
      || config.durationMinutes < 1
      || config.durationMinutes > 180
    ) {
      throw new LmsExamError('Cấu hình số câu hỏi hoặc thời gian thi không hợp lệ', 409);
    }
    const enrollment = await prisma.lmsClassStudent.findUnique({
      where: {
        classId_studentId: { classId: config.classId, studentId: actor.id },
      },
      select: { id: true },
    });
    if (!enrollment) throw new LmsExamError('Bạn không thuộc lớp của bài thi này', 403);
    verifyExamPassword(config.password, password);

    const decision = await prisma.$transaction<AttemptDecision>(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${config.classId}))`;
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`exam-bank:${config.id}`}))`;

      const [lockedClass, enrollment] = await Promise.all([
        tx.lmsClass.findUnique({ where: { id: config.classId }, select: { status: true } }),
        tx.lmsClassStudent.findUnique({
          where: {
            classId_studentId: { classId: config.classId, studentId: actor.id },
          },
          select: { id: true },
        }),
      ]);
      if (!lockedClass || lockedClass.status !== 'ACTIVE') {
        throw new LmsExamError('Lớp học đã được lưu trữ', 409);
      }
      if (!enrollment) throw new LmsExamError('Bạn không thuộc lớp của bài thi này', 403);

      let ownAttempt = await tx.lmsExamResult.findUnique({
        where: {
          examConfigId_studentId: { examConfigId: config.id, studentId: actor.id },
        },
        select: attemptSelect,
      });
      if (ownAttempt?.finishedAt) return { state: 'completed' };
      if (ownAttempt && ownAttempt.answers === EXAM_GENERATING_MARKER) {
        if (Date.now() - ownAttempt.startedAt.getTime() < GENERATION_STALE_MS) {
          return { state: 'wait' };
        }
        await tx.lmsExamResult.delete({ where: { id: ownAttempt.id } });
        ownAttempt = null;
      }
      if (ownAttempt) {
        return {
          state: 'ready',
          attempt: ownAttempt,
          questions: readAttemptQuestions(ownAttempt.answers),
        };
      }

      const generatingAttempt = await tx.lmsExamResult.findFirst({
        where: { examConfigId: config.id, finishedAt: null, answers: EXAM_GENERATING_MARKER },
        select: attemptSelect,
        orderBy: { startedAt: 'desc' },
      });
      if (generatingAttempt) {
        if (Date.now() - generatingAttempt.startedAt.getTime() < GENERATION_STALE_MS) {
          return { state: 'wait' };
        }
        await tx.lmsExamResult.delete({ where: { id: generatingAttempt.id } });
      }

      const bankCandidates = await tx.lmsExamResult.findMany({
        where: { examConfigId: config.id, answers: { not: null } },
        select: attemptSelect,
        orderBy: { startedAt: 'desc' },
        take: 20,
      });
      let bank: QuizQuestion[] | null = null;
      for (const candidate of bankCandidates) {
        if (candidate.answers === EXAM_GENERATING_MARKER) continue;
        try {
          const candidateQuestions = readAttemptQuestions(candidate.answers);
          if (candidateQuestions.length === config.questionCount) {
            bank = candidateQuestions;
            break;
          }
        } catch {
          // Legacy rows only stored graded answers and cannot seed a bank.
        }
      }

      assertExamWindow(config, new Date());
      const startedAt = new Date();
      if (bank) {
        const questions = randomizeExamQuestions(bank);
        const attempt = await tx.lmsExamResult.create({
          data: {
            examConfigId: config.id,
            studentId: actor.id,
            score: 0,
            correctCount: 0,
            totalQuestions: questions.length,
            answers: storeAttemptQuestions(questions),
            startedAt,
            finishedAt: null,
          },
          select: attemptSelect,
        });
        return { state: 'ready', attempt, questions };
      }

      const attempt = await tx.lmsExamResult.create({
        data: {
          examConfigId: config.id,
          studentId: actor.id,
          score: 0,
          correctCount: 0,
          totalQuestions: config.questionCount,
          answers: EXAM_GENERATING_MARKER,
          startedAt,
          finishedAt: null,
        },
        select: attemptSelect,
      });
      return { state: 'generate', attempt };
    });

    if (decision.state === 'completed') {
      throw new LmsExamError('Bạn đã hoàn thành bài thi này', 409);
    }
    if (decision.state === 'wait') {
      throw new LmsExamError('SEDUAI đang tạo đề thi. Vui lòng chờ vài giây rồi thử lại.', 409);
    }

    let attempt = decision.attempt;
    let questions: QuizQuestion[];
    if (decision.state === 'generate') {
      try {
        questions = await buildExamQuestions(config);
        const startedAt = await prisma.$transaction(async (tx) => {
          await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${config.classId}))`;
          await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`exam-bank:${config.id}`}))`;
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
            throw new LmsExamError('Quyền tham gia bài thi đã thay đổi trong lúc tạo đề', 403);
          }
          const actualStart = new Date();
          assertExamWindow(config, actualStart);
          const actualExpiry = getAttemptExpiry(config, actualStart);
          if (actualExpiry.getTime() - actualStart.getTime() < 5_000) {
            throw new LmsExamError('Bài thi sắp đóng, không đủ thời gian để bắt đầu lượt mới', 409);
          }
          const saved = await tx.lmsExamResult.updateMany({
            where: { id: attempt.id, finishedAt: null, answers: EXAM_GENERATING_MARKER },
            data: {
              answers: storeAttemptQuestions(questions),
              totalQuestions: questions.length,
              startedAt: actualStart,
            },
          });
          if (saved.count !== 1) {
            throw new LmsExamError('Lượt tạo đề đã thay đổi. Vui lòng thử lại.', 409);
          }
          return actualStart;
        });
        attempt = { ...attempt, answers: storeAttemptQuestions(questions), startedAt };
      } catch (error) {
        await prisma.lmsExamResult.deleteMany({
          where: { id: attempt.id, finishedAt: null, answers: EXAM_GENERATING_MARKER },
        });
        throw error;
      }
    } else {
      questions = decision.questions;
    }

    if (attempt.totalQuestions !== questions.length) {
      throw new LmsExamError('Dữ liệu lượt thi không còn nhất quán', 409);
    }

    const expiresAt = getAttemptExpiry(config, attempt.startedAt);
    if (Date.now() > expiresAt.getTime() + 30_000) {
      const expiredGrade = gradeQuizAnswers(questions, []);
      await prisma.lmsExamResult.updateMany({
        where: { id: attempt.id, finishedAt: null },
        data: {
          score: expiredGrade.score,
          correctCount: expiredGrade.correctCount,
          totalQuestions: expiredGrade.totalQuestions,
          answers: storeCompletedAttempt(questions, expiredGrade.gradedAnswers),
          finishedAt: expiresAt,
        },
      });
      throw new LmsExamError('Lượt thi đã hết thời gian và được ghi nhận là chưa hoàn thành.', 409);
    }

    const attemptToken = createAttemptToken({
      examConfigId: config.id,
      studentId: actor.id,
      issuedAt: attempt.startedAt,
      expiresAt,
      questionsTag: createQuestionsTag(questions),
    });
    return NextResponse.json({
      success: true,
      data: {
        questions: toPublicQuestions(questions),
        attemptToken,
        startedAt: attempt.startedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        durationMinutes: config.durationMinutes,
      },
    });
  } catch (error: unknown) {
    console.error('LMS Exam Generate error:', error);
    return lmsExamErrorResponse(error);
  }
}
