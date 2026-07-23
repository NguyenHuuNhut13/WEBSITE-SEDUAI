'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, ChevronRight, AlertCircle, RefreshCw, BookOpen, CheckCircle2, FileText, Sparkles, Check } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

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
  const [marking, setMarking] = useState(false);

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
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-none animate-spin" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-md rounded-none border border-rose-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
        <p className="mt-3 font-semibold text-slate-800">Không thể mở bài học</p>
        <p className="mt-1 text-sm text-slate-500">{error || 'Không tìm thấy thông tin bài học.'}</p>
        <button
          type="button"
          onClick={() => void loadLesson()}
          className="mt-5 inline-flex items-center gap-2 rounded-none bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
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

  const handleToggleCompleted = async () => {
    setMarking(true);
    try {
      const response = await fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, progressPercent: 100, completed: !completed }),
      });
      if (response.ok) setCompleted(!completed);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-none border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href={`/lms/student/subjects/${lesson.subjectId}`}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-none transition border border-slate-700"
              title="Quay lại danh sách môn học"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary text-white font-extrabold text-[10px] px-2.5 py-1 uppercase tracking-wider rounded-none">
                {lesson.subject?.name || 'Môn học'}
              </span>
              <span className="bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[10px] px-2.5 py-1 rounded-none">
                Buổi {lesson.orderIndex} • {lesson.type === 'THEORY' ? 'Lý thuyết' : 'Thực hành'}
              </span>
              {completed && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] px-2.5 py-1 rounded-none flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã hoàn thành
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleCompleted}
            disabled={marking}
            className={`px-4 py-2 text-xs font-bold rounded-none transition cursor-pointer flex items-center gap-2 border shadow-sm ${
              completed
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                : 'bg-primary hover:bg-blue-700 text-white border-primary'
            }`}
          >
            {completed ? <Check className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            {completed ? 'Đã hoàn thành bài học' : 'Đánh dấu hoàn thành'}
          </button>
        </div>

        <div className="pt-5 space-y-2">
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">{lesson.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
            Tài liệu giảng dạy và học tập trực quan kết hợp hỗ trợ trợ lý AI SeduAi 24/7.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Lesson Reading Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objectives Section */}
          {lesson.objectives && (
            <div className="bg-blue-50/80 border-l-4 border-blue-600 border-t border-r border-b border-blue-200 p-5 rounded-none shadow-sm">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> Mục tiêu bài học (Cần đạt)
              </h3>
              <p className="text-xs sm:text-sm text-blue-950 leading-relaxed font-medium whitespace-pre-wrap">
                {lesson.objectives.includes('[object Object]')
                  ? 'Nội dung mục tiêu đang được cập nhật.'
                  : lesson.objectives}
              </p>
            </div>
          )}

          {/* Lesson Main Content Body */}
          <div className="bg-white rounded-none border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Nội dung bài giảng chi tiết
              </h2>
              <span className="text-[11px] text-slate-400 font-semibold">Tài liệu chuẩn hóa LMS</span>
            </div>

            {/* Rich Formatted Markdown Content */}
            <div className="pt-2">
              <MarkdownRenderer content={lesson.content} />
            </div>
          </div>

          {/* Footer Action Card */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-none flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-800">Bạn đã nghiên cứu xong bài học này?</p>
              <p className="text-[11px] text-slate-500">Đánh dấu hoàn thành để ghi nhận tiến độ vào hồ sơ học tập.</p>
            </div>
            <button
              type="button"
              onClick={handleToggleCompleted}
              disabled={marking}
              className={`px-5 py-2.5 text-xs font-bold rounded-none transition cursor-pointer flex items-center gap-2 border ${
                completed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                  : 'bg-primary hover:bg-blue-700 text-white border-primary shadow'
              }`}
            >
              {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <BookOpen className="w-4 h-4" />}
              {completed ? 'Đã hoàn thành' : 'Đánh dấu đã học xong'}
            </button>
          </div>
        </div>

        {/* Attachments & Assignments Sidebar */}
        <div className="space-y-6">
          {/* Attachments */}
          <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Tài liệu đính kèm</h3>
            </div>
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
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-none bg-slate-50 hover:bg-slate-100 hover:border-primary transition text-xs font-bold text-slate-800 group"
                    >
                      <span className="truncate max-w-[160px]">{fileName}</span>
                      <Download className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    </a>
                  ) : (
                    <div key={`${fileName}-${i}`} className="rounded-none border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                      {fileName}: liên kết tài liệu không hợp lệ.
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assignments & Quizzes */}
          <div className="bg-white rounded-none border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Bài tập & Trắc nghiệm</h3>
            </div>
            {(!lesson.assignments || lesson.assignments.length === 0) ? (
              <p className="text-xs text-slate-400 italic">Buổi học này chưa có bài tập bắt buộc.</p>
            ) : (
              <div className="space-y-2.5">
                {lesson.assignments.map((assignment: any) => (
                  <Link
                    key={assignment.id}
                    href={`/lms/student/assignments/${assignment.id}`}
                    className="flex flex-col gap-1.5 p-3.5 border border-slate-200 hover:border-primary bg-slate-50 hover:bg-primary/5 rounded-none transition text-xs group"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 group-hover:text-primary">
                      <span className="line-clamp-1">{assignment.title}</span>
                      <ChevronRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Thang điểm 10 • Tự luận</span>
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
