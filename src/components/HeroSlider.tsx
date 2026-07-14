'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Users, 
  ThumbsUp, 
  Building2, 
  Sparkles, 
  Volume2, 
  Bot, 
  Play, 
  CheckCircle2, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  Database 
} from 'lucide-react';

const slides = [
  {
    subtitle: 'Hệ điều hành AI giáo dục thế hệ mới',
    title: 'Cá nhân hóa Giáo dục bằng Trí tuệ Nhân tạo',
    description:
      'SeduAi giúp các trung tâm đào tạo thu hút học viên tự động bằng AI, nâng tầm phương pháp dạy học và tối ưu hóa 90% vận hành.',
    theme: 'crm',
  },
  {
    subtitle: 'Trợ lý Giáo viên AI',
    title: 'Soạn Giáo án, Đề thi & Nhận xét chỉ trong vài giây',
    description:
      'Giáo viên chỉ cần ra lệnh bằng giọng nói hoặc văn bản, AI sẽ tự động soạn thảo mọi tài liệu giảng dạy chất lượng cao.',
    theme: 'teacher',
  },
  {
    subtitle: 'Tuyển sinh thông minh 24/7',
    title: 'AI Admissions CRM — Tự động khai thác & Chăm sóc học viên',
    description:
      'Chatbot AI trò chuyện tự nhiên, khai thác nhu cầu thực tế và tự động tạo Lead trên hệ thống CRM quản trị.',
    theme: 'learning',
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
        return prev + 100 / 60; // Approximate 6-second auto rotate
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
    <section className="relative h-[650px] lg:h-[720px] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary-dark text-white flex items-center">
      {/* Decorative Background Mesh and Glow Grid */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Floating Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-blob pointer-events-none z-0" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-accent/5 rounded-full blur-[90px] animate-blob pointer-events-none z-0" style={{ animationDelay: '8s' }} />

      {/* Slide Layout Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & Text details */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Subtitle badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-extrabold uppercase tracking-wider animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              {slide.subtitle}
            </div>

            {/* Title with Typing Effect */}
            <h1
              key={`title-${currentSlide}`}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] animate-fade-in-up"
            >
              <span className="block text-white/80 text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="shimmer-text">{typingText}</span>
                <span className="inline-block w-0.5 h-6 bg-accent ml-1" style={{ animation: 'typing-cursor 0.8s ease-in-out infinite' }} />
              </span>
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

            {/* Premium Glassmorphic Search Bar */}
            <div className="animate-fade-in-up delay-300 max-w-lg" style={{ animationFillMode: 'both' }}>
              <div className="flex bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20 focus-within:ring-2 focus-within:ring-primary/40">
                <div className="flex-grow flex items-center px-4">
                  <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm các khóa học AI & Tiếng Anh..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <Link
                  href={searchQuery ? `/courses?q=${encodeURIComponent(searchQuery)}` : '/courses'}
                  className="px-5 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  Tìm kiếm
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Stats list */}
            <div className="flex flex-wrap items-center gap-6 pt-2 animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
              {[
                { icon: <Users className="w-3.5 h-3.5" />, value: '15,000+', label: 'Học viên' },
                { icon: <Building2 className="w-3.5 h-3.5" />, value: '250+', label: 'Đối tác' },
                { icon: <ThumbsUp className="w-3.5 h-3.5" />, value: '98%', label: 'Hài lòng' },
                { icon: <Zap className="w-3.5 h-3.5" />, value: '24/7', label: 'AI Support' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-white group">
                  {i > 0 && <div className="w-px h-6 bg-white/10 mr-4 hidden sm:block" />}
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-white/15 transition-colors duration-200">
                    {stat.icon}
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-extrabold block leading-none">{stat.value}</span>
                    <p className="text-[9px] text-slate-400 font-bold tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: HTML/CSS Mockups (Change based on slide.theme) */}
          <div className="lg:col-span-5 hidden lg:block relative z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-3xl opacity-40 animate-pulse-glow" />
            
            <div key={`mockup-${currentSlide}`} className="relative glass-card-dark rounded-3xl p-5 border border-white/10 shadow-2xl animate-float-slow h-[340px] flex flex-col justify-between">
              
              {/* SLIDE 1 MOCKUP: AI Personalization student Dashboard */}
              {slide.theme === 'crm' && (
                <div className="h-full flex flex-col justify-between space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-blue-400">LT</div>
                      <div>
                        <h4 className="font-bold text-xs text-white">Lê Minh Trí</h4>
                        <span className="text-[9px] text-slate-400 block font-semibold">Lớp IELTS Master 7.5</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Live</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Phát âm (AI Voice)</span>
                      <span className="text-xl font-extrabold text-white mt-1 block">94%</span>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-blue-400 h-full rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Phản xạ hội thoại</span>
                      <span className="text-xl font-extrabold text-accent mt-1 block">82%</span>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-accent h-full rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Audio wave simulation */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3">
                    <Volume2 className="w-4 h-4 text-accent animate-pulse" />
                    <div className="flex-grow flex items-center justify-center gap-1.5 h-6">
                      {[12, 24, 18, 8, 30, 20, 16, 26, 10, 22, 14, 6].map((h, i) => (
                        <span 
                          key={i} 
                          className="w-1 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-300"
                          style={{ 
                            height: `${h}px`,
                            animation: `float-slow ${1 + (i % 3) * 0.5}s ease-in-out infinite alternate`
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">00:03</span>
                  </div>
                </div>
              )}

              {/* SLIDE 2 MOCKUP: AI Teacher Assistant soạn giáo án */}
              {slide.theme === 'teacher' && (
                <div className="h-full flex flex-col justify-between space-y-3 animate-fade-in font-mono text-[10px] text-slate-300">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 font-sans">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <h4 className="font-bold text-xs text-white">AI Co-Teacher Console</h4>
                    </div>
                    <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Generating...</span>
                  </div>

                  <div className="bg-slate-950/80 rounded-xl p-3 border border-white/5 flex-grow space-y-1.5 overflow-hidden">
                    <p className="text-slate-500">&gt; prompt: Soạn giáo án Lực Ma Sát lớp 8</p>
                    <p className="text-emerald-400 font-bold"># GIÁO ÁN: LỰC MA SÁT (VẬT LÝ 8)</p>
                    <p className="text-slate-400">// Khởi động:</p>
                    <p className="pl-3">- Thực nghiệm kéo khối gỗ trên 2 bề mặt khác nhau.</p>
                    <p className="text-slate-400">// Hoạt động chính:</p>
                    <p className="pl-3">- AI phân tích lực cản tác động chuyển động...</p>
                    <div className="inline-block w-1.5 h-3 bg-purple-400 animate-pulse ml-1" />
                  </div>

                  <div className="flex justify-between items-center font-sans text-[10px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5">
                    <span>File size: 14KB</span>
                    <span className="text-purple-400 font-bold">Tải về PDF/Word</span>
                  </div>
                </div>
              )}

              {/* SLIDE 3 MOCKUP: AI Admissions CRM Inbox & Scoring */}
              {slide.theme === 'learning' && (
                <div className="h-full flex flex-col justify-between space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4.5 h-4.5 text-accent" />
                      <h4 className="font-bold text-xs text-white">Admissions Inbox CRM</h4>
                    </div>
                    <span className="text-[9px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Stream</span>
                  </div>

                  <div className="space-y-2 flex-grow overflow-hidden text-[10px]">
                    {/* Message bubbles */}
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-[8px] flex items-center justify-center text-slate-300 font-bold flex-shrink-0">HV</div>
                      <p className="bg-white/5 border border-white/5 text-slate-300 p-2 rounded-xl rounded-tl-none leading-relaxed">
                        "Em muốn học khóa Tiếng Anh giao tiếp công việc, lộ trình thế nào ạ?"
                      </p>
                    </div>
                    <div className="flex items-start gap-2 justify-end">
                      <p className="bg-primary text-white p-2 rounded-xl rounded-tr-none leading-relaxed max-w-[85%]">
                        "Chào bạn! SeduAi có lộ trình Business English 12 tuần kết hợp luyện nói 24/7 cùng AI..."
                      </p>
                      <div className="w-5 h-5 rounded-full bg-accent text-[8px] flex items-center justify-center text-slate-950 font-bold flex-shrink-0"><Bot className="w-3 h-3" /></div>
                    </div>
                  </div>

                  {/* Lead analysis box */}
                  <div className="bg-slate-950/80 rounded-xl p-2.5 border border-white/5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">AI Lead Score</span>
                      <span className="font-black text-emerald-400">9.6 / 10 (Rất Tiềm Năng)</span>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-md text-[9px] text-emerald-400 font-bold">Chuyển Tư Vấn Viên</span>
                  </div>
                </div>
              )}

              {/* Mockup footer metadata */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Core Engine v3.2</span>
                <span className="font-bold flex items-center gap-1 text-slate-400"><BarChart3 className="w-3 h-3 text-primary" /> Active session: 104</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      >
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* YouTube-style Progress Dots Indicators at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentSlide(index); setProgress(0); }}
            className={`relative transition-all duration-400 rounded-full cursor-pointer overflow-hidden ${
              index === currentSlide ? 'w-10 h-2 bg-white/20' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
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
