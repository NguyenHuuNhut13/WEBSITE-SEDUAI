'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardCheck, AlertCircle } from 'lucide-react';

export default function StudentExamsIndex() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const examRes = await fetch('/api/lms/exams/config');
      const examJson = await examRes.json();
      if (!examRes.ok || !examJson.success) throw new Error(examJson.error || 'Không thể tải lịch thi.');
      setExams(examJson.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tải lịch thi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Bài thi & Lịch kiểm tra</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý lịch thi trắc nghiệm và xem lại kết quả thi</p>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

      {exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">Hiện chưa có bài thi nào được xếp lịch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam: any) => (
            <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div>
                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[10px] font-bold uppercase tracking-wider">
                  {exam.examType === 'MIDTERM' ? 'Giữa kỳ' : exam.examType === 'FINAL' ? 'Cuối kỳ' : 'Quiz'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{exam.subject?.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Cấu hình: {exam.questionCount} câu hỏi / {exam.durationMinutes} phút</p>
              </div>

              <Link
                href={`/lms/student/exams/${exam.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" /> Bắt đầu làm bài
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
