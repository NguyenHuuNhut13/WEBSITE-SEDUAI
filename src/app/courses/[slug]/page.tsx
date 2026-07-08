'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, GraduationCap, Check, ShieldCheck, Award, X, Send, ChevronDown, BookOpen, Headset } from 'lucide-react';
import { courses } from '@/data/courses';

export default function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Resolve params promise in Next.js 15
  const { slug } = React.use(params);
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({ 0: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  // Related courses (excluding current course, up to 3)
  const relatedCourses = courses.filter((c) => c.slug !== slug).slice(0, 3);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    setIsModalOpen(false);
    setShowToast(true);
    setFormData({ name: '', phone: '', email: '' });
    
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen relative pb-16">
      
      {/* Course Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Breadcrumbs */}
            <nav className="flex text-xs font-semibold text-slate-400 gap-2 mb-2">
              <Link href="/" className="hover:text-primary transition">Trang chủ</Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-primary transition">Khóa học</Link>
              <span>/</span>
              <span className="text-primary-light">{course.category}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            {/* Metadata info */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-0.5">
                  {course.rating}
                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                </span>
                <span>({course.reviews_count} đánh giá từ Edu2Review)</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {course.student_count} học viên đã học</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.instructor}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar layout */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Benefits */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-950 mb-5">Bạn sẽ học được gì sau khóa học?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus (Accordion) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-950 mb-5">Lộ trình học tập chi tiết</h2>
                <div className="space-y-3">
                  {course.syllabus.map((chapter, index) => {
                    const isChapterOpen = !!openAccordions[index];
                    return (
                      <div key={index} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100/50 flex justify-between items-center text-left transition font-bold text-slate-800 text-sm cursor-pointer"
                        >
                          <span>{chapter.title}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                              isChapterOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isChapterOpen && (
                          <div className="p-5 bg-white border-t border-slate-100 space-y-3 animate-scale-up">
                            {chapter.lessons.map((lesson, lIdx) => (
                              <div key={lIdx} className="flex items-center gap-3 text-xs text-slate-600">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                <span>{lesson}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <h2 className="text-xl font-extrabold text-slate-950">Đánh giá thực tế từ học viên</h2>
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
                    Edu2Review Verified
                  </span>
                </div>

                {/* Rating score grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                  <div className="md:col-span-4 text-center space-y-1">
                    <h3 className="text-5xl font-extrabold text-slate-950">{course.rating}</h3>
                    <div className="text-amber-500 flex justify-center gap-0.5 text-sm">
                      <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                      <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                      <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                      <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                      <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                    </div>
                    <p className="text-xs text-slate-400">Trên {course.reviews_count} đánh giá</p>
                  </div>
                  <div className="md:col-span-8 space-y-2">
                    {/* Star Bars */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-slate-500">5 sao</span>
                      <div className="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="w-8 text-slate-400 text-right">85%</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-slate-500">4 sao</span>
                      <div className="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: '12%' }}></div>
                      </div>
                      <span className="w-8 text-slate-400 text-right">12%</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-slate-500">3 sao</span>
                      <div className="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: '3%' }}></div>
                      </div>
                      <span className="w-8 text-slate-400 text-right">3%</span>
                    </div>
                  </div>
                </div>

                {/* Comment list */}
                <div className="space-y-6">
                  {course.reviews.map((review, idx) => (
                    <div key={idx} className="space-y-2.5 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                          <p className="text-[10px] text-slate-400">{review.date}</p>
                        </div>
                        <div className="text-amber-500 flex gap-0.5 text-xs">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star
                              key={sIdx}
                              className={`w-3.5 h-3.5 ${
                                sIdx < review.rating ? 'fill-amber-500 stroke-amber-500' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar Box) */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6 sticky top-24">
                <div>
                  <span className="text-slate-400 text-xs line-through block mb-0.5">
                    Giá gốc: {course.price.toLocaleString('vi-VN')} đ
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-primary text-2xl sm:text-3xl">
                      {course.discount_price.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-extrabold text-xs">
                      Giảm {Math.round(((course.price - course.discount_price) / course.price) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Info list */}
                <div className="space-y-3.5 text-xs text-slate-600 border-t border-b border-slate-100 py-5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> Thời lượng:
                    </span>
                    <span className="font-bold text-slate-900">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-slate-400" /> Trình độ:
                    </span>
                    <span className="font-bold text-slate-900">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-slate-400" /> Chứng nhận:
                    </span>
                    <span className="font-bold text-slate-900">Chứng chỉ SeduAi</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full text-center py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition duration-200 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  Đăng Ký Tư Vấn & Nhận Voucher
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  * Đăng ký ngay hôm nay để được nhận thêm 1 tháng đàm thoại 1-1 miễn phí cùng Trợ lý AI.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative animate-scale-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-xl shadow-inner">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Đăng ký tư vấn khóa học</h3>
                <p className="text-slate-500 text-xs">
                  Bạn đang quan tâm: <strong className="text-slate-700">{course.title}</strong>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ và tên của bạn</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="0901234567"
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Địa chỉ Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="email@gmail.com"
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition duration-200 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Gửi yêu cầu & Đăng ký <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border-l-4 border-emerald-500 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slide-in">
          <div className="text-emerald-500 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-semibold text-slate-800">Thành công!</p>
            <p className="text-xs text-slate-600 mt-0.5">Cảm ơn bạn đã quan tâm! SeduAi sẽ liên hệ tư vấn trong 15-30 phút tới.</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
