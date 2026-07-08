'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/hero-slide-1.png',
    subtitle: 'Hệ điều hành AI giáo dục thế hệ mới',
    title: 'Cá nhân hóa Giáo dục bằng Trí tuệ Nhân tạo',
    description:
      'SeduAi giúp các trung tâm đào tạo thu hút học viên tự động bằng AI, nâng tầm phương pháp dạy học và tối ưu hóa 90% vận hành.',
  },
  {
    image: '/hero-slide-2.png',
    subtitle: 'Trợ lý Giáo viên AI',
    title: 'Soạn Giáo án, Đề thi & Nhận xét chỉ trong vài giây',
    description:
      'Giáo viên chỉ cần ra lệnh bằng giọng nói hoặc văn bản, AI sẽ tự động soạn thảo mọi tài liệu giảng dạy chất lượng cao.',
  },
  {
    image: '/hero-slide-3.png',
    subtitle: 'Tuyển sinh thông minh 24/7',
    title: 'AI Admissions CRM — Tự động khai thác & Chăm sóc học viên',
    description:
      'Chatbot AI trò chuyện tự nhiên, khai thác nhu cầu thực tế và tự động tạo Lead trên hệ thống CRM quản trị.',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[600px] lg:h-[680px] overflow-hidden">
      {/* Background Images */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover animate-hero-zoom"
            loading="eager"
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Subtitle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold uppercase tracking-wider animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
            {slide.subtitle}
          </div>

          {/* Title */}
          <h1
            key={`title-${currentSlide}`}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight animate-fade-in-up"
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p
            key={`desc-${currentSlide}`}
            className="text-slate-200 text-lg max-w-2xl animate-fade-in-up delay-200"
            style={{ animationFillMode: 'both' }}
          >
            {slide.description}
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
            <div className="flex max-w-lg bg-white rounded-full overflow-hidden shadow-2xl shadow-black/20">
              <div className="flex-grow flex items-center px-5">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-4 text-sm text-slate-700 focus:outline-none bg-transparent"
                />
              </div>
              <Link
                href={searchQuery ? `/courses?q=${encodeURIComponent(searchQuery)}` : '/courses'}
                className="px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors duration-200 flex items-center gap-2"
              >
                Tìm kiếm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-8 pt-2 animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
            <div className="text-white">
              <span className="text-2xl font-extrabold">15,000+</span>
              <p className="text-xs text-slate-300 font-medium">Học viên</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-white">
              <span className="text-2xl font-extrabold">250+</span>
              <p className="text-xs text-slate-300 font-medium">Đối tác</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-white">
              <span className="text-2xl font-extrabold">98%</span>
              <p className="text-xs text-slate-300 font-medium">Hài lòng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentSlide
                ? 'w-8 h-3 bg-primary'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
