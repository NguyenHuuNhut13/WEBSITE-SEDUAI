import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = { params: Promise<{ subjectId: string }> };

// GET /api/lms/subjects/[subjectId]
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { subjectId } = await context.params;
    const subject = await prisma.lmsSubject.findUnique({
      where: { id: subjectId },
      include: {
        class: { include: { teacher: true } },
        lessons: {
          include: {
            assignments: {
              include: { _count: { select: { submissions: true } } },
            },
          },
          orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }],
        },
        examConfigs: {
          include: { _count: { select: { results: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ success: false, error: 'Môn học không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: subject });
  } catch (error: any) {
    console.error('LMS Subject GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/lms/subjects/[subjectId]
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { subjectId } = await context.params;
    const body = await request.json();
    const { name } = body;

    const updated = await prisma.lmsSubject.update({
      where: { id: subjectId },
      data: { ...(name && { name }) },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('LMS Subject PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
