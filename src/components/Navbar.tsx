'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Brain,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  User,
  LogOut,
  Award,
  LogIn,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileCourseOpen, setMobileCourseOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const pathname = usePathname();
  const { accessToken, localSync, logout } = useAuth();

  const [isSticky, setIsSticky] = useState(false);

  // Close mobile menu & reset dropdowns on path changes
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
    setMobileCourseOpen(false);
  }, [pathname]);

  // Listen to scroll events to trigger sticky header class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    if (href.includes('#')) return; // Allow hash links to anchor scroll
    const targetPath = href.split('?')[0];
    if (pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
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
      ],
    },
    { name: 'AI Assistant 🤖', href: '/ai-assistant', isSpecial: true },
    { name: 'Tính năng CRM', href: '/#ai-crm-demo' },
    { name: 'Sự kiện', href: '/events' },
    { name: 'Tin tức', href: '/blog' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Bar - Clean Dark Slate */}
      <div className="bg-slate-950 text-slate-300 py-2.5 border-b border-slate-800/80 hidden lg:block text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Left info with circular outline icons */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>
                <span className="text-slate-500 font-medium">CS1: </span>
                <strong className="text-slate-300 font-semibold group-hover:text-white transition">Quận 10, TP. Hồ Chí Minh</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span>
                <span className="text-slate-500 font-medium">Email: </span>
                <a href="mailto:contact@seduai.edu.vn" className="text-slate-300 font-semibold hover:text-primary transition">
                  contact@seduai.edu.vn
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>
                <span className="text-slate-500 font-medium">Hotline 24/7: </span>
                <strong className="text-amber-400 font-bold tracking-wide">1900 1234</strong>
              </span>
            </div>
          </div>

          {/* Right Social icons & AI CRM Badge */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Hệ thống AI EduTech Chuẩn 5 Sao
            </span>
            <div className="flex items-center gap-1.5">
              <a href="#" className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition">
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition">
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition">
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Navbar - Dynamic Gradient & Glassmorphism */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isSticky 
          ? 'stricky-fixed bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg' 
          : 'bg-gradient-to-r from-primary via-blue-700 to-primary-dark border-b border-white/10 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isSticky ? 'h-16' : 'h-18 sm:h-20'
          }`}>
            {/* Left: Premium Logo Link */}
            <Link href="/" onClick={() => handleLinkClick('/')} className="flex items-center space-x-2.5 group cursor-pointer py-2">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md transition duration-300 group-hover:scale-105 ${
                isSticky 
                  ? 'bg-primary text-white shadow-primary/20' 
                  : 'bg-white text-primary shadow-black/10'
              }`}>
                <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg sm:text-xl font-black tracking-tight leading-none transition duration-300 ${
                  isSticky ? 'text-slate-900' : 'text-white'
                }`}>
                  Sedu<span className={isSticky ? 'text-primary' : 'text-amber-400'}>Ai</span>
                </span>
                <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-0.5 transition duration-300 ${
                  isSticky ? 'text-slate-500' : 'text-white/60'
                }`}>
                  EduCenter
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className={`hidden lg:flex space-x-2.5 xl:space-x-4 text-xs font-bold uppercase tracking-wider items-center h-full transition duration-300 ${
              isSticky ? 'text-slate-700' : 'text-white/90'
            }`}>
              {navLinks.map((link) => {
                if (link.submenu) {
                  return (
                    <div key={link.name} className="relative group flex items-center h-full cursor-pointer py-4">
                      <span className={`transition duration-150 flex items-center gap-1 py-1 px-2 rounded-lg ${
                        isSticky 
                          ? 'hover:text-primary hover:bg-slate-100 text-slate-700' 
                          : 'hover:text-white hover:bg-white/10 text-white/90'
                      }`}>
                        {link.name}{' '}
                        <ChevronDown className={`w-3.5 h-3.5 transition duration-200 group-hover:rotate-180 ${
                          isSticky ? 'text-slate-400 group-hover:text-primary' : 'text-white/70 group-hover:text-white'
                        }`} />
                      </span>
                      {/* Dropdown Menu - Sleek Glassmorphic Style */}
                      <div className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => handleLinkClick(sub.href)}
                            className="block px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-primary/10 hover:text-primary rounded-xl transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                const isActive = pathname?.startsWith(link.href);

                if (link.isSpecial) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/25 transition duration-200 transform hover:scale-105 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={`px-2.5 py-1.5 rounded-lg transition duration-150 ${
                      isActive
                        ? isSticky
                          ? 'text-primary font-black bg-primary/10 border-b-2 border-primary'
                          : 'text-white font-black bg-white/15 border-b-2 border-white'
                        : isSticky
                          ? 'hover:text-primary hover:bg-slate-100 text-slate-600'
                          : 'hover:text-white hover:bg-white/10 text-white/90'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search box and User Profile / Login */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm khóa học..."
                  className={`w-[150px] xl:w-[180px] focus:w-[220px] transition-all duration-300 border rounded-xl pl-3.5 pr-8 py-1.5 text-xs focus:outline-none focus:ring-2 ${
                    isSticky 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-primary/20' 
                      : 'bg-white/15 hover:bg-white/20 focus:bg-white/25 border-white/20 text-white placeholder-white/70 focus:ring-white/30'
                  }`}
                />
                <Search className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 transition duration-300 ${
                  isSticky ? 'text-slate-400' : 'text-white/70'
                }`} />
              </div>

              {/* User Menu / Login Badge */}
              {accessToken ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl transition text-xs font-semibold cursor-pointer shadow-inner ${
                      isSticky 
                        ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50' 
                        : 'bg-white/15 hover:bg-white/25 border-white/30 text-white'
                    }`}
                  >
                    <img
                      src={localSync.avatar}
                      alt={localSync.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/60"
                      loading="eager"
                      decoding="async"
                    />
                    <span className="max-w-[90px] truncate font-bold">{localSync.name}</span>
                    <div className="flex items-center gap-0.5 bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded text-[10px] shadow-sm">
                      <Award className="w-3 h-3 text-slate-950" />
                      <span>{localSync.point}</span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-800 z-50 animate-scale-up">
                      <div className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                        <p className="text-xs font-black text-slate-900 truncate">{localSync.name}</p>
                        <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                          <Award className="w-3.5 h-3.5 fill-amber-400" /> Điểm VIP: {localSync.point} điểm
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-primary/10 hover:text-primary rounded-xl transition"
                      >
                        <User className="w-4 h-4 text-primary" /> Quản lý tài khoản VIP
                      </Link>
                      <Link
                        href="/ai-assistant"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" /> Mở ChatGPT Assistant
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer mt-1 border-t border-slate-100 pt-2"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất tài khoản
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`flex items-center gap-1.5 font-black px-4 py-2 rounded-xl text-xs transition duration-200 transform hover:scale-105 ${
                    isSticky 
                      ? 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/10' 
                      : 'bg-white text-primary hover:bg-slate-100 shadow-lg shadow-white/10'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập
                </Link>
              )}
            </div>

            {/* Mobile Controls (Trigger Buttons on Header Right) */}
            <div className="flex items-center lg:hidden gap-2 sm:gap-3">
              {/* AI Assistant Quick Pill on Mobile */}
              <Link
                href="/ai-assistant"
                className="bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm"
                title="Mở AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">AI</span>
              </Link>

              {/* Mobile User Profile Pill or Login Button */}
              {accessToken ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition border border-white/20"
                >
                  <img src={localSync.avatar} className="w-5 h-5 rounded-full object-cover border border-white" loading="eager" decoding="async" />
                  <span className="text-amber-300 font-extrabold">{localSync.point}p</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-white text-primary font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Hamburger Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/15 focus:outline-none transition duration-200 border border-white/20"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER (Rich Interactive Mobile Layout) */}
        {isOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white text-slate-800 absolute top-full left-0 w-full shadow-2xl transition-all duration-300 max-h-[86vh] overflow-y-auto z-50">
            <div className="p-5 space-y-5">
              {/* Mobile Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học nhanh..."
                  className="w-full bg-slate-100 focus:bg-white border border-slate-200 focus:border-primary rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1.5">
                {navLinks.map((link) => {
                  if (link.submenu) {
                    return (
                      <div key={link.name} className="border border-slate-100 rounded-2xl p-1 bg-slate-50/60">
                        <button
                          onClick={() => setMobileCourseOpen(!mobileCourseOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm font-extrabold text-slate-800 uppercase tracking-wider rounded-xl hover:bg-slate-100 transition"
                        >
                          <span>{link.name}</span>
                          {mobileCourseOpen ? (
                            <ChevronUp className="w-4 h-4 text-primary" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        {mobileCourseOpen && (
                          <div className="pt-1 pb-2 px-2 space-y-1 border-t border-slate-200/60 mt-1">
                            {link.submenu.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => handleLinkClick(sub.href)}
                                className="block px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm transition"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
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
                        className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-2xl text-sm sm:text-base font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transform active:scale-98 transition"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{link.name} (ChatGPT Full Mode)</span>
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Mobile VIP User Section inside Drawer */}
              <div className="pt-3 border-t border-slate-200">
                {accessToken ? (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={localSync.avatar}
                          alt={localSync.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary shadow"
                          loading="eager"
                          decoding="async"
                        />
                        <div>
                          <p className="text-xs font-black text-white">{localSync.name}</p>
                          <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] mt-1">
                            <Award className="w-3 h-3 fill-slate-950" /> {localSync.point} điểm SeduAi
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <User className="w-3.5 h-3.5 text-primary" /> Hồ sơ VIP
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="py-2.5 px-3 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-3">
                    <p className="text-xs text-slate-600 font-medium">
                      Đăng nhập tài khoản thành viên để tích điểm & truy cập học tập với Giảng viên AI
                    </p>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full block py-3 bg-primary hover:bg-primary-dark text-white font-black rounded-xl text-xs shadow-md transition"
                    >
                      🚀 Đăng Nhập / Đăng Ký Thành Viên
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
