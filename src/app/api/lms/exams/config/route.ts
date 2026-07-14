import { NextRequest, NextResponse } from 'next/server';
import type { LmsUser } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireLmsUser, withClassLock } from '@/lib/lms-auth';
import { hashExamPassword, LmsExamError, lmsExamErrorResponse } from '@/lib/lms-exam';

const EXAM_TYPES = ['LESSON_QUIZ', 'MIDTERM', 'FINAL'] as const;
const SAFE_STUDENT_SELECT = {
  id: true,
  username: true,
  name: true,
  avatar: true,
  role: true,
} as const;

function parseOptionalDate(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') {
    throw new LmsExamError(`${fieldName} không hợp lệ`, 400);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new LmsExamError(`${fieldName} không hợp lệ`, 400);
  }
  return parsed;
}

function serializeConfig<T extends { password: string | null }>(config: T) {
  const { password, ...safeConfig } = config;
  return { ...safeConfig, hasPassword: Boolean(password) };
}

async function assertCanReadConfig(
  actor: LmsUser,
  config: { classId: string; class: { teacherId: string; status: 'ACTIVE' | 'ARCHIVED' } }
) {
  if (actor.role === 'ADMIN') return;
  if (actor.role === 'TEACHER') {
    if (config.class.teacherId !== actor.id) {
      throw new LmsExamError('Bạn không phụ trách lớp của bài thi này', 403);
    }
    return;
  }

  if (config.class.status !== 'ACTIVE') {
    throw new LmsExamError('Lớp học đã được lưu trữ', 403);
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
  if (!enrollment) {
    throw new LmsExamError('Bạn không thuộc lớp của bài thi này', 403);
  }
}

// GET /api/lms/exams/config?classId=xxx&subjectId=xxx&id=xxx
export async function GET(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request);
    const { searchParams } = request.nextUrl;
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');
    const id = searchParams.get('id');

    if (id) {
      const config = await prisma.lmsExamConfig.findUnique({
        where: { id },
        include: {
          subject: true,
          class: true,
          results: {
            where: {
              finishedAt: { not: null },
              ...(actor.role === 'STUDENT' ? { studentId: actor.id } : {}),
            },
            select: {
              id: true,
              examConfigId: true,
              studentId: true,
              score: true,
              correctCount: true,
              totalQuestions: true,
              startedAt: true,
              finishedAt: true,
              student: { select: SAFE_STUDENT_SELECT },
            },
            orderBy: { finishedAt: 'desc' },
          },
          _count: {
            select: { results: { where: { finishedAt: { not: null } } } },
          },
        },
      });
      if (!config) {
        return NextResponse.json(
          { success: false, error: 'Cấu hình bài thi không tồn tại' },
          { status: 404 }
        );
      }

      await assertCanReadConfig(actor, config);
      return NextResponse.json({
        success: true,
        data: serializeConfig(config),
      });
    }

    const baseWhere = {
      ...(classId ? { classId } : {}),
      ...(subjectId ? { subjectId } : {}),
    };
    const where = actor.role === 'ADMIN'
      ? baseWhere
      : actor.role === 'TEACHER'
        ? { ...baseWhere, class: { teacherId: actor.id } }
        : {
            ...baseWhere,
            class: {
              status: 'ACTIVE' as const,
              students: { some: { studentId: actor.id } },
            },
          };

    const configs = await prisma.lmsExamConfig.findMany({
      where,
      include: {
        subject: true,
        class: true,
        _count: {
          select: { results: { where: { finishedAt: { not: null } } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json({
      success: true,
      data: configs.map((config) => serializeConfig(config)),
    });
  } catch (error: unknown) {
    console.error('LMS Exam Config GET error:', error);
    return lmsExamErrorResponse(error);
  }
}

// POST /api/lms/exams/config — Admin hoặc giáo viên phụ trách tạo cấu hình thi
export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json() as Record<string, unknown>;
    const {
      subjectId,
      classId,
      examType,
      questionCount,
      durationMinutes,
      password,
      lessonOrder,
    } = body;

    if (typeof subjectId !== 'string' || !subjectId || typeof classId !== 'string' || !classId) {
      throw new LmsExamError('subjectId và classId là bắt buộc', 400);
    }
    if (typeof examType !== 'string' || !EXAM_TYPES.includes(examType as typeof EXAM_TYPES[number])) {
      throw new LmsExamError('Loại bài thi không hợp lệ', 400);
    }
    if (!Number.isInteger(questionCount) || Number(questionCount) < 5 || Number(questionCount) > 100) {
      throw new LmsExamError('Số câu hỏi phải là số nguyên từ 5 đến 100', 400);
    }
    if (!Number.isInteger(durationMinutes) || Number(durationMinutes) < 5 || Number(durationMinutes) > 180) {
      throw new LmsExamError('Thời gian thi phải là số nguyên từ 5 đến 180 phút', 400);
    }
    if (password !== undefined && password !== null && typeof password !== 'string') {
      throw new LmsExamError('Mật khẩu bài thi không hợp lệ', 400);
    }
    if (typeof password === 'string' && password.length > 128) {
      throw new LmsExamError('Mật khẩu bài thi không được vượt quá 128 ký tự', 400);
    }

    const startTime = parseOptionalDate(body.startTime, 'Thời gian mở bài thi');
    const endTime = parseOptionalDate(body.endTime, 'Thời gian đóng bài thi');
    if (startTime && endTime && startTime >= endTime) {
      throw new LmsExamError('Thời gian đóng phải sau thời gian mở bài thi', 400);
    }
    if (endTime && endTime <= new Date()) {
      throw new LmsExamError('Thời gian đóng bài thi phải ở tương lai', 400);
    }

    const [classData, subject] = await Promise.all([
      prisma.lmsClass.findUnique({
        where: { id: classId },
        select: { id: true, teacherId: true, status: true },
      }),
      prisma.lmsSubject.findUnique({
        where: { id: subjectId },
        select: { id: true, classId: true, theoryLessons: true, practicalLessons: true },
      }),
    ]);

    if (!classData) throw new LmsExamError('Lớp học không tồn tại', 404);
    if (classData.status !== 'ACTIVE') throw new LmsExamError('Không thể tạo bài thi cho lớp đã lưu trữ', 409);
    if (actor.role === 'TEACHER' && classData.teacherId !== actor.id) {
      throw new LmsExamError('Bạn không phụ trách lớp học này', 403);
    }
    if (!subject) throw new LmsExamError('Môn học không tồn tại', 404);
    if (subject.classId !== classData.id) {
      throw new LmsExamError('Môn học không thuộc lớp đã chọn', 400);
    }

    let normalizedLessonOrder: number | null = null;
    if (examType === 'LESSON_QUIZ') {
      const maxLessonOrder = Math.max(subject.theoryLessons, subject.practicalLessons);
      if (
        !Number.isInteger(lessonOrder)
        || Number(lessonOrder) < 1
        || Number(lessonOrder) > maxLessonOrder
      ) {
        throw new LmsExamError(`Buổi học phải là số nguyên từ 1 đến ${maxLessonOrder}`, 400);
      }
      normalizedLessonOrder = Number(lessonOrder);
    } else if (lessonOrder !== undefined && lessonOrder !== null) {
      throw new LmsExamError('lessonOrder chỉ áp dụng cho bài kiểm tra theo buổi học', 400);
    }

    const config = await withClassLock(classId, async (tx) => {
      const lockedClass = await tx.lmsClass.findUnique({
        where: { id: classId },
        select: { teacherId: true, status: true },
      });
      if (!lockedClass || lockedClass.status !== 'ACTIVE') {
        throw new LmsExamError('Không thể tạo bài thi cho lớp đã lưu trữ', 409);
      }
      if (actor.role === 'TEACHER' && lockedClass.teacherId !== actor.id) {
        throw new LmsExamError('Bạn không phụ trách lớp học này', 403);
      }

      return tx.lmsExamConfig.create({
        data: {
          subjectId,
          classId,
          examType: examType as typeof EXAM_TYPES[number],
          questionCount: Number(questionCount),
          durationMinutes: Number(durationMinutes),
          password: typeof password === 'string' && password.length > 0 ? hashExamPassword(password) : null,
          startTime,
          endTime,
          lessonOrder: normalizedLessonOrder,
        },
        include: { subject: true, class: true },
      });
    });

    return NextResponse.json({ success: true, data: serializeConfig(config) }, { status: 201 });
  } catch (error: unknown) {
    console.error('LMS Exam Config POST error:', error);
    return lmsExamErrorResponse(error);
  }
}
