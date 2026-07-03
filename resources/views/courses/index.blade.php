@extends('layouts.app')

@title('Danh sách khóa học - SeduAi')

@section('content')

<!-- Header Banner -->
<section class="bg-slate-900 text-white py-16 relative overflow-hidden">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Danh Sách Khóa Học SeduAi</h1>
        <p class="text-slate-400 text-sm max-w-xl mx-auto">
            Học tập thực chiến cùng các giảng viên chất lượng cao kết hợp với Trợ lý ảo AI đắc lực hỗ trợ 24/7.
        </p>
        
        <!-- Breadcrumb -->
        <nav class="flex justify-center text-xs font-semibold text-slate-400 gap-2 pt-2">
            <a href="{{ route('home') }}" class="hover:text-primary transition">Trang chủ</a>
            <span>/</span>
            <span class="text-primary-light">Khóa học</span>
        </nav>
    </div>
</section>

<!-- Courses Main Area -->
<section class="py-12 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search & Filter Controls -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
            <form action="{{ route('courses.index') }}" method="GET" class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <!-- Search bar -->
                <div class="relative w-full md:max-w-md">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" name="search" value="{{ $search }}" placeholder="Tìm kiếm tên khóa học, mô tả..." class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50">
                </div>

                <!-- Category Filters (Hidden in query, handled by buttons or selected dropdown in mobile) -->
                <input type="hidden" name="category" id="category-input" value="{{ $selectedCategory }}">

                <!-- Category selector on desktop -->
                <div class="hidden lg:flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                    @foreach($categories as $category)
                        <button type="button" onclick="filterByCategory('{{ $category }}')" class="px-4 py-2 text-xs font-semibold rounded-full border transition duration-200 {{ $selectedCategory === $category ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200' }}">
                            {{ $category }}
                        </button>
                    @endforeach
                </div>

                <!-- Category selector on mobile/tablet -->
                <div class="block lg:hidden w-full md:w-48">
                    <select onchange="filterByCategory(this.value)" class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-slate-50 font-semibold text-slate-700">
                        @foreach($categories as $category)
                            <option value="{{ $category }}" {{ $selectedCategory === $category ? 'selected' : '' }}>
                                {{ $category }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="flex gap-2 w-full md:w-auto">
                    <button type="submit" class="flex-grow md:flex-grow-0 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition duration-200 shadow-md shadow-primary/10">
                        Tìm kiếm
                    </button>
                    @if(!empty($search) || $selectedCategory !== 'Tất cả')
                        <a href="{{ route('courses.index') }}" class="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-sm font-semibold transition flex items-center justify-center">
                            Xóa bộ lọc
                        </a>
                    @endif
                </div>
            </form>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Sidebar (Promotion & AI Testimonial) -->
            <div class="lg:col-span-3 space-y-6">
                <!-- AI Assistant Promo Box -->
                <div class="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <h3 class="font-extrabold text-lg mb-3">Học Thử Cùng AI</h3>
                    <p class="text-xs text-blue-100 leading-relaxed mb-4">
                        Tất cả các khóa học tại SeduAi đều tích hợp AI Assistant đồng hành hỗ trợ học viên 24/7 giải bài tập, dịch thuật và tối ưu lộ trình.
                    </p>
                    <a href="{{ route('home') }}#ai-crm-demo" class="block text-center w-full py-2.5 bg-white text-primary font-bold text-xs rounded-xl hover:bg-blue-50 transition duration-200 shadow-lg">
                        Thử Trò Chuyện Ngay
                    </a>
                </div>

                <!-- Quick Help FAQ -->
                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 class="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Hỗ trợ tuyển sinh</h3>
                    <div class="space-y-3.5">
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 text-sm">
                                <i class="fa-solid fa-headset"></i>
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-slate-700">Điện thoại Hotline</h4>
                                <p class="text-xs text-primary font-semibold mt-0.5">1900 1234</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 text-sm">
                                <i class="fa-solid fa-envelope-open-text"></i>
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-slate-700">Hỗ trợ Email</h4>
                                <p class="text-xs text-slate-500 mt-0.5">admissions@seduai.edu.vn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Grid Courses List -->
            <div class="lg:col-span-9">
                @if(count($courses) > 0)
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @foreach($courses as $course)
                            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col group h-full">
                                <!-- Image -->
                                <div class="relative overflow-hidden aspect-video bg-slate-100">
                                    <img src="{{ $course['image'] }}" alt="{{ $course['title'] }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                    <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white font-semibold text-[10px] tracking-wider uppercase">
                                        {{ $course['category'] }}
                                    </span>
                                </div>

                                <!-- Body -->
                                <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
                                    <div class="space-y-2">
                                        <!-- Ratings -->
                                        <div class="flex items-center gap-1.5 text-xs text-slate-500">
                                            <span class="font-bold text-amber-500 flex items-center gap-0.5">
                                                {{ $course['rating'] }}
                                                <i class="fa-solid fa-star"></i>
                                            </span>
                                            <span>({{ $course['reviews_count'] }} đánh giá)</span>
                                        </div>
                                        
                                        <!-- Title -->
                                        <h3 class="font-bold text-slate-950 text-sm leading-snug line-clamp-2 group-hover:text-primary transition duration-150">
                                            <a href="{{ route('courses.show', $course['slug']) }}">{{ $course['title'] }}</a>
                                        </h3>
                                        
                                        <!-- Meta info -->
                                        <div class="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                                            <span><i class="fa-solid fa-clock"></i> {{ $course['duration'] }}</span>
                                            <span><i class="fa-solid fa-user-graduate"></i> {{ $course['student_count'] }} học viên</span>
                                        </div>
                                    </div>

                                    <!-- Price & CTA -->
                                    <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <span class="text-[11px] text-slate-400 line-through block">{{ number_format($course['price'], 0, ',', '.') }} đ</span>
                                            <span class="font-extrabold text-primary text-base">{{ number_format($course['discount_price'], 0, ',', '.') }} đ</span>
                                        </div>
                                        <a href="{{ route('courses.show', $course['slug']) }}" class="px-3.5 py-2 bg-slate-900 group-hover:bg-primary text-white font-bold text-xs rounded-xl transition duration-200">
                                            Chi tiết
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Pagination Mockup -->
                    <div class="mt-12 flex justify-center">
                        <nav class="inline-flex rounded-xl border border-slate-200 bg-white p-1 gap-1 text-sm font-semibold shadow-sm">
                            <span class="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed"><i class="fa-solid fa-chevron-left"></i></span>
                            <span class="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center cursor-default">1</span>
                            <a href="#" class="w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center">2</a>
                            <a href="#" class="w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center"><i class="fa-solid fa-chevron-right"></i></a>
                        </nav>
                    </div>
                @else
                    <!-- No Courses found fallback -->
                    <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
                        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div class="space-y-1">
                            <h3 class="font-bold text-slate-900 text-base">Không tìm thấy khóa học nào</h3>
                            <p class="text-xs text-slate-500">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để tìm lại.</p>
                        </div>
                        <a href="{{ route('courses.index') }}" class="inline-block px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md">
                            Đặt lại danh sách
                        </a>
                    </div>
                @endif
            </div>
        </div>
    </div>
</section>

@endsection

@section('scripts')
<script>
    function filterByCategory(category) {
        document.getElementById('category-input').value = category;
        document.getElementById('category-input').closest('form').submit();
    }
</script>
@endsection
