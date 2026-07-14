'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, UserPlus, BookOpen, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Teacher { id: string; name: string; username: string; }
interface Student { id: string; name: string; username: string; }

export default function CreateClassPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [subjects, setSubjects] = useState(['', '', '', '']);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // New user quick-add
  const [newTeacherUsername, setNewTeacherUsername] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);

  const loadUsers = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        fetch('/api/lms/users?role=TEACHER'),
        fetch('/api/lms/users?role=STUDENT'),
      ]);
      const tJson = await tRes.json();
      const sJson = await sRes.json();
      if (tJson.success) setTeachers(tJson.data);
      if (sJson.success) setStudents(sJson.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const quickAddTeacher = async () => {
    if (!newTeacherUsername.trim() || !newTeacherName.trim()) {
      setError('Nhập đúng username NKS và họ tên giáo viên.');
      return;
    }
    setError('');
    setAddingTeacher(true);
    try {
      const res = await fetch('/api/lms/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newTeacherUsername.trim(),
          name: newTeacherName.trim(),
          role: 'TEACHER',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTeachers((prev) => [...prev, json.data]);
        setTeacherId(json.data.id);
        setNewTeacherUsername('');
        setNewTeacherName('');
      } else setError(json.error || 'Không thể cấp vai trò giáo viên.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể cấp vai trò giáo viên.'); }
    setAddingTeacher(false);
  };

  const quickAddStudent = async () => {
    if (!newStudentUsername.trim() || !newStudentName.trim()) {
      setError('Nhập đúng username NKS và họ tên học sinh.');
      return;
    }
    setError('');
    setAddingStudent(true);
    try {
      const res = await fetch('/api/lms/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newStudentUsername.trim(),
          name: newStudentName.trim(),
          role: 'STUDENT',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStudents((prev) => [...prev, json.data]);
        setSelectedStudents((prev) => [...prev, json.data.id]);
        setNewStudentUsername('');
        setNewStudentName('');
      } else setError(json.error || 'Không thể cấp tài khoản học sinh.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể cấp tài khoản học sinh.'); }
    setAddingStudent(false);
  };

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) { setError('Vui lòng nhập tên lớp'); return; }
    if (!teacherId) { setError('Vui lòng chọn giáo viên'); return; }
    const validSubjects = subjects.filter((s) => s.trim());
    if (validSubjects.length === 0) { setError('Vui lòng nhập ít nhất 1 môn học'); return; }

    setSaving(true);
    try {
      // 1. Tạo lớp + môn
      const res = await fetch('/api/lms/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, teacherId, subjects: validSubjects, studentIds: selectedStudents }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); setSaving(false); return; }

      router.push('/lms/admin');
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= 25 ? prev : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/lms/admin" className="p-2 rounded-xl hover:bg-slate-100 transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tạo lớp học mới</h1>
          <p className="text-sm text-slate-500">Tạo lớp, gán giáo viên, thêm môn học và học sinh</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold">{error}</div>
      )}

      {/* Tên lớp */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Thông tin lớp</h2>
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">Tên lớp học *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Lớp Web Full-Stack K01"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>

        {/* Chọn GV */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">Giáo viên phụ trách *</label>
          <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
            <option value="">Chọn giáo viên...</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name} (@{t.username})</option>)}
          </select>
          <p className="mt-2 text-xs text-slate-400">Chỉ cấp vai trò bằng username chính xác của tài khoản NKS; không tự tạo username từ họ tên.</p>
          <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-[1fr_1fr_auto]">
            <input type="text" value={newTeacherUsername} onChange={(e) => setNewTeacherUsername(e.target.value)} placeholder="Username NKS"
              className="min-w-0 px-3 py-2 rounded-lg border border-slate-200 text-xs" />
            <input type="text" value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} placeholder="Họ tên giáo viên"
              className="min-w-0 px-3 py-2 rounded-lg border border-slate-200 text-xs" />
            <button onClick={quickAddTeacher} disabled={addingTeacher} className="px-3 py-2 bg-blue-50 text-primary rounded-lg text-xs font-bold hover:bg-blue-100 transition disabled:opacity-50 cursor-pointer">
              {addingTeacher ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Plus className="w-3 h-3 inline" /> Thêm</>}
            </button>
          </div>
        </div>
      </div>

      {/* Môn học */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Môn học (tối đa 4)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((s, i) => (
            <input key={i} type="text" value={s} onChange={(e) => { const n = [...subjects]; n[i] = e.target.value; setSubjects(n); }}
              placeholder={`Môn ${i + 1}`}
              className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          ))}
        </div>
      </div>

      {/* Học sinh */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Học sinh ({selectedStudents.length}/25)</h2>
        </div>
        <p className="text-xs text-slate-400">Học sinh cần có tài khoản NKS; nhập đúng username để liên kết khi đăng nhập.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input type="text" value={newStudentUsername} onChange={(e) => setNewStudentUsername(e.target.value)} placeholder="Username NKS"
            className="min-w-0 px-3 py-2 rounded-lg border border-slate-200 text-xs" />
          <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder="Họ tên học sinh"
            className="min-w-0 px-3 py-2 rounded-lg border border-slate-200 text-xs" />
          <button onClick={quickAddStudent} disabled={addingStudent} className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition disabled:opacity-50 cursor-pointer">
            {addingStudent ? <Loader2 className="w-3 h-3 animate-spin" /> : <><UserPlus className="w-3 h-3 inline" /> Thêm</>}
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-1.5">
          {students.map((s) => (
            <label key={s.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition ${
              selectedStudents.includes(s.id) ? 'bg-primary/5 border border-primary/20' : 'hover:bg-slate-50 border border-transparent'
            }`}>
              <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudent(s.id)}
                className="w-4 h-4 rounded text-primary" />
              <span className="text-sm font-medium text-slate-700">{s.name}</span>
              <span className="text-xs text-slate-400">@{s.username}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={saving}
        className="w-full py-4 bg-primary hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 transition flex items-center justify-center gap-2 cursor-pointer">
        {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang tạo...</> : <><Save className="w-5 h-5" /> Tạo lớp học</>}
      </button>
    </div>
  );
}
