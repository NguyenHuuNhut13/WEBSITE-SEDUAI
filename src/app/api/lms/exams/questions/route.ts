import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LmsExamError, lmsExamErrorResponse, generateDraftExamQuestions, readAttemptQuestions, storeAttemptQuestions } from '@/lib/lms-exam';
import { requireLmsUser } from '@/lib/lms-auth';

export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const examConfigId = request.nextUrl.searchParams.get('examConfigId');
    if (!examConfigId) throw new LmsExamError('examConfigId là bắt buộc', 400);
    const config = await prisma.lmsExamConfig.findUnique({ where: { id: examConfigId }, include: { subject: true, class: true } });
    if (!config) throw new LmsExamError('Cấu hình bài thi không tồn tại', 404);
    if (actor.role === 'TEACHER' && config.class.teacherId !== actor.id) throw new LmsExamError('Bạn không phụ trách bài thi này', 403);
    return NextResponse.json({ success: true, data: { ...config, password: undefined, questions: config.questions ? readAttemptQuestions(config.questions) : [] } });
  } catch (error) {
    return lmsExamErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json() as Record<string, unknown>;
    const examConfigId = typeof body.examConfigId === 'string' ? body.examConfigId : '';
    const action = body.action === 'publish' ? 'publish' : body.action === 'generate' ? 'generate' : '';
    if (!examConfigId || !action) throw new LmsExamError('examConfigId và action là bắt buộc', 400);

    const config = await prisma.lmsExamConfig.findUnique({ where: { id: examConfigId }, include: { subject: true, class: true } });
    if (!config) throw new LmsExamError('Cấu hình bài thi không tồn tại', 404);
    if (config.class.status !== 'ACTIVE') throw new LmsExamError('Lớp học đã được lưu trữ', 409);
    if (actor.role === 'TEACHER' && config.class.teacherId !== actor.id) throw new LmsExamError('Bạn không phụ trách bài thi này', 403);

    if (action === 'generate') {
      // AI generation requires a server-side provider key. Return an actionable
      // error before loading lesson content so the teacher can fix deployment
      // configuration instead of seeing a generic 503.
      if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
        throw new LmsExamError(
          'Chưa cấu hình nhà cung cấp AI. Hãy thêm GEMINI_API_KEY hoặc GROQ_API_KEY vào biến môi trường server, sau đó khởi động/deploy lại.',
          503,
        );
      }
      const questions = await generateDraftExamQuestions(config);
      const updated = await prisma.lmsExamConfig.update({
        where: { id: config.id },
        data: { questions: storeAttemptQuestions(questions), questionStatus: 'GENERATED', publishedAt: null },
      });
      return NextResponse.json({ success: true, data: { ...updated, questions } });
    }

    if (!config.questions) throw new LmsExamError('Cần sinh đề trước khi công bố', 409);
    const questions = readAttemptQuestions(config.questions);
    if (questions.length !== config.questionCount) throw new LmsExamError('Số câu hỏi trong đề không khớp cấu hình', 409);
    const updated = await prisma.lmsExamConfig.update({
      where: { id: config.id },
      data: { questionStatus: 'PUBLISHED', publishedAt: new Date() },
    });
    return NextResponse.json({ success: true, data: { ...updated, questions } });
  } catch (error) {
    return lmsExamErrorResponse(error);
  }
}
