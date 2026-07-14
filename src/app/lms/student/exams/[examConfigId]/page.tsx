'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Clock, Lock, Sparkles, Loader2, ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentExamPage({ params }: { params: Promise<{ examConfigId: string }> }) {
  const { examConfigId } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [config, setConfig] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Quiz running states
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Result state
  const [result, setResult] = useState<any>(null);

  const loadConfig = async () => {
    try {
      const res = await fetch(`/api/lms/exams/config?id=${examConfigId}`);
      const json = await res.json();
      if (json.success) {
        setConfig(json.data);
        
        // If user already took this exam, load the result
        if (user) {
          const userRes = await fetch('/api/lms/users');
          const userJson = await userRes.json();
          if (userJson.success) {
            const dbUser = userJson.data.find((u: any) => u.username === user.username);
            if (dbUser) {
              const resRes = await fetch(`/api/lms/exams/results?examConfigId=${examConfigId}&studentId=${dbUser.id}`);
              const resJson = await resRes.json();
              if (resJson.success && resJson.data.length > 0) {
                setResult(resJson.data[0]);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitExam = async (finalAnswers = answers) => {
    if (!user || result) return;
    setSubmitting(true);
    try {
      const userRes = await fetch('/api/lms/users');
      const userJson = await userRes.json();
      if (!userJson.success) throw new Error('Không thể xác thực.');

      const dbUser = userJson.data.find((u: any) => u.username === user.username);
      if (!dbUser) throw new Error('Học sinh không tồn tại trong hệ thống.');

      // Grade the exam results
      let correctCount = 0;
      const formattedAnswers = questions.map((q) => {
        const selected = finalAnswers[q.index] !== undefined ? finalAnswers[q.index] : -1;
        const isCorrect = selected === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionIndex: q.index,
          selectedOption: selected,
          isCorrect,
        };
      });

      const score = Math.round((correctCount / questions.length) * 10 * 10) / 10;

      // Save to database LmsExamResult
      const saveRes = await fetch('/api/lms/exams/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examConfigId,
          studentId: dbUser.id,
          score,
          correctCount,
          totalQuestions: questions.length,
          answers: formattedAnswers,
          startedAt: new Date(Date.now() - (config.durationMinutes * 60 - timeLeft) * 1000).toISOString(),
          finishedAt: new Date().toISOString(),
        }),
      });

      const saveJson = await saveRes.json();
      if (saveJson.success) {
        setResult(saveJson.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const autoSubmit = () => {
    submitExam();
  };

  const startExam = async () => {
    setPassError('');
    if (config.password && passwordInput !== config.password) {
      setPassError('Sai mật khẩu phòng thi. Vui lòng thử lại.');
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
        }),
      });
      const json = await res.json();
      if (json.success && json.data.questions) {
        setQuestions(json.data.questions);
        setTimeLeft(config.durationMinutes * 60);
        setStarted(true);
      } else {
        setPassError('Không thể tạo câu hỏi thi từ AI. Vui lòng liên hệ giáo viên.');
      }
    } catch (e) {
      console.error(e);
      setPassError('Đã xảy ra lỗi kết nối.');
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
    loadConfig();
  }, [examConfigId]);

  useEffect(() => {
    if (!started || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, result]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Không tìm thấy thông tin cấu hình phòng thi này.</p>
      </div>
    );
  }

  // If already took the exam, show scorecard
  if (result) {
    let parsedAnswers: any[] = [];
    if (result.answers) {
      try {
        parsedAnswers = JSON.parse(result.answers);
      } catch (e) {
        console.error(e);
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

          {config.password && (
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
          onClick={() => submitExam()}
          disabled={submitting}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardCheck className="w-5 h-5" />} Nộp bài thi
        </button>
      </div>
    </div>
  );
}
