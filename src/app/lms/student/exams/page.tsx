'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ClipboardCheck, Star, AlertCircle, ChevronRight } from 'lucide-react';

export default function StudentExamsIndex() {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExams = async () => {
    if (!user) return;
    try {
      const classRes = await fetch('/api/lms/classes');
      const classJson = await classRes.json();
      if (classJson.success) {
        // Enrolled classes
        const studentClasses = classJson.data.filter((c: any) =>
          c.students?.some((s: any) => s.student.username === user.username)
        );
        if (studentClasses.length > 0) {
          const classIds = studentClasses.map((c: any) => c.id);
          // Let's fetch exam configs for the first enrolled class
          const examRes = await fetch(`/api/lms/exams/config?classId=${classIds[0]}`);
          const examJson = await examRes.json();
          if (examJson.success) {
            setExams(examJson.data);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [user]);

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
