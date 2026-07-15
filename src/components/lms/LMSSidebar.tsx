'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  GraduationCap,
  Brain,
  Shield,
  PenTool,
  BookMarked,
  Home,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  // Admin
  { label: 'Quản trị', href: '/lms/admin', icon: <Shield className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Tạo lớp học', href: '/lms/admin/classes/create', icon: <Users className="w-5 h-5" />, roles: ['ADMIN'] },

  // Teacher
  { label: 'Dashboard GV', href: '/lms/teacher', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['TEACHER'] },
  { label: 'Chấm bài', href: '/lms/teacher/grading', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['TEACHER'] },
  { label: 'Tạo đề thi', href: '/lms/teacher/exams/create', icon: <PenTool className="w-5 h-5" />, roles: ['TEACHER'] },

  // Student
  { label: 'Lớp học', href: '/lms/student', icon: <GraduationCap className="w-5 h-5" />, roles: ['STUDENT'] },
  { label: 'Môn học', href: '/lms/student/subjects', icon: <BookMarked className="w-5 h-5" />, roles: ['STUDENT'] },
  { label: 'Bài tập', href: '/lms/student/assignments', icon: <FileText className="w-5 h-5" />, roles: ['STUDENT'] },
  { label: 'Bài thi', href: '/lms/student/exams', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['STUDENT'] },
];

const roleLabels: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  TEACHER: 'Giáo viên',
  STUDENT: 'Học sinh',
};

const roleColors: Record<string, string> = {
  ADMIN: 'from-rose-500 to-pink-600',
  TEACHER: 'from-blue-500 to-indigo-600',
  STUDENT: 'from-emerald-500 to-teal-600',
};

export default function LMSSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { lmsRole, localSync } = useAuth();

  const filteredItems = navItems.filter((item) => item.roles.includes(lmsRole));

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <Link href="/lms" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/30 flex-shrink-0 group-hover:shadow-primary/50 transition-shadow">
              <Brain className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="text-base font-black text-white tracking-tight">
                Sedu<span className="text-amber-400">Ai</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">LMS System</span>
            </div>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <div className={`bg-gradient-to-r ${roleColors[lmsRole]} rounded-xl p-3.5 text-white shadow-lg relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/5" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Vai trò</p>
            <p className="text-sm font-black mt-0.5">{roleLabels[lmsRole]}</p>
            <p className="text-xs font-medium opacity-75 truncate mt-0.5">{localSync.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary/15 text-white lms-nav-active'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/50 space-y-1">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/70 transition text-sm font-semibold"
        >
          <Home className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-xl text-white shadow-lg border border-slate-700/50 hover:bg-slate-800 transition"
        aria-label="Mở menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile backdrop */}
      <div
        className={`lms-sidebar-backdrop lg:hidden ${mobileOpen ? 'lms-sidebar-backdrop-visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`lms-sidebar ${mobileOpen ? 'lms-sidebar-open' : ''}`}
        style={{ width: '260px', minHeight: '100vh' }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
