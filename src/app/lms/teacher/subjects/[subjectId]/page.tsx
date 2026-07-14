'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Save, Loader2, Plus, FileText, Beaker } from 'lucide-react';

export default function TeacherSubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [assignmentLessonId, setAssignmentLessonId] = useState<string | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');

  const loadSubject = async () => {
    try {
      const res = await fetch(`/api/lms/subjects/${subjectId}`);
      const json = await res.json();
      if (json.success) setSubject(json.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadSubject(); }, [subjectId]);

  const createLesson = async (type: string, order: number) => {
    setSaving(true);
    try {
      await fetch('/api/lms/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, type, orderIndex: order, title: `Buổi ${order} - ${type === 'THEORY' ? 'Lý thuyết' : 'Thực hành'}` }),
      });
      await loadSubject();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const updateLesson = async (lessonId: string) => {
    setSaving(true);
    try {
      await fetch('/api/lms/lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lessonId, title: lessonTitle, content: lessonContent }),
      });
      setEditingLesson(null);
      await loadSubject();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const startEdit = (lesson: any) => {
    setEditingLesson(lesson.id);
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || '');
  };

  const createAssignment = async (lessonId: string) => {
    if (!assignmentTitle.trim()) return;
    setSaving(true);
    try {
      const response = await fetch('/api/lms/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          title: assignmentTitle.trim(),
          description: assignmentDescription.trim(),
          dueDate: assignmentDueDate || undefined,
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Không thể tạo bài tập');
      setAssignmentLessonId(null);
      setAssignmentTitle('');
      setAssignmentDescription('');
      setAssignmentDueDate('');
      await loadSubject();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!subject) return <div className="text-center py-12 text-slate-500">Không tìm thấy môn học</div>;

  const theoryLessons = subject.lessons?.filter((l: any) => l.type === 'THEORY').sort((a: any, b: any) => a.orderIndex - b.orderIndex) || [];
  const practicalLessons = subject.lessons?.filter((l: any) => l.type === 'PRACTICAL').sort((a: any, b: any) => a.orderIndex - b.orderIndex) || [];

  const renderLessonList = (lessons: any[], type: string, maxCount: number) => (
    <div className="space-y-2">
      {Array.from({ length: maxCount }, (_, i) => i + 1).map((order) => {
        const lesson = lessons.find((l: any) => l.orderIndex === order);
        const isEditing = editingLesson === lesson?.id;

        return (
          <div key={`${type}-${order}`} className={`bg-white rounded-xl border p-4 transition ${
            lesson ? 'border-slate-200' : 'border-dashed border-slate-300'
          }`}>
            {lesson ? (
              isEditing ? (
                <div className="space-y-3">
                  <input type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} rows={6}
                    placeholder="Nhập nội dung bài học..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y" />
                  <div className="flex gap-2">
                    <button onClick={() => updateLesson(lesson.id)} disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50">
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Lưu
                    </button>
                    <button onClick={() => setEditingLesson(null)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition cursor-pointer">
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between cursor-pointer" onClick={() => startEdit(lesson)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        type === 'THEORY' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>{order}</span>
                      <h4 className="text-sm font-bold text-slate-900">{lesson.title}</h4>
                    </div>
                    {lesson.content && <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 ml-8">{lesson.content.substring(0, 150)}...</p>}
                    {lesson.assignments?.length > 0 && (
                      <p className="text-xs text-amber-600 font-semibold mt-1 ml-8">📝 {lesson.assignments.length} bài tập</p>
                    )}
                  </div>
                  <span className="text-xs text-primary font-bold hover:underline">Sửa</span>
                </div>
              )
            ) : (
              <button onClick={() => createLesson(type, order)} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-primary transition cursor-pointer">
                <Plus className="w-4 h-4" /> Tạo buổi {order}
              </button>
            )}
            {lesson && !isEditing && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="space-y-2">
                  {lesson.assignments?.map((assignment: any) => (
                    <div key={assignment.id} className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-xs">
                      <span className="font-semibold text-amber-900">{assignment.title}</span>
                      <span className="text-amber-700">{assignment._count?.submissions || 0} bài nộp</span>
                    </div>
                  ))}
                </div>
                {assignmentLessonId === lesson.id ? (
                  <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3">
                    <input value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder="Tên bài tập *"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <textarea value={assignmentDescription} onChange={(event) => setAssignmentDescription(event.target.value)} placeholder="Yêu cầu và tiêu chí chấm bài"
                      rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input type="datetime-local" value={assignmentDueDate} onChange={(event) => setAssignmentDueDate(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <div className="flex gap-2">
                      <button onClick={() => createAssignment(lesson.id)} disabled={saving || !assignmentTitle.trim()}
                        className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Tạo bài tập</button>
                      <button onClick={() => setAssignmentLessonId(null)} className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-600">Hủy</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAssignmentLessonId(lesson.id)} className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-700">
                    <FileText className="h-3.5 w-3.5" /> Thêm bài tập
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/lms/teacher/classes/${subject.classId}`} className="p-2 rounded-xl hover:bg-slate-100 transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{subject.name}</h1>
          <p className="text-sm text-slate-500">Lớp: {subject.class?.name} · {subject.theoryLessons} LT + {subject.practicalLessons} TH</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theory */}
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" /> Lý thuyết ({theoryLessons.length}/{subject.theoryLessons})
          </h2>
          {renderLessonList(theoryLessons, 'THEORY', subject.theoryLessons)}
        </div>

        {/* Practical */}
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
            <Beaker className="w-5 h-5 text-emerald-600" /> Thực hành ({practicalLessons.length}/{subject.practicalLessons})
          </h2>
          {renderLessonList(practicalLessons, 'PRACTICAL', subject.practicalLessons)}
        </div>
      </div>
    </div>
  );
}
