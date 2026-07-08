'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Brain, Phone, Mail, MapPin, ChevronDown, Search, User, LogOut, Award, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { accessToken, localSync, logout } = useAuth();

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  const handleLinkClick = (href: string) => {
    if (href.includes('#')) return; // Allow hash links to anchor scroll
    const targetPath = href.split('?')[0];
    if (pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Giới thiệu', href: '/about' },
    { 
      name: 'Khóa học', 
      href: '/courses',
      submenu: [
        { name: 'Tất cả khóa học', href: '/courses' },
        { name: 'Lập trình Web Full-Stack', href: '/courses/lap-trinh-web-fullstack-laravel-react' },
        { name: 'Tiếng Anh Giao Tiếp', href: '/courses/tieng-anh-giao-tiep-quoc-te' },
        { name: 'Luyện thi IELTS 6.5+', href: '/courses/luyen-thi-ielts-cam-ket-dau-ra' },
        { name: 'Ứng dụng AI Doanh Nghiệp', href: '/courses/ung-dung-ai-trong-cong-viec-quan-tri' },
        { name: 'Lập trình Python Trẻ Em', href: '/courses/lap-trinh-python-cho-tre-em' },
      ]
    },
    { name: 'AI Assistant 🤖', href: '/ai-assistant', isSpecial: true },
    { name: 'Tính năng CRM', href: '/#ai-crm-demo' },
    { name: 'Sự kiện', href: '/events' },
    { name: 'Tin tức', href: '/blog' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Bar - Edutech Exact Layout */}
      <div className="bg-slate-900 text-slate-300 py-3 border-b border-slate-800 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Left info with circular outline icons */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-primary bg-white flex items-center justify-center text-primary shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px]">
                <span className="text-slate-500 block leading-none">Địa chỉ</span>
                <strong className="text-slate-300 font-semibold">Quận 10, TP. Hồ Chí Minh</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-primary bg-white flex items-center justify-center text-primary shadow-sm">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[11px]">
                <span className="text-slate-500 block leading-none">Email</span>
                <a href="mailto:contact@seduai.edu.vn" className="text-slate-300 font-semibold hover:text-primary transition">
                  contact@seduai.edu.vn
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-primary bg-white flex items-center justify-center text-primary shadow-sm">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[11px]">
                <span className="text-slate-500 block leading-none">Hotline</span>
                <strong className="text-slate-300 font-semibold">1900 1234</strong>
              </span>
            </div>
          </div>

          {/* Right Social icons */}
          <div className="flex items-center gap-2">
            <a href="#" className="w-7 h-7 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition duration-150">
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-7 h-7 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition duration-150">
              <TwitterIcon className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-7 h-7 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition duration-150">
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-7 h-7 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition duration-150">
              <YoutubeIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Navbar - Edutech Blue Layout */}
      <header className="bg-primary sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: White Logo block */}
            <div className="h-full bg-white px-8 flex items-center border-b-4 border-primary-dark">
              <Link href="/" onClick={() => handleLinkClick('/')} className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                    Sedu<span className="text-primary">Ai</span>
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Education
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-7 text-xs font-bold uppercase tracking-wider items-center h-full text-white/90">
              {navLinks.map((link) => {
                if (link.submenu) {
                  return (
                    <div key={link.name} className="relative group flex items-center h-full cursor-pointer py-7">
                      <span className="hover:text-white transition duration-150 flex items-center gap-1">
                        {link.name} <ChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition duration-150" />
                      </span>
                      {/* Dropdown Menu - Edutech Style */}
                      <div className="absolute top-full left-0 w-64 bg-white border border-slate-100 rounded-b-2xl shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => handleLinkClick(sub.href)}
                            className="block px-5 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:text-primary border-b border-slate-50 last:border-0 transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
                if (link.isSpecial) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl shadow-md shadow-amber-500/20 transition duration-200 transform hover:scale-105 flex items-center gap-1"
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={`transition duration-150 ${
                      isActive ? 'text-white font-extrabold border-b-2 border-white py-7' : 'hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search box and User Profile / Login */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative w-[170px]">
                <input
                  type="text"
                  placeholder="Tìm khóa học..."
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-lg pl-3.5 pr-8 py-1.5 text-xs text-white placeholder-white/60 focus:outline-none transition"
                />
                <Search className="w-3.5 h-3.5 text-white/60 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* User Menu / Login Badge */}
              {accessToken ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 rounded-xl transition text-white text-xs font-semibold cursor-pointer"
                  >
                    <img
                      src={localSync.avatar}
                      alt={localSync.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/50"
                    />
                    <span className="max-w-[90px] truncate">{localSync.name}</span>
                    <div className="flex items-center gap-0.5 bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                      <Award className="w-3 h-3 text-slate-950" />
                      <span>{localSync.point}</span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800 z-50 animate-scale-up">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{localSync.name}</p>
                        <p className="text-[11px] text-primary font-semibold flex items-center gap-1 mt-0.5">
                          <Award className="w-3.5 h-3.5" /> Điểm tích lũy: {localSync.point} điểm
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition"
                      >
                        <User className="w-4 h-4 text-slate-400" /> Quản lý tài khoản
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-white text-primary hover:bg-slate-100 font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition duration-200"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden gap-3">
              {accessToken ? (
                <Link href="/profile" className="flex items-center gap-1 bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  <img src={localSync.avatar} className="w-5 h-5 rounded-full object-cover" />
                  <span>{localSync.point}p</span>
                </Link>
              ) : (
                <Link href="/login" className="bg-white text-primary font-bold px-3 py-1 rounded-lg text-xs shadow-sm">
                  Đăng nhập
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition duration-200"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden border-b border-slate-100 bg-white absolute top-full left-0 w-full shadow-lg transition-all duration-300">
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => {
                if (link.submenu) {
                  return (
                    <div key={link.name} className="space-y-1">
                      <span className="block px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {link.name}
                      </span>
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => handleLinkClick(sub.href)}
                          className="block px-6 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  );
                }
                const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
                if (link.isSpecial) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className="block px-4 py-3 rounded-xl text-base font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md text-center"
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                      isActive ? 'bg-primary-light text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {accessToken && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-4">
                  <Link href="/profile" className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Quản lý tài khoản
                  </Link>
                  <button onClick={logout} className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
