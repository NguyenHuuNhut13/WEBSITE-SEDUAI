'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Brain,
  Shield,
  PenTool,
  BookMarked,
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

export default function LMSSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { lmsRole, localSync } = useAuth();

  const filteredItems = navItems.filter((item) => item.roles.includes(lmsRole));

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

  return (
    <aside
      className={`lms-sidebar ${collapsed ? 'lms-sidebar-collapsed' : ''}`}
      style={{
        width: collapsed ? '72px' : '260px',
        minHeight: '100vh',
        transition: 'width 0.3s ease',
      }}
    >
      <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <Link href="/lms" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 flex-shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="text-base font-black text-white tracking-tight">
                  Sedu<span className="text-amber-400">Ai</span>
                </span>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">LMS System</span>
              </div>
            )}
          </Link>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-3">
            <div className={`bg-gradient-to-r ${roleColors[lmsRole]} rounded-xl p-3 text-white`}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Vai trò</p>
              <p className="text-sm font-black">{roleLabels[lmsRole]}</p>
              <p className="text-xs font-medium opacity-80 truncate mt-0.5">{localSync.name}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition text-xs font-semibold cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Thu gọn</span></>}
          </button>
        </div>
      </div>
    </aside>
  );
}
