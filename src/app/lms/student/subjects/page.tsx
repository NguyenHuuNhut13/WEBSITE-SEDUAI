'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, ChevronRight, AlertCircle } from 'lucide-react';

export default function StudentSubjectsList() {
  const { lmsUserId } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubjects = async () => {
    if (!lmsUserId) return;
    try {
      const classRes = await fetch(`/api/lms/classes?studentId=${encodeURIComponent(lmsUserId)}`);
      const classJson = await classRes.json();
      if (classJson.success) {
        const allSubjects = classJson.data.flatMap((c: any) =>
          (c.subjects || []).map((s: any) => ({ ...s, className: c.name }))
        );
        setSubjects(allSubjects);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [lmsUserId]);

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
        <h1 className="text-2xl font-black text-slate-900">Danh sách môn học</h1>
        <p className="text-sm text-slate-500 mt-1">Các môn học trong chương trình đào tạo của bạn</p>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">Chưa có môn học nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub: any) => (
            <Link
              key={sub.id}
              href={`/lms/student/subjects/${sub.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-primary/35 transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition">{sub.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Lớp: {sub.className}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
