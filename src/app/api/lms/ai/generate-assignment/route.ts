import { NextRequest, NextResponse } from 'next/server';
import { requireLmsUser, lmsErrorResponse } from '@/lib/lms-auth';
import { generateLessonAssignment } from '@/services/ai-grading-service';
import { requiredText, optionalLongText } from '@/lib/lms-input';

export async function POST(request: NextRequest) {
  try {
    const actor = await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();

    const lessonTitle = requiredText(body.lessonTitle, 'Tiêu đề bài học', 200);
    const lessonObjectives = optionalLongText(body.lessonObjectives, 'Mục tiêu bài học', 20000) || '';
    const lessonContent = optionalLongText(body.lessonContent, 'Nội dung bài học', 100000) || '';

    const assignmentData = await generateLessonAssignment(lessonTitle, lessonObjectives, lessonContent);

    return NextResponse.json({ success: true, data: assignmentData });
  } catch (error: any) {
    console.error('LMS AI Generate Assignment error:', error);
    return lmsErrorResponse(error);
  }
}
