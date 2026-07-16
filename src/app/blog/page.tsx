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
  'AI & Giáo Dục': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Luyện thi IELTS': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Xu hướng Lập trình': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Mẹo học tập': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Tất cả': 'bg-slate-800/30 text-slate-400 border-slate-800',
};

const categoryBadgeGlow: Record<string, string> = {
  'AI & Giáo Dục': 'group-hover:border-blue-500/30 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]',
  'Luyện thi IELTS': 'group-hover:border-amber-500/30 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]',
  'Xu hướng Lập trình': 'group-hover:border-purple-500/30 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]',
  'Mẹo học tập': 'group-hover:border-emerald-500/30 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]',
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
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-24 selection:bg-primary selection:text-white">
      {/* Sleek Dark Tech Header Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-center relative overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-5">
          <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full inline-block">
            Góc chia sẻ tri thức AI & Giáo dục
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
            TIN TỨC & <span className="gradient-text">BÀI VIẾT</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Cập nhật xu hướng công nghệ, cẩm nang lập trình và chiến thuật học tiếng Anh được tối ưu hóa với các giải pháp giáo dục AI tại SeduAi.
          </p>

          {/* Elegant inline filter buttons in Hero */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-950 border-white shadow-lg scale-105'
                    : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Left Column: Blog Posts list */}
          <div className="lg:col-span-8 space-y-8">
            {filteredPosts.length > 0 ? (
              <>
                {/* Featured Post Card */}
                {featuredPost && (
                  <article className={`bg-slate-900/30 rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl transition-all duration-500 group ${categoryBadgeGlow[featuredPost.category]}`}>
                    <div className={`bg-gradient-to-tr ${featuredPost.imageBg} text-white p-8 h-56 flex flex-col justify-between relative overflow-hidden`}>
                      {/* Technical mesh background overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.03)_50%,transparent_55%)] bg-[size:8px_8px] pointer-events-none" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${categoryColors[featuredPost.category]} bg-slate-950/40 backdrop-blur-md`}>
                          {featuredPost.category}
                        </span>
                        <span className="bg-rose-500 text-white rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          Nổi bật
                        </span>
                      </div>
                      <div className="text-[9px] text-white/50 font-bold uppercase tracking-widest relative z-10">
                        SeduAi Press
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8 space-y-4">
                      <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" /> {featuredPost.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary" /> {featuredPost.author}
                        </span>
                      </div>
                      
                      <h2 className="font-black text-white text-xl sm:text-2xl leading-snug group-hover:text-primary transition duration-300">
                        <Link href="/blog#">{featuredPost.title}</Link>
                      </h2>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="pt-2">
                        <Link
                          href="/blog#"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-black uppercase tracking-wider group-hover:text-white transition duration-300"
                        >
                          Đọc chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                {/* Sub Post Cards */}
                <div className="space-y-6">
                  {listPosts.map((post) => (
                    <article
                      key={post.id}
                      className={`bg-slate-900/30 rounded-3xl overflow-hidden border border-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row group ${categoryBadgeGlow[post.category]}`}
                    >
                      <div className={`md:w-56 bg-gradient-to-tr ${post.imageBg} text-white p-6 flex flex-col justify-between flex-shrink-0 relative overflow-hidden min-h-[160px]`}>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.03)_50%,transparent_55%)] bg-[size:8px_8px] pointer-events-none" />
                        <span className={`self-start px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${categoryColors[post.category]} bg-slate-950/40 backdrop-blur-md`}>
                          {post.category}
                        </span>
                        <div className="text-[9px] text-white/50 font-bold uppercase tracking-widest">
                          SeduAi Press
                        </div>
                      </div>

                      <div className="p-6 flex flex-col justify-between space-y-4 flex-grow">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-primary" /> {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-primary" /> {post.author}
                            </span>
                          </div>
                          
                          <h2 className="font-black text-white text-base leading-snug group-hover:text-primary transition duration-300">
                            <Link href="/blog#">{post.title}</Link>
                          </h2>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        
                        <Link
                          href="/blog#"
                          className="text-xs text-primary font-black uppercase tracking-wider flex items-center gap-1.5 self-start group-hover:text-white transition duration-300"
                        >
                          Đọc tiếp <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-slate-900/30 rounded-3xl py-20 border border-slate-800 text-center space-y-4 shadow-xl">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-300">Không tìm thấy bài viết nào</h3>
                  <p className="text-slate-500 text-xs">Vui lòng thử từ khóa tìm kiếm hoặc chuyên mục khác.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Glassmorphism Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-6 relative z-10">
            {/* Widget: Search */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
              <h3 className="font-black text-white text-sm pb-3 border-b border-slate-800/80 uppercase tracking-wider flex items-center gap-2">
                <Grid className="w-4 h-4 text-primary" /> Tìm kiếm bài viết
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                />
                <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Widget: Categories list */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
              <h3 className="font-black text-white text-sm pb-3 border-b border-slate-800/80 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Chuyên mục
              </h3>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-300 group cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-primary-light/10 text-primary border border-primary/20'
                        : 'text-slate-400 border border-transparent hover:bg-slate-800/30 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${selectedCategory === cat ? 'translate-x-0.5' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Widget: Recent Posts with dynamic thumbnails */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
              <h3 className="font-black text-white text-sm pb-3 border-b border-slate-800/80 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Bài viết mới nhất
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex gap-3.5 items-center group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${post.imageBg} text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <Tag className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[9px] text-slate-500 font-bold block">{post.date}</span>
                      <Link
                        href="/blog#"
                        className="text-xs font-bold text-slate-300 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200"
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
