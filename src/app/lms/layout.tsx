'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LMSSidebar from '@/components/lms/LMSSidebar';

type LmsNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
};

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isLoading, lmsRole, lmsUserId, lmsIdentityLoading, lmsIdentityError, user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<LmsNotification[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  useEffect(() => {
    if (!lmsUserId) return;
    try {
      const stored = localStorage.getItem(`lms-read-notifications:${lmsUserId}`);
      setReadNotificationIds(stored ? JSON.parse(stored) as string[] : []);
    } catch {
      setReadNotificationIds([]);
    }
  }, [lmsUserId]);

  useEffect(() => {
    if (!lmsUserId) return;
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        let items: LmsNotification[] = [];
        if (lmsRole === 'TEACHER') {
          const [submissionsResponse, resultsResponse] = await Promise.all([
            fetch('/api/lms/submissions'),
            fetch('/api/lms/exams/results'),
          ]);
          const submissionsJson = await submissionsResponse.json();
          const resultsJson = await resultsResponse.json();
          const pending = submissionsJson.success ? (submissionsJson.data || []).filter((submission: any) => submission.status !== 'REVIEWED').slice(0, 5) : [];
          const recentResults = resultsJson.success ? (resultsJson.data || []).slice(0, 4) : [];
          items = [
            ...pending.map((submission: any) => ({
              id: `submission:${submission.id}`,
              title: submission.status === 'AI_GRADED' ? 'Bài đã được SEDUAI chấm' : 'Có bài tập mới cần chấm',
              description: `${submission.student?.name || 'Học sinh'} · ${submission.assignment?.title || 'Bài tập'}`,
              href: '/lms/teacher/grading',
              createdAt: submission.submittedAt,
            })),
            ...recentResults.map((result: any) => ({
              id: `exam:${result.id}`,
              title: 'Có kết quả bài thi mới',
              description: `${result.student?.name || 'Học sinh'} · ${result.examConfig?.subject?.name || 'Môn học'} · ${result.score}/10`,
              href: '/lms/teacher/grading',
              createdAt: result.finishedAt || result.startedAt,
            })),
          ];
        } else if (lmsRole === 'STUDENT') {
          const response = await fetch('/api/lms/exams/config');
          const json = await response.json();
          const exams = json.success ? (json.data || []).filter((exam: any) => exam.canStart).slice(0, 8) : [];
          items = exams.map((exam: any) => ({
            id: `exam:${exam.id}`,
            title: 'Bài thi mới đã mở',
            description: `${exam.subject?.name || 'Môn học'} · ${exam.questionCount} câu hỏi`,
            href: `/lms/student/exams/${exam.id}`,
            createdAt: exam.publishedAt || exam.updatedAt,
          }));
        } else {
          const response = await fetch('/api/lms/classes');
          const json = await response.json();
          const classes = json.success ? (json.data || []).slice(0, 8) : [];
          items = classes.map((item: any) => ({
            id: `class:${item.id}`,
            title: 'Thông tin lớp học đã cập nhật',
            description: item.name || 'Lớp học LMS',
            href: '/lms/admin',
            createdAt: item.updatedAt || item.createdAt,
          }));
        }
        if (!cancelled) setNotifications(items.filter((item) => item.createdAt).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8));
      } catch {
        if (!cancelled) setNotifications([]);
      }
    };

    void loadNotifications();
    return () => { cancelled = true; };
  }, [lmsRole, lmsUserId]);

  const unreadNotifications = notifications.filter((item) => !readNotificationIds.includes(item.id));
  const markNotificationRead = (id: string) => {
    setReadNotificationIds((current) => {
      const next = current.includes(id) ? current : [...current, id].slice(-50);
      if (lmsUserId) localStorage.setItem(`lms-read-notifications:${lmsUserId}`, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (!isLoading && !accessToken) {
      router.replace('/login');
      return;
    }

    if (!lmsUserId) return;
    const targetRole = pathname?.startsWith('/lms/admin') ? 'ADMIN'
      : pathname?.startsWith('/lms/teacher') ? 'TEACHER'
        : pathname?.startsWith('/lms/student') ? 'STUDENT' : null;
    if (targetRole && targetRole !== lmsRole) {
      const homeByRole = { ADMIN: '/lms/admin', TEACHER: '/lms/teacher', STUDENT: '/lms/student' } as const;
      router.replace(homeByRole[lmsRole]);
    }
  }, [isLoading, accessToken, pathname, lmsRole, lmsUserId, router]);

  if (isLoading || lmsIdentityLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-semibold">Đang tải hệ thống LMS...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) return null;

  if (!lmsUserId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-200/50 bg-white p-8 text-center shadow-2xl shadow-rose-500/5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-slate-900">Không thể truy cập LMS</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {lmsIdentityError || 'Tài khoản chưa được cấp vai trò trong hệ thống LMS.'}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-primary/20"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.replace('/profile')}
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Về trang cá nhân
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-400">Phiên đăng nhập NKS của bạn vẫn được giữ nguyên.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lms-shell flex min-h-screen bg-[#f8fafc]">
      <LMSSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">SeduAi LMS</p>
            <p className="truncate text-sm font-semibold text-slate-900">Không gian quản lý học tập</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 md:flex">
              <Search className="h-4 w-4" />
              <span>Tìm kiếm trong LMS</span>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary"
                aria-label="Thông báo"
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-rose-500" />}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] border border-slate-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Thông báo</p>
                      <p className="text-[11px] text-slate-400">{unreadNotifications.length} chưa đọc</p>
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        type="button"
                        onClick={() => unreadNotifications.forEach((item) => markNotificationRead(item.id))}
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-xs text-slate-400">Chưa có thông báo mới</p>
                    ) : notifications.map((item) => {
                      const isUnread = !readNotificationIds.includes(item.id);
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => { markNotificationRead(item.id); setNotificationsOpen(false); }}
                          className={`block border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 ${isUnread ? 'bg-primary/5' : 'bg-white'}`}
                        >
                          <div className="flex items-start gap-2">
                            {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 bg-primary" />}
                            <div className={isUnread ? '' : 'pl-4'}>
                              <p className="text-xs font-bold text-slate-800">{item.title}</p>
                              <p className="mt-1 text-[11px] text-slate-500">{item.description}</p>
                              <p className="mt-1 text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-primary/10 text-sm font-black text-primary" aria-hidden="true">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  (user?.name || user?.username || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden text-right sm:block">
                <p className="max-w-32 truncate text-sm font-bold text-slate-900">{user?.name || user?.username || 'Người dùng'}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{lmsRole}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="p-5 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
