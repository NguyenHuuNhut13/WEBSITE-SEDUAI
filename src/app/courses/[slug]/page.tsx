'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Clock,
  GraduationCap,
  Check,
  ShieldCheck,
  Award,
  X,
  Send,
  ChevronDown,
  BookOpen,
  Users,
  PlayCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { courses, Course } from '@/data/courses';
import CourseCard from '@/components/CourseCard';
import { createLead, getEduCourses, ApiCourse } from '@/services/api';

type TabKey = 'overview' | 'syllabus' | 'reviews' | 'instructor';

export default function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Resolve params promise in Next.js 15
  const { slug } = React.use(params);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({ 0: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // 1. Check local courses first
    const local = courses.find((c) => c.slug === slug);
    if (local) {
      setCourse(local);
      setLoading(false);
      return;
    }

    // 2. Check API courses
    if (slug.startsWith('api-course-')) {
      const id = slug.replace('api-course-', '');
      getEduCourses().then((list) => {
        if (list && list.length > 0) {
          const found = list.find((c) => String(c.id) === id);
          if (found) {
            const mapped: Course = {
              slug: `api-course-${found.id}`,
              title: typeof found.title === 'object' && found.title !== null && 'rendered' in found.title ? (found.title as any).rendered : String(found.title || ''),
              description: found.acf?.description?.replace(/<[^>]*>/g, '') || 'Khóa học chính thức từ hệ thống SeduAi EduCenter.',
              instructor: typeof found.acf?.faculty === 'object' && found.acf?.faculty !== null && 'title' in found.acf.faculty
                ? (found.acf.faculty as any).title
                : (typeof found.acf?.expactteacher === 'object' && found.acf?.expactteacher !== null && 'title' in found.acf.expactteacher
                  ? (found.acf.expactteacher as any).title
                  : String(found.acf?.expactteacher || 'Giảng viên SeduAi')),
              level: typeof (found.acf?.type as any) === 'object' && found.acf?.type !== null 
                ? (Array.isArray(found.acf.type) ? ((found.acf.type as any)[0]?.post_title || 'Mọi trình độ') : ((found.acf.type as any).title || 'Mọi trình độ'))
                : String(found.acf?.type || 'Mọi trình độ'),
              duration: found.acf?.duration || '12 tuần',
              student_count: 420 + (found.id % 150),
              rating: 4.9,
              price: Number(found.acf?.price || 3500000),
              discount_price: Number(found.acf?.sale_price || found.acf?.price || 2490000),
              reviews_count: 24,
              image: found.acf?.featureimg || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
              category: typeof (found.acf?.category as any) === 'object' && found.acf?.category !== null
                ? (Array.isArray(found.acf.category) ? ((found.acf.category as any)[0]?.title || 'AI & Công nghệ') : ((found.acf.category as any).title || 'AI & Công nghệ'))
                : String(found.acf?.category || 'AI & Công nghệ'),
              benefits: (() => {
                const benefitStr = found.acf?.benefit;
                if (!benefitStr) {
                  return [
                    'Lộ trình chuẩn thực chiến SeduAi EduCenter',
                    'Thực hành dự án với sự hướng dẫn của chuyên gia',
                    'Đồng hành cùng Trợ lý AI giải đáp thắc mắc 24/7'
                  ];
                }
                const matches = benefitStr.match(/<li>(.*?)<\/li>/g);
                if (matches) {
                  return matches.map((m) => m.replace(/<\/?li>/g, '').replace(/<[^>]*>/g, '').trim());
                }
                const split = benefitStr.split(/\n|;|<br\s*\/?>/);
                const items = split
                  .map((item) => item.replace(/<[^>]*>/g, '').trim())
                  .filter((item) => item.length > 0);
                return items.length > 0 ? items : [benefitStr];
              })(),
              syllabus: (() => {
                const t = (typeof found.title === 'object' && found.title !== null && 'rendered' in found.title ? (found.title as any).rendered : String(found.title || '')).toLowerCase();
                const cat = (typeof found.acf?.category === 'object' && found.acf?.category !== null && 'title' in found.acf.category ? (found.acf.category as any).title : String(found.acf?.category || 'AI & Công nghệ')).toLowerCase();
                
                // Get the total lessons from the API
                const totalLessons = Number(found.acf?.lession || 24);
                const part = Math.floor(totalLessons / 3);
                const rem = totalLessons % 3;

                const count1 = part + (rem > 0 ? 1 : 0);
                const count2 = part + (rem > 1 ? 1 : 0);
                const count3 = part;

                // Predefined topic templates based on course category
                const englishTopics = [
                  'Nghe hiểu và phân tích từ khóa chính (Keywords) trong đoạn hội thoại',
                  'Phương pháp làm bài đọc matching headings hiệu quả nhanh chóng',
                  'Bố cục lập luận và cách viết đoạn văn Task 2 mạch lạc thuyết phục',
                  'Từ vựng học thuật theo các chủ đề nóng (Education, Environment)',
                  'Phát âm chuẩn IPA - Các lỗi nuốt âm, nối âm người Việt hay mắc',
                  'Phản xạ giao tiếp tự tin và trôi chảy cùng Trợ lý ảo AI SeduAi',
                  'Chiến thuật trả lời Speaking Part 2 ghi điểm ấn tượng với giám khảo',
                  'Luyện đề thi thử trên hệ thống máy tính chuẩn định dạng IELTS',
                  'Nâng cấp cấu trúc câu phức và từ vựng nâng band điểm Writing',
                  'Giải quyết các dạng bài khó trong Reading (True/False/Not Given)',
                  'Viết luận Task 1 - Kỹ năng đọc hiểu và tóm tắt số liệu biểu đồ'
                ];

                const codingTopics = [
                  'Tổng quan khóa học và hướng dẫn cài đặt môi trường lập trình',
                  'Cú pháp cơ bản, khai báo biến số và các cấu trúc dữ liệu cốt lõi',
                  'Cấu trúc điều khiển rẽ nhánh (If-Else) và Vòng lặp (Loops) thực tế',
                  'Xây dựng hàm (Functions) và tư duy tái sử dụng mã nguồn hiệu quả',
                  'Các khái niệm hướng đối tượng (OOP) cơ bản và các mẫu thiết kế',
                  'Thiết kế giao diện người dùng Responsive với CSS Grid & Tailwind',
                  'Kết nối API, xử lý bất đồng bộ (Async/Await) và nạp dữ liệu động',
                  'Quản lý trạng thái ứng dụng (State Management) quy mô lớn',
                  'Tối ưu hóa hiệu năng ứng dụng, bảo mật và xử lý ngoại lệ',
                  'Viết Unit Test kiểm thử chức năng tự động cho hệ thống',
                  'Đóng gói ứng dụng (Docker) và triển khai lên máy chủ VPS/Cloud'
                ];

                const marketingTopics = [
                  'Tổng quan về Chatbot Marketing & Tư duy tự động hóa bán hàng',
                  'Hướng dẫn kết nối Fanpage, Messenger & Thiết lập lời chào mở đầu',
                  'Cấu trúc kịch bản hội thoại tự động và phân loại nhóm khách hàng',
                  'Kịch bản chốt đơn tự động, tính tiền & chăm sóc khách hàng sau mua',
                  'Thiết kế kịch bản Minigame (Vòng quay may mắn, Viral share viral link)',
                  'Ứng dụng chatbot trong Livestream chốt đơn tự động tránh cướp đơn',
                  'Tích hợp API CRM lưu trữ thông tin cơ hội (Lead) tự động từ chat',
                  'Kỹ thuật Remarketing 0 đồng gửi tin nhắn hàng loạt trên Messenger',
                  'Xây dựng phễu thu hút hàng chục nghìn khách hàng với chi phí tối ưu',
                  'Quản lý, đo lường và tối ưu hóa chi phí quảng cáo Facebook Ads',
                  'Đo lường các chỉ số hiệu quả chiến dịch (ROI, CTR) tự động'
                ];

                const generalTopics = [
                  'Giới thiệu tổng quan và xác định mục tiêu học tập của khóa học',
                  'Các khái niệm cơ bản nền tảng nhất cần nắm vững trước khi bắt đầu',
                  'Chuẩn bị tư duy, tài liệu học tập và cài đặt công cụ cần thiết',
                  'Thực chiến áp dụng các kỹ năng cốt lõi vào bài tập thực hành - Phần 1',
                  'Thực chiến áp dụng các kỹ năng cốt lõi vào bài tập thực hành - Phần 2',
                  'Hướng dẫn xử lý các tình huống thực tế thường gặp trong công việc',
                  'Tối ưu hóa hiệu quả, năng suất và giảm thiểu thời gian thực hiện',
                  'Phương pháp làm việc cộng tác nhóm và quản lý thời gian khoa học',
                  'Giải quyết bài tập tình huống lớn tổng hợp cuối khóa học',
                  'Đánh giá kết quả học tập và định hướng lộ trình phát triển bản thân'
                ];

                const generateLessons = (start: number, count: number, templates: string[]): string[] => {
                  const list: string[] = [];
                  for (let i = 0; i < count; i++) {
                    const idx = start + i;
                    const template = templates[i % templates.length];
                    list.push(`Bài ${idx}: ${template}`);
                  }
                  return list;
                };

                if (t.includes('ielts') || t.includes('english') || t.includes('tiếng anh') || cat.includes('tiếng anh')) {
                  return [
                    {
                      title: 'Phần 1: Xây dựng nền tảng từ vựng & ngữ pháp nâng cao',
                      lessons: generateLessons(1, count1, englishTopics)
                    },
                    {
                      title: 'Phần 2: Rèn luyện 4 kỹ năng (Nghe, Nói, Đọc, Viết) thực tế',
                      lessons: generateLessons(count1 + 1, count2, englishTopics)
                    },
                    {
                      title: 'Phần 3: Chiến thuật phòng thi & Luyện đề thực tế',
                      lessons: generateLessons(count1 + count2 + 1, count3, englishTopics)
                    }
                  ];
                }

                if (t.includes('code') || t.includes('lập trình') || t.includes('python') || t.includes('react') || cat.includes('lập trình') || cat.includes('công nghệ')) {
                  return [
                    {
                      title: 'Chương 1: Thiết lập môi trường & Kiến thức nền tảng',
                      lessons: generateLessons(1, count1, codingTopics)
                    },
                    {
                      title: 'Chương 2: Lập trình thực chiến & Xây dựng các tính năng chính',
                      lessons: generateLessons(count1 + 1, count2, codingTopics)
                    },
                    {
                      title: 'Chương 3: Đóng gói sản phẩm, Tối ưu & Triển khai dự án',
                      lessons: generateLessons(count1 + count2 + 1, count3, codingTopics)
                    }
                  ];
                }

                if (t.includes('marketing') || t.includes('bán hàng') || t.includes('chatbot') || cat.includes('marketing') || cat.includes('bán hàng')) {
                  return [
                    {
                      title: 'Phần 1: Tư duy Marketing tự động & Thiết lập Chatbot cơ bản',
                      lessons: generateLessons(1, count1, marketingTopics)
                    },
                    {
                      title: 'Phần 2: Xây dựng kịch bản bán hàng & Minigame thu hút khách hàng',
                      lessons: generateLessons(count1 + 1, count2, marketingTopics)
                    },
                    {
                      title: 'Phần 3: Đồng bộ API CRM & Vận hành chiến dịch Remarketing',
                      lessons: generateLessons(count1 + count2 + 1, count3, marketingTopics)
                    }
                  ];
                }

                return [
                  {
                    title: 'Chương 1: Tổng quan và Nhập môn',
                    lessons: generateLessons(1, count1, generalTopics)
                  },
                  {
                    title: 'Chương 2: Đi sâu thực hành & Ứng dụng thực tế',
                    lessons: generateLessons(count1 + 1, count2, generalTopics)
                  },
                  {
                    title: 'Chương 3: Dự án thực tế & Tổng kết khóa học',
                    lessons: generateLessons(count1 + count2 + 1, count3, generalTopics)
                  }
                ];
              })(),
              reviews: [
                {
                  name: 'Học viên SeduAi',
                  rating: 5,
                  date: 'Vừa xong',
                  comment: 'Khóa học rất chất lượng, giảng viên nhiệt tình, AI hỗ trợ trả lời rất nhanh.'
                }
              ],
              intro: found.acf?.intro || found.acf?.description || ''
            };
            setCourse(mapped);
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-semibold">Đang tải thông tin khóa học từ hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  // Related courses (excluding current course, up to 3)
  const relatedCourses = courses.filter((c) => c.slug !== slug).slice(0, 3);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Call NKS SCRMAI createLead API
    await createLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      demand: `Đăng ký khóa học: ${course.title}`,
      note: `Khoá học ID/Slug: ${course.slug} | Giá: ${course.discount_price} VNĐ`,
    });

    setIsModalOpen(false);
    setShowToast(true);
    setFormData({ name: '', phone: '', email: '' });

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Tổng quan', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'syllabus', label: 'Lộ trình', icon: <PlayCircle className="w-4 h-4" /> },
    { key: 'reviews', label: 'Đánh giá', icon: <Star className="w-4 h-4" /> },
    { key: 'instructor', label: 'Giảng viên', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-50 min-h-screen relative pb-16">
      {/* Course Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Text */}
            <div className="lg:col-span-7 space-y-4">
              {/* Breadcrumbs */}
              <nav className="flex text-xs font-semibold text-slate-400 gap-2 mb-2">
                <Link href="/" className="hover:text-primary transition">
                  Trang chủ
                </Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-primary transition">
                  Khóa học
                </Link>
                <span>/</span>
                <span className="text-white">{course.category}</span>
              </nav>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                {course.description}
              </p>

              {/* Metadata info */}
              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-400 flex items-center gap-0.5">
                    {course.rating}
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                  </span>
                  <span>({course.reviews_count} đánh giá)</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> {course.student_count} học viên
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {course.instructor}
                </span>
              </div>
            </div>

            {/* Right - Course Image */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar layout */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
                  <h2 className="text-xl font-extrabold text-slate-950">
                    Bạn sẽ học được gì sau khóa học?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Course Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Thời lượng</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{course.duration}</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Trình độ</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{course.level}</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <Award className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Chứng nhận</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">Chứng chỉ SeduAi</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Học viên</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{course.student_count}+</p>
                    </div>
                  </div>

                  {/* Detailed Description from API */}
                  {course.intro && (
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <h3 className="text-base font-extrabold text-slate-950">Giới thiệu chi tiết khóa học</h3>
                      <div 
                        className="text-xs text-slate-600 leading-relaxed space-y-3 prose max-w-none api-intro-content"
                        dangerouslySetInnerHTML={{ __html: course.intro }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Syllabus Tab */}
              {activeTab === 'syllabus' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in">
                  <h2 className="text-xl font-extrabold text-slate-950 mb-5">
                    Lộ trình học tập chi tiết
                  </h2>
                  <div className="space-y-3">
                    {course.syllabus.map((chapter, index) => {
                      const isChapterOpen = !!openAccordions[index];
                      return (
                        <div
                          key={index}
                          className="border border-slate-100 rounded-xl overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100/50 flex justify-between items-center text-left transition font-bold text-slate-800 text-sm cursor-pointer"
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                                {index + 1}
                              </span>
                              {chapter.title}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                                isChapterOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isChapterOpen && (
                            <div className="p-5 bg-white border-t border-slate-100 space-y-3 animate-scale-up">
                              {chapter.lessons.map((lesson, lIdx) => (
                                <div key={lIdx} className="flex items-center gap-3 text-xs text-slate-600">
                                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                                  <span>{lesson}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <h2 className="text-xl font-extrabold text-slate-950">Đánh giá từ học viên</h2>
                    <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-semibold">
                      Edu2Review Verified
                    </span>
                  </div>

                  {/* Rating score grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                    <div className="md:col-span-4 text-center space-y-1">
                      <h3 className="text-5xl font-extrabold text-slate-950">{course.rating}</h3>
                      <div className="text-amber-500 flex justify-center gap-0.5 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400">Trên {course.reviews_count} đánh giá</p>
                    </div>
                    <div className="md:col-span-8 space-y-2">
                      {[
                        { stars: 5, percent: 85 },
                        { stars: 4, percent: 12 },
                        { stars: 3, percent: 3 },
                      ].map((bar) => (
                        <div key={bar.stars} className="flex items-center gap-3 text-xs">
                          <span className="w-12 text-slate-500">{bar.stars} sao</span>
                          <div className="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full"
                              style={{ width: `${bar.percent}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-slate-400 text-right">{bar.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="space-y-6">
                    {course.reviews.map((review, idx) => (
                      <div
                        key={idx}
                        className="space-y-2.5 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                              <p className="text-[10px] text-slate-400">{review.date}</p>
                            </div>
                          </div>
                          <div className="text-amber-500 flex gap-0.5 text-xs">
                            {Array.from({ length: 5 }).map((_, sIdx) => (
                              <Star
                                key={sIdx}
                                className={`w-3.5 h-3.5 ${
                                  sIdx < review.rating
                                    ? 'fill-amber-500 stroke-amber-500'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic pl-13">
                          &quot;{review.comment}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructor Tab */}
              {activeTab === 'instructor' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in">
                  <h2 className="text-xl font-extrabold text-slate-950 mb-5">Giảng viên khóa học</h2>
                  <div className="flex items-start gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-extrabold flex-shrink-0">
                      {course.instructor.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 text-base">{course.instructor}</h3>
                      <p className="text-xs text-primary font-semibold">Giảng viên chính</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Giảng viên có kinh nghiệm nhiều năm trong lĩnh vực {course.category}. Đam mê chia sẻ kiến thức và ứng dụng công nghệ AI vào giảng dạy hiện đại.
                      </p>
                      <div className="flex items-center gap-4 pt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" /> {course.student_count}+ học viên
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> {course.rating} đánh giá
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Sidebar Box) */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6 sticky top-16">
                <div>
                  <span className="text-slate-400 text-xs line-through block mb-0.5">
                    Giá gốc: {course.price.toLocaleString('vi-VN')} đ
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-primary text-2xl sm:text-3xl">
                      {course.discount_price.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-extrabold text-xs">
                      Giảm{' '}
                      {Math.round(
                        ((course.price - course.discount_price) / course.price) * 100
                      )}
                      %
                    </span>
                  </div>
                </div>

                {/* Info list */}
                <div className="space-y-3.5 text-xs text-slate-600 border-t border-b border-slate-100 py-5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> Thời lượng:
                    </span>
                    <span className="font-bold text-slate-900">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-slate-400" /> Trình độ:
                    </span>
                    <span className="font-bold text-slate-900">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-slate-400" /> Chứng nhận:
                    </span>
                    <span className="font-bold text-slate-900">Chứng chỉ SeduAi</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full text-center py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition duration-200 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  Đăng Ký Tư Vấn & Nhận Voucher
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  * Đăng ký ngay hôm nay để được nhận thêm 1 tháng đàm thoại 1-1 miễn phí cùng Trợ
                  lý AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Khóa học <span className="gradient-text">liên quan</span>
            </h2>
            <Link
              href="/courses"
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCourses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative animate-scale-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-xl shadow-inner">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Đăng ký tư vấn khóa học</h3>
                <p className="text-slate-500 text-xs">
                  Bạn đang quan tâm: <strong className="text-slate-700">{course.title}</strong>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Họ và tên của bạn
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="0901234567"
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="email@gmail.com"
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition duration-200 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Gửi yêu cầu & Đăng ký <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border-l-4 border-emerald-500 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slide-in">
          <div className="text-emerald-500 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-semibold text-slate-800">Thành công!</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Cảm ơn bạn đã quan tâm! SeduAi sẽ liên hệ tư vấn trong 15-30 phút tới.
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
