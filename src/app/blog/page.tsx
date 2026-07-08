'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, Search, ChevronRight, Tag, BookOpen } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  category: 'AI & Giáo Dục' | 'Luyện thi IELTS' | 'Xu hướng Lập trình' | 'Mẹo học tập';
  date: string;
  author: string;
  excerpt: string;
  slug: string;
  imageBg: string;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = ['Tất cả', 'AI & Giáo Dục', 'Luyện thi IELTS', 'Xu hướng Lập trình', 'Mẹo học tập'];

  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'Cách Trí tuệ Nhân tạo (AI) đang định hình lại phương pháp soạn giáo án của giáo viên',
      category: 'AI & Giáo Dục',
      date: '05/07/2026',
      author: 'Lê Hoàng Nam',
      excerpt: 'Tìm hiểu cách các công cụ AI hỗ trợ giáo viên tự động hóa việc lên ý tưởng bài giảng, biên soạn tài liệu khảo thí và tạo phản hồi cá nhân hóa nhanh gấp 5 lần thông thường.',
      slug: 'ai-dinh-hinh-phuong-phap-soan-giao-an',
      imageBg: 'from-blue-500 to-indigo-600',
    },
    {
      id: 2,
      title: 'Lộ trình tự học tiếng Anh giao tiếp hiệu quả 24/7 cùng trợ lý AI Sedu Coach',
      category: 'Mẹo học tập',
      date: '02/07/2026',
      author: 'ThS. Trần Thị Hạnh',
      excerpt: 'Chia sẻ phương pháp đàm thoại hàng ngày, sửa phát âm theo thời gian thực và ghi nhớ từ vựng theo sơ đồ tư duy được tối ưu bởi AI dành riêng cho người bận rộn.',
      slug: 'tu-hoc-tieng-anh-giao-tiep-cung-ai',
      imageBg: 'from-emerald-500 to-teal-600',
    },
    {
      id: 3,
      title: '5 xu hướng công nghệ lập trình Web Full-Stack đáng chú ý nhất trong năm 2026',
      category: 'Xu hướng Lập trình',
      date: '28/06/2026',
      author: 'GS. Nguyễn Văn Sedu',
      excerpt: 'Điểm mặt những công nghệ hàng đầu như Next.js 16, Tailwind CSS v4, cơ sở dữ liệu phân tán và sự tích hợp không thể thiếu của các AI coding agents trong quy trình sản xuất phần mềm.',
      slug: 'xu-huong-cong-nghe-lap-trinh-web-2026',
      imageBg: 'from-purple-500 to-pink-600',
    },
    {
      id: 4,
      title: 'Chiến thuật chinh phục dạng bài Multiple Choice trong đề thi IELTS Listening',
      category: 'Luyện thi IELTS',
      date: '25/06/2026',
      author: 'Cô Nguyễn Mai Phương',
      excerpt: 'Bật mí mẹo tránh bẫy gây nhiễu, cách định vị thông tin đồng nghĩa (paraphrasing) cực nhanh và phương pháp rèn luyện phản xạ nghe ghi chú hiệu quả.',
      slug: 'chien-thuat-multiple-choice-ielts-listening',
      imageBg: 'from-amber-500 to-orange-600',
    },
    {
      id: 5,
      title: 'Tại sao Lập trình Python là xuất phát điểm hoàn hảo nhất dành cho học sinh cấp 2',
      category: 'Xu hướng Lập trình',
      date: '20/06/2026',
      author: 'Lê Hoàng Nam',
      excerpt: 'Phân tích cú pháp đơn giản, trực quan của Python giúp kích thích tư duy logic, rèn luyện kỹ năng giải quyết vấn đề và tạo bước đệm vững chắc trước khi tiếp cận AI.',
      slug: 'python-perfect-start-for-students',
      imageBg: 'from-cyan-500 to-blue-600',
    },
  ];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentPosts = posts.slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Title Hero Banner */}
      <div className="bg-primary py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/70 block">Góc chia sẻ kiến thức</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            TIN TỨC & BÀI VIẾT
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            Cập nhật xu hướng công nghệ, mẹo tự học tiếng Anh và các thông tin định hướng giáo dục cùng chuyên gia SeduAi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Area: Blog Posts */}
          <div className="lg:col-span-8 space-y-8">
            {filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md shadow-slate-100 flex flex-col md:flex-row hover:shadow-lg transition duration-200 group"
                  >
                    {/* Fake post image banner on left */}
                    <div className={`md:w-64 bg-gradient-to-tr ${post.imageBg} text-white p-6 flex flex-col justify-between flex-shrink-0 relative overflow-hidden min-h-[200px]`}>
                      <span className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider self-start">
                        {post.category}
                      </span>
                      <div className="text-[10px] text-white/80 font-bold uppercase tracking-widest">
                        SeduAi Press
                      </div>
                    </div>

                    {/* Content on right */}
                    <div className="p-6 flex flex-col justify-between space-y-4 flex-grow">
                      <div className="space-y-2">
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-primary" /> {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-primary" /> {post.author}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-primary transition duration-150">
                          <Link href={`/blog#`}>{post.title}</Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Readmore CTA */}
                      <Link
                        href={`/blog#`}
                        className="text-xs text-primary font-bold flex items-center gap-1 hover:text-primary-dark transition self-start"
                      >
                        Đọc chi tiết bài viết <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl py-20 border border-slate-100 text-center space-y-3 shadow-md">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">Không tìm thấy bài viết nào</h3>
                <p className="text-slate-400 text-sm">Vui lòng thử từ khóa tìm kiếm hoặc chuyên mục khác.</p>
              </div>
            )}
          </div>

          {/* Right Area: Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Widget 1: Search */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
                Tìm kiếm bài viết
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Widget 2: Categories */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
                Chuyên mục bài viết
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition ${
                      selectedCategory === cat
                        ? 'bg-primary-light text-primary'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 3: Recent Posts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
                Bài viết mới nhất
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex gap-3 items-center group">
                    {/* Miniature Colored square icon representing post */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${post.imageBg} text-white flex items-center justify-center flex-shrink-0 text-xs font-bold`}>
                      <Tag className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold block">{post.date}</span>
                      <Link
                        href={`/blog#`}
                        className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
