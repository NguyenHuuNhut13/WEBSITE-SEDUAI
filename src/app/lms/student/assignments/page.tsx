'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FileText, ClipboardCheck, AlertCircle, ChevronRight, Star } from 'lucide-react';

export default function StudentAssignmentsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    if (!user) return;
    try {
      const userRes = await fetch('/api/lms/users');
      const userJson = await userRes.json();
      if (userJson.success) {
        const dbUser = userJson.data.find((u: any) => u.username === user.username);
        if (dbUser) {
          const subRes = await fetch(`/api/lms/submissions?studentId=${dbUser.id}`);
          const subJson = await subRes.json();
          if (subJson.success) {
            setSubmissions(subJson.data);
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
    loadSubmissions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
    AI_GRADED: 'bg-blue-50 text-blue-700 border-blue-100',
    REVIEWED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Chờ chấm',
    AI_GRADED: 'AI đã chấm',
    REVIEWED: 'Đã duyệt',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Nhiệm vụ & Bài tập</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý bài nộp và xem nhận xét điểm số</p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">Chưa có bài tập nào được nộp.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-150 overflow-hidden shadow-sm">
          {submissions.map((sub: any) => (
            <Link
              key={sub.id}
              href={`/lms/student/assignments/${sub.assignmentId}`}
              className="p-5 flex items-center justify-between hover:bg-slate-50 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition">
                    {sub.assignment?.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Môn học: {sub.assignment?.lesson?.subject?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {sub.grade !== null && (
                  <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" /> {sub.grade}/10
                  </span>
                )}
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[sub.status]}`}>
                  {statusLabels[sub.status]}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
