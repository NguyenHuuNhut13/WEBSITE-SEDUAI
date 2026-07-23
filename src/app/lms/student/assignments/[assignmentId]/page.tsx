'use client';

import { useCallback, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Send, Sparkles, Loader2, Star, FileText, Upload, CheckCircle2 } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function StudentAssignmentSubmission({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = use(params);
  const { lmsUserId } = useAuth();
  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAssignmentAndSubmission = useCallback(async () => {
    if (!lmsUserId) return;
    try {
      const [assRes, subRes] = await Promise.all([
        fetch(`/api/lms/assignments?id=${assignmentId}`),
        fetch(`/api/lms/submissions?assignmentId=${assignmentId}&studentId=${lmsUserId}`)
      ]);

      const [assJson, subJson] = await Promise.all([
        assRes.json(),
        subRes.json()
      ]);

      if (assJson.success) setAssignment(assJson.data);
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
  }, [assignmentId, lmsUserId]);

  useEffect(() => {
    void loadAssignmentAndSubmission();
  }, [loadAssignmentAndSubmission]);

  const handleSub = async () => {
    setError('');
    setSuccess('');
    if (!content.trim() && selectedFiles.length === 0) {
      setError('Vui lòng nhập nội dung hoặc chọn tệp bài làm.');
      return;
    }

    setSubmitting(true);
    try {
      if (!lmsUserId) throw new Error('Không tìm thấy tài khoản trong LMS.');

      const uploadedFiles = await Promise.all(selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await fetch('/api/lms/uploads', { method: 'POST', body: formData });
        const uploadJson = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadJson.success) throw new Error(uploadJson.error || 'Không thể tải tệp lên.');
        return uploadJson.data;
      }));

      const res = await fetch('/api/lms/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          content,
          files: uploadedFiles,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmission(json.data);
        setSelectedFiles([]);
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
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-none animate-spin" />
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-none border border-slate-800 shadow-md">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Link
            href={`/lms/student/lessons/${assignment.lessonId}`}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-none transition border border-slate-700"
            title="Quay lại bài học"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-primary text-white font-extrabold text-[10px] px-2.5 py-1 uppercase tracking-wider rounded-none">
              {assignment.lesson?.subject?.name || 'Môn học'}
            </span>
            <span className="bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[10px] px-2.5 py-1 rounded-none">
              Bài tập tự luận
            </span>
            {submission && (
              <span className={`font-bold text-[10px] px-2.5 py-1 rounded-none border ${
                submission.status === 'REVIEWED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : submission.status === 'AI_GRADED'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {submission.status === 'REVIEWED' ? 'Đã chấm điểm' : submission.status === 'AI_GRADED' ? 'AI đã chấm' : 'Đã nộp bài'}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{assignment.title}</h1>
          <p className="text-xs text-slate-300 font-medium">Nộp bài làm trực tuyến và nhận phản hồi chấm điểm chi tiết.</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-none text-sm font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-none text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Assignment Description with MarkdownRenderer */}
      <div className="bg-white rounded-none border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-4 h-4 text-primary" /> Đề bài & Yêu cầu bài tập
        </h2>
        <div className="pt-1">
          <MarkdownRenderer content={assignment.description} />
        </div>
      </div>

      {/* Submission Panel */}
      <div className="bg-white rounded-none border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
          Nội dung bài làm của học sinh
        </h2>
        
        {submission?.status === 'REVIEWED' ? (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-none p-4 text-xs sm:text-sm text-slate-800 border border-slate-200 font-mono leading-relaxed">
              {submission.content}
            </div>
            
            {submission.grade !== null && (
              <div className="bg-emerald-50/80 border-l-4 border-emerald-600 border-t border-r border-b border-emerald-200 rounded-none p-5 flex items-start gap-3">
                <Star className="w-5 h-5 text-emerald-600 fill-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-emerald-950">Kết quả đánh giá từ giáo viên: {submission.grade}/10 điểm</p>
                  {submission.teacherReview && (
                    <div className="text-xs text-emerald-900 leading-relaxed font-medium pt-1">
                      <strong>Nhận xét:</strong> {submission.teacherReview}
                    </div>
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
              className="w-full px-4 py-3 rounded-none border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-primary resize-y font-mono bg-slate-50/50"
            />

            <label className="flex cursor-pointer items-center gap-2 rounded-none border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
              <Upload className="h-4 w-4 text-primary" />
              <span>{selectedFiles.length ? `${selectedFiles.length} tệp đã chọn` : 'Đính kèm tệp bài làm (.zip, .pdf, .docx, .png...)'}</span>
              <input type="file" multiple className="hidden" onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))} />
            </label>

            {submission?.files && (
              <div className="space-y-1 text-xs text-slate-600">
                {(typeof submission.files === 'string' ? JSON.parse(submission.files) : submission.files).map((file: any) => (
                  <a key={file.url} href={file.url} target="_blank" rel="noreferrer" className="block text-primary font-bold hover:underline">{file.name}</a>
                ))}
              </div>
            )}

            {submission?.status === 'AI_GRADED' && (
              <div className="bg-blue-50/80 border-l-4 border-blue-600 border-t border-r border-b border-blue-200 rounded-none p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200/80">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-blue-900">Đánh giá sơ bộ tự động từ SEDUAI</span>
                  </div>
                  <span className="text-base font-black text-blue-700 bg-blue-100 px-3 py-0.5 border border-blue-200">{submission.grade}/10 điểm</span>
                </div>
                <div className="pt-1">
                  <MarkdownRenderer content={submission.aiReview} />
                </div>
                <p className="text-[10px] text-slate-500 italic pt-2 border-t border-blue-100">
                  * Bài làm đã được AI chấm sơ bộ. Giáo viên sẽ kiểm tra lại và duyệt điểm số chính thức.
                </p>
              </div>
            )}

            {submission?.status !== 'AI_GRADED' && (
              <button
                type="button"
                onClick={handleSub}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-none shadow transition cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Nộp bài tập
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
