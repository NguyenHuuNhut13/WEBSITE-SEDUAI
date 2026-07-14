'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Loader2, Plus, Trash2, Users } from 'lucide-react';

export default function AdminClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const [classData, setClassData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [classResponse, studentResponse] = await Promise.all([
        fetch(`/api/lms/classes/${classId}`),
        fetch('/api/lms/users?role=STUDENT'),
      ]);
      const [classResult, studentResult] = await Promise.all([classResponse.json(), studentResponse.json()]);
      if (classResult.success) setClassData(classResult.data);
      if (studentResult.success) setStudents(studentResult.data);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const availableStudents = useMemo(() => {
    const enrolledIds = new Set(classData?.students?.map((item: any) => item.studentId) || []);
    return students.filter((student) => !enrolledIds.has(student.id));
  }, [classData, students]);

  const addStudent = async () => {
    if (!selectedStudentId) return;
    setSaving(true);
    setMessage('');
    const response = await fetch(`/api/lms/classes/${classId}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: selectedStudentId }),
    });
    const result = await response.json();
    setMessage(result.success ? 'Đã thêm học sinh vào lớp.' : result.error);
    if (result.success) {
      setSelectedStudentId('');
      await loadData();
    }
    setSaving(false);
  };

  const removeStudent = async (studentId: string) => {
    setSaving(true);
    setMessage('');
    const response = await fetch(`/api/lms/classes/${classId}/students`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    const result = await response.json();
    setMessage(result.success ? 'Đã xóa học sinh khỏi lớp.' : result.error);
    if (result.success) await loadData();
    setSaving(false);
  };

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-primary" /></div>;
  if (!classData) return <div className="py-12 text-center text-slate-500">Không tìm thấy lớp học.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/lms/admin" className="rounded-xl p-2 hover:bg-slate-100"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{classData.name}</h1>
          <p className="text-sm text-slate-500">Giáo viên: {classData.teacher?.name} · {classData.students?.length || 0}/{classData.maxStudents} học sinh</p>
        </div>
      </div>

      {message && <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">{message}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><BookOpen className="h-5 w-5 text-primary" /> Môn học</h2>
          <div className="space-y-2">
            {classData.subjects?.map((subject: any) => <div key={subject.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold">{subject.name}</div>)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Plus className="h-5 w-5 text-emerald-600" /> Thêm học sinh</h2>
          <div className="flex gap-2">
            <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
              <option value="">Chọn học sinh...</option>
              {availableStudents.map((student) => <option key={student.id} value={student.id}>{student.name} (@{student.username})</option>)}
            </select>
            <button onClick={addStudent} disabled={saving || !selectedStudentId || classData.students.length >= classData.maxStudents} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Thêm</button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5"><h2 className="flex items-center gap-2 font-bold"><Users className="h-5 w-5 text-primary" /> Danh sách học sinh</h2></div>
        {classData.students?.length ? (
          <div className="divide-y divide-slate-100">
            {classData.students.map((enrollment: any, index: number) => (
              <div key={enrollment.id} className="flex items-center justify-between px-5 py-4">
                <div><p className="text-sm font-bold text-slate-900">{index + 1}. {enrollment.student.name}</p><p className="text-xs text-slate-500">@{enrollment.student.username}</p></div>
                <button onClick={() => removeStudent(enrollment.studentId)} disabled={saving} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50" aria-label={`Xóa ${enrollment.student.name}`}><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        ) : <div className="p-8 text-center text-sm text-slate-400">Lớp chưa có học sinh.</div>}
      </div>
    </div>
  );
}
