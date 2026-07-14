'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LMSPage() {
  const router = useRouter();
  const { lmsRole, isLoading, accessToken } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken) {
      router.replace('/login');
      return;
    }

    switch (lmsRole) {
      case 'ADMIN':
        router.replace('/lms/admin');
        break;
      case 'TEACHER':
        router.replace('/lms/teacher');
        break;
      default:
        router.replace('/lms/student');
    }
  }, [lmsRole, isLoading, accessToken, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-semibold">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
