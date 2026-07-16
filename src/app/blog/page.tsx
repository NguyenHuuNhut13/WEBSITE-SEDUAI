'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, Search, ChevronRight, Tag, BookOpen, ArrowRight, TrendingUp, Grid } from 'lucide-react';

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

const categoryColors: Record<string, string> = {
  'AI & Giáo Dục': 'bg-blue-50 text-blue-700 border-blue-200',
  'Luyện thi IELTS': 'bg-amber-50 text-amber-700 border-amber-200',
  'Xu hướng Lập trình': 'bg-purple-50 text-purple-700 border-purple-200',
  'Mẹo học tập': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Tất cả': 'bg-slate-100 text-slate-600 border-slate-200',
};

const categoryBadgeGlow: Record<string, string> = {
  'AI & Giáo Dục': 'group-hover:border-blue-500/30 group-hover:shadow-[0_0_15px_rgba(0,119,187,0.06)]',
  'Luyện thi IELTS': 'group-hover:border-amber-500/30 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.06)]',
  'Xu hướng Lập trình': 'group-hover:border-purple-500/30 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.06)]',
  'Mẹo học tập': 'group-hover:border-emerald-500/30 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.06)]',
};

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
      imageBg: 'from-blue-500 to-indigo-650',
    },
    {
      id: 2,
      title: 'Lộ trình tự học tiếng Anh giao tiếp hiệu quả 24/7 cùng trợ lý AI Sedu Coach',
      category: 'Mẹo học tập',
      date: '02/07/2026',
      author: 'ThS. Trần Thị Hạnh',
      excerpt: 'Chia sẻ phương pháp đàm thoại hàng ngày, sửa phát âm theo thời gian thực và ghi nhớ từ vựng theo sơ đồ tư duy được tối ưu bởi AI dành riêng cho người bận rộn.',
      slug: 'tu-hoc-tieng-anh-giao-tiep-cung-ai',
      imageBg: 'from-emerald-550 to-teal-650',
    },
    {
      id: 3,
      title: '5 xu hướng công nghệ lập trình Web Full-Stack đáng chú ý nhất trong năm 2026',
      category: 'Xu hướng Lập trình',
      date: '28/06/2026',
      author: 'GS. Nguyễn Văn Sedu',
      excerpt: 'Điểm mặt những công nghệ hàng đầu như Next.js 16, Tailwind CSS v4, cơ sở dữ liệu phân tán và sự tích hợp không thể thiếu của các AI coding agents trong quy trình sản xuất phần mềm.',
      slug: 'xu-huong-cong-nghe-lap-trinh-web-2026',
      imageBg: 'from-purple-550 to-pink-650',
    },
    {
      id: 4,
      title: 'Chiến thuật chinh phục dạng bài Multiple Choice trong đề thi IELTS Listening',
      category: 'Luyện thi IELTS',
      date: '25/06/2026',
      author: 'Cô Nguyễn Mai Phương',
      excerpt: 'Bật mí mẹo tránh bẫy gây nhiễu, cách định vị thông tin đồng nghĩa (paraphrasing) cực nhanh và phương pháp rèn luyện phản xạ nghe ghi chú hiệu quả.',
      slug: 'chien-thuat-multiple-choice-ielts-listening',
      imageBg: 'from-amber-550 to-orange-650',
    },
    {
      id: 5,
      title: 'Tại sao Lập trình Python là xuất phát điểm hoàn hảo nhất dành cho học sinh cấp 2',
      category: 'Xu hướng Lập trình',
      date: '20/06/2026',
      author: 'Lê Hoàng Nam',
      excerpt: 'Phân tích cú pháp đơn giản, trực quan của Python giúp kích thích tư duy logic, rèn luyện kỹ năng giải quyết vấn đề và tạo bước đệm vững chắc trước khi tiếp cận AI.',
      slug: 'python-perfect-start-for-students',
      imageBg: 'from-cyan-550 to-blue-650',
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentPosts = posts.slice(0, 3);
  const featuredPost = filteredPosts[0];
  const listPosts = filteredPosts.slice(1);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-24 selection:bg-primary selection:text-white">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '5s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-white px-3.5 py-1.5 rounded-full inline-block">
            Góc chia sẻ tri thức AI & Giáo dục
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            TIN TỨC & <span className="gradient-text">BÀI VIẾT</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Cập nhật xu hướng công nghệ, cẩm nang lập trình và chiến thuật học tiếng Anh được tối ưu hóa với các giải pháp giáo dục AI tại SeduAi.
          </p>

          <nav className="flex justify-center text-xs font-semibold text-slate-400 gap-2 pt-2">
            <Link href="/" className="hover:text-primary transition">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-white">Tin tức</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <div className="lg:col-span-8 space-y-8">
            {filteredPosts.length > 0 ? (
              <>
                {featuredPost && (
                  <article className={`bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md transition-all duration-500 group ${categoryBadgeGlow[featuredPost.category]}`}>
                    <div className={`bg-gradient-to-tr ${featuredPost.imageBg} text-white p-8 h-56 flex flex-col justify-between relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.03)_50%,transparent_55%)] bg-[size:8px_8px] pointer-events-none" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${categoryColors[featuredPost.category]} bg-white/10 backdrop-blur-md`}>
                          {featuredPost.category}
                        </span>
                        <span className="bg-rose-600 text-white rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          Nổi bật
                        </span>
                      </div>
                      <div className="text-[9px] text-white/60 font-bold uppercase tracking-widest relative z-10">
                        SeduAi Press
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8 space-y-4">
                      <div className="flex items-center gap-4 text-slate-500 text-[11px] font-bold">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" /> {featuredPost.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary" /> {featuredPost.author}
                        </span>
                      </div>
                      
                      <h2 className="font-black text-slate-900 text-xl sm:text-2xl leading-snug group-hover:text-primary transition duration-300">
                        <Link href="/blog#">{featuredPost.title}</Link>
                      </h2>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="pt-2">
                        <Link
                          href="/blog#"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-black uppercase tracking-wider transition duration-300"
                        >
                          Đọc chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                <div className="space-y-6">
                  {listPosts.map((post) => (
                    <article
                      key={post.id}
                      className={`bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-lg transition-all duration-500 flex flex-col md:flex-row group ${categoryBadgeGlow[post.category]}`}
                    >
                      <div className={`md:w-56 bg-gradient-to-tr ${post.imageBg} text-white p-6 flex flex-col justify-between flex-shrink-0 relative overflow-hidden min-h-[160px]`}>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.03)_50%,transparent_55%)] bg-[size:8px_8px] pointer-events-none" />
                        <span className={`self-start px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${categoryColors[post.category]} bg-white/10 backdrop-blur-md`}>
                          {post.category}
                        </span>
                        <div className="text-[9px] text-white/60 font-bold uppercase tracking-widest">
                          SeduAi Press
                        </div>
                      </div>

                      <div className="p-6 flex flex-col justify-between space-y-4 flex-grow">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-primary" /> {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-primary" /> {post.author}
                            </span>
                          </div>
                          
                          <h2 className="font-black text-slate-900 text-base leading-snug group-hover:text-primary transition duration-300">
                            <Link href="/blog#">{post.title}</Link>
                          </h2>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        
                        <Link
                          href="/blog#"
                          className="text-xs text-primary font-black uppercase tracking-wider flex items-center gap-1.5 self-start transition duration-300"
                        >
                          Đọc tiếp <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl py-20 border border-slate-200 text-center space-y-4 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">Không tìm thấy bài viết nào</h3>
                  <p className="text-slate-500 text-xs">Vui lòng thử từ khóa tìm kiếm hoặc chuyên mục khác.</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6 relative z-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm pb-3 border-b border-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Grid className="w-4 h-4 text-primary" /> Tìm kiếm bài viết
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="w-full border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm pb-3 border-b border-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Chuyên mục
              </h3>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-300 group cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-primary/5 text-primary border border-primary/20'
                        : 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-primary hover:translate-x-1'
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${selectedCategory === cat ? 'translate-x-0.5' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-sm pb-3 border-b border-slate-100 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Bài viết mới nhất
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex gap-3.5 items-center group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${post.imageBg} text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <Tag className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[9px] text-slate-400 font-bold block">{post.date}</span>
                      <Link
                        href="/blog#"
                        className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200"
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
