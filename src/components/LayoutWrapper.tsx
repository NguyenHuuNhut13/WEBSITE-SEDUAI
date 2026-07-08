'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Ẩn toàn bộ Navbar và Footer khi ở trang AI Assistant (/ai-assistant) để có giao diện chuẩn Full-screen ChatGPT
  const isAiAssistant = pathname?.startsWith('/ai-assistant');

  return (
    <>
      {!isAiAssistant && <Navbar />}
      <main className="flex-grow flex flex-col w-full">{children}</main>
      {!isAiAssistant && <Footer />}
      <ScrollToTop />
    </>
  );
}
