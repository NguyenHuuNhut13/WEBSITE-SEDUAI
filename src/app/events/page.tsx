'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Tag, X, CheckCircle } from 'lucide-react';

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
}

const categoryBadgeColors: Record<string, string> = {
  Workshop: 'bg-blue-100 text-blue-700 border-blue-200',
  Seminar: 'bg-purple-100 text-purple-700 border-purple-200',
  'Lớp học thử': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const categoryBorderColors: Record<string, string> = {
  Workshop: 'border-l-blue-500',
  Seminar: 'border-l-purple-500',
  'Lớp học thử': 'border-l-emerald-500',
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
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary via-blue-700 to-primary-dark py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-blob" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/70 block">Sự kiện nổi bật</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">SỰ KIỆN & HỘI THẢO</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            Tham gia các chương trình Workshop chia sẻ, hội thảo khoa học và các lớp học thử miễn phí ứng dụng công nghệ AI tại SeduAi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        {/* Search and Filter Pills */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary hover:bg-primary-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sự kiện, diễn giả..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-5 pr-10 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((evt, idx) => (
              <div
                key={evt.id}
                className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md border-l-4 ${categoryBorderColors[evt.category]} flex flex-col justify-between hover-lift-glow group animate-fade-in-up`}
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
              >
                <div>
                  {/* Banner header */}
                  <div className={`bg-gradient-to-tr ${evt.imageBg} text-white p-5 relative overflow-hidden h-28 flex flex-col justify-between group-hover:brightness-105 transition-all duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-start justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold bg-white border ${categoryBadgeColors[evt.category]}`}>
                        {evt.category}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold text-white">Miễn phí</span>
                    </div>
                    <span className="text-[10px] font-semibold text-white/80 block uppercase tracking-wider">
                      Diễn giả: {evt.speaker.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-primary transition duration-200">
                      {evt.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{evt.description}</p>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-600 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> {evt.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {evt.time}
                      </span>
                      <span className="flex items-center gap-1.5 max-w-full">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => setRegisterEvent(evt)}
                    className="w-full py-2.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-primary text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40 hover:shadow-lg"
                  >
                    Đăng ký giữ chỗ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl py-20 border border-slate-100 text-center space-y-3 shadow-md">
            <Tag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sự kiện</h3>
            <p className="text-slate-400 text-sm">Vui lòng thử từ khóa tìm kiếm hoặc danh mục khác.</p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {registerEvent && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 animate-slide-up-fade">
            <button
              onClick={() => setRegisterEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:rotate-90 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto animate-scale-up">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Đăng ký thành công!</h3>
                <p className="text-slate-500 text-sm">Mã vé tham dự và thông tin phòng học đã được gửi tới Email & Hotline của bạn.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="space-y-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${categoryBadgeColors[registerEvent.category]}`}>
                    {registerEvent.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug mt-2">
                    Đăng ký: {registerEvent.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Vui lòng điền thông tin liên hệ chính xác để nhận mã thư mời và đường link phòng họp Zoom.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Họ và tên học viên', type: 'text', key: 'name', placeholder: 'Nguyễn Văn A' },
                    { label: 'Số điện thoại liên hệ', type: 'tel', key: 'phone', placeholder: '0901234567' },
                    { label: 'Địa chỉ Email', type: 'email', key: 'email', placeholder: 'example@gmail.com' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">{field.label} *</label>
                      <input
                        type={field.type}
                        required
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-primary text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40"
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
