'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Search, X, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  category: 'Workshop' | 'Seminar' | 'Lớp học thử';
  date: string;
  time: string;
  location: string;
  description: string;
  speaker: string;
  imageBg: string;
  borderColor: string;
  status: 'HOT' | 'Sắp diễn ra' | 'Còn ít chỗ';
}

const categoryBadgeColors: Record<string, string> = {
  Workshop: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Seminar: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Lớp học thử': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const categoryGlowColors: Record<string, string> = {
  Workshop: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] group-hover:border-blue-500/40',
  Seminar: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] group-hover:border-purple-500/40',
  'Lớp học thử': 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/40',
};

const statusBadgeColors: Record<string, string> = {
  'HOT': 'bg-rose-500 text-white animate-pulse',
  'Sắp diễn ra': 'bg-amber-500 text-slate-950',
  'Còn ít chỗ': 'bg-orange-500 text-white',
};

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = ['Tất cả', 'Workshop', 'Seminar', 'Lớp học thử'];

  const events: EventItem[] = [
    {
      id: 1,
      title: 'Workshop: Ứng dụng ChatGPT & AI Tools viết luận học thuật đạt điểm cao',
      category: 'Workshop',
      date: '15/07/2026',
      time: '14:00 - 16:30',
      location: 'Phòng Lab 3D, Cơ sở Quận 10, TP.HCM / Online Zoom',
      description: 'Hướng dẫn chi tiết phương pháp lập dàn bài, khai thác dữ liệu nghiên cứu và tinh chỉnh từ vựng tiếng Anh học thuật sử dụng mô hình ngôn ngữ lớn (LLM) an toàn, tránh đạo văn.',
      speaker: 'GS. Nguyễn Văn Sedu (AI Researcher) & ThS. Trần Thị Hạnh',
      imageBg: 'from-blue-600 to-indigo-700',
      borderColor: 'border-l-blue-500',
      status: 'HOT',
    },
    {
      id: 2,
      title: 'Hội thảo (Seminar): Tương lai Giáo dục thông minh & Việc làm ngành AI 2026',
      category: 'Seminar',
      date: '28/07/2026',
      time: '09:00 - 11:30',
      location: 'Hội trường Lớn SeduAi, TP.HCM',
      description: 'Phân tích xu hướng chuyển đổi số của các cơ sở đào tạo, nhu cầu tuyển dụng lập trình viên Full-Stack ứng dụng AI và cách sinh viên tự trang bị năng lực cạnh tranh trong kỷ nguyên mới.',
      speaker: 'CEO SeduAi & Giám đốc Nhân sự Tập đoàn Công nghệ Đa quốc gia',
      imageBg: 'from-purple-600 to-pink-700',
      borderColor: 'border-l-purple-500',
      status: 'Sắp diễn ra',
    },
    {
      id: 3,
      title: 'Lớp học thử miễn phí: Lập trình Python & Thiết kế Game 2D cùng Trợ lý AI',
      category: 'Lớp học thử',
      date: '02/08/2026',
      time: '18:30 - 20:30',
      location: 'Cơ sở Quận 10, TP.HCM / Online Zoom',
      description: 'Dành riêng cho các học viên chưa có nền tảng. Thực hành viết những dòng code đầu tiên, tạo trò chơi đập bóng cổ điển với sự hướng dẫn trực quan từ trợ lý lập trình AI đắc lực.',
      speaker: 'Kỹ sư. Lê Hoàng Nam (Giám đốc Công nghệ SeduAi)',
      imageBg: 'from-emerald-600 to-teal-700',
      borderColor: 'border-l-emerald-500',
      status: 'Còn ít chỗ',
    },
    {
      id: 4,
      title: 'Workshop: Bí quyết chinh phục IELTS Speaking & Writing Band 7.5+ cùng AI Coach',
      category: 'Workshop',
      date: '10/08/2026',
      time: '14:00 - 17:00',
      location: 'Online Zoom Meeting',
      description: 'Chia sẻ bộ tiêu chí chấm điểm IELTS mới nhất và cách sử dụng ứng dụng SeduAi Coach để luyện phát âm, sửa lỗi ngữ pháp, cải thiện độ trôi chảy trực tiếp 24/7.',
      speaker: 'Cô Nguyễn Mai Phương (IELTS 8.5, Academic Manager SeduAi)',
      imageBg: 'from-amber-600 to-orange-700',
      borderColor: 'border-l-amber-500',
      status: 'Sắp diễn ra',
    },
  ];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || evt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setRegisterEvent(null);
      setFormData({ name: '', phone: '', email: '' });
    }, 2500);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-24 selection:bg-primary selection:text-white">
      {/* Dynamic Hero Banner with Technology Grid and Glows */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24 text-center relative overflow-hidden border-b border-slate-900">
        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-5">
          <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full inline-block">
            Sự kiện công nghệ & học thuật
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
            SỰ KIỆN & <span className="gradient-text">HỘI THẢO</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Học tập chủ động với các buổi thảo luận chuyên sâu, lớp học thử miễn phí và hội thảo khoa học ứng dụng AI đỉnh cao được tổ chức định kỳ tại SeduAi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        {/* Search and Filters with Dark Glassmorphism */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-slate-800/30 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar input design */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm sự kiện, diễn giả..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>
        </div>

        {/* Dynamic Glowing Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((evt, idx) => (
              <div
                key={evt.id}
                className={`bg-slate-900/40 rounded-3xl overflow-hidden border border-slate-800/80 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-500 group relative ${categoryGlowColors[evt.category]} animate-fade-in-up`}
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
              >
                {/* Visual mesh color glow in card background on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
                
                <div>
                  {/* Premium Banner image block */}
                  <div className={`bg-gradient-to-tr ${evt.imageBg} text-white p-6 relative overflow-hidden h-36 flex flex-col justify-between`}>
                    {/* Futuristic background patterns */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.05)_50%,transparent_55%)] bg-[size:10px_10px] pointer-events-none" />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${categoryBadgeColors[evt.category]} bg-slate-950/40 backdrop-blur-md`}>
                        {evt.category}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wider uppercase ${statusBadgeColors[evt.status]}`}>
                          {evt.status}
                        </span>
                        <span className="bg-slate-950/60 backdrop-blur-md rounded-lg px-2.5 py-1 text-[9px] font-black text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          Miễn phí
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest block">Speaker</span>
                        <span className="text-xs font-extrabold text-white">
                          {evt.speaker.split('(')[0].trim()}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-slate-950 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Body details info */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-black text-white text-lg leading-snug group-hover:text-primary transition duration-300">
                      {evt.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    {/* Metadata details line */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-slate-300 font-bold border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>Ngày {evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration button footer */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setRegisterEvent(evt)}
                    className="w-full py-3 bg-slate-800 hover:bg-primary text-white text-xs font-black rounded-xl transition-all duration-300 border border-slate-700/60 hover:border-primary shadow-md hover:shadow-primary/20 cursor-pointer uppercase tracking-wider"
                  >
                    Đăng ký giữ chỗ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/30 rounded-3xl py-20 border border-slate-800 text-center space-y-4 shadow-xl">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-300">Không tìm thấy sự kiện</h3>
              <p className="text-slate-500 text-xs">Vui lòng thử từ khóa tìm kiếm hoặc danh mục khác.</p>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal with Glassmorphism */}
      {registerEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative animate-slide-up-fade">
            <button
              onClick={() => setRegisterEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 hover:rotate-90 transition-all duration-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="p-10 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-scale-up">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Đăng ký thành công!</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Mã vé mời điện tử và thông tin phòng học trực tuyến đã được gửi đến email và điện thoại của bạn.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="space-y-2.5">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border ${categoryBadgeColors[registerEvent.category]} bg-slate-950/30`}>
                    {registerEvent.category}
                  </span>
                  <h3 className="font-black text-white text-base sm:text-lg leading-snug mt-2">
                    Đăng ký: {registerEvent.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Nhập chính xác thông tin liên hệ để hệ thống gửi liên kết Zoom & mã code thư mời.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: 'Họ và tên học viên', type: 'text', key: 'name', placeholder: 'Nguyễn Văn A' },
                    { label: 'Số điện thoại', type: 'tel', key: 'phone', placeholder: '0901234567' },
                    { label: 'Địa chỉ Email', type: 'email', key: 'email', placeholder: 'example@gmail.com' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">{field.label} *</label>
                      <input
                        type={field.type}
                        required
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 cursor-pointer uppercase tracking-wider"
                >
                  Xác nhận đăng ký tham gia
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
