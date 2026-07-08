import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import LayoutWrapper from '@/components/LayoutWrapper';

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
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
