'use client';

import { useAuth } from '@/context/AuthContext';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

export default function TeacherAssistantWrapper({ children }: Props) {
  const { lmsRole, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) return null;

  if (lmsRole === 'TEACHER' || lmsRole === 'ADMIN') {
    return <>{children}</>;
  }

  return null;
}
