'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

interface LessonAttachment {
  name?: string;
  url?: string;
}

function getSafeAttachmentUrl(value: unknown) {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (/^\/(?!\/)/.test(url) && !url.includes('\\')) return url;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export default function StudentLessonDetail({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  const loadLesson = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/lms/lessons?id=${lessonId}`);
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success || !json.data) {
        throw new Error(json?.error || 'Không thể tải nội dung bài học.');
      }
      setLesson(json.data);
      setCompleted(Boolean(json.data.progress?.[0]?.completedAt));
      void fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, progressPercent: 25 }),
      });
    } catch (e) {
      setLesson(null);
      setError(e instanceof Error ? e.message : 'Không thể tải nội dung bài học.');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    void loadLesson();
  }, [loadLesson]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
        <p className="mt-3 font-semibold text-slate-800">Không thể mở bài học</p>
        <p className="mt-1 text-sm text-slate-500">{error || 'Không tìm thấy thông tin bài học.'}</p>
        <button
          type="button"
          onClick={() => void loadLesson()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" /> Thử lại
        </button>
      </div>
    );
  }

  // Parse attachments if JSON string
  let parsedAttachments: LessonAttachment[] = [];
  if (lesson.attachments) {
    try {
      const parsed = JSON.parse(lesson.attachments);
      parsedAttachments = Array.isArray(parsed) ? parsed : [];
    } catch {
      parsedAttachments = [];
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
                <div className="whitespace-pre-wrap break-words">{lesson.content}</div>
              ) : (
                <p className="text-slate-400 italic">Bài học này chưa có nội dung chi tiết.</p>
              )}
            </div>
            {lesson.objectives && <section className="mt-6 rounded-none bg-blue-50 p-4 border border-blue-100"><h3 className="text-sm font-bold text-blue-900">Mục tiêu bài học</h3><p className="mt-2 whitespace-pre-wrap text-sm text-blue-800">{lesson.objectives.includes('[object Object]') ? 'Nội dung mục tiêu đang được cập nhật.' : lesson.objectives}</p></section>}
            <button
              type="button"
              onClick={async () => {
                const response = await fetch('/api/lms/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId, progressPercent: 100, completed: true }) });
                if (response.ok) setCompleted(true);
              }}
              className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-bold ${completed ? 'bg-emerald-100 text-emerald-700' : 'bg-primary text-white hover:bg-blue-700'}`}
            >
              {completed ? 'Đã hoàn thành bài học' : 'Đánh dấu đã hoàn thành'}
            </button>
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
                {parsedAttachments.map((file, i) => {
                  const safeUrl = getSafeAttachmentUrl(file.url);
                  const fileName = file.name?.trim() || `Tài liệu ${i + 1}`;

                  return safeUrl ? (
                    <a
                      key={`${fileName}-${i}`}
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition text-xs font-bold text-slate-700"
                    >
                      <span className="truncate max-w-[150px]">{fileName}</span>
                      <Download className="w-4 h-4 text-primary" />
                    </a>
                  ) : (
                    <div key={`${fileName}-${i}`} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                      {fileName}: liên kết tài liệu không hợp lệ.
                    </div>
                  );
                })}
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
