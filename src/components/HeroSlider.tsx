'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ChevronLeft, ChevronRight, Zap, Users, ThumbsUp, Building2 } from 'lucide-react';

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

const typingWords = ['Cá nhân hóa', 'Tự động hóa', 'Nâng tầm', 'Tối ưu hóa'];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
        return prev + 100 / 60;
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, [nextSlide]);

  // Typing effect
  useEffect(() => {
    const word = typingWords[typingIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (typingText.length < word.length) {
            setTypingText(word.slice(0, typingText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          if (typingText.length > 0) {
            setTypingText(typingText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setTypingIndex((prev) => (prev + 1) % typingWords.length);
          }
        }
      },
      isDeleting ? 60 : 100
    );
    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, typingIndex]);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[620px] lg:h-[700px] overflow-hidden">
      {/* Floating Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl animate-blob pointer-events-none z-0" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-2/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-blob pointer-events-none z-0" style={{ animationDelay: '8s' }} />

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
            decoding="async"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.07]" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Subtitle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold uppercase tracking-wider animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            {slide.subtitle}
          </div>

          {/* Title with Typing Effect */}
          <h1
            key={`title-${currentSlide}`}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight animate-fade-in-up"
          >
            <span className="block text-white/90 text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
              <span className="shimmer-text">{typingText}</span>
              <span className="inline-block w-0.5 h-7 bg-accent ml-1" style={{ animation: 'typing-cursor 0.8s ease-in-out infinite' }} />
            </span>
            {slide.title}
          </h1>

          {/* Description */}
          <p
            key={`desc-${currentSlide}`}
            className="text-slate-200 text-base sm:text-lg max-w-2xl animate-fade-in-up delay-200"
            style={{ animationFillMode: 'both' }}
          >
            {slide.description}
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
            <div className="flex max-w-lg bg-white/95 backdrop-blur-sm rounded-full overflow-hidden shadow-2xl shadow-black/30 border border-white/40 transition-all duration-300 hover:shadow-primary/20 hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary/30">
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
                className="px-6 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-primary text-white font-bold text-sm transition-all duration-300 flex items-center gap-2"
              >
                Tìm kiếm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-6 pt-2 animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
            {[
              { icon: <Users className="w-3.5 h-3.5" />, value: '15,000+', label: 'Học viên' },
              { icon: <Building2 className="w-3.5 h-3.5" />, value: '250+', label: 'Đối tác' },
              { icon: <ThumbsUp className="w-3.5 h-3.5" />, value: '98%', label: 'Hài lòng' },
              { icon: <Zap className="w-3.5 h-3.5" />, value: '24/7', label: 'AI Support' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-white group">
                {i > 0 && <div className="w-px h-8 bg-white/20 mr-4 hidden sm:block" />}
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-accent group-hover:bg-white/20 transition-colors duration-200">
                  {stat.icon}
                </div>
                <div>
                  <span className="text-xl font-extrabold block leading-none">{stat.value}</span>
                  <p className="text-[10px] text-slate-300 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-card-dark border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-card-dark border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Progress Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentSlide(index); setProgress(0); }}
            className={`relative transition-all duration-400 rounded-full cursor-pointer overflow-hidden ${
              index === currentSlide ? 'w-10 h-3 bg-white/30' : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
          >
            {index === currentSlide && (
              <span
                className="absolute inset-y-0 left-0 bg-accent rounded-full transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
