'use client';

import { useState, useEffect, use, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Lock, Sparkles, Loader2, ClipboardCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ExamQuestion {
  index: number;
  content: string;
  options: string[];
}

interface ExamAnswerPayload {
  questionIndex: number;
  selectedOption: number;
}

export default function StudentExamPage({ params }: { params: Promise<{ examConfigId: string }> }) {
  const { examConfigId } = use(params);

  const [config, setConfig] = useState<any>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [attemptToken, setAttemptToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState('');
  const [pageError, setPageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Quiz running states
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const autoSubmitTriggered = useRef(false);

  // Result state
  const [result, setResult] = useState<any>(null);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setPageError('');
    try {
      const [res, resultResponse] = await Promise.all([
        fetch(`/api/lms/exams/config?id=${examConfigId}`),
        fetch(`/api/lms/exams/results?examConfigId=${encodeURIComponent(examConfigId)}`)
      ]);

      const [json, resultJson] = await Promise.all([
        res.json().catch(() => null),
        resultResponse.json().catch(() => null)
      ]);

      if (!res.ok || !json?.success || !json.data) {
        throw new Error(json?.error || 'Không thể tải cấu hình bài thi.');
      }
      setConfig(json.data);

      if (!resultResponse.ok || !resultJson?.success) {
        throw new Error(resultJson?.error || 'Không thể kiểm tra trạng thái bài thi.');
      }
      const previousResult = Array.isArray(resultJson.data) ? resultJson.data[0] : resultJson.data;
      setResult(previousResult || null);
    } catch (e) {
      setConfig(null);
      setPageError(e instanceof Error ? e.message : 'Không thể tải thông tin bài thi.');
    } finally {
      setLoading(false);
    }
  }, [examConfigId]);

  const submitExam = useCallback(async (finalAnswers: Record<number, number> = answers) => {
    if (result || submitting) return;
    setSubmitError('');
    if (!attemptToken) {
      setSubmitError('Phiên làm bài không hợp lệ. Vui lòng tải lại trang và bắt đầu lại.');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers: ExamAnswerPayload[] = questions.map((q) => {
        const selected = finalAnswers[q.index] !== undefined ? finalAnswers[q.index] : -1;
        return {
          questionIndex: q.index,
          selectedOption: selected,
        };
      });

      const saveRes = await fetch('/api/lms/exams/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examConfigId,
          answers: formattedAnswers,
          attemptToken,
        }),
      });

      const saveJson = await saveRes.json().catch(() => null);
      if (!saveRes.ok || !saveJson?.success || !saveJson.data) {
        throw new Error(saveJson?.error || 'Không thể nộp bài thi.');
      }
      setResult(saveJson.data);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Không thể nộp bài thi.');
    } finally {
      setSubmitting(false);
    }
  }, [answers, attemptToken, examConfigId, questions, result, submitting]);

  const startExam = async () => {
    setPassError('');
    setSubmitError('');
    if (config.hasPassword && !passwordInput.trim()) {
      setPassError('Vui lòng nhập mật khẩu phòng thi.');
      return;
    }

    setLoading(true);
    try {
      // Call endpoint to generate questions via AI (not stored in DB)
      const res = await fetch('/api/lms/exams/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examConfigId,
          password: passwordInput,
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success && Array.isArray(json.data?.questions) && json.data?.attemptToken) {
        setQuestions(json.data.questions);
        setAttemptToken(json.data.attemptToken);
        setAnswers({});
        setActiveQuestion(0);
        autoSubmitTriggered.current = false;
        const serverExpiry = Date.parse(json.data.expiresAt);
        const remainingSeconds = Number.isFinite(serverExpiry)
          ? Math.max(0, Math.ceil((serverExpiry - Date.now()) / 1000))
          : config.durationMinutes * 60;
        setTimeLeft(remainingSeconds);
        setStarted(true);
      } else {
        setPassError(json?.error || 'Không thể bắt đầu bài thi. Vui lòng liên hệ giáo viên.');
      }
    } catch {
      setPassError('Không thể kết nối hệ thống thi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (!started || timeLeft <= 0 || result) return;
    const timer = setTimeout(() => setTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [started, timeLeft, result]);

  useEffect(() => {
    if (!started || timeLeft !== 0 || result || !attemptToken || autoSubmitTriggered.current) return;
    autoSubmitTriggered.current = true;
    void submitExam();
  }, [attemptToken, result, started, submitExam, timeLeft]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (pageError || !config) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
        <p className="mt-3 font-semibold text-slate-800">Không thể mở phòng thi</p>
        <p className="mt-1 text-sm text-slate-500">{pageError || 'Không tìm thấy thông tin cấu hình phòng thi này.'}</p>
        <button
          type="button"
          onClick={() => void loadConfig()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" /> Thử lại
        </button>
      </div>
    );
  }

  // If already took the exam, show scorecard
  if (result) {
    let parsedAnswers: any[] = [];
    if (Array.isArray(result.answers)) {
      parsedAnswers = result.answers;
    } else if (result.answers) {
      try {
        parsedAnswers = JSON.parse(result.answers);
      } catch {
        parsedAnswers = [];
      }
    }

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/lms/student/subjects/${config.subjectId}`}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Kết quả bài thi</h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Bạn đã hoàn thành bài thi!</h2>
            <p className="text-sm text-slate-500 mt-1">{config.subject?.name} · {config.examType === 'MIDTERM' ? 'Giữa kỳ' : 'Cuối kỳ'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-2xl font-black text-primary">{result.score}/10</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Điểm số</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-2xl font-black text-slate-800">{result.correctCount}/{result.totalQuestions}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Số câu trả lời đúng</p>
            </div>
          </div>

          {/* Simple breakdown list */}
          <div className="text-left space-y-3 max-w-md mx-auto pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Chi tiết đáp án:</h3>
            <div className="grid grid-cols-5 gap-2">
              {parsedAnswers.map((ans: any) => (
                <div
                  key={ans.questionIndex}
                  className={`p-2 rounded-lg border text-center font-bold text-xs ${
                    ans.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  C{ans.questionIndex + 1}: {ans.selectedOption === -1 ? 'X' : String.fromCharCode(65 + ans.selectedOption)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!config.canStart && config.questionStatus !== 'PUBLISHED') {
    return (
      <div className="mx-auto mt-12 max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
        <h1 className="mt-4 text-lg font-bold text-slate-900">Đề thi chưa sẵn sàng</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {config.questionStatus === 'GENERATED'
            ? 'Giáo viên đã sinh câu hỏi nhưng chưa duyệt và công bố đề.'
            : 'Giáo viên đang chuẩn bị ngân hàng câu hỏi cho bài thi này.'}
        </p>
        <Link href="/lms/student/exams" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">Quay lại danh sách bài thi</Link>
      </div>
    );
  }

  // Password / Join Room Screen
  if (!started) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 mt-12">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-slate-950">Phòng thi trắc nghiệm</h1>
          <p className="text-xs text-slate-400 mt-1">Môn học: {config.subject?.name}</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-500">
            <div className="flex justify-between"><span>Dạng bài thi:</span><span className="font-bold text-slate-800">{config.examType}</span></div>
            <div className="flex justify-between"><span>Số câu hỏi:</span><span className="font-bold text-slate-800">{config.questionCount} câu</span></div>
            <div className="flex justify-between"><span>Thời gian làm bài:</span><span className="font-bold text-slate-800">{config.durationMinutes} phút</span></div>
          </div>

          {config.hasPassword && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nhập mật khẩu phòng thi *</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mã pin hoặc password..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {passError && (
            <p className="text-xs font-bold text-rose-600 text-center">{passError}</p>
          )}

          <button
            onClick={startExam}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Đồng ý và Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  // Exam taking state
  const currentQ = questions[activeQuestion];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Question Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-sm font-bold text-primary">Câu hỏi {activeQuestion + 1} / {questions.length}</span>
            <span className="flex items-center gap-1.5 text-rose-600 font-extrabold text-sm bg-rose-50 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </span>
          </div>

          {currentQ && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 leading-relaxed">{currentQ.content}</h2>
              
              <div className="space-y-3">
                {currentQ.options.map((option: string, optionIdx: number) => (
                  <button
                    key={optionIdx}
                    onClick={() => setAnswers({ ...answers, [currentQ.index]: optionIdx })}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-3 cursor-pointer ${
                      answers[currentQ.index] === optionIdx
                        ? 'border-primary bg-primary/5 text-primary font-bold'
                        : 'border-slate-150 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      answers[currentQ.index] === optionIdx ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optionIdx)}
                    </span>
                    <span className="text-sm">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveQuestion((prev) => Math.max(0, prev - 1))}
              disabled={activeQuestion === 0}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer"
            >
              Câu trước
            </button>
            <button
              onClick={() => setActiveQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={activeQuestion === questions.length - 1}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer"
            >
              Câu tiếp theo
            </button>
          </div>
        </div>
      </div>

      {/* Answer Board Sidebar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6 h-fit">
        <h3 className="text-sm font-bold text-slate-900">Bảng câu hỏi</h3>

        {submitError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold leading-relaxed text-rose-700">
            {submitError}
          </div>
        )}
        
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, i) => (
            <button
              key={q.index}
              onClick={() => setActiveQuestion(i)}
              className={`w-full py-2.5 rounded-lg border text-center font-bold text-xs transition cursor-pointer ${
                activeQuestion === i ? 'ring-2 ring-primary ring-offset-2' : ''
              } ${
                answers[q.index] !== undefined
                  ? 'bg-primary text-white border-primary'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => void submitExam()}
          disabled={submitting}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardCheck className="w-5 h-5" />} Nộp bài thi
        </button>
      </div>
    </div>
  );
}
