import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover-lift-glow glow-border flex flex-col h-full relative">
      {/* Giant decorative Quote */}
      <div className="absolute top-4 right-5 text-primary/6 pointer-events-none select-none">
        <Quote className="w-16 h-16" strokeWidth={1.5} />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 transition-transform duration-200 hover:scale-125 ${
              i < testimonial.rating
                ? 'fill-amber-400 stroke-amber-400'
                : 'fill-slate-200 stroke-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Comment — Chat bubble style */}
      <div className="relative bg-slate-50 rounded-xl rounded-tl-none p-4 mb-5 flex-grow border border-slate-100">
        {/* Bubble tail */}
        <div className="absolute -top-2 left-5 w-4 h-4 bg-slate-50 border-l border-t border-slate-100 rotate-45" />
        <p className="text-sm text-slate-600 leading-relaxed italic relative z-10">
          &ldquo;{testimonial.comment}&rdquo;
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300"
            loading="eager"
            decoding="async"
          />
          {/* Shimmer overlay on avatar */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
          <p className="text-[11px] text-slate-400">{testimonial.role}</p>
        </div>
        {/* Course tag */}
        <span className="text-[10px] font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-full border border-primary/10 shrink-0 max-w-[100px] truncate">
          {testimonial.course}
        </span>
      </div>
    </div>
  );
}
