export interface Instructor {
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  bio: string;
}

export const instructors: Instructor[] = [
  {
    name: 'Thầy Quốc Bảo',
    title: 'Lead Instructor - Lập trình',
    specialty: 'Full-Stack Development, AI Integration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: '10+ năm kinh nghiệm phát triển web. Ex-Senior Developer tại các công ty công nghệ lớn. Chuyên gia tích hợp AI vào workflow phát triển phần mềm.',
  },
  {
    name: 'Ms. Sarah Carter',
    title: 'Senior Instructor - Tiếng Anh',
    specialty: 'Business English, IELTS Speaking',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Giáo viên bản xứ đến từ Mỹ. Chứng chỉ TESOL. 8 năm kinh nghiệm giảng dạy tiếng Anh tại Việt Nam. Chuyên gia luyện phát âm IPA.',
  },
  {
    name: 'Thầy Minh Triết',
    title: 'Head of IELTS Department',
    specialty: 'IELTS Academic, IELTS Writing',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    bio: 'IELTS 8.5 Overall. Cựu giám khảo IELTS. 12 năm kinh nghiệm luyện thi IELTS. Tỷ lệ học viên đạt 6.5+ trên 95%.',
  },
  {
    name: 'Dr. Albert Hoang',
    title: 'AI Research Lead',
    specialty: 'AI/ML, Prompt Engineering, Automation',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    bio: 'Tiến sĩ AI từ ĐH Bách Khoa. 7 năm R&D trong lĩnh vực Machine Learning. Founder SeduAi AI Lab. Speaker tại các hội nghị công nghệ quốc tế.',
  },
];
