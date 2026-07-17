'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Brain, MapPin, Phone, Mail, ArrowRight, ChevronUp, CheckCircle2 } from 'lucide-react';
import { createLead } from '@/services/api';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const socialLinks = [
  {
    icon: <FacebookIcon className="w-4 h-4" />,
    href: '#',
    hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
    label: 'Facebook',
  },
  {
    icon: <LinkedinIcon className="w-4 h-4" />,
    href: '#',
    hoverColor: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]',
    label: 'LinkedIn',
  },
  {
    icon: <YoutubeIcon className="w-4 h-4" />,
    href: '#',
    hoverColor: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
    label: 'YouTube',
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async () => {
    if (email.includes('@')) {
      try {
        await createLead({
          name: 'Học viên nhận bản tin',
          phone: '0000000000',
          email: email,
          demand: 'Đăng ký nhận bản tin khuyến mãi & sự kiện từ Footer',
          source: 31,
        });
        setSubscribed(true);
        setTimeout(() => { setSubscribed(false); setEmail(''); }, 3000);
      } catch (error) {
        console.error('Lỗi đăng ký nhận bản tin:', error);
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 relative">
      {/* Top gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Newsletter Bar */}
      <div className="bg-slate-800/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 animate-glow-border">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Nhận thông tin mới nhất</h3>
                <p className="text-xs text-slate-400">Đăng ký email để nhận ưu đãi khóa học và sự kiện sắp tới.</p>
              </div>
            </div>
            <div className="flex w-full lg:w-auto max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm animate-fade-in-up px-4 py-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Đăng ký thành công! Cảm ơn bạn.
                </div>
              ) : (
                <div className="flex bg-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-primary/40 focus-within:border-primary/60 focus-within:shadow-lg focus-within:shadow-primary/10 transition-all duration-300 w-full">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    className="flex-grow px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="px-5 py-3 bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 text-white font-bold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    Đăng ký <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  Sedu<span className="text-primary">Ai</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Hệ điều hành trí tuệ nhân tạo toàn diện cho giáo dục. Đột phá tuyển sinh, nâng tầm
                chất lượng dạy học và tự động hóa quy trình quản lý.
              </p>
              <div className="flex space-x-2 pt-2">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    onClick={(e) => e.preventDefault()}
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${s.hoverColor}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: System modules */}
            <div>
              <h3 className="text-white font-bold text-base mb-5">Hệ thống & Phân hệ</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Admissions CRM', href: '/ai-assistant' },
                  { label: 'AI Teacher Assistant', href: '/ai-assistant' },
                  { label: 'Hệ thống LMS', href: '/lms' },
                  { label: 'Trang cá nhân', href: '/profile' },
                  { label: 'Cổng đăng nhập', href: '/login' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} prefetch={false} className="hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 group">
                      <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform duration-200" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Courses categories */}
            <div>
              <h3 className="text-white font-bold text-base mb-5">Khóa học Đào tạo</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'AI & Công nghệ', href: '/courses?category=AI & Công nghệ' },
                  { label: 'Marketing & Bán hàng', href: '/courses?category=Marketing & Bán hàng' },
                  { label: 'Kinh doanh & Khởi nghiệp', href: '/courses?category=Kinh doanh & Khởi nghiệp' },
                  { label: 'Danh mục khác', href: '/courses?category=Khác' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} prefetch={false} className="hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 group">
                      <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform duration-200" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="text-white font-bold text-base mb-5">Liên hệ SeduAi</h3>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Tầng 5, Tòa nhà SeduAi, Đường 3/2, Phường Hòa Hưng, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="tel:19001234" className="hover:text-primary transition-colors duration-200">1900 1234 (Hotline)</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="mailto:contact@seduai.edu.vn" className="hover:text-primary transition-colors duration-200">contact@seduai.edu.vn</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 SeduAi. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-6">
              <Link href="#" onClick={(e) => e.preventDefault()} prefetch={false} className="hover:text-slate-300 transition-colors duration-200">
                Điều khoản dịch vụ
              </Link>
              <Link href="#" onClick={(e) => e.preventDefault()} prefetch={false} className="hover:text-slate-300 transition-colors duration-200">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button — with progress ring */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 w-12 h-12 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 flex items-center justify-center z-40 transition-all duration-500 hover:scale-110 hover:shadow-primary/50 cursor-pointer animate-glow-border ${
          isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Lên đầu trang"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
