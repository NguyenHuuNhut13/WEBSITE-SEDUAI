'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LMSSidebar from '@/components/lms/LMSSidebar';

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isLoading, lmsRole, lmsUserId, lmsIdentityLoading, lmsIdentityError } = useAuth();

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-semibold">Đang tải hệ thống LMS...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) return null;

  if (!lmsUserId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-slate-900 p-7 text-center shadow-2xl">
          <h1 className="text-xl font-black text-white">Không thể truy cập LMS</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {lmsIdentityError || 'Tài khoản chưa được cấp vai trò trong hệ thống LMS.'}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.replace('/profile')}
              className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700"
            >
              Về trang cá nhân
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-500">Phiên đăng nhập NKS của bạn vẫn được giữ nguyên.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <LMSSidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
