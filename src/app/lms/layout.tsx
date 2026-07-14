'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LMSSidebar from '@/components/lms/LMSSidebar';
import type { UserRole } from '@/types/lms-types';

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isLoading, setLmsRole, lmsRole } = useAuth();

  useEffect(() => {
    if (!isLoading && !accessToken) {
      router.push('/login');
      return;
    }

    let targetRole: UserRole | null = null;
    if (pathname?.startsWith('/lms/admin')) targetRole = 'ADMIN';
    else if (pathname?.startsWith('/lms/teacher')) targetRole = 'TEACHER';
    else if (pathname?.startsWith('/lms/student')) targetRole = 'STUDENT';

    if (targetRole && targetRole !== lmsRole) {
      const timer = setTimeout(() => {
        setLmsRole(targetRole);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoading, accessToken, pathname, lmsRole, setLmsRole, router]);

  if (isLoading) {
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
