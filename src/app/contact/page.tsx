'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  X,
  ShieldCheck,
  Info,
  AlertTriangle,
  ChevronDown,
  Clock,
  MessageSquare,
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createLead } from '@/services/api';

const faqs = [
  {
    question: 'SeduAi có hình thức học Online không?',
    answer:
      'Có! Tất cả khóa học tại SeduAi đều hỗ trợ học Online qua Zoom và nền tảng E-learning riêng. Học viên có thể xem lại bài giảng bất cứ lúc nào và tương tác với Trợ lý AI 24/7.',
  },
  {
    question: 'Tôi có thể dùng thử AI Admissions CRM không?',
    answer:
      'Hoàn toàn được! Bạn có thể trải nghiệm demo trực tiếp trên trang chủ website hoặc liên hệ đội ngũ tư vấn để được cấp tài khoản dùng thử 14 ngày miễn phí.',
  },
  {
    question: 'Chính sách hoàn tiền như thế nào?',
    answer:
      'SeduAi cam kết hoàn 100% học phí trong 7 ngày đầu tiên nếu bạn không hài lòng với chất lượng khóa học. Sau 7 ngày, học phí sẽ được trừ theo số buổi đã học.',
  },
  {
    question: 'Khóa học có cấp chứng chỉ không?',
    answer:
      'Có, tất cả học viên hoàn thành khóa học sẽ được cấp Chứng chỉ Hoàn thành từ SeduAi. Đối với các khóa IELTS, chứng chỉ thi thử cũng được cung cấp kèm kết quả chi tiết.',
  },
];

export default function Contact() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  // Maplibre GL Map initialization
  useEffect(() => {
    if (!mapContainer.current) return;

    let map: maplibregl.Map | null = null;

    try {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [106.6773, 10.7712],
        zoom: 15,
        pitch: 30,
      });

      map.addControl(new maplibregl.NavigationControl());

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="font-sans p-1 text-slate-800 text-xs">
          <h4 class="font-bold text-[#0077bb] text-sm">SeduAi</h4>
          <p class="text-slate-500 mt-1 leading-snug">Hệ điều hành AI dành cho giáo dục</p>
          <p class="font-semibold text-slate-600 mt-1">Tầng 5, Tòa nhà SeduAi, Đường 3/2, Phường Hòa Hưng, Quận 10, TP. Hồ Chí Minh</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ color: '#0077bb' })
        .setLngLat([106.6773, 10.7712])
        .setPopup(popup)
        .addTo(map);

      marker.togglePopup();
    } catch (e) {
      console.error('Lỗi tải bản đồ Maplibre GL:', e);
      setMapError(true);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await createLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        demand: formData.message,
        source: 31, // Nguồn Website
      });

      if (response.success) {
        setShowToast(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      } else {
        setErrorMessage(response.message || 'Gửi liên hệ thất bại. Vui lòng thử lại sau.');
      }
    } catch {
      setErrorMessage('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen relative pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Liên Hệ <span className="gradient-text">Với SeduAi</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn. Hãy liên hệ qua mọi kênh phù hợp nhất.
          </p>

          {/* Breadcrumbs */}
          <nav className="flex justify-center text-xs font-semibold text-slate-400 gap-2 pt-2">
            <Link href="/" className="hover:text-primary transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Liên hệ</span>
          </nav>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover-lift flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Văn phòng chính</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tầng 5, Tòa nhà SeduAi, Đường 3/2, Phường Hòa Hưng, Quận 10, TP. Hồ Chí Minh
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover-lift flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Hotline</h3>
                <a
                  href="tel:19001234"
                  className="text-xs font-bold text-primary hover:underline block pt-0.5"
                >
                  1900 1234
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover-lift flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Email</h3>
                <a
                  href="mailto:contact@seduai.edu.vn"
                  className="text-xs font-bold text-primary hover:underline block pt-0.5"
                >
                  contact@seduai.edu.vn
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover-lift flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Giờ làm việc</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  T2 - CN: 8:00 - 21:00
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
              <h2 className="text-xl font-extrabold text-slate-950 mb-1">
                Gửi lời nhắn cho SeduAi
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Hãy gửi thắc mắc của bạn qua mẫu bên dưới, Trợ lý AI và đội ngũ tư vấn sẽ trả lời
                bạn sớm nhất.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="0901234567"
                      className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Địa chỉ Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="email@gmail.com"
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Lời nhắn của bạn *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Tôi muốn tìm hiểu thêm về khóa học tiếng Anh..."
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition duration-200 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {loading ? (
                    <>Đang gửi liên hệ...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Gửi lời nhắn
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map Container */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-md">
                {mapError ? (
                  <div className="w-full h-[360px] flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center bg-slate-100 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                    <p className="text-xs font-semibold">
                      Lỗi kết nối bản đồ. Vui lòng kiểm tra lại kết nối mạng.
                    </p>
                  </div>
                ) : (
                  <div
                    ref={mapContainer}
                    className="w-full h-[360px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-100"
                  ></div>
                )}
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 px-4">
                <Info className="w-4 h-4 text-primary flex-shrink-0" />
                <span>
                  Trụ sở chính: Tầng 5, Tòa nhà SeduAi, Đường 3/2, Phường Hòa Hưng, Quận 10, TP. Hồ Chí Minh.
                </span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Câu hỏi <span className="gradient-text">thường gặp</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                Tìm câu trả lời nhanh cho những thắc mắc phổ biến
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50 transition"
                  >
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-scale-up">
                      <p className="pt-4 pl-7">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border-l-4 border-emerald-500 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slide-in">
          <div className="text-emerald-500 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-semibold text-slate-800">Thành công!</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Cảm ơn bạn đã liên hệ! SeduAi sẽ phản hồi trong vòng 24 giờ tới.
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
