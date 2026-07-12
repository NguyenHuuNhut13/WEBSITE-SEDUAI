export interface SyllabusChapter {
    title: string;
    lessons: string[];
}

export interface Review {
    name: string;
    date: string;
    rating: number;
    comment: string;
}

export interface Course {
    title: string;
    slug: string;
    category: string;
    rating: number;
    reviews_count: number;
    student_count: number;
    price: number;
    discount_price: number;
    duration: string;
    level: string;
    instructor: string;
    image: string;
    description: string;
    benefits: string[];
    syllabus: SyllabusChapter[];
    reviews: Review[];
    intro?: string;
}

export const courses: Course[] = [
    {
        title: 'Lập Trình Web Full-Stack với Laravel & React',
        slug: 'lap-trinh-web-fullstack-laravel-react',
        category: 'Lập trình',
        rating: 4.9,
        reviews_count: 186,
        student_count: 1450,
        price: 12000000,
        discount_price: 7500000,
        duration: '6 tháng (72 buổi)',
        level: 'Mọi trình độ (Từ cơ bản)',
        instructor: 'Thầy Quốc Bảo & AI Coding Assistant',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        description: 'Khóa học lập trình thực chiến giúp bạn làm chủ PHP Laravel (Backend) và ReactJS (Frontend) từ con số 0. Đặc biệt, bạn sẽ được hướng dẫn tích hợp AI (Copilot/ChatGPT API) vào dự án thực tế để tối ưu hóa code và tăng tốc độ phát triển dự án.',
        benefits: [
            'Làm chủ Laravel Framework và React 18 mới nhất.',
            'Xây dựng 3 dự án thực tế đưa vào CV xin việc.',
            'Học cách sử dụng AI viết code, sửa lỗi và tối ưu hiệu năng.',
            'Hỗ trợ sửa bài 1-1 từ Mentor kinh nghiệm.',
            'Nhận chứng chỉ tốt nghiệp từ SeduAi.'
        ],
        syllabus: [
            {
                title: 'Chương 1: Cơ bản về Web & Tư duy Lập trình',
                lessons: ['Bài 1: Tổng quan về Internet, HTML5, CSS3 và Javascript cơ bản', 'Bài 2: Làm việc với Git/GitHub và các công cụ lập trình', 'Bài 3: Tư duy thuật toán cơ bản và giải quyết bài toán thực tế']
            },
            {
                title: 'Chương 2: Làm chủ Backend với Laravel Framework',
                lessons: ['Bài 4: Khởi tạo Laravel & Cấu hình Routes, Controllers, Views', 'Bài 5: Cơ sở dữ liệu và Eloquent ORM (Migrations, Relationships)', 'Bài 6: Xây dựng RESTful API và xác thực Auth (Sanctum)']
            },
            {
                title: 'Chương 3: Frontend hiện đại với ReactJS',
                lessons: ['Bài 7: Làm quen với React (Components, Props, State, Hooks)', 'Bài 8: Quản lý State nâng cao và Kết nối API với Axios', 'Bài 9: Xây dựng giao diện Responsive với Tailwind CSS']
            },
            {
                title: 'Chương 4: Tích hợp AI & Deploy dự án',
                lessons: ['Bài 10: Tích hợp OpenAI API tạo trợ lý viết code', 'Bài 11: Đóng gói dự án (Docker) và triển khai lên VPS/Cloud (Deploy)', 'Bài 12: Đồ án tốt nghiệp cuối khóa']
            },
        ],
        reviews: [
            { name: 'Nguyễn Minh Tuấn', date: '2026-06-15', rating: 5, comment: 'Khóa học cực kỳ chất lượng. Thầy Bảo giảng rất dễ hiểu, đặc biệt phần tích hợp AI giúp mình tăng hiệu suất làm việc lên gấp đôi.' },
            { name: 'Trần Thị Mai', date: '2026-05-20', rating: 5, comment: 'Tài liệu chi tiết, các anh trợ giảng hỗ trợ nhiệt tình đêm muộn. Rất đáng tiền học.' },
        ]
    },
    {
        title: 'Tiếng Anh Giao Tiếp Quốc Tế - Chuẩn Đầu Ra B1/B2',
        slug: 'tieng-anh-giao-tiep-quoc-te',
        category: 'Tiếng Anh',
        rating: 4.8,
        reviews_count: 142,
        student_count: 2100,
        price: 6000000,
        discount_price: 3800000,
        duration: '3 tháng (36 buổi)',
        level: 'Cơ bản đến Trung cấp',
        instructor: 'Ms. Sarah Carter & Chatbot AI Luyện Nói 24/7',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        description: 'Luyện phát âm chuẩn Mỹ và phản xạ giao tiếp tự nhiên trong cuộc sống và công sở. Đặc biệt, học viên được cấp tài khoản Chatbot AI để luyện nói, sửa lỗi phát âm và ngữ pháp mọi lúc mọi nơi mà không ngại ngùng.',
        benefits: [
            'Luyện phát âm chuẩn IPA với giáo viên bản xứ.',
            'Mở rộng 1,000+ từ vựng giao tiếp thông dụng nhất.',
            'Luyện nói 1-1 hàng ngày cùng Chatbot AI độc quyền của SeduAi.',
            'Cam kết tự tin giao tiếp cơ bản sau khóa học.',
            'Hỗ trợ kiểm tra đầu ra miễn phí.'
        ],
        syllabus: [
            {
                title: 'Chương 1: Chuẩn hóa phát âm IPA (Phát âm chuẩn Mỹ)',
                lessons: ['Bài 1: Nguyên âm đơn và nguyên âm đôi trong IPA', 'Bài 2: Phụ âm và cách nối âm, nuốt âm tự nhiên', 'Bài 3: Ngữ điệu câu và cách nhấn trọng âm từ/câu']
            },
            {
                title: 'Chương 2: Giao tiếp Đời sống thường nhật',
                lessons: ['Bài 4: Chủ đề Giới thiệu bản thân, Gia đình & Sở thích', 'Bài 5: Hỏi đường, Mua sắm, Đi nhà hàng & Đặt phòng khách sạn', 'Bài 6: Xử lý các tình huống khẩn cấp khi đi du lịch nước ngoài']
            },
            {
                title: 'Chương 3: Tiếng Anh Công sở & Công việc',
                lessons: ['Bài 7: Viết Email chuyên nghiệp và trao đổi công việc qua điện thoại', 'Bài 8: Kỹ năng thuyết trình dự án bằng Tiếng Anh', 'Bài 9: Phỏng vấn xin việc và thương lượng lương bằng Tiếng Anh']
            },
        ],
        reviews: [
            { name: 'Lê Thảo Nguyên', date: '2026-06-28', rating: 5, comment: 'App nói chuyện với AI rất mượt, giúp mình sửa phát âm sai từ trước đến nay. Cô Sarah rất thân thiện.' },
            { name: 'Phạm Văn Hùng', date: '2026-06-10', rating: 4, comment: 'Khóa học bổ ích cho người đi làm bận rộn. Học online qua Zoom linh hoạt thời gian.' },
        ]
    },
    {
        title: 'Kỹ Năng Thuyết Trình & Làm Việc Nhóm Thế Hệ Mới',
        slug: 'ky-nang-thuyet-trinh-lam-viec-nhom',
        category: 'Kỹ năng',
        rating: 4.7,
        reviews_count: 98,
        student_count: 890,
        price: 4000000,
        discount_price: 2500000,
        duration: '1.5 tháng (18 buổi)',
        level: 'Mọi trình độ',
        instructor: 'Diễn giả Lê Vy & AI Slide Generator',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
        description: 'Vượt qua nỗi sợ nói trước đám đông, tổ chức cuộc họp hiệu quả và cộng tác nhóm mượt mà. Khóa học hướng dẫn bạn ứng dụng các công cụ Generative AI để lên ý tưởng, cấu trúc nội dung bài nói và thiết kế slide tự động đẹp mắt.',
        benefits: [
            'Kiểm soát tâm lý lo lắng và làm chủ ngôn ngữ cơ thể.',
            'Cấu trúc nội dung thuyết trình thu hút người nghe (kể chuyện - Storytelling).',
            'Sử dụng các công cụ AI (Gamma, MindShow) thiết kế slide trong 3 phút.',
            'Phương pháp làm việc nhóm Scrum/Agile đơn giản áp dụng ngay.',
            'Thực hành thuyết trình trực tiếp nhận phản hồi từ chuyên gia.'
        ],
        syllabus: [
            {
                title: 'Chương 1: Làm chủ Bản thân & Ngôn ngữ cơ thể',
                lessons: ['Bài 1: Vượt qua nỗi sợ sân khấu và chuẩn bị tâm lý vững vàng', 'Bài 2: Làm chủ giọng nói, tốc độ nói và hơi thở', 'Bài 3: Sử dụng cử chỉ tay, ánh mắt và biểu cảm khuôn mặt']
            },
            {
                title: 'Chương 2: Xây dựng Nội dung Thuyết trình Đỉnh cao',
                lessons: ['Bài 4: Thấu hiểu thính giả và xác định thông điệp cốt lõi', 'Bài 5: Áp dụng cấu trúc 3 phần và nghệ thuật kể chuyện Storytelling', 'Bài 6: Lên outline thần tốc bằng ChatGPT/Claude']
            },
            {
                title: 'Chương 3: Thiết kế Slide và Làm việc nhóm',
                lessons: ['Bài 7: Nguyên tắc thiết kế slide tinh giản, hiện đại', 'Bài 8: Thực hành tạo slide tự động bằng AI Tools', 'Bài 9: Quy trình làm việc nhóm hiệu quả, tránh xung đột']
            },
        ],
        reviews: [
            { name: 'Hoàng Anh Đức', date: '2026-06-05', rating: 5, comment: 'Khóa học giúp mình tự tin hơn hẳn khi báo cáo trước sếp. Kỹ thuật dùng AI tạo slide cực nhanh.' },
            { name: 'Đặng Hồng Nhung', date: '2026-05-18', rating: 4, comment: 'Nội dung thực tế, nhiều bài tập nhóm vui và bổ ích.' },
        ]
    },
    {
        title: 'Luyện Thi IELTS Học Thuật - Cam Kết Đầu Ra 6.5+',
        slug: 'luyen-thi-ielts-cam-ket-dau-ra',
        category: 'Tiếng Anh',
        rating: 4.9,
        reviews_count: 220,
        student_count: 1670,
        price: 15000000,
        discount_price: 9900000,
        duration: '5 tháng (60 buổi)',
        level: 'Yêu cầu đầu vào 4.5+',
        instructor: 'Thầy Minh Triết (8.5 IELTS) & AI Essay Grader',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
        description: 'Khóa học ôn luyện toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết định dạng IELTS Academic. Điểm đặc biệt của khóa học là hệ thống chấm bài Writing và sửa bài Speaking tự động bằng AI, giúp học viên phát hiện lỗi sai tức thì và được gợi ý từ vựng nâng band điểm.',
        benefits: [
            'Cam kết tăng ít nhất 1.5 - 2.0 band điểm sau lộ trình.',
            'Hệ thống AI chấm bài Writing không giới hạn số lần, chỉ ra lỗi ngữ pháp chi tiết.',
            'Luyện đề thi thực tế (Cam 15-20) trên phần mềm mô phỏng thi máy.',
            'Sửa bài nói 1-1 trực tiếp cùng cựu giám khảo IELTS.',
            'Cung cấp kho tài liệu VIP độc quyền.'
        ],
        syllabus: [
            {
                title: 'Chương 1: Kỹ năng Reading & Listening (Chiến thuật đạt 7.5+)',
                lessons: ['Bài 1: Xử lý các dạng bài khó trong Reading (Heading Matching, T/F/NG)', 'Bài 2: Kỹ năng nghe ghi chú (Section 1&2) và nghe bài hội thoại dài (Section 3&4)', 'Bài 3: Quản lý thời gian thi Reading và kỹ thuật Skimming/Scanning']
            },
            {
                title: 'Chương 2: Đột phá IELTS Writing Task 1 & Task 2',
                lessons: ['Bài 4: Phân tích biểu đồ Task 1 (Line, Bar, Pie, Table, Map, Process)', 'Bài 5: Cách viết bài luận Task 2 mạch lạc, lập luận logic và từ vựng học thuật', 'Bài 6: Thực hành viết bài và sử dụng AI sửa lỗi ngữ pháp, cải thiện cấu trúc câu']
            },
            {
                title: 'Chương 3: Chinh phục IELTS Speaking (Part 1, 2, 3)',
                lessons: ['Bài 7: Phản xạ nhanh Part 1 và phát triển ý tưởng nói Part 2', 'Bài 8: Tư duy phản biện và thảo luận chuyên sâu Part 3', 'Bài 9: Mock test 1-1 cùng giảng viên và AI chấm điểm phát âm']
            },
        ],
        reviews: [
            { name: 'Nguyễn Hải Đăng', date: '2026-06-25', rating: 5, comment: 'Mình thi đạt 7.0 IELTS nhờ khóa học này. Hệ thống chấm Writing AI rất sát với điểm thi thật.' },
            { name: 'Vũ Quỳnh Chi', date: '2026-06-12', rating: 5, comment: 'Phương pháp dạy của thầy Triết rất hay, giúp học viên hiểu bản chất chứ không học vẹt.' },
        ]
    },
    {
        title: 'Ứng Dụng AI Trong Công Việc & Quản Trị Doanh Nghiệp',
        slug: 'ung-dung-ai-trong-cong-viec-quan-tri',
        category: 'AI & Công nghệ',
        rating: 4.9,
        reviews_count: 312,
        student_count: 3500,
        price: 8000000,
        discount_price: 4900000,
        duration: '2 tháng (24 buổi)',
        level: 'Mọi trình độ (Cho người làm văn phòng & quản lý)',
        instructor: 'Dr. Albert Hoang & SeduAi Team',
        image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
        description: 'Khóa học tiên phong hướng dẫn ứng dụng các mô hình ngôn ngữ lớn (LLMs), AI sinh ảnh và AI tự động hóa vào công việc hàng ngày. Giúp nhân sự văn phòng, Marketer, Designer và nhà quản lý tiết kiệm 50% thời gian làm việc.',
        benefits: [
            'Làm chủ kỹ thuật viết câu lệnh (Prompt Engineering) nâng cao.',
            'Ứng dụng ChatGPT, Claude trong nghiên cứu thị trường, viết content, lập báo cáo.',
            'Sử dụng Midjourney, Stable Diffusion thiết kế hình ảnh truyền thông chuyên nghiệp.',
            'Xây dựng các quy trình làm việc tự động hóa (AI Automation Workflow) không cần code.',
            'Chiến lược tích hợp AI vào quy trình vận hành của doanh nghiệp nhỏ.'
        ],
        syllabus: [
            {
                title: 'Chương 1: Prompt Engineering cơ bản & nâng cao',
                lessons: ['Bài 1: Nguyên lý hoạt động của LLMs và cách viết prompt hiệu quả', 'Bài 2: Các kỹ thuật prompt nâng cao (Few-shot, Chain of Thought)', 'Bài 3: Thiết lập Custom GPTs và Trợ lý ảo cá nhân hóa']
            },
            {
                title: 'Chương 2: AI trong Sáng tạo Nội dung & Thiết kế',
                lessons: ['Bài 4: Lập kế hoạch content và viết bài tự động chuẩn SEO bằng AI', 'Bài 5: Tư duy sáng tạo hình ảnh và làm chủ công cụ Midjourney', 'Bài 6: Thiết kế video ngắn thuyết trình tự động bằng AI (D-ID, HeyGen)']
            },
            {
                title: 'Chương 3: Tự động hóa công việc (AI Automation)',
                lessons: ['Bài 7: Kết nối dữ liệu tự động với Zapier và Make.com', 'Bài 8: Tạo chatbot AI chăm sóc khách hàng tự động trên Fanpage', 'Bài 9: Quản lý dự án thông minh và tối ưu hóa vận hành bằng AI']
            },
        ],
        reviews: [
            { name: 'Lâm Vĩnh Hải', date: '2026-06-20', rating: 5, comment: 'Khóa học tuyệt vời! Mình đã tự xây được hệ thống chatbot trả lời khách hàng tự động tiết kiệm được bao nhiêu chi phí.' },
            { name: 'Lê Thị Thuỷ', date: '2026-06-01', rating: 5, comment: 'Nội dung rất cập nhật và thực tế. Giảng viên dạy nhiệt tình, có tâm.' },
        ]
    },
    {
        title: 'Lập Trình Python Cho Trẻ Em & Tư Duy Thuật Toán',
        slug: 'lap-trinh-python-cho-tre-em',
        category: 'Lập trình',
        rating: 4.8,
        reviews_count: 76,
        student_count: 540,
        price: 5000000,
        discount_price: 3200000,
        duration: '3 tháng (24 buổi)',
        level: 'Học sinh từ 9 - 15 tuổi',
        instructor: 'Cô Minh Anh & AI Tutor đáng yêu',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        description: 'Khóa học thiết kế riêng cho học sinh giúp phát triển tư duy logic và kỹ năng giải quyết vấn đề thông qua ngôn ngữ lập trình Python. Học viên được hỗ trợ học tập bởi Trợ lý học tập AI sinh động, giải đáp thắc mắc bằng ngôn ngữ dễ hiểu của trẻ nhỏ.',
        benefits: [
            'Phát triển tư duy logic, cấu trúc và tư duy thuật toán.',
            'Làm quen với cú pháp ngôn ngữ Python thông qua vẽ đồ họa rùa (Turtle).',
            'Tự xây dựng các trò chơi mini (Flappy Bird, Rắn săn mồi) bằng Pygame.',
            'Sự đồng hành của AI Tutor thông minh, giải đáp bài tập 24/7.',
            'Báo cáo tiến độ học tập hàng tuần gửi trực tiếp cho phụ huynh.'
        ],
        syllabus: [
            {
                title: 'Chương 1: Làm quen với tư duy lập trình',
                lessons: ['Bài 1: Lập trình là gì? Làm quen với môi trường Python', 'Bài 2: Biến số, các kiểu dữ liệu cơ bản và phép toán', 'Bài 3: Vẽ hình khối sáng tạo bằng thư viện Turtle']
            },
            {
                title: 'Chương 2: Cấu trúc điều khiển & Vòng lặp',
                lessons: ['Bài 4: Cấu trúc rẽ nhánh Điều kiện (If - Else)', 'Bài 5: Vòng lặp For, Vòng lặp While và ứng dụng', 'Bài 6: Xây dựng hàm số (Functions) và tái sử dụng code']
            },
            {
                title: 'Chương 3: Lập trình Game cơ bản với Pygame',
                lessons: ['Bài 7: Cấu trúc một trò chơi và xử lý sự kiện bàn phím/chuột', 'Bài 8: Tạo chuyển động và xử lý va chạm cho nhân vật game', 'Bài 9: Hoàn thiện game Rắn săn mồi, tính điểm và âm thanh']
            },
        ],
        reviews: [
            { name: 'Nguyễn Văn Đạt (Phụ huynh bé Huy)', date: '2026-06-22', rating: 5, comment: 'Bé nhà mình rất thích học khóa này. Tối nào cũng tự giác ngồi code vẽ hình rồi khoe với bố mẹ.' },
            { name: 'Phạm Hồng Hải', date: '2026-05-15', rating: 4, comment: 'Cô Minh Anh dạy rất nhẹ nhàng, trợ lý AI hỗ trợ giải thích bài tập dễ hiểu phù hợp trẻ em.' },
        ]
    }
];
