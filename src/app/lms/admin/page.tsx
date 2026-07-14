'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Users, BookOpen, GraduationCap, Plus, Search, MoreVertical, Trash2, Eye } from 'lucide-react';

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
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadClasses = async () => {
    try {
      const res = await fetch('/api/lms/classes');
      const json = await res.json();
      if (json.success) setClasses(json.data);
    } catch (e) {
      console.error('Error loading classes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filtered = classes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Tổng lớp học', value: classes.length, icon: <BookOpen className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
    { label: 'Tổng học sinh', value: classes.reduce((sum, c) => sum + (c._count?.students || c.studentCount || 0), 0), icon: <GraduationCap className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600' },
    { label: 'Tổng giáo viên', value: new Set(classes.map((c) => c.teacher?.id)).size, icon: <Users className="w-6 h-6" />, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản trị LMS</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý lớp học, giáo viên và học sinh</p>
        </div>
        <Link
          href="/lms/admin/classes/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition"
        >
          <Plus className="w-4 h-4" /> Tạo lớp mới
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">{stat.label}</p>
                <p className="text-3xl font-black mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Danh sách lớp học</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm lớp..."
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm mt-3">Đang tải...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">Chưa có lớp học nào</p>
            <Link href="/lms/admin/classes/create" className="text-primary text-sm font-bold hover:underline mt-2 inline-block">
              Tạo lớp đầu tiên →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Lớp học</th>
                  <th className="text-left px-5 py-3">Giáo viên</th>
                  <th className="text-center px-5 py-3">Học sinh</th>
                  <th className="text-center px-5 py-3">Môn học</th>
                  <th className="text-center px-5 py-3">Trạng thái</th>
                  <th className="text-right px-5 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 text-sm">{cls.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {cls.teacher?.avatar && (
                          <img src={cls.teacher.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                        )}
                        <span className="text-sm text-slate-700 font-medium">{cls.teacher?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">{cls._count?.students || cls.studentCount || 0}/25</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">{cls._count?.subjects || cls.subjectCount || 0}/4</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        cls.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cls.status === 'ACTIVE' ? 'Hoạt động' : 'Lưu trữ'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/lms/admin/classes/${cls.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition"
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
