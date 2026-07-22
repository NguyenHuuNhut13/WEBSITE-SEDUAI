import { createHmac, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import type { ExamAnswer, QuizQuestion } from '@/types/lms-types';
import { generateQuizQuestions, gradeQuizAnswers, QuizGenerationUnavailableError } from '@/services/ai-grading-service';
import { LmsAuthError, LmsRequestError } from '@/lib/lms-auth';
import prisma from '@/lib/prisma';

const ATTEMPT_TOKEN_VERSION = 1;
const CLOCK_SKEW_SECONDS = 30;
export const EXAM_GENERATING_MARKER = JSON.stringify({ version: 1, state: 'GENERATING' });

export type PublicExamQuestion = Pick<QuizQuestion, 'index' | 'content' | 'options'>;

export interface ExamAttemptClaims {
  v: typeof ATTEMPT_TOKEN_VERSION;
  examConfigId: string;
  studentId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  questionsTag: string;
}

interface ExamQuestionSource {
  id: string;
  subjectId: string;
  examType: 'LESSON_QUIZ' | 'MIDTERM' | 'FINAL';
  questionCount: number;
  durationMinutes: number;
  lessonOrder: number | null;
  lessonType?: 'THEORY' | 'PRACTICAL' | null;
  questions?: string | null;
  questionStatus?: 'NOT_GENERATED' | 'GENERATED' | 'PUBLISHED';
  startTime: Date | null;
  endTime: Date | null;
  subject: { name: string };
}

export class LmsExamError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'LmsExamError';
  }
}

function getExamSecret() {
  const secret = process.env.LMS_EXAM_SECRET || process.env.DATABASE_URL;
  if (!secret) {
    throw new Error('LMS_EXAM_SECRET hoặc DATABASE_URL chưa được cấu hình');
  }
  return secret;
}

function hmac(value: string) {
  return createHmac('sha256', getExamSecret()).update(value).digest();
}

function safeEqual(left: Buffer, right: Buffer) {
  return left.length === right.length && timingSafeEqual(left, right);
}

function serializeQuestions(questions: QuizQuestion[]) {
  return JSON.stringify(
    questions.map((question) => ({
      index: question.index,
      content: question.content,
      options: question.options,
      correctAnswer: question.correctAnswer,
    }))
  );
}

export function storeAttemptQuestions(questions: QuizQuestion[]) {
  return serializeQuestions(questions);
}

export function readAttemptQuestions(value: string | null): QuizQuestion[] {
  let parsed: unknown;
  try {
    parsed = value ? JSON.parse(value) : null;
  } catch {
    throw new LmsExamError('Bộ câu hỏi của lượt thi không còn hợp lệ', 409);
  }

  const storedQuestions = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    && 'questions' in parsed
    ? (parsed as { questions?: unknown }).questions
    : parsed;
  if (!Array.isArray(storedQuestions) || storedQuestions.length < 1 || storedQuestions.length > 100) {
    throw new LmsExamError('Bộ câu hỏi của lượt thi không còn hợp lệ', 409);
  }

  const seen = new Set<number>();
  return storedQuestions.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new LmsExamError('Bộ câu hỏi của lượt thi không còn hợp lệ', 409);
    }
    const question = item as Record<string, unknown>;
    const index = Number(question.index);
    const options = question.options;
    const correctAnswer = Number(question.correctAnswer);
    if (
      !Number.isInteger(index)
      || seen.has(index)
      || typeof question.content !== 'string'
      || question.content.length > 10_000
      || !Array.isArray(options)
      || options.length < 2
      || options.length > 10
      || options.some((option) => typeof option !== 'string' || option.length > 2_000)
      || !Number.isInteger(correctAnswer)
      || correctAnswer < 0
      || correctAnswer >= options.length
    ) {
      throw new LmsExamError('Bộ câu hỏi của lượt thi không còn hợp lệ', 409);
    }
    seen.add(index);
    return {
      index,
      content: question.content,
      options: options as string[],
      correctAnswer,
    };
  });
}

export function storeCompletedAttempt(questions: QuizQuestion[], gradedAnswers: ExamAnswer[]) {
  return JSON.stringify({
    version: 1,
    questions: JSON.parse(serializeQuestions(questions)) as unknown,
    gradedAnswers,
  });
}

export function readCompletedAnswers(value: string | null): ExamAnswer[] {
  let parsed: unknown;
  try {
    parsed = value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
  const answers = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    && 'gradedAnswers' in parsed
    ? (parsed as { gradedAnswers?: unknown }).gradedAnswers
    : parsed;
  if (!Array.isArray(answers)) return [];
  return answers.flatMap((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const record = item as Record<string, unknown>;
    if (
      !Number.isInteger(record.questionIndex)
      || !Number.isInteger(record.selectedOption)
      || typeof record.isCorrect !== 'boolean'
    ) return [];
    return [{
      questionIndex: Number(record.questionIndex),
      selectedOption: Number(record.selectedOption),
      isCorrect: record.isCorrect,
    }];
  });
}

export function createQuestionsTag(questions: QuizQuestion[]) {
  return hmac(`lms-exam-questions:${serializeQuestions(questions)}`).toString('base64url');
}

export function verifyQuestionsTag(questions: QuizQuestion[], tag: string) {
  const actual = Buffer.from(tag, 'base64url');
  const expected = hmac(`lms-exam-questions:${serializeQuestions(questions)}`);
  return safeEqual(actual, expected);
}

export function toPublicQuestions(questions: QuizQuestion[]): PublicExamQuestion[] {
  return questions.map(({ index, content, options }) => ({ index, content, options }));
}

export function randomizeExamQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const shuffledQuestions = [...questions];
  for (let index = shuffledQuestions.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [shuffledQuestions[index], shuffledQuestions[swapIndex]] = [shuffledQuestions[swapIndex], shuffledQuestions[index]];
  }

  return shuffledQuestions.map((question, questionIndex) => {
    const options = question.options.map((option, originalIndex) => ({ option, originalIndex }));
    for (let index = options.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(index + 1);
      [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
    }
    return {
      ...question,
      index: questionIndex,
      options: options.map(({ option }) => option),
      correctAnswer: options.findIndex(({ originalIndex }) => originalIndex === question.correctAnswer),
    };
  });
}

export async function buildExamQuestions(config: ExamQuestionSource): Promise<QuizQuestion[]> {
  if (!config.questions || config.questionStatus !== 'PUBLISHED') {
    throw new LmsExamError('Đề thi chưa được giáo viên duyệt và công bố.', 409);
  }
  return readAttemptQuestions(config.questions);
}

export async function generateDraftExamQuestions(config: ExamQuestionSource): Promise<QuizQuestion[]> {
  const lessons = await prisma.lmsLesson.findMany({
    where: {
      subjectId: config.subjectId,
      ...(config.examType === 'LESSON_QUIZ' && config.lessonOrder !== null
        ? { orderIndex: config.lessonOrder, ...(config.lessonType ? { type: config.lessonType } : {}) }
        : config.examType === 'MIDTERM'
          ? { orderIndex: { lte: 8 } }
          : {}),
    },
    select: { title: true, objectives: true, preparation: true, activities: true, content: true },
    orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }, { id: 'asc' }],
  });

  const lessonContents = lessons
    .map((lesson) => {
      const parts = [
        lesson.title ? `### Bài học: ${lesson.title}` : '',
        lesson.objectives ? `Mục tiêu bài học: ${lesson.objectives}` : '',
        lesson.preparation ? `Chuẩn bị: ${lesson.preparation}` : '',
        lesson.activities ? `Sườn tiến trình hoạt động: ${lesson.activities}` : '',
        lesson.content?.trim() || '',
      ].filter(Boolean);
      return parts.join('\n\n');
    })
    .filter((content): content is string => Boolean(content));

  let generated;
  try {
    generated = await generateQuizQuestions(
      lessonContents,
      config.questionCount,
      config.subject.name
    );
  } catch (error) {
    if (error instanceof QuizGenerationUnavailableError) {
      throw new LmsExamError(error.message, error.status);
    }
    throw error;
  }

  if (generated.questions.length !== config.questionCount) {
    throw new LmsExamError('Không thể tạo đủ số lượng câu hỏi cho bài thi', 503);
  }

  for (const question of generated.questions) {
    if (
      !Number.isInteger(question.index)
      || !Array.isArray(question.options)
      || question.options.length < 2
      || !Number.isInteger(question.correctAnswer)
      || question.correctAnswer < 0
      || question.correctAnswer >= question.options.length
    ) {
      throw new LmsExamError('Bộ câu hỏi được tạo không hợp lệ', 503);
    }
  }

  return generated.questions;
}

export function assertExamWindow(
  config: Pick<ExamQuestionSource, 'startTime' | 'endTime'>,
  now = new Date()
) {
  if (config.startTime && now < config.startTime) {
    throw new LmsExamError('Bài thi chưa đến thời gian mở', 409);
  }
  if (config.endTime && now >= config.endTime) {
    throw new LmsExamError('Bài thi đã đóng', 409);
  }
}

export function getAttemptExpiry(
  config: Pick<ExamQuestionSource, 'durationMinutes' | 'endTime'>,
  issuedAt = new Date()
) {
  const durationExpiry = new Date(issuedAt.getTime() + config.durationMinutes * 60_000);
  return config.endTime && config.endTime < durationExpiry ? config.endTime : durationExpiry;
}

export function verifyExamPassword(expected: string | null, supplied: unknown) {
  if (!expected) return;
  if (typeof supplied !== 'string') {
    throw new LmsExamError('Mật khẩu bài thi là bắt buộc', 403);
  }

  let expectedDigest: Buffer;
  let suppliedDigest: Buffer;
  if (expected.startsWith('scrypt$')) {
    const parts = expected.split('$');
    if (parts.length !== 3) throw new LmsExamError('Mật khẩu bài thi chưa được cấu hình đúng', 500);
    const salt = Buffer.from(parts[1], 'base64url');
    expectedDigest = Buffer.from(parts[2], 'base64url');
    if (salt.length !== 16 || expectedDigest.length !== 32) {
      throw new LmsExamError('Mật khẩu bài thi chưa được cấu hình đúng', 500);
    }
    suppliedDigest = scryptSync(supplied, salt, expectedDigest.length);
  } else {
    // Compatibility with exam configs created before password hashing.
    expectedDigest = hmac(`lms-exam-password:${expected}`);
    suppliedDigest = hmac(`lms-exam-password:${supplied}`);
  }
  if (!safeEqual(expectedDigest, suppliedDigest)) {
    throw new LmsExamError('Mật khẩu bài thi không đúng', 403);
  }
}

export function hashExamPassword(password: string) {
  const salt = randomBytes(16);
  const digest = scryptSync(password, salt, 32);
  return `scrypt$${salt.toString('base64url')}$${digest.toString('base64url')}`;
}

export function createAttemptToken(input: {
  examConfigId: string;
  studentId: string;
  issuedAt: Date;
  expiresAt: Date;
  questionsTag: string;
}) {
  const claims: ExamAttemptClaims = {
    v: ATTEMPT_TOKEN_VERSION,
    examConfigId: input.examConfigId,
    studentId: input.studentId,
    issuedAt: Math.floor(input.issuedAt.getTime() / 1000),
    expiresAt: Math.ceil(input.expiresAt.getTime() / 1000),
    nonce: randomBytes(16).toString('base64url'),
    questionsTag: input.questionsTag,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = hmac(`lms-exam-attempt:${payload}`).toString('base64url');
  return `${payload}.${signature}`;
}

export function verifyAttemptToken(token: unknown, now = new Date()): ExamAttemptClaims {
  if (typeof token !== 'string' || token.length > 4096) {
    throw new LmsExamError('attemptToken không hợp lệ', 400);
  }

  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new LmsExamError('attemptToken không hợp lệ', 400);
  }

  const [payload, encodedSignature] = parts;
  const signature = Buffer.from(encodedSignature, 'base64url');
  const expectedSignature = hmac(`lms-exam-attempt:${payload}`);
  if (!safeEqual(signature, expectedSignature)) {
    throw new LmsExamError('attemptToken không hợp lệ', 403);
  }

  let claims: ExamAttemptClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as ExamAttemptClaims;
  } catch {
    throw new LmsExamError('attemptToken không hợp lệ', 400);
  }

  if (
    claims.v !== ATTEMPT_TOKEN_VERSION
    || typeof claims.examConfigId !== 'string'
    || typeof claims.studentId !== 'string'
    || !Number.isInteger(claims.issuedAt)
    || !Number.isInteger(claims.expiresAt)
    || typeof claims.nonce !== 'string'
    || claims.nonce.length < 16
    || claims.nonce.length > 128
    || typeof claims.questionsTag !== 'string'
    || claims.questionsTag.length < 32
    || claims.questionsTag.length > 128
    || claims.expiresAt <= claims.issuedAt
  ) {
    throw new LmsExamError('attemptToken không hợp lệ', 400);
  }

  const nowSeconds = Math.floor(now.getTime() / 1000);
  if (claims.issuedAt > nowSeconds + CLOCK_SKEW_SECONDS) {
    throw new LmsExamError('Thời điểm bắt đầu bài thi không hợp lệ', 403);
  }
  // Allow a short transport grace period so an automatic submit fired at
  // 00:00 is not rejected only because the request needed a few seconds to
  // reach the server. The score still uses the signed original expiry.
  if (nowSeconds > claims.expiresAt + CLOCK_SKEW_SECONDS) {
    throw new LmsExamError('Lượt thi đã hết thời gian', 409);
  }

  return claims;
}

export function lmsExamErrorResponse(error: unknown) {
  if (error instanceof LmsAuthError || error instanceof LmsRequestError || error instanceof LmsExamError) {
    return Response.json({ success: false, error: error.message }, { status: error.status });
  }
  return Response.json(
    { success: false, error: 'Lỗi hệ thống LMS. Vui lòng thử lại sau.' },
    { status: 500 }
  );
}

export async function finalizeExpiredExamAttempts(
  scope: Prisma.LmsExamResultWhereInput = {},
) {
  const attempts = await prisma.lmsExamResult.findMany({
    where: { AND: [scope, { finishedAt: null }] },
    select: {
      id: true,
      answers: true,
      startedAt: true,
      examConfig: { select: { durationMinutes: true, endTime: true } },
    },
    orderBy: { startedAt: 'asc' },
    take: 500,
  });

  const now = Date.now();
  let finalized = 0;
  for (const attempt of attempts) {
    if (attempt.answers === EXAM_GENERATING_MARKER) {
      if (now - attempt.startedAt.getTime() > 2 * 60_000) {
        await prisma.lmsExamResult.deleteMany({
          where: { id: attempt.id, finishedAt: null, answers: EXAM_GENERATING_MARKER },
        });
      }
      continue;
    }

    const expiresAt = getAttemptExpiry(attempt.examConfig, attempt.startedAt);
    if (now <= expiresAt.getTime() + CLOCK_SKEW_SECONDS * 1_000) continue;
    try {
      const questions = readAttemptQuestions(attempt.answers);
      const grade = gradeQuizAnswers(questions, []);
      const saved = await prisma.lmsExamResult.updateMany({
        where: { id: attempt.id, finishedAt: null },
        data: {
          score: grade.score,
          correctCount: grade.correctCount,
          totalQuestions: grade.totalQuestions,
          answers: storeCompletedAttempt(questions, grade.gradedAnswers),
          finishedAt: expiresAt,
        },
      });
      finalized += saved.count;
    } catch (error) {
      console.error('Unable to finalize expired LMS exam attempt:', attempt.id, error);
    }
  }
  return finalized;
}
