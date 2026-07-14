import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover-lift-glow glow-border flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Decorative Quote icon */}
      <div className="absolute top-4 right-5 text-primary/5 pointer-events-none select-none">
        <Quote className="w-12 h-12" strokeWidth={1.5} />
      </div>

      <div className="space-y-4">
        {/* Rating Stars */}
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < testimonial.rating
                  ? 'fill-amber-400 stroke-amber-400 animate-pulse'
                  : 'fill-slate-200 stroke-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Testimonial Comment */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic relative z-10">
          &ldquo;{testimonial.comment}&rdquo;
        </p>
      </div>

      {/* Author profile and Course Badge */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-bold text-slate-900 text-xs truncate">{testimonial.name}</h4>
          <span className="text-[10px] text-slate-400 font-semibold block truncate">{testimonial.role}</span>
        </div>
        <span className="text-[9px] font-extrabold text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/10 truncate max-w-[80px]">
          {testimonial.course}
        </span>
      </div>
    </div>
  );
}
