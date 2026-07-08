export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  course: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Nguyễn Hải Đăng',
    role: 'Sinh viên Đại học Bách Khoa',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Mình thi đạt 7.0 IELTS nhờ khóa học tại SeduAi. Hệ thống chấm Writing bằng AI rất sát với điểm thi thật, giúp mình cải thiện từng ngày mà không cần chờ giáo viên chấm.',
    course: 'Luyện Thi IELTS 6.5+',
  },
  {
    name: 'Lâm Vĩnh Hải',
    role: 'Marketing Manager tại TechCorp',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Khóa học Ứng dụng AI tuyệt vời! Mình đã tự xây được hệ thống chatbot trả lời khách hàng tự động, tiết kiệm 60% chi phí nhân sự chăm sóc khách hàng cho công ty.',
    course: 'Ứng Dụng AI Trong Công Việc',
  },
  {
    name: 'Trần Thị Mai',
    role: 'Freelance Web Developer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Tài liệu chi tiết, mentor hỗ trợ nhiệt tình đến đêm muộn. Sau khóa học Full-Stack, mình đã nhận được 3 dự án freelance đầu tiên với mức thu nhập rất ổn.',
    course: 'Lập Trình Web Full-Stack',
  },
  {
    name: 'Nguyễn Văn Đạt',
    role: 'Phụ huynh bé Huy (11 tuổi)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Bé nhà mình rất thích học khóa Python. Tối nào cũng tự giác ngồi code vẽ hình rồi khoe với bố mẹ. Trợ lý AI giải thích bài dễ hiểu, phù hợp với trẻ em.',
    course: 'Lập Trình Python Cho Trẻ Em',
  },
];
