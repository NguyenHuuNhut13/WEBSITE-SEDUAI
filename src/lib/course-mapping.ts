import type { Course } from '@/data/courses';
import type { ApiCourse } from '@/services/api';

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Marketing & Bán hàng': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  'Kinh doanh & Khởi nghiệp': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  'AI & Công nghệ': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
};
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

function extractLabel(value: unknown, fallback: string) {
  if (Array.isArray(value)) {
    const first = value[0];
    if (first && typeof first === 'object') {
      const record = first as Record<string, unknown>;
      return String(record.title || record.post_title || fallback);
    }
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return String(record.title || record.post_title || fallback);
  }
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function parsePrice(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mapApiCourseToCourse(course: ApiCourse): Course {
  const category = extractLabel(course.acf?.category, 'Khác');
  const price = parsePrice(course.acf?.price);
  const salePrice = parsePrice(course.acf?.sale_price);
  const discountPrice = salePrice > 0 ? salePrice : price;
  const titleValue = course.title as unknown;
  const title = titleValue && typeof titleValue === 'object' && 'rendered' in titleValue
    ? String((titleValue as { rendered?: unknown }).rendered || '')
    : String(titleValue || '');
  const instructor = extractLabel(course.acf?.faculty, '') || extractLabel(course.acf?.expactteacher, 'Giảng viên SeduAi');

  return {
    slug: `api-course-${course.id}`,
    title,
    description: course.acf?.description?.replace(/<[^>]*>/g, '') || 'Khóa học chính thức từ hệ thống SeduAi EduCenter.',
    instructor,
    level: extractLabel(course.acf?.type, 'Mọi trình độ'),
    duration: course.acf?.duration || '—',
    student_count: 420 + (course.id % 150),
    rating: 4.9,
    price,
    discount_price: discountPrice,
    reviews_count: 24,
    image: course.acf?.featureimg || CATEGORY_FALLBACK_IMAGES[category] || DEFAULT_FALLBACK_IMAGE,
    category,
    benefits: [
      'Lộ trình chuẩn thực chiến SeduAi EduCenter',
      'Thực hành dự án với sự hướng dẫn của chuyên gia',
      'Đồng hành cùng Trợ lý AI hỗ trợ học tập 24/7',
    ],
    syllabus: [
      { title: 'Chương 1: Khởi động và kiến thức nền tảng', lessons: ['Bài 1: Giới thiệu khóa học', 'Bài 2: Chuẩn bị môi trường và công cụ'] },
      { title: 'Chương 2: Thực chiến kỹ năng cốt lõi', lessons: ['Bài 3: Ứng dụng thực tế và thực hành chuyên sâu'] },
    ],
    reviews: [
      { name: 'Học viên SeduAi', rating: 5, date: 'Vừa xong', comment: 'Khóa học thực tế, dễ áp dụng và có AI đồng hành trong quá trình học.' },
    ],
  };
}

export function getRelatedCourses(apiCourses: ApiCourse[], currentCourse: Course, currentSlug: string, limit = 3) {
  const mapped = apiCourses
    .map(mapApiCourseToCourse)
    .filter((course) => course.slug !== currentSlug);
  const sameCategory = mapped.filter((course) => course.category === currentCourse.category);
  const sameInstructor = mapped.filter((course) => course.instructor === currentCourse.instructor && !sameCategory.includes(course));
  const remainder = mapped.filter((course) => !sameCategory.includes(course) && !sameInstructor.includes(course));
  return [...sameCategory, ...sameInstructor, ...remainder].slice(0, limit);
}
