'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LMSSidebar from '@/components/lms/LMSSidebar';

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isLoading, lmsRole, lmsUserId } = useAuth();

  useEffect(() => {
    if (!isLoading && !accessToken) {
      router.push('/login');
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

  if (isLoading || (accessToken && !lmsUserId)) {
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
