'use client';

import { useState, useTransition, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, GraduationCap, Headset, Mail, RefreshCw, ArrowUpDown, Tag, Wallet } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/data/courses';
import { getEduCourses } from '@/services/api';
import { mapApiCourseToCourse } from '@/lib/course-mapping';

function CourseListContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [apiCoursesList, setApiCoursesList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getEduCourses().then((list) => {
      if (list && list.length > 0) {
        setApiCoursesList(list.map(mapApiCourseToCourse));
      }
      setLoading(false);
    });
  }, []);

  // Trích xuất danh mục từ dữ liệu API
  const categories = useMemo(() => {
    const catSet = new Set<string>();
    apiCoursesList.forEach((c) => { if (c.category) catSet.add(c.category); });
    return ['Tất cả', ...Array.from(catSet).sort()];
  }, [apiCoursesList]);

  // Client-side filtering logic
  let filteredCourses = apiCoursesList.filter((course) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      course.title.toLowerCase().includes(lowerSearch) ||
      course.description.toLowerCase().includes(lowerSearch) ||
      course.instructor.toLowerCase().includes(lowerSearch);
    const matchesCategory =
      selectedCategory === 'Tất cả' || course.category === selectedCategory;

    const matchesPrice = course.discount_price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sorting
  if (sortBy === 'price-asc') {
    filteredCourses = [...filteredCourses].sort((a, b) => a.discount_price - b.discount_price);
  } else if (sortBy === 'price-desc') {
    filteredCourses = [...filteredCourses].sort((a, b) => b.discount_price - a.discount_price);
  } else if (sortBy === 'rating') {
    filteredCourses = [...filteredCourses].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'popular') {
    filteredCourses = [...filteredCourses].sort((a, b) => b.student_count - a.student_count);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchTerm(e.target.value);
    });
  };

  const isFiltered = searchTerm !== '' || selectedCategory !== 'Tất cả' || sortBy !== 'default' || maxPrice < 10000000;

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả');
    setSortBy('default');
    setMaxPrice(10000000);
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-none blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-accent/10 rounded-none blur-3xl animate-blob" style={{ animationDelay: '5s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Danh Sách <span className="gradient-text">Khóa Học</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Học tập thực chiến cùng các giảng viên chất lượng cao kết hợp với Trợ lý ảo AI đắc lực hỗ trợ 24/7.
          </p>

          {/* Breadcrumbs */}
          <nav className="flex justify-center text-xs font-semibold text-slate-400 gap-2 pt-2">
            <Link href="/" className="hover:text-primary transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Khóa học</span>
          </nav>
        </div>
      </section>

      {/* Main Course list grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls bar */}
          <div className="bg-white border border-slate-200 rounded-none p-5 mb-8 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm tên khóa học, giảng viên..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                />
              </div>

              {/* Sort + Reset */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-48 pl-9 pr-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-none focus:outline-none focus:border-primary bg-slate-50 text-slate-600 cursor-pointer appearance-none"
                  >
                    <option value="default">Mặc định</option>
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                  </select>
                </div>

                {isFiltered && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-none text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Đặt lại
                  </button>
                )}
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-primary/50">
              {(loading ? ['Tất cả'] : categories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-none border transition-all duration-300 cursor-pointer flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'bg-slate-50 hover:bg-primary-light hover:border-primary/30 hover:text-primary text-slate-600 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar info */}
            <div className="lg:col-span-3 space-y-6">
              {/* Promo box */}
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-none p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-none blur-xl"></div>
                <h3 className="font-extrabold text-lg mb-3">Học Thử Cùng AI</h3>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Tất cả các khóa học tại SeduAi đều tích hợp AI Assistant đồng hành hỗ trợ học viên 24/7 giải bài tập, dịch thuật và tối ưu lộ trình.
                </p>
                <Link
                  href="/#ai-crm-demo"
                  className="block text-center w-full py-2.5 bg-white text-primary font-bold text-xs rounded-none hover:bg-blue-50 transition duration-200 shadow-lg cursor-pointer"
                >
                  Thử Trò Chuyện Ngay
                </Link>
              </div>

              {/* Price range filter */}
              <div className="bg-white border border-slate-200 rounded-none p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" /> Mức giá tối đa
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">0đ</span>
                    <span className="text-primary bg-primary-light px-2.5 py-1 rounded-none">
                      {maxPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-slate-100 rounded-none cursor-pointer appearance-none focus:outline-none"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span>Thấp nhất</span>
                    <span>10.000.000đ</span>
                  </div>
                </div>
              </div>

              {/* Category summary */}
              {!loading && (
                <div className="bg-white border border-slate-200 rounded-none p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" /> Danh mục
                  </h3>
                  <div className="space-y-2">
                    {categories.filter(c => c !== 'Tất cả').map((cat) => {
                      const count = apiCoursesList.filter(c => c.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-none transition cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-primary-light text-primary font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-none ${
                            selectedCategory === cat ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick FAQ info */}
              <div className="bg-white border border-slate-200 rounded-none p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                  Hỗ trợ tuyển sinh
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-none bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                      <Headset className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Điện thoại Hotline</h4>
                      <p className="text-xs text-primary font-semibold mt-0.5">1900 1234</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-none bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-4 h-4" />
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
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500">
                  Hiển thị <strong className="text-slate-900">{loading ? 0 : filteredCourses.length}</strong> khóa học
                  {selectedCategory !== 'Tất cả' && (
                    <> trong <strong className="text-primary">{selectedCategory}</strong></>
                  )}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm animate-pulse">
                      <div className="aspect-video bg-slate-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-slate-200 rounded-none w-3/4" />
                        <div className="h-4 bg-slate-200 rounded-none" />
                        <div className="h-4 bg-slate-200 rounded-none w-5/6" />
                        <div className="flex gap-4 pt-2">
                          <div className="h-3 bg-slate-200 rounded-none w-20" />
                          <div className="h-3 bg-slate-200 rounded-none w-24" />
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                          <div className="h-5 bg-slate-200 rounded-none w-24" />
                          <div className="h-8 bg-slate-200 rounded-none w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, idx) => (
                    <div key={course.slug} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 9) * 60}ms`, animationFillMode: 'both' }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-none p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-none bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">Không tìm thấy khóa học nào</h3>
                    <p className="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để tìm lại.</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="inline-block px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-none shadow-md cursor-pointer hover:bg-primary-dark transition"
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

export default function CourseList() {
  return (
    <Suspense fallback={
      <div className="bg-slate-100 min-h-screen py-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-none border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-500 text-xs font-semibold">Đang tải danh sách khóa học...</p>
        </div>
      </div>
    }>
      <CourseListContent />
    </Suspense>
  );
}
