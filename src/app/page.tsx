import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bot,
  Users,
  GraduationCap,
  CheckCircle2,
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
import { courses, Course } from '@/data/courses';
import { events } from '@/data/events';
import { instructors } from '@/data/instructors';
import { getEduCourses, ApiCourse } from '@/services/api';
import TeacherAssistantWrapper from '@/components/TeacherAssistantWrapper';
import EcosystemAndTestimonials from '@/components/EcosystemAndTestimonials';

const partners = [
  {
    name: 'Đại học Thủ Dầu Một',
    logo: 'https://tdmu.edu.vn/img/brand/Logo_TDMU_2024_nguyen_ban.svg',
  },
  {
    name: 'Công ty NKS',
    logo: 'https://nks.com.vn/wp-content/uploads/2025/07/nks-fulllogo.png',
  },
  {
    name: 'Google',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/google.svg',
  },
  {
    name: 'Gemini',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/googlegemini.svg',
  },
  {
    name: 'OpenAI',
    logo: '/openai.svg',
  },
  {
    name: 'Groq',
    logo: '/groq.svg',
  },
  {
    name: 'Vercel',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/vercel.svg',
  },
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
  
  // 1. Giảng viên động từ API
  const uniqueFaculties = new Map<number, { id: number; title: string; slug: string; courseTitle: string }>();
  apiCourses.forEach((c) => {
    if (c.acf?.faculty && typeof c.acf.faculty === 'object' && 'id' in c.acf.faculty) {
      const fac = c.acf.faculty as { id: number; title: string; slug: string };
      if (fac.id && fac.title) {
        uniqueFaculties.set(fac.id, {
          id: fac.id,
          title: fac.title,
          slug: fac.slug,
          courseTitle: typeof c.title === 'object' && c.title !== null && 'rendered' in c.title ? (c.title as any).rendered : String(c.title || ''),
        });
      }
    }
  });

  const avatarList = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  ];

  const mappedInstructors = Array.from(uniqueFaculties.values()).map((fac, idx) => ({
    name: fac.title,
    title: 'Giảng viên Chuyên môn - SeduAi',
    specialty: `Chuyên gia giảng dạy khóa "${fac.courseTitle}"`,
    avatar: avatarList[idx % avatarList.length],
    bio: `Giảng viên giàu kinh nghiệm thực tế, chuyên môn cao trực tiếp đồng hành dẫn dắt và hỗ trợ học viên hoàn thành mục tiêu học tập chuẩn quốc tế.`,
  }));

  const displayInstructors = mappedInstructors.length > 0 ? mappedInstructors : instructors;

  // 2. Khai giảng động từ API
  const mappedEvents = apiCourses.slice(0, 4).map((c, idx) => {
    const courseTitle = typeof c.title === 'object' && c.title !== null && 'rendered' in c.title ? (c.title as any).rendered : String(c.title || '');
    const dayOffset = 20 + (idx * 3) % 11;
    const dateStr = `2026-07-${dayOffset}`;
    const timeSlots = ['19:30 - 21:30', '09:00 - 11:00', '14:00 - 16:00', '18:00 - 20:00'];
    const locations = ['Trụ sở SeduAi, Quận 10, TP.HCM', 'Trực tuyến qua Zoom', 'Học viện SeduAi Lab', 'Trực tuyến qua MS Teams'];
    
    return {
      title: `Khai giảng khóa ${courseTitle}`,
      date: dateStr,
      time: timeSlots[idx % timeSlots.length],
      location: locations[idx % locations.length],
      category: 'Khai giảng',
      description: `Buổi khai giảng chính thức khóa học "${courseTitle}" nhằm kích hoạt lộ trình học tập tối ưu hóa bằng công nghệ AI và giới thiệu Trợ lý ảo AI đắc lực đồng hành 24/7.`,
    };
  });

  const displayEvents = mappedEvents.length > 0 ? mappedEvents : events;

  const featuredCourses = mappedApiCourses.length > 0 ? mappedApiCourses.slice(0, 4) : courses.slice(0, 4);

  const categories = [
    {
      icon: <Cpu className="w-5 h-5 transition-transform" />,
      title: 'AI & Công nghệ',
      count: 6,
    },
    {
      icon: <Globe className="w-5 h-5 transition-transform" />,
      title: 'Marketing & Bán hàng',
      count: 5,
    },
    {
      icon: <Lightbulb className="w-5 h-5 transition-transform" />,
      title: 'Kinh doanh & Khởi nghiệp',
      count: 4,
    },
  ];

  return (
    <div className="overflow-hidden bg-slate-50 min-h-screen">
      {/* ====== Upgraded Hero Slider ====== */}
      <HeroSlider />

      {/* ====== Quick Features Section (Box-Image-Box layout similar to template) ====== */}
      <section className="reveal-section pb-16 bg-slate-50 border-b border-slate-100 relative z-20 -mt-20 lg:-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Box 1 (Left): Smart Learning */}
            <div className="scroll-reveal bg-[#0077bb] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center min-h-[240px] lg:min-h-[280px] text-left transition-all duration-300 hover:brightness-[1.03] group shadow-inner">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white bg-white/10 shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  LỘ TRÌNH CHUẨN QUỐC TẾ
                </h3>
                <p className="text-blue-50 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
                  Các khóa học Tiếng Anh, IELTS và Lập trình được thiết kế chuẩn đầu ra kết hợp với Trợ lý ảo AI đắc lực đồng hành hỗ trợ học viên 24/7 giải đáp thắc mắc.
                </p>
              </div>
              <div className="pt-5">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 border-2 border-white/80 hover:bg-white hover:text-[#0077bb] hover:border-white text-white font-black text-[11px] px-6 py-3 transition duration-300 uppercase tracking-widest self-start cursor-pointer shadow-md"
                >
                  Xem khóa học
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Box 2 (Center Image) */}
            <div className="scroll-reveal relative min-h-[240px] lg:min-h-full w-full group">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                alt="Học viên SeduAi học tập"
                fill
                sizes="(max-w-[768px]) 100vw, 33vw"
                unoptimized
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Box 3 (Right): Library */}
            <div className="scroll-reveal bg-[#0077bb] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center min-h-[240px] lg:min-h-[280px] text-left transition-all duration-300 hover:brightness-[1.03] group shadow-inner">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white bg-white/10 shadow-sm">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  KHO THƯ VIỆN HỌC TẬP
                </h3>
                <p className="text-blue-50 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
                  Hệ thống kho tài liệu chuyên sâu, bài viết hướng dẫn học tập và chia sẻ kiến thức chuẩn hóa từ các chuyên gia hàng đầu giúp bứt phá mục tiêu.
                </p>
              </div>
              <div className="pt-5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 border-2 border-white/80 hover:bg-white hover:text-[#0077bb] hover:border-white text-white font-black text-[11px] px-6 py-3 transition duration-300 uppercase tracking-widest self-start cursor-pointer shadow-md"
                >
                  Xem bài viết
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====== Course Categories Section ====== */}
      <section className="pt-24 pb-16 bg-slate-100 border-b border-slate-200 relative">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/courses?category=${encodeURIComponent(cat.title)}`}
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
      <section className="py-16 bg-slate-100 relative reveal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
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
              <div key={course.slug} className="scroll-reveal" style={{ transitionDelay: `${idx * 80}ms` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Bento Grid Features (Why Choose Us Redesign) ====== */}
      <section className="py-16 bg-white border-t border-b border-slate-100 relative reveal-section">
        <div className="absolute top-[20%] left-0 w-90 h-90 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-2 scroll-reveal">
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
            <div className="scroll-reveal col-span-1 md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 relative overflow-hidden flex flex-col justify-between hover-lift-glow glow-border group min-h-[320px]">
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-slate-950 transition-all duration-300">
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
                <p className="text-xs text-slate-200 font-medium italic flex-grow">&quot;Excellent pronunciation! Try stressing the second syllable of &apos;alternative&apos;.&quot;</p>
                <Volume2 className="w-4 h-4 text-accent animate-pulse" />
              </div>
            </div>

            {/* Box 2 (Span 1) - Cam ket dau ra */}
            <div className="scroll-reveal col-span-1 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover-lift-glow glow-border card-shine group min-h-[320px] shadow-sm">
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
            <div className="scroll-reveal col-span-1 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover-lift-glow glow-border card-shine group min-h-[320px] shadow-sm">
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
            <div className="scroll-reveal col-span-1 md:col-span-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between hover-lift-glow glow-border group min-h-[320px]">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                  <Zap className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">Thực Chiến Qua Các Dự Án Thực Tế</h3>
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
      <section id="ai-crm-demo" className="py-16 bg-slate-50 scroll-mt-28 reveal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info */}
            <div className="scroll-reveal lg:col-span-5 space-y-6">
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
            <div className="scroll-reveal lg:col-span-7">
              <ChatbotCRM />
            </div>
          </div>
        </div>
      </section>

      {/* ====== AI Teacher Assistant Section ====== */}
      <TeacherAssistantWrapper>
        <section className="py-16 bg-white border-t border-slate-100 reveal-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Console */}
              <div className="scroll-reveal lg:col-span-7 order-last lg:order-first">
                <TeacherConsole />
              </div>

              {/* Right Info */}
              <div className="scroll-reveal lg:col-span-5 space-y-6">
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
      </TeacherAssistantWrapper>

      {/* ====== Animated Counters ====== */}
      <CounterSection />

      {/* ====== Upcoming Events ====== */}
      <section className="py-16 bg-slate-50 reveal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Khai giảng</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Lịch Khai Giảng & Sự Kiện
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Đừng bỏ lỡ các sự kiện, workshop giáo dục miễn phí và lịch mở lớp mới nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayEvents.map((event, index) => (
              <div key={index} className="scroll-reveal" style={{ transitionDelay: `${index * 120}ms` }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Instructors Section ====== */}
      <section className="py-16 bg-white reveal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal text-center mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Giảng viên</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Đội Ngũ Giảng Viên Chuyên Môn
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Giảng viên giàu kinh nghiệm thực chiến đạt chuẩn quốc tế, trực tiếp giảng dạy cùng sự hỗ trợ của trợ lý AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayInstructors.map((instructor, index) => (
              <div key={index} className="scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Ecosystem and Testimonials ====== */}
      <EcosystemAndTestimonials />

      {/* ====== Grayscale Partner Logos Marquee ====== */}
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
                  <Image
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    width={96}
                    height={40}
                    unoptimized
                    className="mr-3 h-8 w-20 object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
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
