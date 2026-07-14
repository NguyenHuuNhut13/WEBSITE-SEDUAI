'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Send, Sparkles, Loader2, Star, FileText } from 'lucide-react';

export default function StudentAssignmentSubmission({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = use(params);
  const { lmsUserId } = useAuth();
  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAssignmentAndSubmission = async () => {
    if (!lmsUserId) return;
    try {
      const assRes = await fetch(`/api/lms/assignments?id=${assignmentId}`);
      const assJson = await assRes.json();
      if (assJson.success) setAssignment(assJson.data);

      const subRes = await fetch(`/api/lms/submissions?assignmentId=${assignmentId}&studentId=${lmsUserId}`);
      const subJson = await subRes.json();
      if (subJson.success && subJson.data.length > 0) {
        const sub = subJson.data[0];
        setSubmission(sub);
        setContent(sub.content || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignmentAndSubmission();
  }, [assignmentId, lmsUserId]);

  const handleSub = async () => {
    setError('');
    setSuccess('');
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung trả lời bài tập.');
      return;
    }

    setSubmitting(true);
    try {
      if (!lmsUserId) throw new Error('Không tìm thấy tài khoản trong LMS.');

      const res = await fetch('/api/lms/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          studentId: lmsUserId,
          content,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmission(json.data);
        setSuccess('Nộp bài tập thành công! Giáo viên hoặc AI sẽ chấm điểm bài làm của bạn.');
      } else {
        setError(json.error);
      }
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi khi nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-semibold">Không tìm thấy thông tin bài tập.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href={`/lms/student/lessons/${assignment.lessonId}`}
          className="p-2 rounded-xl hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{assignment.title}</h1>
          <p className="text-sm text-slate-500">Môn học: {assignment.lesson?.subject?.name}</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Assignment Description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
          <FileText className="w-4 h-4 text-slate-500" /> Đề bài & Yêu cầu bài tập
        </h2>
        <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
          {assignment.description || 'Chưa có mô tả bài tập chi tiết.'}
        </div>
      </div>

      {/* Submission Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Bài làm của bạn</h2>
        
        {submission?.status === 'REVIEWED' ? (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap border border-slate-100">
              {submission.content}
            </div>
            
            {submission.grade !== null && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-center gap-3">
                <Star className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">Đã chấm điểm: {submission.grade}/10</p>
                  {submission.teacherReview && (
                    <p className="text-xs text-slate-600 mt-1">Nhận xét của giáo viên: {submission.teacherReview}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              disabled={submission?.status === 'AI_GRADED'}
              placeholder="Nhập câu trả lời hoặc chèn mã nguồn bài làm của bạn vào đây..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
            />

            {submission?.status === 'AI_GRADED' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-blue-900">Đánh giá sơ bộ từ AI</span>
                  <span className="ml-auto text-base font-black text-blue-700">{submission.grade}/10</span>
                </div>
                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{submission.aiReview}</div>
                <p className="text-[10px] text-slate-400 mt-4 italic">Bài làm đã được AI chấm tự động và đang đợi giáo viên duyệt lại điểm số.</p>
              </div>
            )}

            {submission?.status !== 'AI_GRADED' && (
              <button
                onClick={handleSub}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />} Nộp bài tập
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
