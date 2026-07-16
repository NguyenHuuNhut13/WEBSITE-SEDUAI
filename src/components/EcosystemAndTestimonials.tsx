'use client';

import React, { useState } from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

const faqs = [
  {
    question: 'Hệ sinh thái học tập SeduAi hoạt động như thế nào?',
    answer:
      'SeduAi tích hợp mô hình LMS (Learning Management System) chuẩn 5 sao cùng Trợ lý AI cá nhân hóa hỗ trợ 24/7. Học viên có thể làm bài tập, nhận phản hồi chấm điểm tự động tức thì từ AI, đồng thời tham gia các buổi học tương tác cùng giảng viên chuyên gia.',
  },
  {
    question: 'Giảng viên chuyên môn và AI hỗ trợ học viên ra sao?',
    answer:
      'Các buổi học chính khóa được giảng dạy trực tiếp bởi các giảng viên giàu kinh nghiệm thực chiến. Trợ lý AI đóng vai trò như gia sư đồng hành 24/7 giúp giải đáp lý thuyết, sửa lỗi mã nguồn, chấm điểm bài luận và gợi ý lộ trình cải thiện riêng cho từng học viên.',
  },
  {
    question: 'Thông tin học phí và chính sách trả góp của SeduAi ra sao?',
    answer:
      'SeduAi hỗ trợ trả góp học phí lãi suất 0% thông qua liên kết thẻ tín dụng của hơn 25 ngân hàng uy tín toàn quốc. Ngoài ra, trung tâm có các chính sách học bổng khuyến học và ưu đãi lên đến 30% cho học viên đăng ký sớm.',
  },
  {
    question: 'Chứng chỉ hoàn thành khóa học của SeduAi có giá trị thế nào?',
    answer:
      'Sau khi hoàn thành tối thiểu 80% tiến độ học tập và các bài kiểm tra thực chiến, học viên sẽ được cấp Chứng chỉ Hoàn thành khóa học điện tử chuẩn quốc tế của SeduAi, có mã định danh để nhà tuyển dụng dễ dàng xác thực.',
  },
  {
    question: 'Chính sách cam kết và hoàn học phí được quy định thế nào?',
    answer:
      'SeduAi cam kết hoàn trả 100% học phí trong vòng 7 ngày đầu tiên kể từ ngày khai giảng nếu học viên cảm thấy không hài lòng với phương pháp giảng dạy hoặc chất lượng dịch vụ hỗ trợ của trung tâm.',
  },
];

export default function EcosystemAndTestimonials() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Divide 4 testimonials into 2 slides (each slide contains 2 items)
  const slides = [
    [testimonials[0], testimonials[1]],
    [testimonials[2], testimonials[3]],
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ====== LEFT COLUMN: TESTIMONIALS SLIDER ====== */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-extrabold tracking-widest text-red-500 block">
                Testimonials
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                Ý Kiến Học Viên
              </h2>
            </div>

            {/* Testimonials stacked cards (exactly 2 cards visible per slide) */}
            <div className="space-y-6 transition-all duration-500 ease-in-out">
              {slides[activeSlide]?.map((testimonial, idx) => {
                if (!testimonial) return null;
                return (
                  <div
                    key={idx}
                    className="bg-slate-100/70 p-8 shadow-sm relative flex flex-col sm:flex-row gap-6 items-start"
                    style={{ borderRadius: '0px' }} // Sharp corners as requested
                  >
                    {/* Circle Avatar on Left */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border border-red-200 bg-white">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content on Right */}
                    <div className="space-y-3 flex-grow">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h4 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">
                          {testimonial.name}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">
                          ({testimonial.role})
                        </span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400"
                          />
                        ))}
                      </div>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        {testimonial.comment}
                      </p>
                      
                      <span className="inline-block text-[10px] font-extrabold text-primary bg-primary-light px-2.5 py-0.5 border border-primary/10">
                        Khóa học: {testimonial.course}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot indicators (exactly like pink/red dots in template image) */}
            <div className="flex items-center gap-2 pt-2 justify-start">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? 'bg-red-500 scale-110 shadow-sm'
                      : 'bg-red-200 hover:bg-red-300'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ====== RIGHT COLUMN: FAQ ACCORDION ====== */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-extrabold tracking-widest text-red-500 block">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                Câu Hỏi Thường Gặp
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-100 overflow-hidden transition-all duration-300"
                    style={{ borderRadius: '0px' }} // Strict sharp corners
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center gap-4 p-4 bg-slate-100/70 hover:bg-slate-100 transition text-left cursor-pointer"
                    >
                      {/* Red square symbol container */}
                      <div className="flex-shrink-0 w-6 h-6 border border-red-500 flex items-center justify-center bg-white text-red-500 font-bold transition-colors">
                        {isOpen ? (
                          <Minus className="w-3.5 h-3.5 stroke-[3px]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                        )}
                      </div>

                      <span className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wide uppercase">
                        {faq.question}
                      </span>
                    </button>

                    {/* Expandable answer panel */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-[300px] border-t border-slate-100 bg-white' : 'max-h-0'
                      }`}
                    >
                      <div className="p-6 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        {faq.answer}
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
