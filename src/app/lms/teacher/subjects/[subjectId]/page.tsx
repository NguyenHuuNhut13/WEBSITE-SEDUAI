'use client';

import { useCallback, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Save, Loader2, Plus, FileText, Beaker, Sparkles, AlertCircle } from 'lucide-react';

function toLocalDateTimeInput(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  return value ? new Date(value).toISOString() : null;
}

export default function TeacherSubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [lessonStep, setLessonStep] = useState<1 | 2 | 3>(1);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonObjectives, setLessonObjectives] = useState('');
  const [lessonPreparation, setLessonPreparation] = useState('');
  const [lessonActivities, setLessonActivities] = useState('');
  const [lessonAssessment, setLessonAssessment] = useState('');
  const [lessonStatus, setLessonStatus] = useState('DRAFT');
  const [lessonAttachments, setLessonAttachments] = useState<any[]>([]);
  const [lessonFiles, setLessonFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [assignmentLessonId, setAssignmentLessonId] = useState<string | null>(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentRubric, setAssignmentRubric] = useState('');
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [allowResubmission, setAllowResubmission] = useState(false);
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [operationError, setOperationError] = useState('');
  const [previewQuizConfig, setPreviewQuizConfig] = useState<any | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handlePreviewQuiz = async (config: any) => {
    setPreviewQuizConfig(config);
    setLoadingQuestions(true);
    try {
      const res = await fetch(`/api/lms/exams/questions?examConfigId=${config.id}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setPreviewQuestions(json.data.questions || []);
      } else {
        setPreviewQuestions([]);
      }
    } catch {
      setPreviewQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAiGenerateLesson = async (type: string, order: number) => {
    setSaving(true);
    setOperationError('');
    try {
      const response = await fetch('/api/lms/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subject.name,
          lessonType: type,
          orderIndex: order
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Không thể sinh nội dung bài học bằng AI.');
      
      const { title, objectives, preparation, activities, content, assessment } = result.data;
      setLessonTitle(title);
      setLessonObjectives(objectives);
      setLessonPreparation(preparation);
      setLessonActivities(activities);
      setLessonContent(content);
      setLessonAssessment(assessment);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể sinh nội dung bài học bằng AI.');
    } finally {
      setSaving(false);
    }
  };

  const handleAiGenerateAssignment = async (lesson: any) => {
    setSaving(true);
    setOperationError('');
    try {
      const response = await fetch('/api/lms/ai/generate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          lessonObjectives: lesson.objectives || '',
          lessonContent: lesson.content || ''
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Không thể sinh bài tập bằng AI.');
      
      const { title, description, rubric } = result.data;
      setAssignmentTitle(title);
      setAssignmentDescription(description);
      setAssignmentRubric(rubric);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể sinh bài tập bằng AI.');
    } finally {
      setSaving(false);
    }
  };

  const handleAiGenerateLessonQuiz = async (lessonId: string) => {
    setSaving(true);
    setOperationError('');
    try {
      const response = await fetch('/api/lms/ai/generate-lesson-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || 'Không thể sinh Quiz bằng AI.');
      await loadSubject();
      if (json.data) {
        await handlePreviewQuiz(json.data);
      }
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể sinh Quiz bằng AI.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishQuiz = async (examConfigId: string) => {
    setSaving(true);
    setOperationError('');
    try {
      const response = await fetch('/api/lms/exams/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examConfigId, action: 'publish' }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || 'Không thể công bố đề thi');
      await loadSubject();
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể công bố đề thi');
    } finally {
      setSaving(false);
    }
  };

  const loadSubject = useCallback(async () => {
    try {
      const res = await fetch(`/api/lms/subjects/${subjectId}`);
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Không thể tải môn học.');
      setSubject(json.data);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể tải môn học.');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => { void loadSubject(); }, [loadSubject]);

  const createLesson = async (type: string, order: number) => {
    setSaving(true);
    setOperationError('');
    try {
      const response = await fetch('/api/lms/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, type, orderIndex: order, title: `Buổi ${order} - ${type === 'THEORY' ? 'Lý thuyết' : 'Thực hành'}` }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.error || 'Không thể tạo bài học.');
      await loadSubject();
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể tạo bài học.');
    } finally {
      setSaving(false);
    }
  };

  const updateLesson = async (lessonId: string) => {
    setSaving(true);
    setOperationError('');
    try {
      const uploaded = await Promise.all(lessonFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await fetch('/api/lms/uploads', { method: 'POST', body: formData });
        const uploadJson = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadJson.success) throw new Error(uploadJson.error || 'Không thể tải học liệu lên.');
        return uploadJson.data;
      }));
      const response = await fetch('/api/lms/lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lessonId,
          title: lessonTitle,
          content: lessonContent,
          objectives: lessonObjectives,
          preparation: lessonPreparation,
          activities: lessonActivities,
          assessment: lessonAssessment,
          status: lessonStatus,
          attachments: [...lessonAttachments, ...uploaded],
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.error || 'Không thể cập nhật bài học.');
      setEditingLesson(null);
      await loadSubject();
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể cập nhật bài học.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (lesson: any) => {
    setEditingLesson(lesson.id);
    setLessonStep(1);
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || '');
    setLessonObjectives(lesson.objectives || '');
    setLessonPreparation(lesson.preparation || '');
    setLessonActivities(lesson.activities || '');
    setLessonAssessment(lesson.assessment || '');
    setLessonStatus(lesson.status || 'DRAFT');
    try { setLessonAttachments(lesson.attachments ? JSON.parse(lesson.attachments) : []); } catch { setLessonAttachments([]); }
    setLessonFiles([]);
  };

  const createAssignment = async (lessonId: string) => {
    if (!assignmentTitle.trim()) return;
    setSaving(true);
    setOperationError('');
    try {
      const response = await fetch('/api/lms/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          title: assignmentTitle.trim(),
          description: assignmentDescription.trim(),
          rubric: assignmentRubric.trim(),
          allowLateSubmission,
          allowResubmission,
          dueDate: assignmentDueDate ? toIsoDateTime(assignmentDueDate) : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Không thể tạo bài tập');
      resetAssignmentForm();
      await loadSubject();
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể tạo bài tập');
    } finally {
      setSaving(false);
    }
  };

  const resetAssignmentForm = () => {
    setAssignmentLessonId(null);
    setEditingAssignmentId(null);
    setAssignmentTitle('');
    setAssignmentDescription('');
    setAssignmentRubric('');
    setAllowLateSubmission(false);
    setAllowResubmission(false);
    setAssignmentDueDate('');
  };

  const startCreateAssignment = (lessonId: string) => {
    resetAssignmentForm();
    setAssignmentLessonId(lessonId);
    setOperationError('');
  };

  const startEditAssignment = (lessonId: string, assignment: any) => {
    setAssignmentLessonId(lessonId);
    setEditingAssignmentId(assignment.id);
    setAssignmentTitle(assignment.title || '');
    setAssignmentDescription(assignment.description || '');
    setAssignmentRubric(assignment.rubric || '');
    setAllowLateSubmission(Boolean(assignment.allowLateSubmission));
    setAllowResubmission(Boolean(assignment.allowResubmission));
    setAssignmentDueDate(assignment.dueDate ? toLocalDateTimeInput(assignment.dueDate) : '');
    setOperationError('');
  };

  const updateAssignment = async () => {
    if (!editingAssignmentId || !assignmentTitle.trim()) return;
    setSaving(true);
    setOperationError('');
    try {
      const response = await fetch('/api/lms/assignments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAssignmentId,
          title: assignmentTitle.trim(),
          description: assignmentDescription,
          rubric: assignmentRubric,
          allowLateSubmission,
          allowResubmission,
          dueDate: toIsoDateTime(assignmentDueDate),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Không thể cập nhật bài tập');
      resetAssignmentForm();
      await loadSubject();
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Không thể cập nhật bài tập');
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
          <div key={`${type}-${order}`} className={`bg-white rounded-none border p-4 transition ${
            lesson ? 'border-slate-200' : 'border-dashed border-slate-300'
          }`}>
            {lesson ? (
              isEditing ? (
                <div className="bg-slate-50 border-2 border-primary p-4 rounded-none space-y-4">
                  {/* Step Indicator Header */}
                  <div className="bg-slate-900 text-white p-3 flex flex-wrap items-center justify-between gap-3 rounded-none">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-white font-black text-[11px] px-2 py-0.5 rounded-none uppercase">
                        {type === 'THEORY' ? 'Lý thuyết' : 'Thực hành'} - Buổi {order}
                      </span>
                      <h3 className="font-extrabold text-xs text-white">Quy Trình Soạn Bài Học Chi Tiết</h3>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleAiGenerateLesson(type, order)}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-blue-700 disabled:opacity-50 text-white rounded-none font-bold text-xs shadow cursor-pointer transition"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                      Tự động sinh giáo án AI
                    </button>
                  </div>

                  {/* Progress Tabs */}
                  <div className="grid grid-cols-3 border border-slate-300 bg-white text-xs font-bold text-center">
                    <button
                      type="button"
                      onClick={() => setLessonStep(1)}
                      className={`py-2.5 border-r border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        lessonStep === 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white/20 text-current flex items-center justify-center text-[10px] font-black">1</span>
                      <span className="hidden sm:inline">1. Sườn Sư Phạm</span>
                      <span className="sm:hidden">Bước 1</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonStep(2)}
                      className={`py-2.5 border-r border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        lessonStep === 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white/20 text-current flex items-center justify-center text-[10px] font-black">2</span>
                      <span className="hidden sm:inline">2. Nội Dung & Học Liệu</span>
                      <span className="sm:hidden">Bước 2</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLessonStep(3)}
                      className={`py-2.5 flex items-center justify-center gap-1.5 cursor-pointer ${
                        lessonStep === 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span className="w-4 h-4 bg-white/20 text-current flex items-center justify-center text-[10px] font-black">3</span>
                      <span className="hidden sm:inline">3. Lưu & Công Bố</span>
                      <span className="sm:hidden">Bước 3</span>
                    </button>
                  </div>

                  {/* STEP 1: SƯỜN SƯ PHẠM */}
                  {lessonStep === 1 && (
                    <div className="space-y-3 bg-white p-3.5 border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                          Tên bài học
                        </label>
                        <input
                          type="text"
                          value={lessonTitle}
                          onChange={(e) => setLessonTitle(e.target.value)}
                          placeholder="Nhập tên bài học..."
                          className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs font-bold focus:outline-none focus:border-primary bg-slate-50/50"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">
                            🎯 Mục tiêu bài học (Cần đạt)
                          </label>
                          <textarea
                            value={lessonObjectives}
                            onChange={(e) => setLessonObjectives(e.target.value)}
                            rows={3}
                            placeholder="Mục tiêu về Kiến thức, Kỹ năng, Thái độ..."
                            className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs focus:outline-none focus:border-primary bg-slate-50/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-amber-900 uppercase tracking-wider block">
                            📦 Chuẩn bị của GV & HS
                          </label>
                          <textarea
                            value={lessonPreparation}
                            onChange={(e) => setLessonPreparation(e.target.value)}
                            rows={3}
                            placeholder="Slide, máy tính, học liệu đính kèm..."
                            className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs focus:outline-none focus:border-primary bg-slate-50/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-emerald-900 uppercase tracking-wider block">
                          📋 Sườn Tiến Trình Hoạt Động (4 Bước Sư Phạm Cho Giáo Viên)
                        </label>
                        <textarea
                          value={lessonActivities}
                          onChange={(e) => setLessonActivities(e.target.value)}
                          rows={4}
                          placeholder="1. Khởi động ➔ 2. Khám phá kiến thức ➔ 3. Luyện tập thực hành ➔ 4. Vận dụng..."
                          className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs focus:outline-none focus:border-primary bg-slate-50/50"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setLessonStep(2)}
                          className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-none hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer shadow"
                        >
                          Sang Bước 2: Soạn Nội Dung ➔
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: NỘI DUNG BÀI HỌC & HỌC LIỆU */}
                  {lessonStep === 2 && (
                    <div className="space-y-3 bg-white p-3.5 border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block flex items-center justify-between">
                          <span>📖 Nội dung bài giảng chi tiết (Dành cho học sinh đọc học)</span>
                          <span className="text-[10px] text-slate-500 font-normal lowercase">(hỗ trợ Markdown)</span>
                        </label>
                        <textarea
                          value={lessonContent}
                          onChange={(e) => setLessonContent(e.target.value)}
                          rows={8}
                          placeholder="Triển khai chi tiết kiến thức, mã nguồn code blocks, công thức bám sát sườn hoạt độngở Bước 1..."
                          className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs focus:outline-none focus:border-primary font-mono bg-slate-50/50 resize-y"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-violet-900 uppercase tracking-wider block">
                          🏆 Tiêu chí đánh giá hoàn thành bài học
                        </label>
                        <textarea
                          value={lessonAssessment}
                          onChange={(e) => setLessonAssessment(e.target.value)}
                          rows={2}
                          placeholder="Yêu cầu học sinh hoàn thành bài tập tự luận hoặc bài kiểm tra trắc nghiệm..."
                          className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs focus:outline-none focus:border-primary bg-slate-50/50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block rounded-none border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700">
                          📁 Tải học liệu / File đính kèm (.pdf, .zip, .docx...)
                          <input
                            type="file"
                            multiple
                            className="mt-1.5 block w-full text-xs text-slate-600 cursor-pointer"
                            onChange={(event) => setLessonFiles(Array.from(event.target.files || []))}
                          />
                        </label>
                      </div>

                      <div className="flex justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setLessonStep(1)}
                          className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-none hover:bg-slate-300 transition cursor-pointer"
                        >
                          ⬅ Quay lại Bước 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setLessonStep(3)}
                          className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-none hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer shadow"
                        >
                          Sang Bước 3: Công Bố ➔
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: LƯU & CÔNG BỐ */}
                  {lessonStep === 3 && (
                    <div className="space-y-3 bg-white p-3.5 border border-slate-200">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                          🚀 Trạng thái công bố bài học
                        </label>
                        <select
                          value={lessonStatus}
                          onChange={(e) => setLessonStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded-none border border-slate-300 text-xs font-bold focus:outline-none focus:border-primary bg-slate-50"
                        >
                          <option value="DRAFT">📌 Bản nháp (chỉ giáo viên thấy)</option>
                          <option value="PUBLISHED">✅ Công bố ngay cho học sinh</option>
                          <option value="ARCHIVED">📦 Lưu trữ</option>
                        </select>
                      </div>

                      <div className="p-3 bg-slate-100 border border-slate-200 text-xs space-y-1 text-slate-700">
                        <p className="font-black text-slate-900 mb-1">Xác nhận thông tin bài học:</p>
                        <p>• Tiêu đề: <strong>{lessonTitle || '(Chưa đặt)'}</strong></p>
                        <p>• Nội dung bài học: <strong>{lessonContent ? `${lessonContent.length} ký tự` : 'Chưa có'}</strong></p>
                        <p>• File đính kèm: <strong>{lessonFiles.length + lessonAttachments.length} file</strong></p>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setLessonStep(2)}
                          className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-none hover:bg-slate-300 transition cursor-pointer"
                        >
                          ⬅ Quay lại Bước 2
                        </button>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingLesson(null)}
                            className="px-3.5 py-2 bg-slate-200 text-slate-700 rounded-none text-xs font-bold hover:bg-slate-300 transition cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => updateLesson(lesson.id)}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 text-white rounded-none text-xs font-extrabold hover:bg-emerald-700 transition cursor-pointer shadow disabled:opacity-50"
                          >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Lưu Hoàn Tất Bài Học
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start justify-between cursor-pointer" onClick={() => startEdit(lesson)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-none flex items-center justify-center text-xs font-bold ${
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
                    <div key={assignment.id} className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-3 py-2 text-xs">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-amber-900">{assignment.title}</p>
                        <p className="text-amber-700">{assignment._count?.submissions || 0} bài nộp{assignment.dueDate ? ` · Hạn ${new Date(assignment.dueDate).toLocaleString('vi-VN')}` : ''}</p>
                      </div>
                      <button type="button" onClick={() => startEditAssignment(lesson.id, assignment)} className="shrink-0 font-bold text-amber-800 hover:underline">Sửa</button>
                    </div>
                  ))}
                </div>
                {/* Quiz Section */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Quiz ôn tập buổi học
                  </h5>
                  {(() => {
                    const quizConfig = subject.examConfigs?.find(
                      (config: any) =>
                        config.examType === 'LESSON_QUIZ' &&
                        config.lessonOrder === order &&
                        config.lessonType === type
                    );

                    if (!quizConfig) {
                      return (
                        <button
                          type="button"
                          onClick={() => handleAiGenerateLessonQuiz(lesson.id)}
                          disabled={saving}
                          className="flex items-center gap-1 text-xs font-extrabold text-primary hover:underline cursor-pointer disabled:opacity-50"
                        >
                          ✨ Sinh Quiz trắc nghiệm AI
                        </button>
                      );
                    }

                    return (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/65 px-3 py-2 rounded-none text-xs">
                        <div>
                          <p className="font-bold text-slate-800">
                            {quizConfig.questionStatus === 'GENERATED' ? '📝 Đã sinh câu hỏi (Chờ duyệt)' : '✅ Quiz đã công bố'}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {quizConfig.questionCount} câu hỏi · {quizConfig.durationMinutes} phút {quizConfig.questionStatus === 'PUBLISHED' && `· ${quizConfig._count?.results || 0} lượt thi`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePreviewQuiz(quizConfig)}
                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            👁️ Xem trước đề
                          </button>
                          <span className="text-slate-300">|</span>
                          {quizConfig.questionStatus === 'GENERATED' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handlePublishQuiz(quizConfig.id)}
                                disabled={saving}
                                className="font-bold text-emerald-700 hover:underline cursor-pointer disabled:opacity-50"
                              >
                                Duyệt & Công bố
                              </button>
                              <span className="text-slate-300">|</span>
                            </>
                          )}
                          {quizConfig.questionStatus !== 'PUBLISHED' && (
                            <button
                              type="button"
                              onClick={() => handleAiGenerateLessonQuiz(lesson.id)}
                              disabled={saving}
                              className="font-bold text-primary hover:underline cursor-pointer disabled:opacity-50"
                            >
                              Sinh lại đề
                            </button>
                          )}
                          {quizConfig.questionStatus === 'PUBLISHED' && (
                            <span className="font-bold text-emerald-600">Sẵn sàng</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {assignmentLessonId === lesson.id ? (
                  <div className="mt-3 space-y-2 rounded-none bg-slate-50 p-3 border border-slate-200">
                    <div className="flex items-center justify-between gap-3">
                      <input value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder="Tên bài tập *"
                        className="w-full rounded-none border border-slate-200 px-3 py-2 text-sm" />
                      <button
                        type="button"
                        onClick={() => handleAiGenerateAssignment(lesson)}
                        disabled={saving}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:opacity-50 text-white rounded-none font-bold text-xs shadow transition cursor-pointer"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        Sinh bài tập AI
                      </button>
                    </div>
                    <textarea value={assignmentDescription} onChange={(event) => setAssignmentDescription(event.target.value)} placeholder="Yêu cầu và tiêu chí chấm bài"
                      rows={3} className="w-full rounded-none border border-slate-200 px-3 py-2 text-sm" />
                    <textarea value={assignmentRubric} onChange={(event) => setAssignmentRubric(event.target.value)} placeholder="Rubric: tiêu chí và số điểm cho từng tiêu chí"
                      rows={3} className="w-full rounded-none border border-slate-200 px-3 py-2 text-sm" />
                    <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={allowLateSubmission} onChange={(event) => setAllowLateSubmission(event.target.checked)} /> Cho phép nộp trễ</label>
                    <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={allowResubmission} onChange={(event) => setAllowResubmission(event.target.checked)} /> Cho phép nộp lại</label>
                    <input type="datetime-local" value={assignmentDueDate} onChange={(event) => setAssignmentDueDate(event.target.value)}
                      className="w-full rounded-none border border-slate-200 px-3 py-2 text-sm" />
                    <div className="flex gap-2">
                      <button onClick={() => editingAssignmentId ? updateAssignment() : createAssignment(lesson.id)} disabled={saving || !assignmentTitle.trim()}
                        className="rounded-none bg-amber-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{editingAssignmentId ? 'Lưu bài tập' : 'Tạo bài tập'}</button>
                      <button onClick={resetAssignmentForm} className="rounded-none bg-white px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200">Hủy</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => startCreateAssignment(lesson.id)} className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-700">
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
        <Link href={`/lms/teacher/classes/${subject.classId}`} className="p-2 rounded-none hover:bg-slate-100 transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{subject.name}</h1>
          <p className="text-sm text-slate-500">Lớp: {subject.class?.name} · {subject.theoryLessons} LT + {subject.practicalLessons} TH</p>
        </div>
      </div>

      {operationError && (
        <div className="flex items-center justify-between rounded-none border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-extrabold text-rose-900 block text-xs uppercase tracking-wider">Thông báo lỗi từ hệ thống:</span>
              <span>{operationError}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOperationError('')}
            className="text-rose-500 hover:text-rose-800 font-bold ml-4 text-base cursor-pointer shrink-0"
            title="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}

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

      {/* Quiz Preview Modal */}
      {previewQuizConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col bg-white border border-slate-200 shadow-2xl rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Xem trước bộ đề Quiz AI
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {previewQuizConfig.questionCount} câu hỏi · Thời lượng {previewQuizConfig.durationMinutes} phút · {previewQuizConfig.questionStatus === 'GENERATED' ? 'Chờ duyệt công bố' : 'Đã công bố'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuizConfig(null)}
                className="p-1 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Questions list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingQuestions ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm font-semibold">Đang tải danh sách câu hỏi đề thi...</p>
                </div>
              ) : previewQuestions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic">
                  Không tìm thấy câu hỏi hoặc chưa sinh đề.
                </div>
              ) : (
                previewQuestions.map((q: any, index: number) => (
                  <div key={index} className="border border-slate-200 bg-white p-4 space-y-3 rounded-none shadow-sm">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 bg-primary/10 text-primary font-black px-2 py-0.5 text-xs">
                        Câu {index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-relaxed">{q.content}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        return (
                          <div
                            key={optIdx}
                            className={`px-3 py-2 text-xs border font-medium ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                            {isCorrect && <span className="ml-2 text-emerald-700 text-[10px]">✓ Đáp án đúng</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="ml-7 p-2.5 bg-blue-50/70 border border-blue-100 text-xs text-blue-800">
                        <span className="font-bold">💡 Giải thích:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
              <button
                type="button"
                onClick={() => setPreviewQuizConfig(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition cursor-pointer rounded-none"
              >
                Đóng xem trước
              </button>
              <div className="flex items-center gap-3">
                {previewQuizConfig.questionStatus === 'GENERATED' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await handlePublishQuiz(previewQuizConfig.id);
                      setPreviewQuizConfig(null);
                    }}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 rounded-none shadow"
                  >
                    ✅ Duyệt & Công bố Quiz ngay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
