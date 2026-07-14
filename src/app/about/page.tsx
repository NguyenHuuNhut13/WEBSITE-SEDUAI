'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Brain, 
  Star, 
  CheckCircle, 
  Users, 
  Award, 
  ShieldCheck, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  MessageSquare, 
  BookOpen, 
  Volume2, 
  Calendar,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'crm' | 'teacher' | 'learning'>('crm');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '15,000+', label: 'Học viên tốt nghiệp', icon: '🎓', trend: '+25% năm nay' },
    { value: '98%', label: 'Tỷ lệ hài lòng', icon: '⭐', trend: 'Đánh giá 5 sao' },
    { value: '50+', label: 'Giảng viên chuyên môn', icon: '👨‍🏫', trend: 'IELTS 8.0+ / C1' },
    { value: '10+', label: 'Ứng dụng AI độc quyền', icon: '🤖', trend: 'Tự động hóa 24/7' },
  ];

  const coreValues = [
    {
      icon: <Brain className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />,
      title: 'Ứng dụng Công nghệ đột phá',
      description: 'Luôn tiên phong đưa trí tuệ nhân tạo (AI) vào việc hỗ trợ đào tạo, cá nhân hóa lộ trình học cho từng học viên dựa trên dữ liệu thực tế.',
    },
    {
      icon: <Award className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />,
      title: 'Chất lượng Đào tạo Cam kết',
      description: 'Cam kết chất lượng chuẩn đầu ra rõ ràng bằng văn bản pháp lý, bảo vệ tối đa quyền lợi học tập và cam kết hoàn học phí hoặc học lại miễn phí.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />,
      title: 'Trung thực & Minh bạch',
      description: 'Mọi thông tin học phí, lộ trình đào tạo chi tiết, và kết quả đánh giá năng lực của học viên đều được lưu trữ minh bạch trên hệ thống.',
    },
    {
      icon: <Heart className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />,
      title: 'Tận tâm Đồng hành',
      description: 'Đội ngũ chuyên môn kết hợp cùng hệ thống trợ lý AI hỗ trợ 24/7, luôn lắng nghe, giải đáp và gỡ rối học thuật kịp thời.',
    },
  ];

  const team = [
    {
      name: 'GS. Nguyễn Văn Sedu',
      role: 'Đồng sáng lập & Cố vấn Trí Tuệ Nhân Tạo',
      desc: 'Hơn 15 năm nghiên cứu tại Silicon Valley về xử lý ngôn ngữ tự nhiên và ứng dụng AI vào mô hình giáo dục thông minh.',
      quote: 'AI không thay thế giáo viên, nhưng giáo viên biết dùng AI sẽ thay thế những người không dùng.',
      gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    },
    {
      name: 'ThS. Trần Thị Hạnh',
      role: 'Giám đốc Đào tạo & Khảo thí',
      desc: 'Nguyên trưởng khoa Anh ngữ trường Quốc tế uy tín, chuyên gia thiết kế giáo trình chuẩn đầu ra IELTS và giao tiếp.',
      quote: 'Công nghệ là bệ phóng mạnh mẽ giúp chúng tôi cá nhân hóa sự đồng hành đến từng học viên đơn lẻ.',
      gradient: 'from-purple-600 via-pink-500 to-rose-400',
    },
    {
      name: 'Kỹ sư. Lê Hoàng Nam',
      role: 'Giám đốc Phát triển Công nghệ',
      desc: 'Chịu trách nhiệm kiến trúc hệ thống AI Admissions CRM và AI Teacher Assistant đắc lực hỗ trợ hàng ngàn giáo viên.',
      quote: 'Chúng tôi xây dựng những công cụ AI tinh vi nhưng mang lại trải nghiệm sử dụng đơn giản, trực quan nhất.',
      gradient: 'from-emerald-600 via-teal-500 to-teal-400',
    },
  ];

  const timeline = [
    { date: '01/07/2026', title: 'Khởi động dự án SeduAi & Thiết kế Kiến trúc', desc: 'Đặt những viên gạch đầu tiên cho nền tảng EdTech kết hợp AI. Thiết lập ý tưởng về hệ thống cá nhân hóa lộ trình và kiến trúc cơ sở dữ liệu ban đầu.' },
    { date: '08/07/2026', title: 'Hoàn thiện phân hệ AI Admissions CRM', desc: 'Triển khai thành công hệ thống tối ưu tuyển sinh và phân loại lead thông minh, tích hợp chatbot tự động hỗ trợ tư vấn học viên 24/7.' },
    { date: '12/07/2026', title: 'Tích hợp trợ lý AI Teacher Assistant', desc: 'Ra mắt bộ công cụ hỗ trợ giáo viên soạn giáo án bài bản tự động và chấm điểm kỹ năng Writing/Speaking tiếng Anh chi tiết.' },
    { date: 'Hiện tại (14/07/2026)', title: 'Tinh chỉnh LMS & AI Learning Companion', desc: 'Tối ưu hóa các lớp học trực tuyến, bảng theo dõi năng lực cá nhân và trợ lý ảo giao tiếp đàm thoại giọng nói hai chiều thời gian thực.' },
    { date: 'Tháng 08/2026 (Kế hoạch)', title: 'Phát hành chính thức SeduAi v1.0', desc: 'Mở rộng quy mô phục vụ diện rộng trên production, kết nối đồng bộ dữ liệu tài khoản từ hệ thống quản trị NKS để phục vụ hàng ngàn học viên.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 overflow-x-hidden relative">
      {/* Hero Banner with Premium Grid and Particle Effects */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-primary-dark py-28 text-white relative overflow-hidden">
        {/* Decorative Grid Overlays */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Blob Animations */}
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[80px] animate-blob" style={{ animationDelay: '4s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-bold uppercase tracking-wider animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                Kiến tạo tương lai giáo dục
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] animate-fade-in-up">
                Định Hình Giáo Dục Bằng <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-blue-400 to-accent animate-gradient-shift">
                  Trí Tuệ Nhân Tạo
                </span>
              </h1>
              <p className="text-slate-300 max-w-2xl text-sm sm:text-base sm:leading-relaxed animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
                SeduAi tiên phong kết hợp mô hình đào tạo chất lượng cao cùng sức mạnh AI vượt trội. Chúng tôi cá nhân hóa lộ trình học tập, tối ưu hiệu suất vận hành giáo dục và đồng hành cùng học viên từng bước đi đến thành công.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
                <a 
                  href="#ecosystem" 
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 flex items-center gap-2 group"
                >
                  Khám phá Giải pháp
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="/courses" 
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Trải nghiệm Khóa học
                </a>
              </div>
            </div>

            {/* Right Interactive AI SVG Graphic */}
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50 animate-pulse-glow" />
              <div className="relative glass-card-dark rounded-3xl p-6 border border-white/10 shadow-2xl animate-float-slow">
                <svg className="w-full h-[320px] text-blue-400/30" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid paths */}
                  <path d="M100 100 L200 150 L300 100 L200 250 L100 100 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <path d="M200 150 L300 280 L200 250 L100 280 L200 150 Z" stroke="currentColor" strokeWidth="1" />
                  <path d="M100 100 L100 280 M300 100 L300 280 M200 50 L200 350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                  
                  {/* Glowing nodes */}
                  <circle cx="100" cy="100" r="4" fill="#0077bb" className="animate-ping" />
                  <circle cx="100" cy="100" r="3.5" fill="#0077bb" />
                  
                  <circle cx="200" cy="150" r="6" fill="#ffb606" className="animate-pulse" />
                  <circle cx="200" cy="150" r="4" fill="#ffb606" />
                  
                  <circle cx="300" cy="100" r="4" fill="#0077bb" className="animate-ping" />
                  <circle cx="300" cy="100" r="3.5" fill="#0077bb" />
                  
                  <circle cx="200" cy="250" r="6" fill="#00a4e4" className="animate-pulse" />
                  <circle cx="200" cy="250" r="4.5" fill="#00a4e4" />
                  
                  <circle cx="100" cy="280" r="4" fill="#0077bb" />
                  <circle cx="300" cy="280" r="4" fill="#0077bb" />
                  <circle cx="200" cy="50" r="3" fill="#0077bb" />
                  <circle cx="200" cy="350" r="3" fill="#0077bb" />
                  
                  {/* Floating particles */}
                  <circle cx="150" cy="125" r="2" fill="#fff" className="animate-bounce" style={{ animationDuration: '4s' }} />
                  <circle cx="250" cy="190" r="2" fill="#fff" className="animate-bounce" style={{ animationDuration: '6s' }} />
                  <circle cx="150" cy="265" r="2.5" fill="#fff" className="animate-bounce" style={{ animationDuration: '5s' }} />
                </svg>

                {/* Dashboard micro badges */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono tracking-wider text-slate-300">AI CORE ACTIVE</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] font-bold text-white">Accuracy: 99.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Board Overlay */}
      <div className="reveal-section relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl py-8 px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-xl border border-white/30 backdrop-blur-md">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1 text-center scroll-reveal group" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-light text-xl mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 block tracking-tight">{stat.value}</span>
              <span className="text-xs sm:text-sm text-slate-700 font-bold block">{stat.label}</span>
              <span className="text-[10px] text-primary font-semibold bg-primary-light px-2 py-0.5 rounded-full inline-block mt-1">{stat.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Blurs for Main Content */}
      <div className="absolute top-[25%] left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[60%] right-10 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-20 relative z-10">
        
        {/* Mission & Vision Section */}
        <div className="reveal-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3.5 py-1.5 rounded-lg inline-block">
              Sứ mệnh của chúng tôi
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Định Nghĩa Lại Mô Hình <br />
              <span className="gradient-text">Giáo Dục Thông Minh</span> Kỷ Nguyên Mới
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              SeduAi ra đời với niềm tin mãnh liệt rằng mỗi học viên đều sở hữu tiềm năng vô hạn và xứng đáng có một lộ trình học tập tối ưu, được thiết kế riêng biệt. Nhờ ứng dụng công nghệ trí tuệ nhân tạo (AI), chúng tôi phân tích chính xác trình độ đầu vào, thói quen và điểm mạnh/yếu của từng cá nhân để điều chỉnh bài học theo thời gian thực.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Chúng tôi không chỉ số hóa tài liệu học tập mà còn xây dựng một hệ thống đồng hành 24/7. Ở bất kỳ đâu và vào bất kỳ lúc nào, học viên luôn có trợ lý AI hỗ trợ giải đáp bài tập, giao tiếp phản xạ và đánh giá sửa lỗi tức thì.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-5 relative overflow-hidden hover-lift-glow card-shine scroll-reveal delay-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Cam kết Giá trị SeduAi
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'Chương trình chuẩn quốc tế:', desc: 'Nội dung bám sát thực tiễn công việc toàn cầu, liên tục cập nhật theo xu hướng mới nhất.' },
                { title: 'Công nghệ hỗ trợ tối đa:', desc: 'Tích hợp hệ thống quản lý học tập thông minh, trợ lý ảo chấm điểm và luyện nói phản xạ.' },
                { title: 'Chuyên môn sư phạm cao:', desc: 'Đội ngũ giảng viên, chuyên gia khảo thí đạt chuẩn quốc tế giàu kinh nghiệm thực tế.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="w-5.5 h-5.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                  </div>
                  <span className="text-slate-600 text-sm leading-relaxed">
                    <strong className="text-slate-800 font-semibold">{item.title}</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ecosystem Section (Interactive Tabs) */}
        <div id="ecosystem" className="reveal-section space-y-10 scroll-reveal">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3.5 py-1.5 rounded-lg inline-block">Hệ sinh thái công nghệ</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hạ Tầng Giáo Dục Số SeduAi</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Chúng tôi phát triển và tích hợp 3 trụ cột công nghệ cốt lõi giúp kết nối nhà trường, giáo viên và học viên hiệu quả.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tab selection triggers */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {[
                { id: 'crm', title: 'AI Admissions CRM', desc: 'Tuyển sinh & tư vấn lộ trình tự động', icon: <Users className="w-5 h-5" /> },
                { id: 'teacher', title: 'AI Teacher Assistant', desc: 'Soạn giáo án & trợ lý chấm điểm', icon: <Brain className="w-5 h-5" /> },
                { id: 'learning', title: 'AI Learning Companion', desc: 'Luyện giao tiếp & hỗ trợ học tập 24/7', icon: <Heart className="w-5 h-5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    activeTab === tab.id
                      ? 'bg-white border-primary shadow-lg shadow-primary/5 hover-lift-glow glow-border'
                      : 'bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className={`font-bold text-sm ${activeTab === tab.id ? 'text-primary' : 'text-slate-900'}`}>{tab.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-normal">{tab.desc}</p>
                  </div>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-primary ml-auto self-center" />}
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="lg:col-span-8 bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sm:p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              {activeTab === 'crm' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-primary bg-primary-light px-2.5 py-1 rounded-full uppercase tracking-wider">Tối ưu hóa chuyển đổi</span>
                    <h3 className="text-2xl font-black text-slate-900">AI Admissions CRM</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Hệ thống thông minh kết nối và quản trị dữ liệu học viên từ bước tìm hiểu đầu tiên. CRM phân tích các nhu cầu học tập để đề xuất lộ trình và mức phí tối ưu nhất, giải phóng sức lao động thủ công của bộ phận tư vấn.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Tự động phân loại hồ sơ năng lực</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Trợ lý ảo phản hồi ban đầu 24/7</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Đề xuất khóa học thông minh</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Báo cáo tỷ lệ chuyển đổi realtime</div>
                  </div>

                  {/* Mock CRM UI */}
                  <div className="bg-slate-900 rounded-2xl p-4 text-white font-mono text-[11px] space-y-2 border border-slate-800 shadow-inner">
                    <div className="flex justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
                      <span>⚡ LIVE CRM SIGNAL FEED</span>
                      <span className="text-emerald-400">ONLINE</span>
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <p><span className="text-slate-500">[14:52:10]</span> New Lead Registered: <span className="text-primary-light">Minh Anh (IELTS Goal 6.5)</span></p>
                      <p><span className="text-slate-500">[14:52:11]</span> AI Score Assessment: <span className="text-accent">9.4/10 (High Intent)</span></p>
                      <p><span className="text-slate-500">[14:52:12]</span> Auto-routed to Counselor: <span className="text-emerald-400">Jennie Nguyen</span></p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'teacher' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Trợ lực cho giảng dạy</span>
                    <h3 className="text-2xl font-black text-slate-900">AI Teacher Assistant</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Công cụ hỗ trợ giáo viên tiết kiệm 80% thời gian chuẩn bị bài. Trợ lý tự động xây dựng giáo án, khởi tạo ngân hàng đề kiểm tra đa dạng và hỗ trợ chấm điểm phần Speaking & Writing cực kỳ chuẩn xác kèm phản hồi chi tiết.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Tạo giáo án & slide bài giảng tự động</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Ngân hàng câu hỏi tùy biến cao</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Phân tích sửa lỗi phát âm và ngữ pháp</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Thống kê lỗ hổng kiến thức của lớp</div>
                  </div>

                  {/* Mock Assistant UI */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5 text-slate-700 shadow-inner">
                    <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Kết quả chấm bài IELTS Writing Task 2</span>
                    </div>
                    <div className="space-y-1.5">
                      <p><strong>Đề tài:</strong> Environment vs Technology</p>
                      <p className="text-slate-500 italic">"Technology plays a crucial role in protect the climate..."</p>
                      <div className="p-2 bg-purple-50 rounded border border-purple-100 text-[11px] text-purple-900">
                        <strong>AI Feedback:</strong> Sai giới từ/dạng động từ tại cụm "in protect". Gợi ý sửa: <strong>"in protecting"</strong> (Sau giới từ dùng V-ing).
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Đồng hành cùng học viên</span>
                    <h3 className="text-2xl font-black text-slate-900">AI Learning Companion</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Người bạn đồng hành của học viên mọi lúc mọi nơi. Trợ lý AI hỗ trợ luyện nói phản xạ giao tiếp hai chiều trực tiếp, sửa lỗi phát âm từng âm tiết và hướng dẫn giải bài tập thông minh mà không làm thay bài tập cho học viên.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Trò chuyện đàm thoại trực tiếp cùng AI</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Đánh giá phát âm chi tiết (Phoneme)</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Gợi ý từ vựng nâng cao theo ngữ cảnh</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Tích hợp Gamification thúc đẩy tự học</div>
                  </div>

                  {/* Mock Conversation UI */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3 text-slate-800 shadow-inner">
                    <div className="flex items-center gap-2 font-bold text-slate-950 border-b border-slate-200 pb-2">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>Giao tiếp Phản Xạ AI Companion</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex gap-2">
                        <span className="font-extrabold text-emerald-600 flex-shrink-0">AI Chatbot:</span>
                        <p className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">"Hello! What did you do to improve your English today?"</p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <p className="bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg shadow-sm">"I practice speaking English with you, my friend!"</p>
                        <span className="font-extrabold text-slate-900 flex-shrink-0">Học viên:</span>
                      </div>
                      <div className="text-[10px] text-slate-500 text-right font-medium">
                        🔊 Phát âm của bạn đạt <strong>96%</strong>. Rất trôi chảy!
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Roadmap Section (Double-Column Spacing Fix) */}
        <div className="reveal-section grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Timeline Info left column (4 cols) */}
          <div className="lg:col-span-4 space-y-5 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3.5 py-1.5 rounded-lg inline-block">
              Lộ trình & Cột mốc
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hành Trình Kiến Tạo <br />
              <span className="gradient-text">SeduAi Platform</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bắt đầu từ đầu tháng 7 năm 2026, dự án SeduAi đã trải qua các chu kỳ phát triển và hoàn thiện thần tốc nhằm đưa giải pháp giáo dục AI tốt nhất tới người dạy và người học.
            </p>
            <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm space-y-2">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Chu kỳ Phát triển Thần tốc
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Các cấu phần tuyển sinh (CRM), trợ giảng (Teacher Assistant) và đồng hành học tập (Learning Companion) được hoàn thành liên tục chỉ trong 2 tuần.
              </p>
            </div>
          </div>

          {/* Timeline Node List right column (8 cols) */}
          <div className="lg:col-span-8 relative pl-6 md:pl-8 border-l-2 border-slate-200/80 space-y-8 scroll-reveal delay-200">
            {timeline.map((item, i) => (
              <div 
                key={i} 
                className="relative group transition-all duration-300"
              >
                {/* Node indicator */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-[10px] h-[10px] md:w-[14px] md:h-[14px] rounded-full bg-white border-[3px] md:border-4 border-primary flex items-center justify-center z-20 group-hover:scale-125 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping opacity-0 group-hover:opacity-100" />
                </div>

                {/* Event Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md hover-lift-glow card-shine">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[10px] font-extrabold text-primary bg-primary-light px-2.5 py-1 rounded-lg">
                      {item.date}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="reveal-section space-y-12">
          <div className="text-center space-y-3 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3.5 py-1.5 rounded-lg inline-block">Giá trị cốt lõi</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nguyên Tắc Hành Động Của Chúng Tôi</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">SeduAi hoạt động dựa trên bốn trụ cột chính nhằm mang lại lợi ích tốt nhất cho người học và đối tác.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((val, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-md flex flex-col sm:flex-row items-start gap-5 hover-lift-glow glow-border card-shine scroll-reveal group" 
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all duration-300 group-hover:scale-110">
                  {val.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors duration-200">{val.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Team Section */}
        <div className="reveal-section space-y-12">
          <div className="text-center space-y-3 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3.5 py-1.5 rounded-lg inline-block">Đội ngũ sáng lập</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đứng Sau Sự Thành Công Của SeduAi</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Tập hợp những bộ óc xuất sắc trong lĩnh vực Trí tuệ nhân tạo và Quản trị giáo dục.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg hover-lift-glow glow-border group card-shine scroll-reveal flex flex-col justify-between min-h-[340px]" 
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${t.gradient} flex items-center justify-center text-white font-extrabold text-lg shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                      {t.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors duration-200">{t.name}</h4>
                      <span className="text-xs text-primary font-bold block">{t.role}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{t.desc}</p>
                </div>
                
                {/* Quote block */}
                <div className="pt-4 mt-4 border-t border-slate-100 text-slate-500 italic text-[11px] leading-relaxed flex gap-1.5">
                  <span className="text-2xl text-primary/30 leading-none">“</span>
                  <p>{t.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action CTA Section */}
        <div className="reveal-section scroll-reveal">
          <div className="bg-slate-900 rounded-3xl py-14 px-8 sm:px-16 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800">
            {/* Grid Pattern overlays */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
            <div className="absolute -left-10 -top-10 w-60 h-60 bg-accent/10 rounded-full blur-[80px] animate-blob" style={{ animationDelay: '5s' }} />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="text-xs uppercase font-extrabold tracking-widest text-accent flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Bắt đầu hành trình của bạn
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Trải Nghiệm Giáo Dục Cá Nhân Hóa Ngay Hôm Nay</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Đăng ký ngay hôm nay để nhận bài kiểm tra năng lực đầu vào miễn phí bằng công nghệ AI và được chuyên gia thiết kế lộ trình phát triển riêng biệt.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <a 
                  href="/contact" 
                  className="px-8 py-3.5 rounded-xl bg-accent text-slate-950 font-bold text-sm hover:bg-accent-dark transition-all duration-300 hover:scale-105 shadow-lg shadow-accent/20"
                >
                  Đăng Ký Tư Vấn
                </a>
                <a 
                  href="/courses" 
                  className="px-8 py-3.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white/20 transition-all duration-300"
                >
                  Xem Các Khóa Học
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
