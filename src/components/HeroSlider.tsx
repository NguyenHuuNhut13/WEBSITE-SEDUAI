'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';

const slides = [
  {
    subtitle: 'ĐỒNG HÀNH BỨT PHÁ TƯƠNG LAI',
    title: 'CÁ NHÂN HÓA GIÁO DỤC BẰNG TRÍ TUỆ NHÂN TẠO',
    description:
      'SeduAi đồng hành cùng bạn thiết kế lộ trình học tập tối ưu, tích hợp gia sư ảo AI đắc lực hỗ trợ 24/7 giúp đột phá kết quả học tập.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80',
  },
  {
    subtitle: 'HỆ THỐNG HỌC TẬP THÔNG MINH',
    title: 'HỌC TẬP KHÔNG GIỚI HẠN CÙNG TRỢ LÝ ẢO AI',
    description:
      'Tích hợp các công cụ AI tự động chấm điểm, chấm sửa phát âm đàm thoại trực tiếp và hướng dẫn giải bài chi tiết cho từng kỹ năng.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80',
  },
  {
    subtitle: 'CÔNG NGHỆ GIÁO DỤC HIỆN ĐẠI',
    title: 'NỀN TẢNG TRI THỨC VỮNG CHẮC KỶ NGUYÊN MỚI',
    description:
      'Chương trình đào tạo chuẩn quốc tế giúp bạn làm chủ Tiếng Anh, IELTS, kỹ năng mềm và tư duy lập trình đỉnh cao.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&auto=format&fit=crop&q=80',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  // Auto-rotate slides with progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / 60; // Approximate 6-second auto rotate
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[650px] lg:h-[720px] overflow-hidden text-white flex items-center pt-16 lg:pt-28 animate-fade-in">
      
      {/* Slide Background Images with smooth opacity transitions */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-105"
            style={{ 
              backgroundImage: `url(${s.image})`,
              transform: idx === currentSlide ? 'scale(1)' : 'scale(1.05)'
            }}
          />
          {/* Dark gradient overlay to secure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/50 animate-fade-in" />
        </div>
      ))}

      {/* Decorative Grid overlays */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0077bb_1px,transparent_1px),linear-gradient(to_bottom,#0077bb_1px,transparent_1px)] bg-[size:4rem_4rem] z-1 pointer-events-none" />

      {/* Slide Layout Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & Text details */}
          <div className="lg:col-span-9 space-y-6 text-left">
            {/* Subtitle badge with vertical bar accent */}
            <div className="flex items-center gap-3 text-[#0077bb] text-xs sm:text-sm font-black uppercase tracking-widest animate-fade-in">
              <span className="w-1.5 h-6 bg-[#0077bb] rounded-full inline-block" />
              {slide.subtitle}
            </div>

            {/* Main Title */}
            <h1
              key={`title-${currentSlide}`}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] uppercase animate-fade-in-up"
            >
              {slide.title}
            </h1>

            {/* Description */}
            <p
              key={`desc-${currentSlide}`}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl animate-fade-in-up delay-200"
              style={{ animationFillMode: 'both' }}
            >
              {slide.description}
            </p>

            {/* Dual Action Buttons */}
            <div 
              key={`buttons-${currentSlide}`}
              className="flex flex-wrap items-center gap-4 pt-4 animate-fade-in-up delay-300" 
              style={{ animationFillMode: 'both' }}
            >
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0077bb] hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 uppercase tracking-widest cursor-pointer"
              >
                Xem Khóa Học
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/85 hover:bg-white hover:text-slate-950 hover:border-white text-white font-black text-xs sm:text-sm rounded-xl transition-all duration-300 uppercase tracking-widest cursor-pointer shadow-md"
              >
                Tư Vấn Ngay
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      >
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Progress Dots Indicators at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => { setCurrentSlide(index); setProgress(0); }}
            className={`relative transition-all duration-400 rounded-full cursor-pointer overflow-hidden ${
              index === currentSlide ? 'w-10 h-2 bg-white/20' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
            }`}
          >
            {index === currentSlide && (
              <span
                className="absolute inset-y-0 left-0 bg-[#0077bb] rounded-full transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
