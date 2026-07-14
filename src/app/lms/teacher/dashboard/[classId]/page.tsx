'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Trophy, BarChart3, Users, Target } from 'lucide-react';

export default function TeacherRealtimeDashboard({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadStats = async () => {
    try {
      const res = await fetch(`/api/lms/dashboard/${classId}`);
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStats();
    }, 0);
    return () => clearTimeout(timer);
  }, [classId]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, classId]);

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!stats) return <div className="text-center py-12 text-slate-500">Không có dữ liệu</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/lms/teacher" className="p-2 rounded-xl hover:bg-slate-100 transition"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Dashboard — {stats.className}</h1>
            <p className="text-sm text-slate-500">{stats.totalStudents} học sinh · Auto-refresh {autoRefresh ? 'mỗi 10s' : 'tắt'}</p>
          </div>
        </div>
        <button onClick={() => setAutoRefresh(!autoRefresh)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            autoRefresh ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}>
          <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} style={autoRefresh ? { animationDuration: '3s' } : {}} />
          {autoRefresh ? 'Realtime ON' : 'Realtime OFF'}
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 shadow-xl">
          <Users className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black">{stats.totalStudents}</p>
          <p className="text-xs font-bold opacity-80">Học sinh</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5 shadow-xl">
          <Target className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black">{stats.assignmentCompletion}%</p>
          <p className="text-xs font-bold opacity-80">Hoàn thành bài tập</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-5 shadow-xl">
          <BarChart3 className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black">{stats.examCompletion}%</p>
          <p className="text-xs font-bold opacity-80">Hoàn thành bài thi</p>
        </div>
      </div>

      {/* Subject Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Thống kê theo môn</h2>
        <div className="space-y-4">
          {stats.subjectStats.map((sub: any) => (
            <div key={sub.subjectId} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{sub.subjectName}</span>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Điểm TB: <strong className="text-primary">{sub.averageScore}</strong></span>
                  <span>Nộp bài: <strong>{sub.submissionRate}%</strong></span>
                  <span>Bài học: <strong>{sub.completedLessons}/{sub.totalLessons}</strong></span>
                </div>
              </div>
              {/* Score bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${sub.averageScore * 10}%`,
                  background: sub.averageScore >= 8 ? 'linear-gradient(to right, #10b981, #059669)' :
                    sub.averageScore >= 6 ? 'linear-gradient(to right, #3b82f6, #2563eb)' :
                    sub.averageScore >= 4 ? 'linear-gradient(to right, #f59e0b, #d97706)' :
                    'linear-gradient(to right, #ef4444, #dc2626)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Bảng xếp hạng</h2>
        {stats.leaderboard.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu</p>
        ) : (
          <div className="space-y-2">
            {stats.leaderboard.map((entry: any) => (
              <div key={entry.studentId} className={`flex items-center gap-3 p-3 rounded-xl ${
                entry.rank === 1 ? 'bg-amber-50 border border-amber-100' :
                entry.rank === 2 ? 'bg-slate-50 border border-slate-100' :
                entry.rank === 3 ? 'bg-orange-50 border border-orange-100' : ''
              }`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                  entry.rank === 1 ? 'bg-amber-400 text-white' :
                  entry.rank === 2 ? 'bg-slate-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-600'
                }`}>{entry.rank}</span>
                <div className="flex-1">
                  <span className="text-sm font-bold text-slate-900">{entry.studentName}</span>
                  <span className="text-xs text-slate-500 ml-2">{entry.totalSubmissions} bài</span>
                </div>
                <span className="text-sm font-black text-primary">{entry.averageScore}/10</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
