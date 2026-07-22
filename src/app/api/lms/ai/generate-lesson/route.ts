import { NextRequest, NextResponse } from 'next/server';
import { requireLmsUser, lmsErrorResponse } from '@/lib/lms-auth';
import { generateLessonPlan } from '@/services/ai-grading-service';
import { requiredText, positiveInteger, enumValue } from '@/lib/lms-input';

export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();

    const subjectName = requiredText(body.subjectName, 'Tên môn học', 200);
    const lessonType = enumValue(body.lessonType, 'Loại bài học', ['THEORY', 'PRACTICAL'] as const);
    const orderIndex = positiveInteger(body.orderIndex, 'Thứ tự buổi học', 1, 100);

    const lessonPlan = await generateLessonPlan(subjectName, lessonType, orderIndex);

    return NextResponse.json({ success: true, data: lessonPlan });
  } catch (error: any) {
    console.error('LMS AI Generate Lesson error:', error);
    return lmsErrorResponse(error);
  }
}
