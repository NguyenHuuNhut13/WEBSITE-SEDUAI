export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
}

export const events: Event[] = [
  {
    title: 'Khai giảng khóa Lập trình Web Full-Stack K15',
    date: '2026-07-20',
    time: '09:00 - 11:00',
    location: 'Trụ sở SeduAi, Quận 10, TP.HCM',
    category: 'Khai giảng',
    description: 'Buổi khai giảng khóa Lập trình Web Full-Stack Laravel & React khóa 15 dành cho học viên đã đăng ký.',
  },
  {
    title: 'Workshop: Ứng dụng AI trong giảng dạy',
    date: '2026-07-25',
    time: '14:00 - 17:00',
    location: 'Online qua Zoom',
    category: 'Workshop',
    description: 'Workshop miễn phí hướng dẫn giáo viên cách sử dụng AI để soạn giáo án, tạo đề thi và viết nhận xét học sinh.',
  },
  {
    title: 'Thi thử IELTS Mock Test tháng 8',
    date: '2026-08-02',
    time: '08:00 - 12:00',
    location: 'Trụ sở SeduAi, Quận 10, TP.HCM',
    category: 'Thi thử',
    description: 'Buổi thi thử IELTS Academic chuẩn format với phòng thi mô phỏng và AI chấm bài Writing & Speaking.',
  },
  {
    title: 'Ngày hội tư vấn hướng nghiệp AI & Công nghệ',
    date: '2026-08-10',
    time: '09:00 - 16:00',
    location: 'Trụ sở SeduAi, Quận 10, TP.HCM',
    category: 'Sự kiện',
    description: 'Ngày hội tư vấn hướng nghiệp miễn phí dành cho học sinh THPT và sinh viên muốn tìm hiểu các ngành nghề AI, Data Science, Lập trình.',
  },
];
