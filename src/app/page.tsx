import Link from 'next/link';
import { ArrowRight, Bot, Users, GraduationCap, Award, CheckCircle2, Flame } from 'lucide-react';
import ChatbotCRM from '@/components/ChatbotCRM';
import TeacherConsole from '@/components/TeacherConsole';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/data/courses';

export default function Home() {
  const featuredCourses = courses.slice(0, 4);

  const steps = [
    { icon: Bot, title: 'AI CRM', desc: 'Thu hút & Tư vấn' },
    { icon: Flame, title: 'Chăm sóc', desc: 'Tự động gửi tin' },
    { icon: Award, title: 'Đăng ký', desc: 'Xếp lớp tự động' },
    { icon: GraduationCap, title: 'Đào tạo', desc: 'Học cùng AI Tutor' },
    { icon: CheckCircle2, title: 'Đánh giá', desc: 'Chấm điểm bằng AI' },
    { icon: Users, title: 'Gia hạn', desc: 'Phân tích nhu cầu' },
    { icon: ArrowRight, title: 'Giới thiệu', desc: 'Lan tỏa học viên' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/10 right-1/10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
                Hệ điều hành AI giáo dục thế hệ mới
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Cá nhân hóa giáo dục bằng <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Trí tuệ nhân tạo</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto lg:mx-0">
                SeduAi giúp các trung tâm đào tạo và trường học thu hút học viên tự động bằng AI, nâng tầm phương pháp dạy học với trợ lý giáo viên AI, và tối ưu hóa 90% vận hành.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all duration-300 shadow-lg shadow-primary/30 flex items-center gap-2 group cursor-pointer"
                >
                  Khám phá khóa học
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/#ai-crm-demo"
                  className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Xem AI tư vấn tuyển sinh
                </Link>
              </div>
            </div>

            {/* Hero Widget Showcase */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden max-w-md mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    AI Agent Dashboard
                  </span>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Học viên mới hôm nay</p>
                        <h4 className="text-lg font-bold text-white">42 Leads</h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      +18%
                    </span>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-300">
                        Trợ lý giáo viên AI soạn bài
                      </span>
                      <span className="text-xs text-slate-400">88% hoàn thành</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-xl p-4 border border-primary/25 space-y-2">
                    <p className="text-xs text-primary font-bold flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" /> Trợ lý AI đang hỏi phụ huynh:
                    </p>
                    <p className="text-sm italic text-slate-300">
                      &quot;Quý phụ huynh đang tìm khóa học tiếng Anh hay Lập trình cho bé?&quot;
                    </p>
                    <div className="flex justify-end pt-1">
                      <span className="text-[10px] text-slate-400">Đã đồng bộ CRM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Systems Cycle Flow */}
      <section id="features" className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Chu trình Vận hành Đào tạo bằng AI
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              Từ lúc tiếp cận học viên mới cho đến khi đào tạo thành tài và giới thiệu học viên mới, AI tự động hóa hoàn toàn.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="bg-slate-50 border border-slate-100 p-4 rounded-2xl relative shadow-sm hover:border-primary/50 transition duration-300 col-span-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 text-xl group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{step.desc}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Admissions CRM (Interactive Chat) */}
      <section id="ai-crm-demo" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl shadow-sm">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Admissions CRM
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Trợ lý tuyển sinh AI tương tác trực tiếp với phụ huynh và học sinh qua Website/Fanpage. AI tự động khai thác nhu cầu thực tế: độ tuổi, môn học mong muốn, ngân sách, vị trí địa lý... sau đó phân tích và tự động tạo cơ hội (Lead) trên CRM quản trị kèm theo đánh giá tiềm năng.
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

      {/* AI Teacher Assistant (Interactive Tool) */}
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
                AI Teacher Assistant
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Giảm tải áp lực chuẩn bị bài học cho giáo viên. Chỉ với lệnh nói hoặc văn bản đơn giản, Trợ lý AI sẽ hỗ trợ đắc lực giáo viên trong việc: soạn thảo giáo án chi tiết theo chương trình, tạo kho đề thi phong phú đa dạng, hỗ trợ chấm điểm và viết nhận xét học sinh định kỳ chi tiết và ý nghĩa.
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

      {/* Featured Courses Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Khóa Học Đột Phá AI & Công Nghệ
              </h2>
              <p className="text-slate-500 mt-2">
                Các khóa đào tạo kết hợp cùng công cụ Trí tuệ nhân tạo độc quyền tại SeduAi
              </p>
            </div>
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-primary hover:text-primary text-slate-600 font-semibold text-sm transition duration-200 flex items-center gap-2 cursor-pointer bg-white"
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

      {/* Statistics Counters */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark/25 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <h3 className="text-4xl lg:text-5xl font-extrabold">15,000+</h3>
              <p className="text-primary-light font-medium text-sm lg:text-base">Học viên theo học</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl lg:text-5xl font-extrabold">1,200+</h3>
              <p className="text-primary-light font-medium text-sm lg:text-base">Trợ lý Giáo án được tạo</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl lg:text-5xl font-extrabold">98%</h3>
              <p className="text-primary-light font-medium text-sm lg:text-base">Đánh giá hài lòng</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl lg:text-5xl font-extrabold">250+</h3>
              <p className="text-primary-light font-medium text-sm lg:text-base">Trung tâm & Đối tác</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
