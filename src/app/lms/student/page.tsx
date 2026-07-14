'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, GraduationCap, Clock, FileText, ClipboardCheck, AlertCircle, ChevronRight } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudentData = async () => {
    try {
      // Fetch classes for the student. Since user.id might be the lmsUser id or NKS user id,
      // let's fetch all classes and filter client-side or use a dedicated endpoint if available.
      // In this setup, GET /api/lms/classes returns all classes with their students.
      const classRes = await fetch('/api/lms/classes');
      const classJson = await classRes.json();
      
      if (classJson.success && user) {
        // Filter classes where the student is enrolled
        const studentClasses = classJson.data.filter((c: any) => 
          c.students?.some((s: any) => s.student.username === user.username)
        );
        setClasses(studentClasses);

        if (studentClasses.length > 0) {
          const classIds = studentClasses.map((c: any) => c.id);
          
          // Fetch exams for these classes
          const examRes = await fetch(`/api/lms/exams/config?classId=${classIds[0]}`);
          const examJson = await examRes.json();
          if (examJson.success) {
            setExams(examJson.data);
          }

          // Fetch submissions/assignments for this student
          // We can fetch submissions for the student to see status
          const userRes = await fetch(`/api/lms/users`);
          const userJson = await userRes.json();
          if (userJson.success) {
            const dbUser = userJson.data.find((u: any) => u.username === user.username);
            if (dbUser) {
              const subResReal = await fetch(`/api/lms/submissions?studentId=${dbUser.id}`);
              const subJsonReal = await subResReal.json();
              if (subJsonReal.success) {
                setAssignments(subJsonReal.data);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Error loading student data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Cổng học tập học sinh</h1>
        <p className="text-sm text-slate-500 mt-1">Xem bài giảng, nộp bài tập và tham gia làm bài thi trắc nghiệm</p>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">Bạn chưa được xếp vào lớp học nào.</p>
          <p className="text-xs text-slate-400 mt-1">Vui lòng liên hệ Admin để được thêm vào lớp học.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrolled Classes */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Lớp học của tôi</h2>
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{cls.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">Giáo viên phụ trách: {cls.teacher?.name || 'Chưa phân công'}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">Đang học</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {cls.subjects?.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/lms/student/subjects/${sub.id}`}
                          className="p-4 border border-slate-100 rounded-xl hover:border-primary/35 hover:bg-slate-50/50 transition group flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Môn học</span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-primary transition">{sub.name}</h4>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
                            <span>16 buổi học</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments & Submissions status */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Bài tập gần đây</h2>
              {assignments.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
                  Chưa có bài nộp hoặc bài tập được giao.
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {assignments.slice(0, 5).map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={`/lms/student/assignments/${sub.assignmentId}`}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition block"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">{sub.assignment?.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Môn: {sub.assignment?.lesson?.subject?.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {sub.grade !== null && (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {sub.grade}đ
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          sub.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-700' :
                          sub.status === 'AI_GRADED' ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {sub.status === 'REVIEWED' ? 'Đã duyệt' :
                           sub.status === 'AI_GRADED' ? 'AI đã chấm' :
                           'Chờ chấm'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Exams List Sidebar */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Lịch thi trắc nghiệm</h2>
            {exams.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
                Chưa có lịch thi nào được lên.
              </div>
            ) : (
              <div className="space-y-3">
                {exams.map((exam: any) => (
                  <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[10px] font-bold uppercase tracking-wider">
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
        </div>
      )}
    </div>
  );
}
