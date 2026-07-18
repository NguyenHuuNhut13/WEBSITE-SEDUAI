'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, FileText, BarChart3, PenTool } from 'lucide-react';

export default function TeacherClassDetail({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'subjects' | 'students' | 'exams'>('subjects');
  const [examActionId, setExamActionId] = useState<string | null>(null);

  const loadClass = useCallback(async () => {
    try {
      const res = await fetch(`/api/lms/classes/${classId}`);
      const json = await res.json();
      if (json.success) setClassData(json.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [classId]);

  useEffect(() => {
    void loadClass();
  }, [loadClass]);

  const handleExamAction = async (examConfigId: string, action: 'generate' | 'publish') => {
    setExamActionId(examConfigId);
    try {
      const response = await fetch('/api/lms/exams/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examConfigId, action }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || 'Không thể cập nhật đề thi');
      await loadClass();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Không thể cập nhật đề thi');
    } finally {
      setExamActionId(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!classData) {
    return <div className="text-center py-12"><p className="text-slate-500">Không tìm thấy lớp học</p></div>;
  }

  const tabs = [
    { key: 'subjects', label: 'Môn học', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'students', label: 'Học sinh', icon: <Users className="w-4 h-4" /> },
    { key: 'exams', label: 'Bài thi', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/lms/teacher" className="p-2 rounded-xl hover:bg-slate-100 transition"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-slate-900">{classData.name}</h1>
          <p className="text-sm text-slate-500">GV: {classData.teacher?.name} · {classData.students?.length || 0}/25 HS · {classData.subjects?.length || 0} môn</p>
        </div>
        <Link href={`/lms/teacher/dashboard/${classId}`} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition">
          <BarChart3 className="w-4 h-4" /> Dashboard
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
              activeTab === tab.key ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classData.subjects?.map((sub: any) => {
            const lessonCount = sub.lessons?.length || 0;
            const totalLessons = sub.theoryLessons + sub.practicalLessons;
            const progress = totalLessons > 0 ? Math.round((lessonCount / totalLessons) * 100) : 0;
            return (
              <Link key={sub.id} href={`/lms/teacher/subjects/${sub.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-primary/30 transition group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary">{sub.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{sub.theoryLessons} buổi LT + {sub.practicalLessons} buổi TH</p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-2">{lessonCount}/{totalLessons} bài học đã soạn</p>
              </Link>
            );
          })}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <th className="text-left px-5 py-3">#</th>
                <th className="text-left px-5 py-3">Học sinh</th>
                <th className="text-left px-5 py-3">Username</th>
                <th className="text-left px-5 py-3">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classData.students?.map((enrollment: any, i: number) => (
                <tr key={enrollment.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-sm text-slate-500">{i + 1}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-900">{enrollment.student?.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">@{enrollment.student?.username}</td>
                  <td className="px-5 py-3 text-xs text-slate-400">{new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!classData.students || classData.students.length === 0) && (
            <div className="p-8 text-center text-slate-400 text-sm">Chưa có học sinh trong lớp</div>
          )}
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="space-y-3">
          <Link href="/lms/teacher/exams/create" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition w-fit">
            <PenTool className="w-4 h-4" /> Tạo đề thi mới
          </Link>
          {classData.examConfigs?.map((exam: any) => (
            <div key={exam.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {exam.examType === 'MIDTERM' ? '🏆 Giữa kỳ' : exam.examType === 'FINAL' ? '🎯 Cuối kỳ' : '📝 Quiz buổi'} — {exam.subject?.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {exam.questionCount} câu · {exam.durationMinutes} phút · {exam._count?.results || 0} lượt thi
                </p>
              </div>
              <div className="flex items-center gap-2">
                {exam.hasPassword && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-bold">🔒 Có mật khẩu</span>}
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-bold">{exam._count?.results || 0} kết quả</span>
                {exam.questionStatus !== 'PUBLISHED' && <button type="button" disabled={examActionId === exam.id} onClick={() => void handleExamAction(exam.id, 'generate')} className="text-xs rounded-lg bg-blue-50 px-2 py-1 font-bold text-blue-700 disabled:opacity-50">{exam.questionStatus === 'GENERATED' ? 'Sinh lại đề' : 'Sinh đề AI'}</button>}
                {exam.questionStatus === 'GENERATED' && <button type="button" disabled={examActionId === exam.id} onClick={() => void handleExamAction(exam.id, 'publish')} className="text-xs rounded-lg bg-emerald-50 px-2 py-1 font-bold text-emerald-700 disabled:opacity-50">Duyệt & công bố</button>}
                {exam.questionStatus === 'PUBLISHED' && <span className="text-xs rounded-lg bg-emerald-100 px-2 py-1 font-bold text-emerald-700">Đã công bố</span>}
              </div>
            </div>
          ))}
          {(!classData.examConfigs || classData.examConfigs.length === 0) && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">Chưa có đề thi nào</div>
          )}
        </div>
      )}
    </div>
  );
}
