'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Brain, MessageSquare, Phone, Mail, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
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
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Bar - Edutech Premium Style */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-2.5 border-b border-slate-900 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" /> 
              Hotline: <strong className="text-slate-200">1900 1234</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> 
              Email: <a href="mailto:contact@seduai.edu.vn" className="text-slate-200 hover:text-primary transition duration-150">contact@seduai.edu.vn</a>
            </span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span>Giờ làm việc: 8:00 - 21:00</span>
            <span className="text-slate-800">|</span>
            <Link href="/#ai-crm-demo" className="text-primary hover:text-white transition duration-150 font-bold">
              Tư vấn AI Tuyển sinh 24/7
            </Link>
          </div>
        </div>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" onClick={() => handleLinkClick('/')} className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Sedu<span className="text-primary">Ai</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 text-sm font-semibold items-center h-full">
              {navLinks.map((link) => {
                if (link.submenu) {
                  return (
                    <div key={link.name} className="relative group flex items-center h-full cursor-pointer py-7">
                      <span className="text-slate-600 hover:text-primary transition duration-200 flex items-center gap-1">
                        {link.name} <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition duration-200" />
                      </span>
                      {/* Dropdown Menu - Edutech Style */}
                      <div className="absolute top-full left-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => handleLinkClick(sub.href)}
                            className="block px-5 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-primary-light hover:text-primary transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={`transition duration-200 ${
                      isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/#ai-crm-demo"
                className="px-5 py-2.5 rounded-full bg-primary-light text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Chat với AI
              </Link>
              <Link
                href="/courses"
                onClick={() => handleLinkClick('/courses')}
                className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all duration-300 shadow-md shadow-primary/10"
              >
                Học thử ngay
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 focus:outline-none transition duration-200"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden border-b border-slate-100 bg-white absolute top-full left-0 w-full shadow-lg transition-all duration-300">
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
              
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link
                  href="/#ai-crm-demo"
                  className="w-full text-center px-5 py-3 rounded-xl bg-primary-light text-primary font-bold text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Chat với AI Tuyển sinh
                </Link>
                <Link
                  href="/courses"
                  onClick={() => handleLinkClick('/courses')}
                  className="w-full text-center px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/10"
                >
                  Đăng ký học thử
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
