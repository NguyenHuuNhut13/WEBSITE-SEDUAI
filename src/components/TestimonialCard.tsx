import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm card-hover-lift flex flex-col h-full relative">
      {/* Quote Icon */}
      <div className="absolute top-5 right-5 text-primary/10">
        <Quote className="w-10 h-10" />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? 'fill-amber-400 stroke-amber-400'
                : 'fill-slate-200 stroke-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-sm text-slate-600 leading-relaxed flex-grow italic">
        &quot;{testimonial.comment}&quot;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-primary/20"
          loading="eager"
          decoding="async"
        />
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
          <p className="text-[11px] text-slate-400">{testimonial.role}</p>
        </div>
      </div>

      {/* Course tag */}
      <div className="mt-3">
        <span className="text-[10px] font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-full">
          {testimonial.course}
        </span>
      </div>
    </div>
  );
}
