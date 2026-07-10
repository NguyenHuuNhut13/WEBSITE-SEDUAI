'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { Search, GraduationCap, Headset, Mail, RefreshCw, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { courses, Course } from '@/data/courses';
import { getEduCourses, ApiCourse } from '@/services/api';

export default function CourseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');
  const [apiCoursesList, setApiCoursesList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  const categories = ['Tất cả', 'Tiếng Anh', 'Lập trình', 'Kỹ năng', 'AI & Công nghệ'];

  useEffect(() => {
    setLoading(true);
    getEduCourses().then((list) => {
      if (list && list.length > 0) {
        const mapped: Course[] = list.map((c: ApiCourse) => ({
          slug: `api-course-${c.id}`,
          title: typeof c.title === 'object' && c.title !== null && 'rendered' in c.title ? (c.title as any).rendered : String(c.title || ''),
          description: c.acf?.description?.replace(/<[^>]*>/g, '') || 'Khóa học chính thức từ hệ thống SeduAi EduCenter.',
          instructor: typeof c.acf?.expactteacher === 'object' && c.acf?.expactteacher !== null && 'title' in c.acf.expactteacher
            ? (c.acf.expactteacher as any).title
            : String(c.acf?.expactteacher || 'Giảng viên SeduAi'),
          level: typeof (c.acf?.type as any) === 'object' && c.acf?.type !== null 
            ? (Array.isArray(c.acf.type) ? ((c.acf.type as any)[0]?.post_title || 'Mọi trình độ') : ((c.acf.type as any).title || 'Mọi trình độ'))
            : String(c.acf?.type || 'Mọi trình độ'),
          duration: c.acf?.duration || '12 tuần',
          student_count: 420 + (c.id % 150),
          rating: 4.9,
          original_price: Number(c.acf?.price || 3500000),
          discount_price: Number(c.acf?.sale_price || c.acf?.price || 2490000),
          price: Number(c.acf?.price || 3500000),
          reviews_count: 24,
          image: c.acf?.featureimg || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
          category: typeof c.acf?.category === 'object' && c.acf?.category !== null && 'title' in c.acf.category
            ? (c.acf.category as any).title
            : String(c.acf?.category || 'AI & Công nghệ'),
          lessons_count: Number(c.acf?.lession || 24),
          benefits: [
            'Lộ trình chuẩn thực chiến SeduAi EduCenter',
            'Thực hành dự án với sự hướng dẫn của chuyên gia',
            'Đồng hành cùng Trợ lý AI giải đáp thắc mắc 24/7'
          ],
          syllabus: [
            {
              title: 'Chương 1: Khởi động và kiến thức nền tảng',
              lessons: ['Bài 1: Giới thiệu khóa học', 'Bài 2: Chuẩn bị môi trường & công cụ']
            },
            {
              title: 'Chương 2: Thực chiến kỹ năng cốt lõi',
              lessons: ['Bài 3: Ứng dụng thực tế và thực hành chuyên sâu']
            }
          ],
          reviews: [
            {
              name: 'Học viên SeduAi',
              rating: 5,
              date: 'Vừa xong',
              comment: 'Khóa học rất chất lượng, giảng viên nhiệt tình, AI hỗ trợ trả lời rất nhanh.'
            }
          ]
        }));
        setApiCoursesList(mapped);
      }
      setLoading(false);
    });
  }, []);

  const allCombinedCourses = apiCoursesList;

  // Client-side filtering logic
  let filteredCourses = allCombinedCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Tất cả' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả');
    setSortBy('default');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl"></div>
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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="relative w-full lg:max-w-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm tên khóa học..."
                  value={searchTerm}
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

              {/* Sort + Reset */}
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-grow lg:flex-grow-0">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full lg:w-48 pl-9 pr-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-slate-50 text-slate-600 cursor-pointer appearance-none"
                  >
                    <option value="default">Mặc định</option>
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="price-asc">Giá: Thấp → Cao</option>
                    <option value="price-desc">Giá: Cao → Thấp</option>
                  </select>
                </div>

                {(searchTerm !== '' || selectedCategory !== 'Tất cả' || sortBy !== 'default') && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Đặt lại
                  </button>
                )}
              </div>
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
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                      <Headset className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Điện thoại Hotline</h4>
                      <p className="text-xs text-primary font-semibold mt-0.5">1900 1234</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Hỗ trợ Email</h4>
                      <p className="text-xs text-slate-500 mt-0.5">admissions@seduai.edu.vn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level filter */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" /> Trình độ
                </h3>
                <div className="space-y-2">
                  {['Mọi trình độ', 'Cơ bản', 'Trung cấp', 'Nâng cao'].map((level) => (
                    <label key={level} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-primary transition">
                      <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Courses grid */}
            <div className="lg:col-span-9">
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500">
                  Hiển thị <strong className="text-slate-900">{loading ? 0 : filteredCourses.length}</strong> khóa học
                </p>
              </div>

              {loading ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center space-y-4 shadow-sm">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400 text-xs font-semibold">Đang tải danh sách khóa học thực tế từ CRM...</p>
                </div>
              ) : filteredCourses.length > 0 ? (
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
