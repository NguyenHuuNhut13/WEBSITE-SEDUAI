'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterItemProps {
  end: number;
  suffix: string;
  label: string;
  duration?: number;
}

function CounterItem({ end, suffix, label, duration = 2000 }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-center space-y-2">
      <h3 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
        {isVisible ? count.toLocaleString('vi-VN') : '0'}
        <span className="text-primary">{suffix}</span>
      </h3>
      <p className="text-slate-400 font-medium text-sm">{label}</p>
    </div>
  );
}

const counters = [
  { end: 15000, suffix: '+', label: 'Học viên theo học' },
  { end: 1200, suffix: '+', label: 'Trợ lý Giáo án AI đã tạo' },
  { end: 98, suffix: '%', label: 'Đánh giá hài lòng' },
  { end: 250, suffix: '+', label: 'Trung tâm & Đối tác' },
];

export default function CounterSection() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Con số <span className="gradient-text">nói lên tất cả</span>
          </h2>
          <p className="text-slate-400 mt-3 text-sm max-w-lg mx-auto">
            SeduAi không ngừng phát triển và đồng hành cùng hàng ngàn học viên trên khắp Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, index) => (
            <CounterItem key={index} {...counter} />
          ))}
        </div>
      </div>
    </section>
  );
}
