'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Download, FileText, ChevronRight } from 'lucide-react';

export default function StudentLessonDetail({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadLesson = async () => {
    try {
      const res = await fetch(`/api/lms/lessons?id=${lessonId}`);
      const json = await res.json();
      if (json.success) setLesson(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-semibold">Không tìm thấy thông tin bài học.</p>
      </div>
    );
  }

  // Parse attachments if JSON string
  let parsedAttachments = [];
  if (lesson.attachments) {
    try {
      parsedAttachments = JSON.parse(lesson.attachments);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/lms/student/subjects/${lesson.subjectId}`}
          className="p-2 rounded-xl hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{lesson.title}</h1>
          <p className="text-sm text-slate-500">
            Môn học: {lesson.subject?.name} · Buổi số {lesson.orderIndex} ({lesson.type === 'THEORY' ? 'Lý thuyết' : 'Thực hành'})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Nội dung bài học</h2>
            <div className="prose max-w-none text-slate-700 leading-relaxed text-sm">
              {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }} />
              ) : (
                <p className="text-slate-400 italic">Bài học này chưa có nội dung chi tiết.</p>
              )}
            </div>
          </div>
        </div>

        {/* Attachments & Assignments Sidebar */}
        <div className="space-y-6">
          {/* Attachments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Tài liệu bài học</h3>
            {parsedAttachments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Không có tài liệu đính kèm.</p>
            ) : (
              <div className="space-y-2">
                {parsedAttachments.map((file: any, i: number) => (
                  <a
                    key={i}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition text-xs font-bold text-slate-700"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <Download className="w-4 h-4 text-primary" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Bài tập tự luyện</h3>
            {(!lesson.assignments || lesson.assignments.length === 0) ? (
              <p className="text-xs text-slate-400 italic">Buổi học này không có bài tập bắt buộc.</p>
            ) : (
              <div className="space-y-2">
                {lesson.assignments.map((assignment: any) => (
                  <Link
                    key={assignment.id}
                    href={`/lms/student/assignments/${assignment.id}`}
                    className="flex items-center justify-between p-4 border border-primary/10 rounded-xl bg-primary/5 hover:bg-primary/10 transition text-xs font-bold text-primary group"
                  >
                    <span>{assignment.title}</span>
                    <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
