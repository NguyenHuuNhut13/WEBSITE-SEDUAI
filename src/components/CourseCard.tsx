import Link from 'next/link';
import { Star, Clock, GraduationCap, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const discountPercent = course.price > course.discount_price
    ? Math.round(((course.price - course.discount_price) / course.price) * 100)
    : 0;

  const isBestseller = (course.student_count ?? 0) > 500;
  const isNew = discountPercent === 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col group h-full card-hover-lift card-shine glow-border">
      {/* Course Image */}
      <div className="relative overflow-hidden aspect-video bg-slate-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="eager"
          decoding="async"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
          <span className="text-white font-bold text-sm flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
            <Sparkles className="w-4 h-4 text-accent" />
            Khám phá khóa học
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-white font-bold text-[10px] tracking-wider uppercase shadow-md">
          {course.category}
        </span>

        {/* Dynamic badge: Bestseller / Discount */}
        {isBestseller && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-md">
            <Flame className="w-3 h-3" />
            Bán chạy
          </span>
        )}
        {!isBestseller && discountPercent > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-rose-500 text-white font-extrabold text-[10px] shadow-md">
            -{discountPercent}%
          </span>
        )}
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
          <h3 className="font-bold text-slate-950 text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition duration-200">
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
            {discountPercent > 0 && (
              <span className="text-xs text-slate-400 line-through block leading-none">
                {course.price.toLocaleString('vi-VN')} đ
              </span>
            )}
            <span className="font-extrabold text-primary text-lg leading-tight">
              {course.discount_price.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="px-4 py-2.5 bg-primary/10 text-primary group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-600 group-hover:text-white font-bold text-xs rounded-xl transition-all duration-400 flex items-center gap-1.5 shadow-sm group-hover:shadow-primary/25 group-hover:shadow-md"
          >
            Chi tiết <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
