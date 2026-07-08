'use client';

import { Brain, Star, CheckCircle, Users, Award, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const stats = [
    { value: '15,000+', label: 'Học viên tốt nghiệp' },
    { value: '98%', label: 'Tỷ lệ hài lòng học viên' },
    { value: '50+', label: 'Giảng viên chuyên môn cao' },
    { value: '10+', label: 'Ứng dụng công nghệ AI độc quyền' },
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
    },
    {
      name: 'ThS. Trần Thị Hạnh',
      role: 'Giám đốc Đào tạo & Khảo thí',
      desc: 'Nguyên trưởng khoa Anh ngữ trường Quốc tế uy tín, chuyên gia thiết kế giáo trình chuẩn đầu ra IELTS và giao tiếp.',
    },
    {
      name: 'Kỹ sư. Lê Hoàng Nam',
      role: 'Giám đốc Phát triển Công nghệ',
      desc: 'Chịu trách nhiệm kiến trúc hệ thống AI Admissions CRM và AI Teacher Assistant đắc lực hỗ trợ hàng ngàn giáo viên.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Title Hero Banner */}
      <div className="bg-primary py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/70 block">Về chúng tôi</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            GIỚI THIỆU SEDUAI
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            Tiên phong kết hợp Giáo dục Chất lượng cao cùng sức mạnh Trí Tuệ Nhân Tạo (AI) tối ưu hóa lộ trình phát triển tương lai.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">
              Sứ mệnh của chúng tôi
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Định nghĩa lại Mô hình Giáo dục Thông minh Kỷ nguyên mới
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              SeduAi được thành lập với mục tiêu rút ngắn khoảng cách tri thức và tối ưu hóa năng suất học tập. Chúng tôi tin rằng, mỗi cá nhân đều có một lộ trình tiếp thu riêng biệt. Nhờ vào việc ứng dụng trí tuệ nhân tạo (AI), SeduAi có khả năng phân tích điểm mạnh, điểm yếu và sở thích của từng học viên nhằm thiết kế chương trình học chính xác nhất.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Từ tiếng Anh giao tiếp, luyện thi IELTS cho tới lập trình kỹ thuật cao, SeduAi không chỉ cung cấp giáo trình chuẩn quốc tế mà còn xây dựng môi trường tự học, tự tương tác 24/7 cùng trợ lý AI đắc lực.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-100 border border-slate-100 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-bold text-slate-900">Cam kết Giá trị SeduAi</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm leading-relaxed">
                  <strong>Giáo trình cập nhật liên tục:</strong> Chương trình học được điều chỉnh định kỳ để bám sát thực tiễn công việc và thi cử hiện đại.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm leading-relaxed">
                  <strong>Hỗ trợ công nghệ toàn diện:</strong> Tích hợp CRM học viên, phòng lab thực hành ảo và chatbot giảng dạy AI đi kèm.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600 text-sm leading-relaxed">
                  <strong>Giảng viên chuyên môn:</strong> 100% giảng viên đạt chứng chỉ quốc tế uy tín, tận tâm, giàu kinh nghiệm thực chiến.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-slate-900 rounded-3xl py-12 px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
              <span className="text-3xl sm:text-4xl font-black text-primary block">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold block leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">
              Giá trị cốt lõi
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nguyên Tắc Hành Động Của Chúng Tôi
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              SeduAi hoạt động dựa trên bốn trụ cột chính nhằm mang lại lợi ích tốt nhất cho người học và đối tác.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((val, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md shadow-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  {val.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">{val.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founders / Team */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary-light px-3 py-1.5 rounded-lg inline-block">
              Đội ngũ sáng lập
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Đứng Sau Sự Thành Công Của SeduAi
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              Tập hợp những bộ óc xuất sắc trong lĩnh vực Trí tuệ nhân tạo và Quản trị giáo dục.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md shadow-slate-100 flex flex-col justify-between hover:shadow-lg transition">
                <div className="space-y-4">
                  {/* Fake Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                    {t.name.split(' ').pop()?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-lg">{t.name}</h4>
                    <span className="text-xs text-primary font-bold block">{t.role}</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
