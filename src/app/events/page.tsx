'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Search, X, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  Workshop: 'bg-blue-50 text-blue-700 border-blue-200',
  Seminar: 'bg-purple-50 text-purple-700 border-purple-200',
  'Lớp học thử': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const categoryGlowColors: Record<string, string> = {
  Workshop: 'group-hover:shadow-[0_0_20px_rgba(0,119,187,0.08)] group-hover:border-primary/30',
  Seminar: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.08)] group-hover:border-purple-500/30',
  'Lớp học thử': 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] group-hover:border-emerald-500/30',
};

const statusBadgeColors: Record<string, string> = {
  'HOT': 'bg-rose-600 text-white animate-pulse',
  'Sắp diễn ra': 'bg-amber-500 text-slate-900',
  'Còn ít chỗ': 'bg-orange-500 text-white',
};

export default function EventsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenRegister = (evt: EventItem) => {
    setRegisterEvent(evt);
    setFormData({
      name: user?.name || `${user?.lastname || ''} ${user?.firstname || ''}`.trim() || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
  };

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
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-24 selection:bg-primary selection:text-white">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-none blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-accent/10 rounded-none blur-3xl animate-blob" style={{ animationDelay: '5s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-white px-3.5 py-1.5 rounded-none inline-block">
            Sự kiện công nghệ & học thuật
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            SỰ KIỆN & <span className="gradient-text">HỘI THẢO</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Học tập chủ động với các buổi thảo luận chuyên sâu, lớp học thử miễn phí và hội thảo khoa học ứng dụng AI đỉnh cao được tổ chức định kỳ tại SeduAi.
          </p>

          {/* Breadcrumbs */}
          <nav className="flex justify-center text-xs font-semibold text-slate-400 gap-2 pt-2">
            <Link href="/" className="hover:text-primary transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Sự kiện</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        {/* Search and Filters */}
        <div className="bg-white border border-slate-200 p-5 rounded-none shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2.5 rounded-none text-xs font-bold transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
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
              className="w-full border border-slate-200 rounded-none pl-10 pr-4 py-2.5 text-xs bg-slate-50 text-slate-900 placeholder-slate-450 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>
        </div>

        {/* Glowing Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className={`bg-white rounded-none overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-500 group relative ${categoryGlowColors[evt.category]}`}
              >
                <div>
                  {/* Premium Banner image block */}
                  <div className={`bg-gradient-to-tr ${evt.imageBg} text-white p-6 relative overflow-hidden h-36 flex flex-col justify-between`}>
                    {/* Background patterns */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.05)_50%,transparent_55%)] bg-[size:10px_10px] pointer-events-none" />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <span className={`px-3 py-1 rounded-none text-[9px] font-black border uppercase tracking-wider ${categoryBadgeColors[evt.category]} bg-white/10 backdrop-blur-md`}>
                        {evt.category}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-none text-[9px] font-black tracking-wider uppercase ${statusBadgeColors[evt.status]}`}>
                          {evt.status}
                        </span>
                        <span className="bg-white/10 backdrop-blur-md rounded-none px-2.5 py-1 text-[9px] font-black text-emerald-400 border border-emerald-400/20 uppercase tracking-wider">
                          Miễn phí
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest block">Speaker</span>
                        <span className="text-xs font-extrabold text-white">
                          {evt.speaker.split('(')[0].trim()}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-none bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-slate-950 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Body details info */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-black text-slate-900 text-lg leading-snug group-hover:text-primary transition duration-300">
                      {evt.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    {/* Metadata details line */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-slate-650 font-bold border-t border-slate-100">
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
                        <span className="truncate text-slate-600">{evt.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration button footer */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => handleOpenRegister(evt)}
                    className="w-full py-3 bg-slate-100 hover:bg-primary text-slate-800 hover:text-white text-xs font-black rounded-none transition-all duration-300 border border-slate-200 hover:border-primary shadow-sm hover:shadow-primary/20 cursor-pointer uppercase tracking-wider"
                  >
                    Đăng ký giữ chỗ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-none py-20 border border-slate-200 text-center space-y-4 shadow-sm">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sự kiện</h3>
              <p className="text-slate-500 text-xs">Vui lòng thử từ khóa tìm kiếm hoặc danh mục khác.</p>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {registerEvent && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-none overflow-hidden shadow-2xl relative animate-slide-up-fade">
            <button
              onClick={() => setRegisterEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-none bg-slate-100 text-slate-500 hover:text-slate-950 hover:bg-slate-200 hover:rotate-90 transition-all duration-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="p-10 text-center space-y-5">
                <div className="w-20 h-20 rounded-none bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto animate-scale-up">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Đăng ký thành công!</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Mã vé mời điện tử và thông tin phòng học trực tuyến đã được gửi đến email và điện thoại của bạn.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="space-y-2.5">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-none uppercase tracking-wider border ${categoryBadgeColors[registerEvent.category]} bg-slate-50`}>
                    {registerEvent.category}
                  </span>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg leading-snug mt-2">
                    Đăng ký: {registerEvent.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
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
                      <label className="text-xs font-bold text-slate-700">{field.label} *</label>
                      <input
                        type={field.type}
                        required
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-none transition-all duration-300 shadow-lg shadow-primary/20 cursor-pointer uppercase tracking-wider"
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
