import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Users,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Globe,
  Cpu,
  Lightbulb,
  ShieldCheck,
  Headset,
  Zap,
  Mail,
  Sparkles,
  Volume2
} from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import ChatbotCRM from '@/components/ChatbotCRM';
import TeacherConsole from '@/components/TeacherConsole';
import CourseCard from '@/components/CourseCard';
import CounterSection from '@/components/CounterSection';
import EventCard from '@/components/EventCard';
import InstructorCard from '@/components/InstructorCard';
import TestimonialCard from '@/components/TestimonialCard';
import { courses, Course } from '@/data/courses';
import { events } from '@/data/events';
import { instructors } from '@/data/instructors';
import { testimonials } from '@/data/testimonials';
import { getEduCourses, ApiCourse } from '@/services/api';

const partners = [
  {
    name: 'Đại học Bách Khoa',
    logo: (
      <svg className="w-5 h-5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    )
  },
  {
    name: 'Đại học FPT',
    logo: (
      <svg className="w-5 h-5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 22h20L12 2z" />
        <path d="M12 7l6 11H6l6-11z" />
      </svg>
    )
  },
  {
    name: 'Google for Education',
    logo: (
      <svg className="w-4.5 h-4.5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
  {
    name: 'Microsoft Learn',
    logo: (
      <svg className="w-4.5 h-4.5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
        <rect x="1" y="1" width="10" height="10" />
        <rect x="13" y="1" width="10" height="10" />
        <rect x="1" y="13" width="10" height="10" />
        <rect x="13" y="13" width="10" height="10" />
      </svg>
    )
  },
  {
    name: 'AWS Academy',
    logo: (
      <svg className="w-5 h-5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 15h9a3 3 0 000-6z" />
        <path d="M6 19c3 3 9 3 12 0" />
        <path d="M18 19l-1-2.5 M18 19l-2.5 1" />
      </svg>
    )
  },
  {
    name: 'British Council',
    logo: (
      <svg className="w-4.5 h-4.5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M6 8v8 M18 8v8 M8 6h8 M8 18h8" />
      </svg>
    )
  },
  {
    name: 'VNUHCM',
    logo: (
      <svg className="w-5 h-5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <circle cx="12" cy="9" r="3" />
      </svg>
    )
  },
  {
    name: 'Đại học Kinh tế',
    logo: (
      <svg className="w-4.5 h-4.5 mr-2 text-slate-400 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 22h18 M6 18V7 M12 18V7 M18 18V7 M3 7h18 M12 2L3 7h18z" />
      </svg>
    )
  }
];

export default async function Home() {
  const apiCourses = await getEduCourses();
  
  const mappedApiCourses: Course[] = apiCourses.map((c: ApiCourse) => ({
    slug: `api-course-${c.id}`,
    title: typeof c.title === 'object' && c.title !== null && 'rendered' in c.title ? (c.title as any).rendered : String(c.title || ''),
    description: c.acf?.description?.replace(/<[^>]*>/g, '') || 'Khóa học chính thức từ hệ thống SeduAi EduCenter.',
    instructor: typeof c.acf?.faculty === 'object' && c.acf?.faculty !== null && 'title' in c.acf.faculty
      ? (c.acf.faculty as any).title
      : (typeof c.acf?.expactteacher === 'object' && c.acf?.expactteacher !== null && 'title' in c.acf.expactteacher
        ? (c.acf.expactteacher as any).title
        : String(c.acf?.expactteacher || 'Giảng viên SeduAi')),
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
    category: typeof (c.acf?.category as any) === 'object' && c.acf?.category !== null
      ? (Array.isArray(c.acf.category) ? ((c.acf.category as any)[0]?.title || 'AI & Công nghệ') : ((c.acf.category as any).title || 'AI & Công nghệ'))
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

  const featuredCourses = mappedApiCourses.length > 0 ? mappedApiCourses.slice(0, 4) : courses.slice(0, 4);

  const categories = [
    {
      icon: <Globe className="w-5 h-5 transition-transform" />,
      title: 'Tiếng Anh & IELTS',
      count: 2,
    },
    {
      icon: <Cpu className="w-5 h-5 transition-transform" />,
      title: 'Lập trình & Công nghệ',
      count: 2,
    },
    {
      icon: <Lightbulb className="w-5 h-5 transition-transform" />,
      title: 'AI & Ứng dụng',
      count: 1,
    },
    {
      icon: <BookOpen className="w-5 h-5 transition-transform" />,
      title: 'Kỹ năng mềm',
      count: 1,
    },
  ];

  return (
    <div className="overflow-hidden bg-slate-50 min-h-screen">
      {/* ====== Upgraded Hero Slider ====== */}
      <HeroSlider />

      {/* ====== Course Categories Section ====== */}
      <section className="py-16 bg-white border-b border-slate-100 relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Danh mục</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Khám Phá Các Lĩnh Vực Đào Tạo
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Chương trình chuẩn quốc tế kết hợp công nghệ AI tiên tiến giúp tăng tốc lộ trình học tập.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/courses?category=${encodeURIComponent(cat.title.split(' & ')[0])}`}
                className="bg-white border border-slate-200/60 rounded-3xl p-6 hover-lift-glow card-shine transition-all duration-300 group shadow-sm flex flex-col justify-between min-h-[180px] text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                  {cat.icon}
                </div>
                <div className="space-y-1.5 pt-4">
                  <h3 className="font-bold text-slate-950 text-[15px] group-hover:text-primary transition-colors duration-200">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-extrabold tracking-wider uppercase">
                    {cat.count} khóa học
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-105 flex items-center text-[10px] font-extrabold text-primary uppercase tracking-wider gap-1.5 group-hover:gap-2.5 transition-all">
                  Khám phá ngay
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Featured Courses ====== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Nổi bật</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Khóa Học Nổi Bật Nhất
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Các khóa đào tạo đột phá tích hợp công cụ Trí tuệ nhân tạo độc quyền tại SeduAi.
              </p>
            </div>
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-primary hover:border-primary hover:text-white text-slate-700 font-bold text-xs transition-all duration-300 flex items-center gap-1.5 bg-white shadow-sm hover:scale-105 group"
            >
              Xem Tất Cả Khóa Học
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course, idx) => (
              <div key={course.slug} className="animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Bento Grid Features (Why Choose Us Redesign) ====== */}
      <section className="py-16 bg-white border-t border-b border-slate-100 relative">
        <div className="absolute top-[20%] left-0 w-90 h-90 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Khác biệt</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Hệ Sinh Thái Đào Tạo Ưu Việt SeduAi
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Nền tảng EdTech tiên phong ứng dụng trí tuệ nhân tạo giúp tối ưu hiệu năng dạy và học toàn diện.
            </p>
          </div>

          {/* Premium Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 (Span 2, height x2) - AI Assistant interactive representation */}
            <div className="col-span-1 md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 relative overflow-hidden flex flex-col justify-between hover-lift-glow group min-h-[320px]">
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                  <Bot className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">Trợ Lý AI Đồng Hành 24/7</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Học viên được đàm thoại nói trực tiếp, luyện phát âm chuẩn đến từng âm tiết và sửa lỗi ngữ pháp bài viết tức thì cùng trợ lý AI 1-1 mà không cần chờ đợi.
                </p>
              </div>

              {/* Mock AI companion visual representation */}
              <div className="mt-6 bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4 max-w-md relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
                  <span className="text-[10px] font-mono text-slate-400">AI Voice Model:</span>
                </div>
                <p className="text-xs text-slate-200 font-medium italic flex-grow">"Excellent pronunciation! Try stressing the second syllable of 'alternative'."</p>
                <Volume2 className="w-4 h-4 text-accent animate-pulse" />
              </div>
            </div>

            {/* Box 2 (Span 1) - Cam ket dau ra */}
            <div className="col-span-1 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover-lift-glow card-shine group min-h-[320px] shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-primary transition-colors">Cam Kết Chuẩn Đầu Ra</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Lộ trình học tập chuẩn hóa, cam kết kết quả đầu ra rõ ràng bằng văn bản pháp lý. Sẵn sàng hoàn trả học phí nếu không đạt mục tiêu đề ra ban đầu.
                </p>
              </div>
              <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mt-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cam kết pháp lý
              </div>
            </div>

            {/* Box 3 (Span 1) - Mentor 1-1 */}
            <div className="col-span-1 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover-lift-glow card-shine group min-h-[320px] shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Headset className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-primary transition-colors">Mentor 1-1 Tận Tâm</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Đội ngũ giáo viên, giảng viên chuyên môn cao hỗ trợ chữa bài viết, bài nói thủ công chi tiết hàng tuần và định hình chiến thuật thi tốt nhất.
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-4">
                {/* Micro avatar profiles mockup */}
                <div className="flex -space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border border-white text-[8px] font-bold flex items-center justify-center text-white">GV</div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 border border-white text-[8px] font-bold flex items-center justify-center text-white">MT</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-white text-[8px] font-bold flex items-center justify-center text-white">AI</div>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">Hỗ trợ kết hợp 1-1</span>
              </div>
            </div>

            {/* Box 4 (Span 2) - Project thuc chien */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between hover-lift-glow min-h-[220px]">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-accent">
                  <Zap className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-xl font-bold text-white">Thực Chiến Qua Các Dự Án Thực Tế</h3>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Chúng tôi xây dựng phương pháp học qua thực hành (Project-based learning). Học viên phát triển đồ án thực tế giúp lưu giữ kiến thức lâu dài và tạo portfolio nổi bật.
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-blue-200 mt-4 relative z-10">
                <span>PROJECT COMPLETE RATE: 100%</span>
                <span className="text-accent flex items-center gap-1"><Sparkles className="w-3 h-3" /> Ready for CV</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====== AI Admissions CRM Demo Section ====== */}
      <section id="ai-crm-demo" className="py-16 bg-slate-50 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Hệ thống CRM</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  AI Admissions CRM
                </h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Trợ lý tuyển sinh AI tương tác trực tiếp với phụ huynh và học sinh qua Website/Fanpage. AI tự động khai thác nhu cầu thực tế: độ tuổi, môn học mong muốn, ngân sách, vị trí địa lý... sau đó phân tích và tự động tạo cơ hội (Lead) trên CRM quản trị kèm theo chấm điểm tiềm năng.
              </p>
              <div className="space-y-3 font-semibold text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Trò chuyện tự nhiên 24/7 không cần người trực.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Đẩy trực tiếp thông tin vào hệ thống CRM quản lý.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Phân loại khách hàng tiềm năng bằng AI.</span>
                </div>
              </div>
            </div>

            {/* Right Chatbot CRM Simulation */}
            <div className="lg:col-span-7">
              <ChatbotCRM />
            </div>
          </div>
        </div>
      </section>

      {/* ====== AI Teacher Assistant Section ====== */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Console */}
            <div className="lg:col-span-7 order-last lg:order-first">
              <TeacherConsole />
            </div>

            {/* Right Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Dành cho giáo viên</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  AI Teacher Assistant
                </h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Giảm tải áp lực chuẩn bị bài học cho giáo viên. Chỉ với lệnh nói hoặc văn bản đơn giản, Trợ lý AI sẽ hỗ trợ đắc lực giáo viên trong việc: soạn thảo giáo án chi tiết theo chương trình, tạo kho đề thi phong phú đa dạng, hỗ trợ chấm điểm và viết nhận xét học sinh định kỳ chi tiết và ý nghĩa.
              </p>
              <div className="space-y-3 font-semibold text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Tiết kiệm 10+ giờ làm việc mỗi tuần cho giáo viên.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Giáo án & Đề thi chuẩn hóa, tự động tạo ba-rem đáp án.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Nhận xét cá nhân hóa bám sát quá trình học của học viên.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Animated Counters ====== */}
      <CounterSection />

      {/* ====== Upcoming Events ====== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Khai giảng</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Lịch Khai Giảng & Sự Kiện
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Đừng bỏ lỡ các sự kiện, workshop giáo dục miễn phí và lịch mở lớp mới nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== Instructors Section ====== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Giảng viên</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Đội Ngũ Giảng Viên Chuyên Môn
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Giảng viên giàu kinh nghiệm thực chiến đạt chuẩn quốc tế, trực tiếp giảng dạy cùng sự hỗ trợ của trợ lý AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor, index) => (
              <InstructorCard key={index} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== Testimonials ====== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Cảm nhận</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Học Viên Nói Gì Về SeduAi
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Hàng ngàn học viên đã tìm thấy lộ trình tối ưu và nâng cao vượt bậc năng lực học tập cùng SeduAi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== Grayscale Partner Logos Marquee with Custom SVG Icons ====== */}
      <section className="py-14 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-8">
            Được tin tưởng bởi các đối tác giáo dục hàng đầu
          </p>
          <div className="relative overflow-hidden">
            <div className="animate-marquee marquee-track">
              {partners.concat(partners).map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center px-6 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-500 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md cursor-default group"
                >
                  {partner.logo}
                  <span>{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== Premium Newsletter CTA ====== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl py-14 px-8 sm:px-16 text-center text-white relative overflow-hidden border border-slate-800 shadow-2xl">
            {/* Grid Pattern overlays */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />
            <div className="absolute -left-10 -top-10 w-60 h-60 bg-accent/5 rounded-full blur-[80px] animate-blob pointer-events-none" style={{ animationDelay: '5s' }} />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-accent">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Nhận Thông Tin Khóa Học & Ưu Đãi Mới Nhất
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
                Đăng ký nhận bản tin để không bỏ lỡ các khóa học mới, workshop miễn phí và ưu đãi học phí lên đến 30%.
              </p>
              
              <div className="flex flex-col sm:flex-row max-w-md mx-auto bg-white/5 rounded-2xl overflow-hidden border border-white/10 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-transparent p-1 gap-1">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-grow px-5 py-3.5 bg-transparent text-white placeholder-slate-400 focus:outline-none text-xs sm:text-sm"
                />
                <button className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer">
                  Đăng ký
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
