'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, Lightbulb, BookOpen, Building2 } from 'lucide-react';
import { getEduCourses } from '@/services/api';

interface CounterItemProps {
  end: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  duration?: number;
  delay?: number;
}

function CounterItem({ end, suffix, label, icon, duration = 2000, delay = 0 }: CounterItemProps) {
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

    const timer = setTimeout(() => {
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
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, end, duration, delay]);

  return (
    <div
      ref={ref}
      className="scroll-reveal glass-card-dark rounded-2xl p-6 text-center space-y-3 hover-lift-glow group"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className="w-12 h-12 mx-auto rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>

      {/* Counter */}
      <h3 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
        {isVisible ? count.toLocaleString('vi-VN') : '0'}
        <span className="text-accent">{suffix}</span>
      </h3>
      <p className="text-slate-400 font-medium text-sm">{label}</p>

      {/* Decorative bottom bar */}
      <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full opacity-60 group-hover:w-16 transition-all duration-500" />
    </div>
  );
}

export default function CounterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stats, setStats] = useState({
    students: 15000,
    courses: 15,
    lessons: 495,
    classes: 250,
  });

  useEffect(() => {
    // 1. Fetch CRM courses list
    getEduCourses().then((list) => {
      if (list && list.length > 0) {
        let totalLessons = 0;
        list.forEach((course) => {
          const lCount = parseInt(course.acf?.lession as string) || 0;
          totalLessons += lCount;
        });
        setStats((prev) => ({
          ...prev,
          courses: list.length,
          lessons: totalLessons || (list.length * 33),
        }));
      }
    });

    // 2. Fetch DB stats from local API
    fetch('/api/stats')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const { totalStudents, totalClasses } = json.data;
          setStats((prev) => ({
            ...prev,
            students: 14950 + (totalStudents || 0),
            classes: 245 + (totalClasses || 0),
          }));
        }
      })
      .catch((err) => console.error('Error fetching database stats:', err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = entry.target.querySelectorAll('.scroll-reveal');
            reveals.forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const counters = [
    { end: stats.students, suffix: '+', label: 'Học viên tin dùng', icon: <Users className="w-6 h-6" /> },
    { end: stats.courses, suffix: '+', label: 'Khóa học CRM API', icon: <Lightbulb className="w-6 h-6" /> },
    { end: stats.lessons, suffix: '+', label: 'Bài giảng chuyên sâu', icon: <BookOpen className="w-6 h-6" /> },
    { end: stats.classes, suffix: '+', label: 'Trung tâm & Đối tác', icon: <Building2 className="w-6 h-6" /> },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Top gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14 scroll-reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Thống kê nổi bật
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Con số <span className="gradient-text">nói lên tất cả</span>
          </h2>
          <p className="text-slate-400 mt-3 text-sm max-w-lg mx-auto">
            SeduAi không ngừng phát triển và đồng hành cùng hàng ngàn học viên trên khắp Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {counters.map((counter, index) => (
            <CounterItem key={index} {...counter} delay={index * 100} />
          ))}
        </div>
      </div>

      {/* Bottom gradient separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
