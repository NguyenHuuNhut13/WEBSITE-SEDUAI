import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/lms/assignments?lessonId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const id = searchParams.get('id');

    if (id) {
      const assignment = await prisma.lmsAssignment.findUnique({
        where: { id },
        include: {
          lesson: { include: { subject: { include: { class: true } } } },
          submissions: { include: { student: true }, orderBy: { submittedAt: 'desc' } },
        },
      });
      return NextResponse.json({ success: true, data: assignment });
    }

    if (!lessonId) {
      return NextResponse.json({ success: false, error: 'lessonId là bắt buộc' }, { status: 400 });
    }

    const assignments = await prisma.lmsAssignment.findMany({
      where: { lessonId },
      include: { _count: { select: { submissions: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: assignments });
  } catch (error: any) {
    console.error('LMS Assignments GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/lms/assignments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, title, description, dueDate } = body;

    if (!lessonId || !title) {
      return NextResponse.json({ success: false, error: 'lessonId và title là bắt buộc' }, { status: 400 });
    }

    const assignment = await prisma.lmsAssignment.create({
      data: {
        lessonId,
        title,
        description: description || '',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: assignment });
  } catch (error: any) {
    console.error('LMS Assignments POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
