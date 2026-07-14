'use client';

import { useEffect, useRef } from 'react';
import { Brain, Star, CheckCircle, Users, Award, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    { value: '15,000+', label: 'Học viên tốt nghiệp', icon: '🎓' },
    { value: '98%', label: 'Tỷ lệ hài lòng học viên', icon: '⭐' },
    { value: '50+', label: 'Giảng viên chuyên môn cao', icon: '👨‍🏫' },
    { value: '10+', label: 'Ứng dụng công nghệ AI độc quyền', icon: '🤖' },
  ];

  const coreValues = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: 'Ứng dụng Công nghệ đột phá',
      description: 'Luôn tiên phong đưa trí tuệ nhân tạo (AI) vào việc hỗ trợ đào tạo, cá nhân hóa lộ trình học cho từng cá nhân.',
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: 'Chất lượng Đào tạo Cam kết',
      description: 'Cam kết chất lượng chuẩn đầu ra rõ ràng bằng văn bản pháp lý, bảo vệ quyền lợi học tập tối đa cho học viên.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Trung thực & Minh bạch',
      description: 'Mọi thông tin học phí, lộ trình đào tạo, đánh giá năng lực của học viên đều được công khai và cập nhật chính xác.',
    },
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: 'Tận tâm Đồng hành',
      description: 'Hệ thống trợ lý AI và đội ngũ chuyên môn hỗ trợ 24/7, luôn lắng nghe và khắc phục khó khăn của học viên kịp thời.',
    },
  ];

  const team = [
    {
      name: 'GS. Nguyễn Văn Sedu',
      role: 'Đồng sáng lập & Cố vấn Trí Tuệ Nhân Tạo',
      desc: 'Hơn 15 năm nghiên cứu tại Silicon Valley về xử lý ngôn ngữ tự nhiên và ứng dụng AI vào mô hình giáo dục thông minh.',
      gradient: 'from-primary to-blue-500',
    },
    {
      name: 'ThS. Trần Thị Hạnh',
      role: 'Giám đốc Đào tạo & Khảo thí',
      desc: 'Nguyên trưởng khoa Anh ngữ trường Quốc tế uy tín, chuyên gia thiết kế giáo trình chuẩn đầu ra IELTS và giao tiếp.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Kỹ sư. Lê Hoàng Nam',
      role: 'Giám đốc Phát triển Công nghệ',
      desc: 'Chịu trách nhiệm kiến trúc hệ thống AI Admissions CRM và AI Teacher Assistant đắc lực hỗ trợ hàng ngàn giáo viên.',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  const timeline = [
    { year: '2020', title: 'Thành lập SeduAi', desc: 'Ra đời với sứ mệnh kết hợp AI và Giáo dục chất lượng cao.' },
    { year: '2021', title: 'Hệ thống CRM v1.0', desc: 'Triển khai phần mềm quản lý học viên AI đầu tiên tại TP.HCM.' },
    { year: '2023', title: 'AI Teacher Assistant', desc: 'Ra mắt trợ lý giảng dạy AI hỗ trợ soạn giáo án tự động.' },
    { year: '2026', title: 'SeduAi Platform v3', desc: 'Nền tảng toàn diện phục vụ 15,000+ học viên trên toàn quốc.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Banner with Parallax-style gradient */}
      <div className="bg-gradient-to-br from-primary via-blue-700 to-primary-dark py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-5">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/70 block">Về chúng tôi</span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight animate-fade-in-up">
            GIỚI THIỆU <span className="text-accent">SEDUAI</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
            Tiên phong kết hợp Giáo dục Chất lượng cao cùng sức mạnh Trí Tuệ Nhân Tạo (AI) tối ưu hóa lộ trình phát triển tương lai.
          </p>
        </div>
      </div>

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-28">

        {/* Intro Section */}
        <div className="reveal-section grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">
              Sứ mệnh của chúng tôi
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Định nghĩa lại Mô hình <span className="gradient-text">Giáo dục Thông minh</span> Kỷ nguyên mới
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              SeduAi được thành lập với mục tiêu rút ngắn khoảng cách tri thức và tối ưu hóa năng suất học tập. Chúng tôi tin rằng, mỗi cá nhân đều có một lộ trình tiếp thu riêng biệt. Nhờ vào việc ứng dụng trí tuệ nhân tạo (AI), SeduAi có khả năng phân tích điểm mạnh, điểm yếu và sở thích của từng học viên nhằm thiết kế chương trình học chính xác nhất.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Từ tiếng Anh giao tiếp, luyện thi IELTS cho tới lập trình kỹ thuật cao, SeduAi không chỉ cung cấp giáo trình chuẩn quốc tế mà còn xây dựng môi trường tự học, tự tương tác 24/7 cùng trợ lý AI đắc lực.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-5 relative overflow-hidden hover-lift-glow scroll-reveal delay-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold text-slate-900">Cam kết Giá trị SeduAi</h3>
            <ul className="space-y-4">
              {[
                { title: 'Giáo trình cập nhật liên tục:', desc: 'Chương trình học được điều chỉnh định kỳ để bám sát thực tiễn công việc và thi cử hiện đại.' },
                { title: 'Hỗ trợ công nghệ toàn diện:', desc: 'Tích hợp CRM học viên, phòng lab thực hành ảo và chatbot giảng dạy AI đi kèm.' },
                { title: 'Giảng viên chuyên môn:', desc: '100% giảng viên đạt chứng chỉ quốc tế uy tín, tận tâm, giàu kinh nghiệm thực chiến.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
                  </div>
                  <span className="text-slate-600 text-sm leading-relaxed">
                    <strong>{item.title}</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="reveal-section bg-slate-900 rounded-3xl py-14 px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '6s' }} />
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2 scroll-reveal group" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="text-3xl block mb-1 group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
              <span className="text-3xl sm:text-4xl font-black text-primary block">{stat.value}</span>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold block leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Story Timeline */}
        <div className="reveal-section space-y-12">
          <div className="text-center space-y-3 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Lịch sử phát triển</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hành trình <span className="gradient-text">SeduAi</span></h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-blue-400 to-transparent hidden md:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6 items-start scroll-reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                  {/* Dot */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10 shadow-md shadow-primary/30 hidden md:flex">{i + 1}</div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex-grow hover-lift-glow group">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-extrabold text-primary bg-primary-light px-2.5 py-1 rounded-lg">{item.year}</span>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors duration-200">{item.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="reveal-section space-y-12">
          <div className="text-center space-y-3 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Giá trị cốt lõi</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nguyên Tắc Hành Động Của Chúng Tôi</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">SeduAi hoạt động dựa trên bốn trụ cột chính nhằm mang lại lợi ích tốt nhất cho người học và đối tác.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((val, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex items-start gap-4 hover-lift-glow glow-border card-shine scroll-reveal group" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  {val.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors duration-200">{val.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="reveal-section space-y-12">
          <div className="text-center space-y-3 scroll-reveal">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">Đội ngũ sáng lập</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đứng Sau Sự Thành Công Của SeduAi</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Tập hợp những bộ óc xuất sắc trong lĩnh vực Trí tuệ nhân tạo và Quản trị giáo dục.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md hover-lift-glow glow-border group card-shine scroll-reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${t.gradient} flex items-center justify-center text-white font-extrabold text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    {t.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors duration-200">{t.name}</h4>
                    <span className="text-xs text-primary font-bold block">{t.role}</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
