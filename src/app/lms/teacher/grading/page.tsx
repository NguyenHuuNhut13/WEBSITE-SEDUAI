'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { Sparkles, Loader2, CheckCircle, Eye, Star, Search, RefreshCw, FileText, Paperclip } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function getSubmissionFiles(value: unknown): Array<{ name: string; url: string }> {
  if (!value) return [];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((file): file is { name: string; url: string } => Boolean(file && typeof file.url === 'string'));
  } catch {
    return [];
  }
}

export default function TeacherGradingPage() {
  const { lmsUserId } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'AI_GRADED' | 'REVIEWED'>('ALL');

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
  const counts = useMemo(() => ({
    all: submissions.length,
    pending: submissions.filter((item) => item.status === 'PENDING').length,
    ai: submissions.filter((item) => item.status === 'AI_GRADED').length,
    reviewed: submissions.filter((item) => item.status === 'REVIEWED').length,
  }), [submissions]);
  const filteredSubmissions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return submissions.filter((sub) => {
      const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
      const haystack = `${sub.student?.name || ''} ${sub.assignment?.title || ''} ${sub.assignment?.lesson?.subject?.name || ''}`.toLowerCase();
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [query, statusFilter, submissions]);

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">Đánh giá học tập</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">Chấm bài & review</h1>
          <p className="mt-2 text-sm text-slate-500">SEDUAI chấm bài tự động, giáo viên kiểm tra và xác nhận điểm cuối.</p>
        </div>
        <button onClick={() => { setLoading(true); void loadSubmissions(); }} className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primary/30 hover:text-primary">
          <RefreshCw className="h-4 w-4" /> Làm mới
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Tổng bài nộp', value: counts.all, icon: <FileText className="h-5 w-5" />, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'Chờ chấm', value: counts.pending, icon: <Sparkles className="h-5 w-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'AI đã chấm', value: counts.ai, icon: <Star className="h-5 w-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Đã review', value: counts.reviewed, icon: <CheckCircle className="h-5 w-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo học sinh, bài tập hoặc môn học..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10" />
        </div>
        <div className="mt-3 flex gap-1 overflow-x-auto sm:mt-0">
          {([['ALL', 'Tất cả'], ['PENDING', 'Chờ chấm'], ['AI_GRADED', 'AI đã chấm'], ['REVIEWED', 'Đã review']] as const).map(([value, label]) => (
            <button key={value} onClick={() => setStatusFilter(value)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${statusFilter === value ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        {/* Submissions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Bài nộp ({filteredSubmissions.length})</h2>
            <span className="text-xs text-slate-400">Mới nhất trước</span>
          </div>
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">Chưa có bài nộp</div>
          ) : (
            filteredSubmissions.map((sub) => (
              <div key={sub.id} onClick={() => setSelectedSub(sub)}
                className={`cursor-pointer rounded-xl border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm ${
                  selectedSub?.id === sub.id ? 'border-primary ring-2 ring-primary/10' : 'border-slate-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">{sub.student?.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[sub.status] || 'bg-slate-100 text-slate-600'}`}>
                    {statusLabels[sub.status]}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{sub.assignment?.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  {sub.grade !== null && sub.grade !== undefined && (
                    <span className="flex items-center gap-1 text-xs font-bold text-primary"><Star className="w-3 h-3" /> {sub.grade}/10</span>
                  )}
                  {sub.files && <span className="flex items-center gap-1 text-xs font-medium text-slate-400"><Paperclip className="h-3 w-3" /> File đính kèm</span>}
                  <span className="text-xs text-slate-400">{new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {selectedSub ? (
            <>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-400">{selectedSub.assignment?.lesson?.subject?.name || 'Môn học'}</p>
                    <h3 className="text-base font-bold text-slate-900">{selectedSub.assignment?.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">Nộp bởi: {selectedSub.student?.name} · {new Date(selectedSub.submittedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[selectedSub.status] || 'bg-slate-100 text-slate-600'}`}>{statusLabels[selectedSub.status]}</span>
                </div>
                <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
                  {selectedSub.content || 'Bài nộp này không có nội dung văn bản, vui lòng xem file đính kèm.'}
                </div>
                {selectedSub.assignment?.rubric && (
                  <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50 p-3">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-violet-700">Rubric chấm điểm</p>
                    <p className="whitespace-pre-wrap text-xs leading-5 text-violet-900">{selectedSub.assignment.rubric}</p>
                  </div>
                )}
                {getSubmissionFiles(selectedSub.files).length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><Paperclip className="h-3.5 w-3.5" /> File đính kèm</p>
                    {getSubmissionFiles(selectedSub.files).map((file) => (
                      <a key={file.url} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5"><FileText className="h-3.5 w-3.5" /> {file.name || 'Tệp bài làm'}</a>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Actions */}
              {selectedSub.status === 'PENDING' && selectedSub.content && !selectedSub.aiGrading && (
                <button onClick={() => aiGrade(selectedSub.id)} disabled={gradingId === selectedSub.id}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark cursor-pointer disabled:opacity-50">
                  {gradingId === selectedSub.id ? <><Loader2 className="w-4 h-4 animate-spin" /> AI đang chấm...</> : <><Sparkles className="w-4 h-4" /> AI Chấm bài</>}
                </button>
              )}

              {selectedSub.status === 'PENDING' && selectedSub.aiGrading && (
                <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
                  <Loader2 className="h-4 w-4 animate-spin" /> SEDUAI đang xử lý bài này...
                </div>
              )}

              {selectedSub.status === 'PENDING' && !selectedSub.content && getSubmissionFiles(selectedSub.files).length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Đây là bài nộp bằng file. Vui lòng xem file, nhập điểm và nhận xét để hoàn tất review thủ công.
                </div>
              )}

              {/* AI Review Result */}
              {selectedSub.aiReview && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
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
