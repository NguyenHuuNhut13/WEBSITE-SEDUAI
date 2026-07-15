'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
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
  GraduationCap,
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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.113-5.211 4.113a5.83 5.83 0 1 1 0-11.66c1.61 0 2.978.579 4.024 1.543l2.42-2.42C18.89 3.58 15.86 2.457 12.24 2.457a9.543 9.543 0 1 0 0 19.086c5.28 0 9.543-3.83 9.543-9.543 0-.663-.07-1.3-.2-1.915H12.24Z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileCourseOpen, setMobileCourseOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, localSync, logout } = useAuth();

  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile menu & reset dropdowns on path changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      setShowUserMenu(false);
      setMobileCourseOpen(false);
    }, 0);
    return () => clearTimeout(timer);
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
    if (href.includes('#')) return;
    const targetPath = href.split('?')[0];
    if (pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks: {
    name: string;
    href: string;
    submenu?: { name: string; href: string }[];
  }[] = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'EVENT', href: '/events' },
    {
      name: 'COURSES',
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
    { name: 'FEATURES', href: '/#ai-crm-demo' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CONTACT', href: '/contact' },
    ...(accessToken ? [
      { name: 'LMS', href: '/lms' },
      { name: 'PROFILE', href: '/profile' }
    ] : []),
  ];

  return (
    <>
      {!isSticky && (
        <div className="bg-black/60 text-white/95 py-2.5 border-b border-white/10 hidden lg:block text-xs relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-6 font-semibold">
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#c91e1e] shadow-sm">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>45/12 Best Avenue Street, UK 2450, US</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#c91e1e] shadow-sm">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:help@example.com" className="hover:text-white/80 transition">
                  help@example.com
                </a>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#c91e1e] shadow-sm">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>+49-123-456-789</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <a href="#" onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-[#c91e1e] hover:text-white transition shadow-sm">
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-[#c91e1e] hover:text-white transition shadow-sm">
                <GoogleIcon className="w-3.5 h-3.5" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-[#c91e1e] hover:text-white transition shadow-sm">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-[#c91e1e] hover:text-white transition shadow-sm">
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      <header className={`z-50 transition-all duration-300 ${
        isSticky 
          ? 'sticky top-0 left-0 w-full bg-[#c91e1e] shadow-xl border-b border-red-800' 
          : 'bg-transparent lg:absolute lg:top-[48px] lg:left-0 lg:right-0'
      }`}>
        <div className={`mx-auto transition-all duration-300 ${
          isSticky 
            ? 'w-full px-0' 
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        }`}>
          <div className="flex items-stretch w-full">
            <Link 
              href="/" 
              onClick={() => handleLinkClick('/')} 
              className={`bg-white text-slate-900 transition-all duration-300 flex flex-col items-center justify-center shadow-lg border-b border-slate-200/80 shrink-0 ${
                isSticky 
                  ? 'h-16 px-6' 
                  : 'h-20 lg:h-24 px-8 mt-0 lg:-mt-2 rounded-b-xl lg:rounded-b-2xl'
              }`}
            >
              <div className={`bg-[#c91e1e] text-white flex items-center justify-center rounded transition-all duration-300 ${
                isSticky ? 'w-8 h-8' : 'w-10 h-10 lg:w-12 lg:h-12'
              }`}>
                <GraduationCap className={isSticky ? 'w-5 h-5' : 'w-6 h-6 lg:w-7.5 lg:h-7.5'} />
              </div>
              <span className={`font-black uppercase tracking-widest text-[#222] transition-all duration-300 ${
                isSticky ? 'text-[9px] mt-1' : 'text-[10px] lg:text-xs mt-2'
              }`}>
                EDUTECH
              </span>
            </Link>

            <div className={`bg-[#c91e1e] text-white flex items-center justify-between flex-grow transition-all duration-300 shadow-md ${
              isSticky 
                ? 'h-16 px-4 lg:px-8' 
                : 'h-18 lg:h-20 px-6 lg:px-10 rounded-r-xl lg:rounded-r-2xl'
            }`}>
              <nav className="hidden lg:flex space-x-4 xl:space-x-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider items-center h-full">
                {navLinks.map((link) => {
                  if (link.submenu) {
                    return (
                      <div key={link.name} className="relative group flex items-center h-full cursor-pointer py-4">
                        <span className="hover:text-white/80 transition duration-150 flex items-center gap-1">
                          {link.name}{' '}
                          <ChevronDown className="w-3.5 h-3.5 transition duration-200 group-hover:rotate-180 text-white/70 group-hover:text-white" />
                        </span>
                        <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0 text-slate-800">
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => handleLinkClick(sub.href)}
                              className="block px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-rose-50 hover:text-[#c91e1e] rounded-lg transition"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className={`transition duration-150 py-1 border-b-2 ${
                        isActive
                          ? 'border-white text-white font-black'
                          : 'border-transparent text-white/90 hover:text-white hover:border-white/40'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden lg:flex items-center gap-3 xl:gap-4">
                {accessToken ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 border border-white/30 px-3 py-1.5 rounded-xl hover:bg-white/10 transition text-xs font-bold text-white cursor-pointer"
                    >
                      <img
                        src={localSync.avatar}
                        alt={localSync.name}
                        className="w-5.5 h-5.5 rounded-full object-cover border border-white/60"
                        loading="eager"
                        decoding="async"
                      />
                      <span className="max-w-[80px] truncate">{localSync.name}</span>
                      <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px]">{localSync.point}p</span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 text-slate-800 z-50 animate-scale-up">
                        <div className="px-2.5 py-2 bg-slate-50 rounded-lg mb-1 border border-slate-100">
                          <p className="text-[11px] font-black text-slate-900 truncate">{localSync.name}</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-2.5 py-2 text-[11px] font-bold text-slate-700 hover:bg-primary/10 hover:text-primary rounded-lg transition"
                        >
                          <User className="w-3.5 h-3.5 text-primary" /> Hồ sơ VIP
                        </Link>
                        <button
                          onClick={async () => {
                            if (await logout()) {
                              setShowUserMenu(false);
                              router.push('/');
                            }
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="border border-white/40 hover:bg-white hover:text-[#c91e1e] text-white font-black px-3.5 py-2 rounded-xl text-xs tracking-wider uppercase transition flex items-center gap-1 shrink-0"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Đăng Nhập</span>
                  </Link>
                )}
                <Link 
                  href="/ai-assistant"
                  className="border border-white/40 hover:bg-white/10 text-white font-black px-3 py-2 rounded-xl text-xs tracking-wider uppercase transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Assistant</span>
                </Link>
                <div className="relative flex items-center border border-white/40 rounded-xl bg-transparent px-3 py-1.5 focus-within:border-white focus-within:ring-1 focus-within:ring-white/20 transition">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-white placeholder-white/60 outline-none w-28 sm:w-36 focus:w-44 transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-white/80 shrink-0 ml-2" />
                </div>
              </div>

              <div className="flex items-center lg:hidden gap-3">
                <Link
                  href="/ai-assistant"
                  className="bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm"
                  title="Mở AI Assistant"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">AI</span>
                </Link>
                {accessToken ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg text-xs font-bold transition border border-white/20"
                  >
                    <img src={localSync.avatar} className="w-5 h-5 rounded-full object-cover border border-white" loading="eager" decoding="async" />
                    <span className="text-amber-300 font-extrabold text-[10px]">{localSync.point}p</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-white text-[#c91e1e] font-extrabold px-2.5 py-1.5 rounded-xl text-[10px] shadow-md uppercase tracking-wider"
                  >
                    Đăng nhập
                  </Link>
                )}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/10 transition border border-white/20"
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white text-slate-800 absolute top-full left-0 w-full shadow-2xl transition-all duration-300 max-h-[86vh] overflow-y-auto z-50">
            <div className="p-5 space-y-5">
              <div className="relative">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#c91e1e] rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c91e1e]/20 transition font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
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
                            <ChevronUp className="w-4 h-4 text-[#c91e1e]" />
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
                                className="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white hover:text-[#c91e1e] hover:shadow-sm transition"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => handleLinkClick(link.href)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                        isActive
                          ? 'bg-[#c91e1e] text-white shadow-md shadow-red-600/20'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#c91e1e]'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </Link>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-slate-200">
                {accessToken ? (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={localSync.avatar}
                          alt={localSync.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#c91e1e] shadow"
                          loading="eager"
                          decoding="async"
                        />
                        <div>
                          <p className="text-xs font-black text-white">{localSync.name}</p>
                          <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] mt-1">
                            <Award className="w-3 h-3 fill-slate-950" /> {localSync.point} điểm
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
                        onClick={async () => {
                          if (await logout()) {
                            setIsOpen(false);
                            router.push('/');
                          }
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
                      Đăng nhập để tích điểm & truy cập học tập với Giảng viên AI
                    </p>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full block py-3 bg-[#c91e1e] hover:bg-red-700 text-white font-black rounded-xl text-xs shadow-md transition"
                    >
                      🚀 Đăng Nhập / Đăng Ký
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
