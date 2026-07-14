import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = { params: Promise<{ classId: string }> };

// GET /api/lms/dashboard/[classId] — Aggregated stats for teacher dashboard
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { classId } = await context.params;

    // Lấy thông tin lớp
    const classData = await prisma.lmsClass.findUnique({
      where: { id: classId },
      include: {
        teacher: true,
        students: { include: { student: true } },
        subjects: {
          include: {
            lessons: {
              include: {
                assignments: {
                  include: {
                    submissions: true,
                  },
                },
              },
            },
            examConfigs: {
              include: {
                results: { include: { student: true } },
              },
            },
          },
        },
      },
    });

    if (!classData) {
      return NextResponse.json({ success: false, error: 'Lớp không tồn tại' }, { status: 404 });
    }

    const totalStudents = classData.students.length;

    // Tính toán stats từng môn
    const subjectStats = classData.subjects.map((subject: any) => {
      const totalLessons = subject.theoryLessons + subject.practicalLessons;
      const completedLessons = subject.lessons.filter((l: any) => l.content && l.content.length > 0).length;

      // Tỷ lệ nộp bài
      const allAssignments = subject.lessons.flatMap((l: any) => l.assignments);
      const allSubmissions = allAssignments.flatMap((a: any) => a.submissions);
      const expectedSubmissions = allAssignments.length * totalStudents;
      const submissionRate = expectedSubmissions > 0 ? Math.round((allSubmissions.length / expectedSubmissions) * 100) : 0;

      // Điểm TB
      const gradedSubmissions = allSubmissions.filter((s: any) => s.grade !== null);
      const avgScore = gradedSubmissions.length > 0
        ? Math.round((gradedSubmissions.reduce((sum: number, s: any) => sum + (s.grade || 0), 0) / gradedSubmissions.length) * 10) / 10
        : 0;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        averageScore: avgScore,
        completedLessons,
        totalLessons,
        submissionRate,
      };
    });

    // Bảng xếp hạng học sinh
    const studentScores: Record<string, { name: string; avatar?: string; totalScore: number; count: number; submissions: number }> = {};

    classData.subjects.forEach((subject: any) => {
      subject.lessons.forEach((lesson: any) => {
        lesson.assignments.forEach((assignment: any) => {
          assignment.submissions.forEach((sub: any) => {
            if (!studentScores[sub.studentId]) {
              const student = classData.students.find((s: any) => s.studentId === sub.studentId)?.student;
              studentScores[sub.studentId] = {
                name: student?.name || 'Unknown',
                avatar: student?.avatar || undefined,
                totalScore: 0,
                count: 0,
                submissions: 0,
              };
            }
            studentScores[sub.studentId].submissions++;
            if (sub.grade !== null) {
              studentScores[sub.studentId].totalScore += sub.grade || 0;
              studentScores[sub.studentId].count++;
            }
          });
        });
      });

      // Thêm điểm thi
      subject.examConfigs.forEach((exam: any) => {
        exam.results.forEach((result: any) => {
          if (!studentScores[result.studentId]) {
            studentScores[result.studentId] = {
              name: result.student.name,
              avatar: result.student.avatar || undefined,
              totalScore: 0,
              count: 0,
              submissions: 0,
            };
          }
          studentScores[result.studentId].totalScore += result.score;
          studentScores[result.studentId].count++;
        });
      });
    });

    const leaderboard = Object.entries(studentScores)
      .map(([studentId, data]: [string, any]) => ({
        studentId,
        studentName: data.name,
        studentAvatar: data.avatar,
        averageScore: data.count > 0 ? Math.round((data.totalScore / data.count) * 10) / 10 : 0,
        totalSubmissions: data.submissions,
        rank: 0,
      }))
      .sort((a: any, b: any) => b.averageScore - a.averageScore)
      .map((entry: any, index: number) => ({ ...entry, rank: index + 1 }));

    // Tỷ lệ hoàn thành tổng
    const allAssignments = classData.subjects.flatMap((s: any) => s.lessons.flatMap((l: any) => l.assignments));
    const allSubmissions = allAssignments.flatMap((a: any) => a.submissions);
    const expectedTotal = allAssignments.length * totalStudents;
    const assignmentCompletion = expectedTotal > 0 ? Math.round((allSubmissions.length / expectedTotal) * 100) : 0;

    const allExamConfigs = classData.subjects.flatMap((s: any) => s.examConfigs);
    const allExamResults = allExamConfigs.flatMap((e: any) => e.results);
    const expectedExams = allExamConfigs.length * totalStudents;
    const examCompletion = expectedExams > 0 ? Math.round((allExamResults.length / expectedExams) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        classId,
        className: classData.name,
        totalStudents,
        subjectStats,
        leaderboard,
        assignmentCompletion,
        examCompletion,
      },
    });
  } catch (error: any) {
    console.error('LMS Dashboard GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
