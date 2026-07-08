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
  CalendarDays,
  Mail,
} from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import ChatbotCRM from '@/components/ChatbotCRM';
import TeacherConsole from '@/components/TeacherConsole';
import CourseCard from '@/components/CourseCard';
import CounterSection from '@/components/CounterSection';
import EventCard from '@/components/EventCard';
import InstructorCard from '@/components/InstructorCard';
import TestimonialCard from '@/components/TestimonialCard';
import { courses } from '@/data/courses';
import { events } from '@/data/events';
import { instructors } from '@/data/instructors';
import { testimonials } from '@/data/testimonials';

export default function Home() {
  const featuredCourses = courses.slice(0, 4);

  const categories = [
    {
      icon: <Globe className="w-7 h-7" />,
      title: 'Tiếng Anh & IELTS',
      count: 2,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      hoverColor: 'hover:bg-blue-600 hover:text-white hover:border-blue-600',
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: 'Lập trình & Công nghệ',
      count: 2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      hoverColor: 'hover:bg-emerald-600 hover:text-white hover:border-emerald-600',
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: 'AI & Ứng dụng',
      count: 1,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      hoverColor: 'hover:bg-purple-600 hover:text-white hover:border-purple-600',
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: 'Kỹ năng mềm',
      count: 1,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      hoverColor: 'hover:bg-amber-600 hover:text-white hover:border-amber-600',
    },
  ];

  const whyChooseUs = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI đồng hành 24/7',
      desc: 'Trợ lý AI giải đáp thắc mắc, sửa bài tập và cá nhân hóa lộ trình học mọi lúc mọi nơi.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Cam kết đầu ra',
      desc: 'Chương trình chuẩn hóa, cam kết kết quả rõ ràng. Hoàn tiền nếu không đạt mục tiêu.',
    },
    {
      icon: <Headset className="w-6 h-6" />,
      title: 'Mentor 1-1 tận tâm',
      desc: 'Đội ngũ mentor kinh nghiệm hỗ trợ riêng từng học viên, sửa bài chi tiết hàng tuần.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Thực hành dự án thực tế',
      desc: 'Học qua dự án thực tế. Tốt nghiệp với portfolio ấn tượng sẵn sàng cho CV xin việc.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ====== Hero Slider ====== */}
      <HeroSlider />

      {/* ====== Course Categories ====== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Danh mục <span className="gradient-text">Khóa học</span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-lg mx-auto">
              Khám phá các lĩnh vực đào tạo chất lượng cao kết hợp công nghệ AI tiên tiến
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/courses?category=${encodeURIComponent(cat.title.split(' & ')[0])}`}
                className={`border rounded-2xl p-6 text-center space-y-3 transition-all duration-300 group card-hover-lift ${cat.color} ${cat.hoverColor}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center mx-auto shadow-sm group-hover:bg-white/20 transition duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-sm">{cat.title}</h3>
                <p className="text-xs opacity-70">{cat.count} khóa học</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Featured Courses ====== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Khóa Học <span className="gradient-text">Nổi Bật</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                Các khóa đào tạo kết hợp cùng công cụ Trí tuệ nhân tạo độc quyền tại SeduAi
              </p>
            </div>
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-primary hover:text-primary text-slate-600 font-semibold text-sm transition duration-200 flex items-center gap-2 cursor-pointer bg-white shadow-sm"
            >
              Xem tất cả khóa học
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== Why Choose Us ====== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tại sao chọn <span className="gradient-text">SeduAi</span>?
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-lg mx-auto">
              Nền tảng giáo dục duy nhất tích hợp AI toàn diện vào mọi khâu từ tuyển sinh, giảng dạy đến quản lý
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 card-hover-lift group text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== AI Admissions CRM (Interactive Chat) ====== */}
      <section id="ai-crm-demo" className="py-20 bg-slate-50 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl shadow-sm">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Admissions <span className="gradient-text">CRM</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Trợ lý tuyển sinh AI tương tác trực tiếp với phụ huynh và học sinh qua
                Website/Fanpage. AI tự động khai thác nhu cầu thực tế: độ tuổi, môn học mong muốn,
                ngân sách, vị trí địa lý... sau đó phân tích và tự động tạo cơ hội (Lead) trên CRM
                quản trị kèm theo đánh giá tiềm năng.
              </p>
              <div className="space-y-3 font-semibold text-sm text-slate-700">
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

      {/* ====== AI Teacher Assistant ====== */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Console */}
            <div className="lg:col-span-7 order-last lg:order-first">
              <TeacherConsole />
            </div>

            {/* Right Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Teacher <span className="gradient-text">Assistant</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Giảm tải áp lực chuẩn bị bài học cho giáo viên. Chỉ với lệnh nói hoặc văn bản đơn
                giản, Trợ lý AI sẽ hỗ trợ đắc lực giáo viên trong việc: soạn thảo giáo án chi tiết
                theo chương trình, tạo kho đề thi phong phú đa dạng, hỗ trợ chấm điểm và viết nhận
                xét học sinh định kỳ chi tiết và ý nghĩa.
              </p>
              <div className="space-y-3 font-semibold text-sm text-slate-700">
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Lịch <span className="gradient-text">Khai giảng & Sự kiện</span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-lg mx-auto">
              Đừng bỏ lỡ các sự kiện, workshop miễn phí và lịch khai giảng sắp tới
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== Instructors Section ====== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Đội ngũ <span className="gradient-text">Giảng viên</span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-lg mx-auto">
              Giảng viên giàu kinh nghiệm thực chiến, đồng hành cùng Trợ lý AI trong mỗi bài giảng
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Học viên <span className="gradient-text">nói gì về SeduAi</span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-lg mx-auto">
              Hàng ngàn học viên đã tin tưởng và đạt được kết quả vượt mong đợi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== Partner Logos Marquee ====== */}
      <section className="py-14 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Được tin tưởng bởi các đối tác giáo dục hàng đầu
          </p>
          <div className="relative overflow-hidden">
            <div className="animate-marquee marquee-track">
              {[
                'Đại học Bách Khoa',
                'Đại học FPT',
                'British Council',
                'Google for Education',
                'Microsoft Learn',
                'AWS Academy',
                'Đại học Kinh tế',
                'VNUHCM',
                'Đại học Bách Khoa',
                'Đại học FPT',
                'British Council',
                'Google for Education',
                'Microsoft Learn',
                'AWS Academy',
                'Đại học Kinh tế',
                'VNUHCM',
              ].map((name, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-400"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== Newsletter CTA ====== */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Nhận thông tin khóa học & ưu đãi mới nhất
          </h2>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            Đăng ký nhận bản tin để không bỏ lỡ các khóa học mới, workshop miễn phí và ưu đãi học phí lên đến 30%.
          </p>
          <div className="flex max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-full overflow-hidden border border-white/20">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-grow px-6 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
            />
            <button className="px-6 py-4 bg-accent hover:bg-accent-dark text-slate-900 font-bold text-sm transition-colors duration-200 flex items-center gap-2 cursor-pointer">
              Đăng ký
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
