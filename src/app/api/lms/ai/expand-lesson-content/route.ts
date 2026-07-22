import { NextRequest, NextResponse } from 'next/server';
import { requireLmsUser, lmsErrorResponse } from '@/lib/lms-auth';
import { expandLessonContentFromActivities } from '@/services/ai-grading-service';
import { requiredText } from '@/lib/lms-input';

export async function POST(request: NextRequest) {
  try {
    await requireLmsUser(request, ['ADMIN', 'TEACHER']);
    const body = await request.json();

    const subjectName = requiredText(body.subjectName, 'Tên môn học', 200);
    const lessonTitle = requiredText(body.lessonTitle, 'Tên bài học', 200);
    const lessonObjectives = String(body.lessonObjectives || '');
    const lessonActivities = requiredText(body.lessonActivities, 'Sườn tiến trình hoạt động', 5000);

    const content = await expandLessonContentFromActivities(
      subjectName,
      lessonTitle,
      lessonObjectives,
      lessonActivities
    );

    return NextResponse.json({ success: true, data: { content } });
  } catch (error: any) {
    console.error('LMS AI Expand Lesson Content error:', error);
    return lmsErrorResponse(error);
  }
}
