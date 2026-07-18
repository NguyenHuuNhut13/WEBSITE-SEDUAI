'use client';

import { useCallback, useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle, Eye, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function TeacherGradingPage() {
  const { lmsUserId } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [error, setError] = useState('');

  const loadSubmissions = useCallback(async () => {
    try {
      const res = await fetch(`/api/lms/submissions?teacherId=${encodeURIComponent(lmsUserId || '')}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Không thể tải danh sách bài nộp.');
      setSubmissions(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tải danh sách bài nộp.');
    } finally {
      setLoading(false);
    }
  }, [lmsUserId]);

  useEffect(() => { if (lmsUserId) void loadSubmissions(); }, [lmsUserId, loadSubmissions]);

  const aiGrade = async (id: string) => {
    setGradingId(id);
    setError('');
    try {
      const res = await fetch(`/api/lms/submissions/${id}/ai-grade`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'SEDUAI chưa thể chấm bài.');
      setSubmissions((prev) => prev.map((s) => s.id === id ? json.data : s));
      setSelectedSub(json.data);
    } catch (e) { setError(e instanceof Error ? e.message : 'SEDUAI chưa thể chấm bài.'); }
    setGradingId(null);
  };

  const reviewSubmission = async (id: string, grade: number, teacherReview: string, expectedUpdatedAt: string) => {
    setError('');
    setReviewingId(id);
    try {
      const res = await fetch('/api/lms/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, grade, teacherReview, expectedUpdatedAt, status: 'REVIEWED' }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Không thể xác nhận điểm.');
      setSubmissions((prev) => prev.map((s) => s.id === id ? json.data : s));
      setSelectedSub(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể xác nhận điểm.'); }
    finally { setReviewingId(null); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    AI_GRADED: 'bg-blue-50 text-blue-700',
    REVIEWED: 'bg-emerald-50 text-emerald-700',
  };
  const statusLabels: Record<string, string> = {
    PENDING: 'Chờ chấm',
    AI_GRADED: 'AI đã chấm',
    REVIEWED: 'Đã review',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Chấm bài với AI</h1>
        <p className="text-sm text-slate-500 mt-1">Sử dụng SEDUAI để chấm bài tự động, sau đó review và chỉnh điểm</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions List */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Bài nộp ({submissions.length})</h2>
          {submissions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">Chưa có bài nộp</div>
          ) : (
            submissions.map((sub) => (
              <div key={sub.id} onClick={() => setSelectedSub(sub)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition hover:shadow-md ${
                  selectedSub?.id === sub.id ? 'border-primary shadow-md' : 'border-slate-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">{sub.student?.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[sub.status]}`}>
                    {statusLabels[sub.status]}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{sub.assignment?.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  {sub.grade !== null && (
                    <span className="flex items-center gap-1 text-xs font-bold text-primary"><Star className="w-3 h-3" /> {sub.grade}/10</span>
                  )}
                  <span className="text-xs text-slate-400">{new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedSub ? (
            <>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-base font-bold text-slate-900 mb-1">{selectedSub.assignment?.title}</h3>
                <p className="text-xs text-slate-500 mb-3">Nộp bởi: {selectedSub.student?.name} · {new Date(selectedSub.submittedAt).toLocaleString('vi-VN')}</p>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedSub.content || '(Không có nội dung)'}
                </div>
                {selectedSub.files && (
                  <div className="mt-3 space-y-1 text-xs">
                    {(typeof selectedSub.files === 'string' ? JSON.parse(selectedSub.files) : selectedSub.files).map((file: any) => (
                      <a key={file.url} href={file.url} target="_blank" rel="noreferrer" className="block text-primary hover:underline">Tệp: {file.name}</a>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Actions */}
              {selectedSub.status === 'PENDING' && selectedSub.content && (
                <button onClick={() => aiGrade(selectedSub.id)} disabled={gradingId === selectedSub.id}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition cursor-pointer disabled:opacity-50">
                  {gradingId === selectedSub.id ? <><Loader2 className="w-4 h-4 animate-spin" /> AI đang chấm...</> : <><Sparkles className="w-4 h-4" /> AI Chấm bài</>}
                </button>
              )}

              {/* AI Review Result */}
              {selectedSub.aiReview && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Nhận xét từ AI</span>
                    <span className="ml-auto text-lg font-black text-blue-700">{selectedSub.grade}/10</span>
                  </div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">{selectedSub.aiReview}</div>
                </div>
              )}

              {/* Teacher Review Form */}
              {(
                selectedSub.status === 'AI_GRADED'
                || (selectedSub.status === 'PENDING' && !selectedSub.content && selectedSub.files)
              ) && (
                <TeacherReviewForm
                  key={selectedSub.id}
                  sub={selectedSub}
                  reviewing={reviewingId === selectedSub.id}
                  onReview={reviewSubmission}
                />
              )}

              {selectedSub.status === 'REVIEWED' && selectedSub.teacherReview && (
                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-900">Đã review · Điểm: {selectedSub.grade}/10</span>
                  </div>
                  <p className="text-sm text-slate-700">{selectedSub.teacherReview}</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Eye className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Chọn bài nộp để xem chi tiết và chấm điểm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TeacherReviewForm({
  sub,
  reviewing,
  onReview,
}: {
  sub: any;
  reviewing: boolean;
  onReview: (id: string, grade: number, review: string, expectedUpdatedAt: string) => Promise<void>;
}) {
  const [grade, setGrade] = useState(sub.grade ?? 0);
  const [review, setReview] = useState('');
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <h4 className="text-sm font-bold text-slate-900">Review của giáo viên</h4>
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-600">Điểm:</label>
        <input type="number" min={0} max={10} step={0.5} value={grade} onChange={(e) => setGrade(parseFloat(e.target.value))}
          className="w-20 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-center" />
        <span className="text-xs text-slate-400">/ 10</span>
      </div>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={3}
        placeholder="Nhận xét thêm cho học sinh..."
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-y" />
      <button onClick={() => void onReview(sub.id, grade, review.trim(), sub.updatedAt)} disabled={reviewing || !Number.isFinite(grade) || grade < 0 || grade > 10 || !review.trim()}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
        {reviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Xác nhận Review
      </button>
    </div>
  );
}
