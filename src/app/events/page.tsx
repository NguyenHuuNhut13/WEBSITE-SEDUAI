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
}

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
    },
  ];

  // Filter logic
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
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Title Hero Banner */}
      <div className="bg-primary py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/70 block">Sự kiện nổi bật</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            SỰ KIỆN & HỘI THẢO
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            Tham gia các chương trình Workshop chia sẻ, hội thảo khoa học và các lớp học thử miễn phí ứng dụng công nghệ AI tại SeduAi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sự kiện, diễn giả..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
              >
                <div>
                  {/* Banner header inside card */}
                  <div className={`bg-gradient-to-tr ${evt.imageBg} text-white p-6 relative overflow-hidden h-32 flex flex-col justify-end`}>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                      {evt.category}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-white/80 block uppercase tracking-wider">Diễn giả: {evt.speaker.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-primary transition duration-150">
                      {evt.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    {/* Meta info */}
                    <div className="space-y-2 pt-2 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Ngày tổ chức: {evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Thời gian: {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="line-clamp-1">Địa điểm: {evt.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Miễn phí tham dự
                  </span>
                  <button
                    onClick={() => setRegisterEvent(evt)}
                    className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark shadow-sm hover:shadow transition duration-150"
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 animate-scaleIn">
            <button
              onClick={() => setRegisterEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Đăng ký thành công!</h3>
                <p className="text-slate-500 text-xs">
                  Mã vé tham dự và thông tin phòng học đã được gửi tới Email & Hotline của bạn.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {registerEvent.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    Đăng ký: {registerEvent.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Vui lòng điền thông tin liên hệ chính xác để nhận mã thư mời và đường link phòng họp Zoom.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1.5">
                    <label>Họ và tên học viên *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label>Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="0901234567"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label>Địa chỉ Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition shadow-md shadow-primary/10"
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
