'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Search, GraduationCap, Headset, Mail, RefreshCw } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/data/courses';

export default function CourseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [, startTransition] = useTransition();

  const categories = ['Tất cả', 'Tiếng Anh', 'Lập trình', 'Kỹ năng', 'AI & Công nghệ'];

  // Client-side filtering logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Tất cả' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchTerm(e.target.value);
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Danh Sách Khóa Học SeduAi</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Học tập thực chiến cùng các giảng viên chất lượng cao kết hợp với Trợ lý ảo AI đắc lực hỗ trợ 24/7.
          </p>

          {/* Breadcrumbs */}
          <nav className="flex justify-center text-xs font-semibold text-slate-400 gap-2 pt-2">
            <Link href="/" className="hover:text-primary transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-primary-light">Khóa học</span>
          </nav>
        </div>
      </section>

      {/* Main Course list grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="relative w-full lg:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm tên khóa học, mô tả..."
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto py-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border transition duration-200 cursor-pointer flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Reset filter button */}
              {(searchTerm !== '' || selectedCategory !== 'Tất cả') && (
                <button
                  onClick={handleReset}
                  className="w-full lg:w-auto px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Đặt lại
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar info */}
            <div className="lg:col-span-3 space-y-6">
              {/* Promo box */}
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <h3 className="font-extrabold text-lg mb-3">Học Thử Cùng AI</h3>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Tất cả các khóa học tại SeduAi đều tích hợp AI Assistant đồng hành hỗ trợ học viên 24/7 giải bài tập, dịch thuật và tối ưu lộ trình.
                </p>
                <Link
                  href="/#ai-crm-demo"
                  className="block text-center w-full py-2.5 bg-white text-primary font-bold text-xs rounded-xl hover:bg-blue-50 transition duration-200 shadow-lg cursor-pointer"
                >
                  Thử Trò Chuyện Ngay
                </Link>
              </div>

              {/* Quick FAQ info */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                  Hỗ trợ tuyển sinh
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 text-sm">
                      <Headset className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Điện thoại Hotline</h4>
                      <p className="text-xs text-primary font-semibold mt-0.5">1900 1234</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 text-sm">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Hỗ trợ Email</h4>
                      <p className="text-xs text-slate-500 mt-0.5">admissions@seduai.edu.vn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses grid */}
            <div className="lg:col-span-9">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.slug} course={course} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">Không tìm thấy khóa học nào</h3>
                    <p className="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để tìm lại.</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="inline-block px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-primary-dark transition"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
