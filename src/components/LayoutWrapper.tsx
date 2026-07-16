'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingChatbot from '@/components/FloatingChatbot';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Ẩn toàn bộ Navbar và Footer khi ở trang AI Assistant (/ai-assistant) để có giao diện chuẩn Full-screen ChatGPT
  const isAiAssistant = pathname?.startsWith('/ai-assistant');

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal the parent element itself
            entry.target.classList.add('revealed');
            // Staggered reveal for children
            entry.target.querySelectorAll('.scroll-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 80);
            });
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    // Query parent sections and independent scroll-reveal elements
    const handleObserve = () => {
      const targets = document.querySelectorAll('.reveal-section, .scroll-reveal:not(.reveal-section .scroll-reveal)');
      targets.forEach((target) => observer.observe(target));
    };

    handleObserve();

    // Re-bind when mutations happen (dynamic content loading / routing changes)
    const mutator = new MutationObserver(handleObserve);
    mutator.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutator.disconnect();
    };
  }, [pathname]);

  return (
    <>
      {!isAiAssistant && <Navbar />}
      <main className="flex-grow flex flex-col w-full">{children}</main>
      {!isAiAssistant && <Footer />}
      {!isAiAssistant && <FloatingChatbot />}
      <ScrollToTop />
    </>
  );
}
