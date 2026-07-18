'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ClipboardCheck, AlertCircle, ChevronRight, BookOpen, FileText,
  GraduationCap, Clock, Sparkles,
} from 'lucide-react';

export default function StudentDashboard() {
  const { lmsUserId, localSync } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudentData = useCallback(async () => {
    if (!lmsUserId) return;
    try {
      const classRes = await fetch('/api/lms/classes');
      const classJson = await classRes.json();
      
      if (classJson.success) {
        const studentClasses = classJson.data;
        setClasses(studentClasses);

        if (studentClasses.length > 0) {
          const [examRes, assignmentRes] = await Promise.all([
            fetch('/api/lms/exams/config'),
            fetch(`/api/lms/assignments?studentId=${encodeURIComponent(lmsUserId)}`)
          ]);

          const [examJson, assignmentJson] = await Promise.all([
            examRes.json(),
            assignmentRes.json()
          ]);

          if (examJson.success) setExams(examJson.data);
          if (assignmentJson.success) setAssignments(assignmentJson.data);
        }
      }
    } catch (e) {
      console.error('Error loading student data:', e);
    } finally {
      setLoading(false);
    }
  }, [lmsUserId]);

  useEffect(() => {
    void loadStudentData();
  }, [loadStudentData]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Shimmer hero */}
        <div className="lms-shimmer h-32 rounded-2xl" />
        {/* Shimmer stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="lms-shimmer h-24 rounded-2xl" />)}
        </div>
        {/* Shimmer cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => <div key={i} className="lms-shimmer h-48 rounded-2xl" />)}
          </div>
          <div className="lms-shimmer h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const pendingCount = assignments.filter((a) => !a.submissions?.[0]).length;
  const gradedCount = assignments.filter((a) => a.submissions?.[0]?.status === 'REVIEWED' || a.submissions?.[0]?.status === 'AI_GRADED').length;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-4 w-4" /> Cổng học tập
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">Tổng quan học tập</h1>
          <p className="mt-2 text-sm text-slate-500">Xin chào {localSync.name || 'Học sinh'}, tiếp tục việc học của bạn hôm nay.</p>
        </div>
        <div className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 sm:block">Học kỳ hiện tại</div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Lớp đang học', value: classes.length, icon: <GraduationCap className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Bài tập chưa nộp', value: pendingCount, icon: <FileText className="w-6 h-6" />, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
          { label: 'Bài đã chấm', value: gradedCount, icon: <ClipboardCheck className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
        ].map((stat) => (
          <div key={stat.label} className="lms-card bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm lms-fade-up">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 lms-stat-number">{stat.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-600 font-bold text-lg">Bạn chưa được xếp vào lớp học nào</p>
          <p className="text-sm text-slate-400 mt-2">Vui lòng liên hệ Admin để được thêm vào lớp học.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrolled Classes + Assignments */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Lớp học của tôi
              </h2>
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="lms-card bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm lms-fade-up">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{cls.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Giáo viên: {cls.teacher?.name || 'Chưa phân công'}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                        Đang học
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                      {cls.subjects?.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/lms/student/subjects/${sub.id}`}
                          className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Môn học</span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-primary transition">{sub.name}</h4>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Bài giảng</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Bài tập gần đây
              </h2>
              {assignments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center text-slate-400 text-sm shadow-sm">
                  Chưa có bài nộp hoặc bài tập được giao.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/60 divide-y divide-slate-100 overflow-hidden shadow-sm">
                  {assignments.slice(0, 5).map((assignment: any) => {
                    const sub = assignment.submissions?.[0];
                    return (
                    <Link
                      key={assignment.id}
                      href={`/lms/student/assignments/${assignment.id}`}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          sub?.status === 'REVIEWED' ? 'bg-emerald-500' :
                          sub?.status === 'AI_GRADED' ? 'bg-blue-500' :
                          sub ? 'bg-amber-500' : 'bg-slate-300'
                        }`} />
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition">{assignment.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Môn: {assignment.lesson?.subject?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {sub?.grade !== null && sub?.grade !== undefined && (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {sub.grade}đ
                          </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          sub?.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          sub?.status === 'AI_GRADED' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {sub?.status === 'REVIEWED' ? 'Đã duyệt' :
                           sub?.status === 'AI_GRADED' ? 'AI đã chấm' :
                           sub ? 'Chờ chấm' : 'Chưa nộp'}
                        </span>
                      </div>
                    </Link>
                  );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Exams Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-rose-500" />
              Lịch thi trắc nghiệm
            </h2>
            {exams.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center text-slate-400 text-sm shadow-sm">
                <Clock className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                Chưa có lịch thi nào.
              </div>
            ) : (
              <div className="space-y-3">
                {exams.map((exam: any) => (
                  <div key={exam.id} className="lms-card bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-4 lms-fade-up">
                    <div>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        exam.examType === 'MIDTERM' ? 'bg-violet-50 text-violet-700 border-violet-100' :
                        exam.examType === 'FINAL' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        'bg-sky-50 text-sky-700 border-sky-100'
                      }`}>
                        {exam.examType === 'MIDTERM' ? 'Giữa kỳ' : exam.examType === 'FINAL' ? 'Cuối kỳ' : 'Quiz'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-2">{exam.subject?.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {exam.questionCount} câu</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exam.durationMinutes} phút</span>
                      </div>
                    </div>

                    {exam.canStart || exam.questionStatus === 'PUBLISHED' ? (
                      <Link
                        href={`/lms/student/exams/${exam.id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-500/20 transition cursor-pointer"
                      >
                        <ClipboardCheck className="w-4 h-4" /> Vào phòng thi
                      </Link>
                    ) : (
                      <div className="w-full rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-center text-xs font-semibold text-amber-700">
                        {exam.questionStatus === 'GENERATED' ? 'Chờ giáo viên duyệt đề' : 'Đang chuẩn bị đề'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
