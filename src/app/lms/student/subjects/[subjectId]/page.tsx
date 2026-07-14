'use client';

import { useCallback, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Beaker, ChevronRight } from 'lucide-react';

export default function StudentSubjectDetail({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadSubject = useCallback(async () => {
    try {
      const res = await fetch(`/api/lms/subjects/${subjectId}`);
      const json = await res.json();
      if (json.success) setSubject(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    void loadSubject();
  }, [loadSubject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-semibold">Không tìm thấy thông tin môn học này.</p>
      </div>
    );
  }

  const theoryLessons = subject.lessons?.filter((l: any) => l.type === 'THEORY').sort((a: any, b: any) => a.orderIndex - b.orderIndex) || [];
  const practicalLessons = subject.lessons?.filter((l: any) => l.type === 'PRACTICAL').sort((a: any, b: any) => a.orderIndex - b.orderIndex) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/lms/student" className="p-2 rounded-xl hover:bg-slate-100 transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{subject.name}</h1>
          <p className="text-sm text-slate-500">Môn học lớp: {subject.class?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lý thuyết */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-950 flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-600" /> Lý thuyết (8 buổi)
          </h2>
          <div className="space-y-3">
            {Array.from({ length: subject.theoryLessons }).map((_, idx) => {
              const order = idx + 1;
              const lesson = theoryLessons.find((l: any) => l.orderIndex === order);
              
              return (
                <div
                  key={`theory-${order}`}
                  className={`bg-white rounded-xl border p-4 transition ${
                    lesson ? 'border-slate-200' : 'border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  {lesson ? (
                    <Link href={`/lms/student/lessons/${lesson.id}`} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {order}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition">
                            {lesson.title}
                          </h4>
                          {lesson.assignments?.length > 0 && (
                            <span className="inline-flex items-center text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded mt-1">
                              📝 Có bài tập
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sm font-medium">
                        {order}
                      </span>
                      <span className="text-xs">Nội dung bài học chưa được cập nhật</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Thực hành */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-950 flex items-center gap-2 mb-1">
            <Beaker className="w-5 h-5 text-emerald-600" /> Thực hành (8 buổi)
          </h2>
          <div className="space-y-3">
            {Array.from({ length: subject.practicalLessons }).map((_, idx) => {
              const order = idx + 1;
              const lesson = practicalLessons.find((l: any) => l.orderIndex === order);
              
              return (
                <div
                  key={`practical-${order}`}
                  className={`bg-white rounded-xl border p-4 transition ${
                    lesson ? 'border-slate-200' : 'border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  {lesson ? (
                    <Link href={`/lms/student/lessons/${lesson.id}`} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          {order}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition">
                            {lesson.title}
                          </h4>
                          {lesson.assignments?.length > 0 && (
                            <span className="inline-flex items-center text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded mt-1">
                              📝 Có bài tập
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sm font-medium">
                        {order}
                      </span>
                      <span className="text-xs">Nội dung bài học chưa được cập nhật</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
