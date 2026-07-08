'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';

function ScrollToTopHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top of the page if there's no hash in the URL.
    // This resolves scroll shift issues caused by Next.js layout restore.
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopHandler />
    </Suspense>
  );
}
