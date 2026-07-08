import Link from 'next/link';
import { Star, Clock, GraduationCap } from 'lucide-react';
import { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col group h-full">
      {/* Course Image */}
      <div className="relative overflow-hidden aspect-video bg-slate-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white font-semibold text-[10px] tracking-wider uppercase">
          {course.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Ratings & Stars */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-amber-500 flex items-center gap-0.5">
              {course.rating}
              <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
            </span>
            <span>({course.reviews_count} đánh giá)</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-950 text-base leading-snug line-clamp-2 group-hover:text-primary transition duration-150">
            <Link href={`/courses/${course.slug}`}>{course.title}</Link>
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
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
            <span className="text-xs text-slate-400 line-through block">
              {course.price.toLocaleString('vi-VN')} đ
            </span>
            <span className="font-extrabold text-primary text-base">
              {course.discount_price.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="px-4 py-2 bg-slate-900 group-hover:bg-primary text-white font-bold text-xs rounded-xl transition duration-200"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
