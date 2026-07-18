'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Lock, Clock, FileText } from 'lucide-react';

export default function CreateExamPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examType, setExamType] = useState('MIDTERM');
  const [questionCount, setQuestionCount] = useState(30);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [lessonOrder, setLessonOrder] = useState(1);
  const [lessonType, setLessonType] = useState<'THEORY' | 'PRACTICAL'>('THEORY');
  const [password, setPassword] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadClasses = async () => {
    try {
      const res = await fetch('/api/lms/classes');
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Không thể tải danh sách lớp.');
      setClasses(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tải danh sách lớp.');
    }
  };

  useEffect(() => { loadClasses(); }, []);

  useEffect(() => {
    if (examType === 'MIDTERM') setQuestionCount(30);
    else if (examType === 'FINAL') setQuestionCount(50);
    else setQuestionCount(10);
  }, [examType]);

  const selectedClass = classes.find((c) => c.id === classId);
  const selectedSubject = selectedClass?.subjects?.find((subject: any) => subject.id === subjectId);
  const maxLessonOrder = Math.max(selectedSubject?.theoryLessons || 0, selectedSubject?.practicalLessons || 0, 1);

  const handleSubmit = async () => {
    setError('');
    if (!classId || !subjectId) { setError('Chọn lớp và môn học'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/lms/exams/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          subjectId,
          examType,
          questionCount,
          durationMinutes,
          lessonOrder: examType === 'LESSON_QUIZ' ? lessonOrder : null,
          lessonType: examType === 'LESSON_QUIZ' ? lessonType : null,
          password: password || null,
          startTime: startTime ? new Date(startTime).toISOString() : null,
          endTime: endTime ? new Date(endTime).toISOString() : null,
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) router.push(`/lms/teacher/classes/${classId}`);
      else setError(json.error);
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể tạo cấu hình bài thi.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/lms/teacher" className="p-2 rounded-xl hover:bg-slate-100 transition"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tạo đề thi</h1>
          <p className="text-sm text-slate-500">Cấu hình thi — AI sẽ tự sinh câu hỏi khi học sinh vào thi</p>
        </div>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
        {/* Class */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">Lớp học *</label>
            <select value={classId} onChange={(e) => { setClassId(e.target.value); setSubjectId(''); setLessonOrder(1); }}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Chọn lớp...</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Subject */}
        {classId && (
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">Môn học *</label>
            <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setLessonOrder(1); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Chọn môn...</option>
              {selectedClass?.subjects?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}

        {/* Exam Type */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1.5">Loại bài thi</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'LESSON_QUIZ', label: 'Quiz buổi học', desc: 'Kiểm tra ngắn' },
              { value: 'MIDTERM', label: 'Giữa kỳ', desc: '30 câu' },
              { value: 'FINAL', label: 'Cuối kỳ', desc: '50 câu' },
            ].map((type) => (
              <button key={type.value} onClick={() => setExamType(type.value)}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  examType === type.value ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                <p className="text-sm font-bold">{type.label}</p>
                <p className="text-xs opacity-70">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Config */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1 mb-1.5"><FileText className="w-3.5 h-3.5" /> Số câu hỏi</label>
            <input type="number" min={examType === 'MIDTERM' ? 30 : examType === 'FINAL' ? 50 : 5} max={examType === 'MIDTERM' ? 30 : examType === 'FINAL' ? 50 : 100} value={questionCount} readOnly={examType !== 'LESSON_QUIZ'} onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-center" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1 mb-1.5"><Clock className="w-3.5 h-3.5" /> Thời gian (phút)</label>
            <input type="number" min={5} max={180} value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-center" />
          </div>
        </div>

        {examType === 'LESSON_QUIZ' && (<>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">Buổi học dùng cho quiz</label>
            <input
              type="number"
              min={1}
              max={maxLessonOrder}
              value={lessonOrder}
              onChange={(event) => setLessonOrder(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">Loại buổi học</label>
            <select value={lessonType} onChange={(event) => setLessonType(event.target.value as 'THEORY' | 'PRACTICAL')} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm">
              <option value="THEORY">Lý thuyết</option>
              <option value="PRACTICAL">Thực hành</option>
            </select>
          </div>
        </>)}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">Thời gian mở (tùy chọn)</label>
            <input type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">Thời gian đóng (tùy chọn)</label>
            <input type="datetime-local" value={endTime} onChange={(event) => setEndTime(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-bold text-slate-600 flex items-center gap-1 mb-1.5"><Lock className="w-3.5 h-3.5" /> Mật khẩu thi (tuỳ chọn)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Để trống nếu không cần mật khẩu"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
          <p className="text-xs text-slate-400 mt-1">Học sinh phải nhập đúng mật khẩu mới được vào thi</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
        <strong>Lưu ý:</strong> Câu hỏi trắc nghiệm sẽ được AI tự động sinh khi học sinh bắt đầu thi. Bạn chỉ cần cấu hình số câu, thời gian và mật khẩu.
      </div>

      <button onClick={handleSubmit} disabled={saving}
        className="w-full py-4 bg-primary hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
        {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang tạo...</> : <><Save className="w-5 h-5" /> Tạo cấu hình thi</>}
      </button>
    </div>
  );
}
