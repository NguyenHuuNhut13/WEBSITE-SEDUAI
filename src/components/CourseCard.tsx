import Link from 'next/link';
import { Star, Clock, GraduationCap, ArrowRight } from 'lucide-react';
import { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const discountPercent = Math.round(
    ((course.price - course.discount_price) / course.price) * 100
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col group h-full card-hover-lift">
      {/* Course Image */}
      <div className="relative overflow-hidden aspect-video bg-slate-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="eager"
          decoding="async"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-white font-bold text-[10px] tracking-wider uppercase shadow-md">
          {course.category}
        </span>
        {/* Discount badge */}
        <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-rose-500 text-white font-extrabold text-[10px]">
          -{discountPercent}%
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Instructor & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[60%]">
              {course.instructor.split(' & ')[0]}
            </span>
            <span className="font-bold text-amber-500 flex items-center gap-0.5 text-xs">
              {course.rating}
              <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
              <span className="text-slate-400 font-normal ml-0.5">({course.reviews_count})</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-950 text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition duration-150">
            <Link href={`/courses/${course.slug}`} prefetch={false}>{course.title}</Link>
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> {course.student_count} học viên
            </span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 line-through block leading-none">
              {course.price.toLocaleString('vi-VN')} đ
            </span>
            <span className="font-extrabold text-primary text-lg leading-tight">
              {course.discount_price.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="px-4 py-2.5 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white font-bold text-xs rounded-xl transition-all duration-300 flex items-center gap-1.5"
          >
            Chi tiết <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
