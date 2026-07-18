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
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Quản trị', href: '/lms/admin', icon: <Shield className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Tạo lớp học', href: '/lms/admin/classes/create', icon: <Users className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Dashboard giáo viên', href: '/lms/teacher', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['TEACHER'] },
  { label: 'Chấm bài', href: '/lms/teacher/grading', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['TEACHER'] },
  { label: 'Tạo đề thi', href: '/lms/teacher/exams/create', icon: <PenTool className="w-5 h-5" />, roles: ['TEACHER'] },
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

export default function LMSSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { lmsRole, localSync } = useAuth();
  const filteredItems = navItems.filter((item) => item.roles.includes(lmsRole));

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className={`relative h-[76px] px-4 border-b border-slate-100 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
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
        <button onClick={() => setCollapsed((value) => !value)} className="hidden lg:flex absolute -right-3 top-[64px] z-10 w-6 h-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-primary transition" aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}>
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && <div className="px-4 py-4">
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Vai trò hiện tại</p>
          <p className="text-sm font-black mt-0.5 text-slate-900">{roleLabels[lmsRole] || 'Người dùng'}</p>
          <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{localSync.name}</p>
        </div>
      </div>}

      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} py-2 space-y-1 overflow-y-auto`}>
        {!collapsed && <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Menu chính</p>}
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${isActive ? 'bg-primary/10 text-primary lms-nav-active' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
              <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`p-3 border-t border-slate-100 space-y-1 ${collapsed ? 'flex justify-center' : ''}`}>
        <Link href="/" title={collapsed ? 'Về trang chủ' : undefined} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-semibold">
          <Home className="w-4 h-4" />
          {!collapsed && <span>Về trang chủ</span>}
        </Link>
        {!collapsed && <div className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400"><Settings className="w-4 h-4" /> Cấu hình hệ thống</div>}
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white text-slate-700 shadow-md border border-slate-200 hover:text-primary transition" aria-label="Mở menu">
        <Menu className="w-5 h-5" />
      </button>
      <div className={`lms-sidebar-backdrop lg:hidden ${mobileOpen ? 'lms-sidebar-backdrop-visible' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`lms-sidebar ${mobileOpen ? 'lms-sidebar-open' : ''}`} style={{ width: collapsed ? '84px' : '260px', minHeight: '100vh' }}>
        {sidebarContent}
      </aside>
    </>
  );
}
