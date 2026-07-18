'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Users, BookOpen, GraduationCap, Plus, Search, Eye, Shield } from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  teacher?: { id: string; name: string; avatar?: string };
  studentCount?: number;
  subjectCount?: number;
  status: string;
  createdAt: string;
  _count?: { students: number; subjects: number };
}

export default function AdminDashboard() {
  const { localSync } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadClasses = useCallback(async () => {
    try {
      const res = await fetch('/api/lms/classes');
      const json = await res.json();
      if (json.success) setClasses(json.data);
    } catch (e) {
      console.error('Error loading classes:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClasses();
  }, [loadClasses]);

  const filtered = classes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Tổng lớp học', value: classes.length, icon: <BookOpen className="w-6 h-6" />, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Tổng học sinh', value: classes.reduce((sum, c) => sum + (c._count?.students || c.studentCount || 0), 0), icon: <GraduationCap className="w-6 h-6" />, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Tổng giáo viên', value: new Set(classes.map((c) => c.teacher?.id)).size, icon: <Users className="w-6 h-6" />, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="lms-dashboard-banner relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 text-slate-900 shadow-sm">
        <div className="lms-banner-orb absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="lms-banner-orb absolute bottom-0 left-1/4 w-24 h-24 rounded-full translate-y-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Bảng điều khiển Admin</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Xin chào, {localSync.name || 'Admin'}! ⚡</h1>
            <p className="text-sm text-slate-500 mt-2">Quản lý toàn bộ hệ thống lớp học, giáo viên và học sinh</p>
          </div>
          <Link
            href="/lms/admin/classes/create"
            className="hidden sm:flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tạo lớp mới
          </Link>
        </div>
      </div>

      {/* Mobile CTA */}
      <Link
        href="/lms/admin/classes/create"
        className="sm:hidden flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition"
      >
        <Plus className="w-4 h-4" /> Tạo lớp mới
      </Link>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="lms-card bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm lms-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 lms-stat-number">{stat.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Danh sách lớp học
          </h2>
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm lớp..."
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/80 transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="lms-shimmer h-14 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold">Chưa có lớp học nào</p>
            <Link href="/lms/admin/classes/create" className="text-primary text-sm font-bold hover:underline mt-2 inline-block">
              Tạo lớp đầu tiên →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">Lớp học</th>
                  <th className="text-left px-5 py-3.5">Giáo viên</th>
                  <th className="text-center px-5 py-3.5">Học sinh</th>
                  <th className="text-center px-5 py-3.5">Môn học</th>
                  <th className="text-center px-5 py-3.5">Trạng thái</th>
                  <th className="text-right px-5 py-3.5">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/60 transition group">
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-primary transition">{cls.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {cls.teacher?.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cls.teacher.avatar} className="w-7 h-7 rounded-full object-cover border-2 border-slate-100" alt="" />
                        )}
                        <span className="text-sm text-slate-700 font-medium">{cls.teacher?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">{cls._count?.students || cls.studentCount || 0}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">{cls._count?.subjects || cls.subjectCount || 0}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                        cls.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {cls.status === 'ACTIVE' ? '● Hoạt động' : 'Lưu trữ'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/lms/admin/classes/${cls.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition border border-primary/10"
                      >
                        <Eye className="w-3.5 h-3.5" /> Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
