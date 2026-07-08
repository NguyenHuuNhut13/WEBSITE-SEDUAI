'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Brain, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khóa học', href: '/courses' },
    { name: 'Hệ sinh thái AI', href: '/#ai-crm-demo' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Sedu<span className="text-primary">Ai</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = 
                link.href === '/' 
                  ? pathname === '/' 
                  : pathname?.startsWith(link.href) && link.href !== '/#ai-crm-demo';
              return (
                <Link
                  key={link.name}
                  href={link.href}
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
          <div className="px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => {
              const isActive = 
                link.href === '/' 
                  ? pathname === '/' 
                  : pathname?.startsWith(link.href) && link.href !== '/#ai-crm-demo';
              return (
                <Link
                  key={link.name}
                  href={link.href}
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
                className="w-full text-center px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/10"
              >
                Đăng ký học thử
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
