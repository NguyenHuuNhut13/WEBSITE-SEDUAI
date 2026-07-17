'use client';

import { useState, useTransition, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, GraduationCap, Headset, Mail, RefreshCw, ArrowUpDown, Tag, Wallet } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/data/courses';
import { getEduCourses, ApiCourse } from '@/services/api';

// Ảnh fallback theo danh mục
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Marketing & Bán hàng': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  'Kinh doanh & Khởi nghiệp': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  'AI & Công nghệ': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
};
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

// Khoảng giá
const PRICE_RANGES = [
  { label: 'Tất cả mức giá', value: 'all' },
  { label: 'Dưới 500.000đ', value: 'under500k' },
  { label: '500.000đ – 1.000.000đ', value: '500k-1m' },
  { label: 'Trên 1.000.000đ', value: 'over1m' },
] as const;

function extractCategory(acfCategory: unknown): string {
  if (Array.isArray(acfCategory) && acfCategory.length > 0) {
    const first = acfCategory[0];
    if (first && typeof first === 'object' && 'title' in first) {
      return String((first as { title: string }).title);
    }
  }
  if (acfCategory && typeof acfCategory === 'object' && 'title' in acfCategory) {
    return String((acfCategory as { title: string }).title);
  }
  if (typeof acfCategory === 'string' && acfCategory) {
    return acfCategory;
  }
  return 'Khác';
}

function extractInstructor(acf: ApiCourse['acf']): string {
  if (acf?.faculty && typeof acf.faculty === 'object' && 'title' in acf.faculty) {
    return String((acf.faculty as { title: string }).title);
  }
  if (acf?.expactteacher && typeof acf.expactteacher === 'object' && 'title' in acf.expactteacher) {
    return String((acf.expactteacher as { title: string }).title);
  }
  if (typeof acf?.expactteacher === 'string' && acf.expactteacher) {
    return acf.expactteacher;
  }
  return 'Giảng viên SeduAi';
}

function parsePrice(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function mapApiCourse(c: ApiCourse): Course {
  const category = extractCategory(c.acf?.category);
  const price = parsePrice(c.acf?.price);
  const salePrice = parsePrice(c.acf?.sale_price);
  const discountPrice = salePrice > 0 ? salePrice : price;
  const image = c.acf?.featureimg || CATEGORY_FALLBACK_IMAGES[category] || DEFAULT_FALLBACK_IMAGE;

  return {
    slug: `api-course-${c.id}`,
    title: typeof c.title === 'object' && c.title !== null && 'rendered' in c.title
      ? (c.title as { rendered: string }).rendered
      : String(c.title || ''),
    description: c.acf?.description?.replace(/<[^>]*>/g, '') || 'Khóa học chính thức từ hệ thống SeduAi EduCenter.',
    instructor: extractInstructor(c.acf),
    level: 'Mọi trình độ',
    duration: c.acf?.duration || '—',
    student_count: 420 + (c.id % 150),
    rating: 4.9,
    discount_price: discountPrice,
    price,
    reviews_count: 24,
    image,
    category,
    benefits: [
      'Lộ trình chuẩn thực chiến SeduAi EduCenter',
      'Thực hành dự án với sự hướng dẫn của chuyên gia',
      'Đồng hành cùng Trợ lý AI giải đáp thắc mắc 24/7',
    ],
    syllabus: [
      { title: 'Chương 1: Khởi động và kiến thức nền tảng', lessons: ['Bài 1: Giới thiệu khóa học', 'Bài 2: Chuẩn bị môi trường & công cụ'] },
      { title: 'Chương 2: Thực chiến kỹ năng cốt lõi', lessons: ['Bài 3: Ứng dụng thực tế và thực hành chuyên sâu'] },
    ],
    reviews: [
      { name: 'Học viên SeduAi', rating: 5, date: 'Vừa xong', comment: 'Khóa học rất chất lượng, giảng viên nhiệt tình, AI hỗ trợ trả lời rất nhanh.' },
    ],
  };
}

function CourseListContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
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
        setApiCoursesList(list.map(mapApiCourse));
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

    let matchesPrice = true;
    if (priceRange === 'under500k') {
      matchesPrice = course.discount_price < 500000;
    } else if (priceRange === '500k-1m') {
      matchesPrice = course.discount_price >= 500000 && course.discount_price <= 1000000;
    } else if (priceRange === 'over1m') {
      matchesPrice = course.discount_price > 1000000;
    }

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

  const isFiltered = searchTerm !== '' || selectedCategory !== 'Tất cả' || sortBy !== 'default' || priceRange !== 'all';

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('Tất cả');
    setSortBy('default');
    setPriceRange('all');
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '5s' }} />
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
                  placeholder="Tìm tên khóa học, giảng viên..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto py-1 scrollbar-none">
                {(loading ? ['Tất cả'] : categories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105'
                        : 'bg-slate-50 hover:bg-primary-light hover:border-primary/30 hover:text-primary text-slate-600 border-slate-200'
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

                {isFiltered && (
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

              {/* Price range filter */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" /> Khoảng giá
                </h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-primary transition group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === range.value}
                        onChange={() => setPriceRange(range.value)}
                        className="rounded-full border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className={priceRange === range.value ? 'text-primary font-semibold' : ''}>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category summary */}
              {!loading && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
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
                          className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-primary-light text-primary font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
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
            </div>

            {/* Courses grid */}
            <div className="lg:col-span-9">
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400">
                  Hiển thị <strong className="text-white">{loading ? 0 : filteredCourses.length}</strong> khóa học
                  {selectedCategory !== 'Tất cả' && (
                    <> trong <strong className="text-primary">{selectedCategory}</strong></>
                  )}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                      <div className="aspect-video bg-slate-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                        <div className="h-4 bg-slate-200 rounded-full" />
                        <div className="h-4 bg-slate-200 rounded-full w-5/6" />
                        <div className="flex gap-4 pt-2">
                          <div className="h-3 bg-slate-200 rounded-full w-20" />
                          <div className="h-3 bg-slate-200 rounded-full w-24" />
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                          <div className="h-5 bg-slate-200 rounded w-24" />
                          <div className="h-8 bg-slate-200 rounded-xl w-20" />
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

export default function CourseList() {
  return (
    <Suspense fallback={
      <div className="bg-slate-950 min-h-screen py-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-semibold">Đang tải danh sách khóa học...</p>
        </div>
      </div>
    }>
      <CourseListContent />
    </Suspense>
  );
}

