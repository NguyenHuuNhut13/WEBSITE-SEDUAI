import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireLmsUser } from '@/lib/lms-auth';
import { finalizeExpiredExamAttempts, LmsExamError, lmsExamErrorResponse } from '@/lib/lms-exam';

type RouteContext = { params: Promise<{ classId: string }> };

interface StudentScore {
  name: string;
  avatar?: string;
  totalScore: number;
  count: number;
  submissions: number;
}

function percentage(completed: number, expected: number) {
  if (expected <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / expected) * 100)));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

// GET /api/lms/dashboard/[classId] — thống kê dành cho Admin/Giáo viên phụ trách
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const { classId } = await context.params;

    const accessClass = await prisma.lmsClass.findUnique({
      where: { id: classId },
      select: { id: true, teacherId: true },
    });
    if (!accessClass) {
      return NextResponse.json(
        { success: false, error: 'Lớp học không tồn tại' },
        { status: 404 }
      );
    }
    if (actor.role === 'TEACHER' && accessClass.teacherId !== actor.id) {
      throw new LmsExamError('Bạn không phụ trách lớp học này', 403);
    }

    await finalizeExpiredExamAttempts({ examConfig: { classId } });

    const classData = await prisma.lmsClass.findUnique({
      where: { id: classId },
      select: {
        id: true,
        name: true,
        status: true,
        students: {
          select: {
            studentId: true,
            student: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { enrolledAt: 'asc' },
        },
        subjects: {
          select: {
            id: true,
            name: true,
            theoryLessons: true,
            practicalLessons: true,
            lessons: {
              select: {
                id: true,
                content: true,
                assignments: {
                  select: {
                    id: true,
                    submissions: {
                      select: {
                        studentId: true,
                        grade: true,
                        status: true,
                      },
                    },
                  },
                },
              },
            },
            examConfigs: {
              select: {
                id: true,
                results: {
                  where: { finishedAt: { not: null } },
                  select: {
                    studentId: true,
                    score: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!classData) {
      return NextResponse.json(
        { success: false, error: 'Lớp học không tồn tại' },
        { status: 404 }
      );
    }

    const enrolledStudentIds = new Set(classData.students.map(({ studentId }) => studentId));
    const totalStudents = enrolledStudentIds.size;
    const studentScores = new Map<string, StudentScore>(
      classData.students.map(({ studentId, student }) => [
        studentId,
        {
          name: student.name,
          avatar: student.avatar || undefined,
          totalScore: 0,
          count: 0,
          submissions: 0,
        },
      ])
    );

    const subjectStats = classData.subjects.map((subject) => {
      const totalLessons = subject.theoryLessons + subject.practicalLessons;
      const completedLessons = subject.lessons.filter((lesson) => Boolean(lesson.content?.trim())).length;
      const assignments = subject.lessons.flatMap((lesson) => lesson.assignments);
      const submissions = assignments
        .flatMap((assignment) => assignment.submissions)
        .filter((submission) => enrolledStudentIds.has(submission.studentId));
      const reviewedGrades = submissions
        .filter((submission) => submission.status === 'REVIEWED' && Number.isFinite(submission.grade))
        .map((submission) => Number(submission.grade));

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        averageScore: average(reviewedGrades),
        completedLessons,
        totalLessons,
        submissionRate: percentage(submissions.length, assignments.length * totalStudents),
      };
    });

    for (const subject of classData.subjects) {
      for (const lesson of subject.lessons) {
        for (const assignment of lesson.assignments) {
          for (const submission of assignment.submissions) {
            const score = studentScores.get(submission.studentId);
            if (!score) continue;
            score.submissions += 1;
            if (submission.status === 'REVIEWED' && Number.isFinite(submission.grade)) {
              score.totalScore += Number(submission.grade);
              score.count += 1;
            }
          }
        }
      }

      for (const exam of subject.examConfigs) {
        for (const result of exam.results) {
          const score = studentScores.get(result.studentId);
          if (!score || !Number.isFinite(result.score)) continue;
          score.totalScore += result.score;
          score.count += 1;
        }
      }
    }

    const leaderboard = Array.from(studentScores.entries())
      .map(([studentId, score]) => ({
        studentId,
        studentName: score.name,
        studentAvatar: score.avatar,
        averageScore: score.count > 0
          ? Math.round((score.totalScore / score.count) * 10) / 10
          : 0,
        totalSubmissions: score.submissions,
        rank: 0,
      }))
      .sort((left, right) => right.averageScore - left.averageScore || left.studentName.localeCompare(right.studentName, 'vi'))
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    const assignments = classData.subjects.flatMap((subject) =>
      subject.lessons.flatMap((lesson) => lesson.assignments)
    );
    const submissions = assignments
      .flatMap((assignment) => assignment.submissions)
      .filter((submission) => enrolledStudentIds.has(submission.studentId));
    const examConfigs = classData.subjects.flatMap((subject) => subject.examConfigs);
    const examResults = examConfigs
      .flatMap((exam) => exam.results)
      .filter((result) => enrolledStudentIds.has(result.studentId));

    return NextResponse.json({
      success: true,
      data: {
        classId,
        className: classData.name,
        classStatus: classData.status,
        totalStudents,
        subjectStats,
        leaderboard,
        assignmentCompletion: percentage(submissions.length, assignments.length * totalStudents),
        examCompletion: percentage(examResults.length, examConfigs.length * totalStudents),
      },
    });
  } catch (error: unknown) {
    console.error('LMS Dashboard GET error:', error);
    return lmsExamErrorResponse(error);
  }
}
