import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/lms/submissions?assignmentId=xxx&studentId=xxx&status=PENDING
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const classId = searchParams.get('classId');

    const where: any = {};
    if (assignmentId) where.assignmentId = assignmentId;
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (classId) {
      where.assignment = {
        lesson: { subject: { classId } },
      };
    }

    const submissions = await prisma.lmsSubmission.findMany({
      where,
      include: {
        student: true,
        assignment: {
          include: { lesson: { include: { subject: true } } },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error: any) {
    console.error('LMS Submissions GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/lms/submissions — Học sinh nộp bài
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, studentId, content, files } = body;

    if (!assignmentId || !studentId) {
      return NextResponse.json({ success: false, error: 'assignmentId và studentId là bắt buộc' }, { status: 400 });
    }

    const submission = await prisma.lmsSubmission.upsert({
      where: {
        assignmentId_studentId: { assignmentId, studentId },
      },
      update: {
        content: content || '',
        files: files ? JSON.stringify(files) : null,
        status: 'PENDING',
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId,
        content: content || '',
        files: files ? JSON.stringify(files) : null,
        status: 'PENDING',
      },
      include: { student: true, assignment: true },
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error('LMS Submissions POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/lms/submissions — Giáo viên review + cập nhật điểm
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, grade, teacherReview, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id submission là bắt buộc' }, { status: 400 });
    }

    const updated = await prisma.lmsSubmission.update({
      where: { id },
      data: {
        ...(grade !== undefined && { grade }),
        ...(teacherReview !== undefined && { teacherReview }),
        ...(status && { status }),
      },
      include: { student: true, assignment: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Submissions PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
