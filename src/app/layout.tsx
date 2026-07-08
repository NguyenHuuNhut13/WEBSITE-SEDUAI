import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SeduAi - Hệ điều hành AI dành cho giáo dục',
  description: 'SeduAi kết hợp trí tuệ nhân tạo đột phá để tối ưu hóa quy trình giáo dục, tuyển sinh thông minh và đồng hành học tập cùng học viên.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="font-sans antialiased text-slate-800 bg-slate-50 min-h-full flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
