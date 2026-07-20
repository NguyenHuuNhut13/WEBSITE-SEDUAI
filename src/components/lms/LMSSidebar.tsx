'use client';

import { useEffect, useState } from 'react';
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
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
  section: string;
}

const navItems: NavItem[] = [
  { label: 'Quản trị', href: '/lms/admin', icon: <Shield className="w-5 h-5" />, roles: ['ADMIN'], section: 'Tổng quan' },
  { label: 'Tạo lớp học', href: '/lms/admin/classes/create', icon: <Users className="w-5 h-5" />, roles: ['ADMIN'], section: 'Quản lý học tập' },
  { label: 'Dashboard giáo viên', href: '/lms/teacher', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['TEACHER'], section: 'Tổng quan' },
  { label: 'Chấm bài', href: '/lms/teacher/grading', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['TEACHER'], section: 'Quản lý học tập' },
  { label: 'Tạo đề thi', href: '/lms/teacher/exams/create', icon: <PenTool className="w-5 h-5" />, roles: ['TEACHER'], section: 'Quản lý học tập' },
  { label: 'Lớp học', href: '/lms/student', icon: <GraduationCap className="w-5 h-5" />, roles: ['STUDENT'], section: 'Tổng quan' },
  { label: 'Môn học', href: '/lms/student/subjects', icon: <BookMarked className="w-5 h-5" />, roles: ['STUDENT'], section: 'Học tập' },
  { label: 'Bài tập', href: '/lms/student/assignments', icon: <FileText className="w-5 h-5" />, roles: ['STUDENT'], section: 'Học tập' },
  { label: 'Bài thi', href: '/lms/student/exams', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['STUDENT'], section: 'Học tập' },
];

const roleLabels: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  TEACHER: 'Giáo viên',
  STUDENT: 'Học sinh',
};

export default function LMSSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { lmsRole } = useAuth();
  const filteredItems = navItems.filter((item) => item.roles.includes(lmsRole));
  const activeItem = [...filteredItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname?.startsWith(item.href + '/'));

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className={`relative h-[76px] px-5 border-b border-slate-100 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <Link href="/lms" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:bg-primary-dark transition-colors">
            <Brain className="w-5 h-5" strokeWidth={2.5} />
          </div>
          {!collapsed && <div className="overflow-hidden">
            <span className="text-base font-black text-slate-900 tracking-tight">Sedu<span className="text-primary">Ai</span></span>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">LMS System</span>
          </div>}
        </Link>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition" aria-label="Đóng menu">
          <X className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="hidden lg:flex absolute -right-4 top-5 z-10 w-8 h-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-primary/30 hover:text-primary transition"
          aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          <Menu className="w-4 h-4" strokeWidth={2.25} />
        </button>
      </div>

      {!collapsed && <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
            <p className="text-sm font-semibold mt-1 text-slate-900 truncate">{roleLabels[lmsRole] || 'Người dùng'}</p>
          </div>
          <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
        </div>
      </div>}

      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-1 overflow-y-auto`}>
        {filteredItems.map((item, index) => {
          const isActive = activeItem?.href === item.href;
          const showSection = !collapsed && (index === 0 || filteredItems[index - 1].section !== item.section);
          return (
            <div key={item.href}>
              {showSection && <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.section}</p>}
              <Link href={item.href} title={collapsed ? item.label : undefined} className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}>
                <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </div>
          );
        })}
      </nav>

    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white text-slate-700 shadow-md border border-slate-200 hover:text-primary transition" aria-label="Mở menu">
        <Menu className="w-5 h-5" />
      </button>
      <div className={`lms-sidebar-backdrop lg:hidden ${mobileOpen ? 'lms-sidebar-backdrop-visible' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`lms-sidebar ${mobileOpen ? 'lms-sidebar-open' : ''}`} style={{ width: collapsed ? '84px' : '280px', minHeight: '100vh' }}>
        {sidebarContent}
      </aside>
    </>
  );
}
