'use client';

import React, { useState } from 'react';
import { testimonials } from '@/data/testimonials';

const ecosystemFaqs = [
  {
    title: 'HỆ SINH THÁI GIÁO DỤC THÔNG MINH SEDUAI LÀ GÌ?',
    content: 'Hệ sinh thái SeduAi là nền tảng giáo dục tích hợp trí tuệ nhân tạo toàn diện, kết hợp giữa: AI Admissions CRM (tối ưu hóa tuyển sinh), AI Teacher Assistant (trợ lý giáo án & đề thi cho giáo viên), hệ thống LMS thông minh (học tập tương tác) và AI Grading (chấm điểm & nhận xét tự động theo thời gian thực).'
  },
  {
    title: 'TRỢ LÝ GIẢNG DẠY AI TEACHER ASSISTANT HOẠT ĐỘNG RA SAO?',
    content: 'Giúp giảm tải 80% công việc hành chính cho giáo viên. Chỉ với lệnh giọng nói hoặc văn bản đơn giản, Trợ lý AI sẽ hỗ trợ soạn giáo án chi tiết theo chương trình, tạo kho đề thi phong phú, hỗ trợ chấm điểm và viết nhận xét học viên chi tiết.'
  },
  {
    title: 'HỆ THỐNG HỌC TẬP TƯƠNG TÁC THÔNG MINH LMS LÀ GÌ?',
    content: 'Hệ thống quản lý học tập (LMS) thế hệ mới giúp học viên theo dõi tiến độ, thực hành bài tập trực tiếp với sự đồng hành của trợ lý AI 24/7, tự động nhắc nhở và tối ưu hóa lộ trình ôn tập cá nhân hóa.'
  },
  {
    title: 'AI GRADING - CHẤM ĐIỂM & NHẬN XÉT TỰ ĐỘNG BẰNG AI?',
    content: 'Tích hợp mô hình ngôn ngữ lớn chấm điểm tự động cho các bài tập Writing & Speaking. Học viên nhận kết quả chấm điểm kèm phân tích ngữ pháp, phát âm và gợi ý sửa bài chi tiết ngay lập tức mà không cần chờ đợi.'
  },
  {
    title: 'AI ADMISSIONS CRM - TỰ ĐỘNG HÓA TUYỂN SINH THẾ NÀO?',
    content: 'Hệ thống CRM thông minh tự động tương tác với phụ huynh và học sinh qua Website/Fanpage, tự động khai thác nhu cầu thực tế và đẩy thông tin Lead trực tiếp vào hệ thống quản lý kèm theo chấm điểm tiềm năng.'
  }
];

export default function EcosystemAndTestimonials() {
  const [activePage, setActivePage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Carousel sliding window of 2 items
  const displayedTestimonials = testimonials.slice(activePage, activePage + 2);

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column 1: Testimonials Carousel (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="mb-8 space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#0077bb]">Cảm nhận học viên</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  TESTIMONIALS
                </h2>
              </div>

              <div className="space-y-6 min-h-[460px]">
                {displayedTestimonials.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#f2f2f2] p-8 border border-slate-200/40 relative shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12 overflow-hidden bg-slate-200">
                        {/* Circular clip path mask to bypass global border-radius: 0px */}
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          style={{ clipPath: 'circle(50% at 50% 50%)' }}
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-950 text-sm uppercase tracking-wide inline">
                          {item.name}
                        </h4>
                        <span className="text-xs text-slate-500 ml-2 font-medium">
                          ({item.role})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#0077bb]">
                        Khóa học: {item.course}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-amber-400 text-xs">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel dots indicator */}
            <div className="flex justify-center gap-2.5 mt-8">
              {[0, 1, 2].map((pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => setActivePage(pageIndex)}
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    activePage === pageIndex 
                      ? 'bg-red-600 scale-110' 
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to page ${pageIndex + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Column 2: Ecosystem & FAQs Accordion (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="mb-8 space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0077bb]">Hỏi đáp & thông tin</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                FREQUENTLY ASKED QUESTIONS
              </h2>
            </div>

            <div className="space-y-4">
              {ecosystemFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index}
                    className="border border-slate-200/40 bg-[#f8f9fa] transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left p-4 flex items-center gap-4 focus:outline-none transition hover:bg-[#f2f2f2]"
                    >
                      {/* Plus / Minus indicator square box matching screenshot red/orange accents */}
                      <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center border font-bold text-xs transition-colors duration-200 ${
                        isOpen 
                          ? 'border-red-600 text-red-600 bg-white' 
                          : 'border-red-600 text-white bg-red-600'
                      }`}>
                        {isOpen ? '－' : '＋'}
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide uppercase">
                        {faq.title}
                      </span>
                    </button>

                    {/* Content smooth collapse */}
                    <div className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-slate-200/60' : 'max-h-0'
                    }`}>
                      <div className="p-5 text-slate-600 text-xs sm:text-sm leading-relaxed bg-white">
                        {faq.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
