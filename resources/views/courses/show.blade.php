@extends('layouts.app')

@title($course['title'] . ' - SeduAi')

@section('content')

<!-- Course Header Banner -->
<section class="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 relative overflow-hidden">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl space-y-4">
            <!-- Breadcrumbs -->
            <nav class="flex text-xs font-semibold text-slate-400 gap-2 mb-2">
                <a href="{{ route('home') }}" class="hover:text-primary transition">Trang chủ</a>
                <span>/</span>
                <a href="{{ route('courses.index') }}" class="hover:text-primary transition">Khóa học</a>
                <span>/</span>
                <span class="text-primary-light">{{ $course['category'] }}</span>
            </nav>

            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {{ $course['title'] }}
            </h1>

            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                {{ $course['description'] }}
            </p>

            <!-- Metadata info -->
            <div class="flex flex-wrap items-center gap-5 text-xs text-slate-300 pt-2">
                <span class="flex items-center gap-1.5">
                    <span class="font-bold text-amber-400 flex items-center gap-0.5">
                        {{ $course['rating'] }}
                        <i class="fa-solid fa-star"></i>
                    </span>
                    <span>({{ $course['reviews_count'] }} đánh giá từ Edu2Review)</span>
                </span>
                <span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span><i class="fa-solid fa-user-graduate"></i> {{ $course['student_count'] }} học viên đã học</span>
                <span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span><i class="fa-solid fa-chalkboard-user"></i> {{ $course['instructor'] }}</span>
            </div>
        </div>
    </div>
</section>

<!-- Course Details Content Area -->
<section class="py-12 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Main Column (Details, Syllabus, Reviews) -->
            <div class="lg:col-span-8 space-y-8">
                <!-- What you will learn -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h2 class="text-xl font-extrabold text-slate-950 mb-5">Bạn sẽ học được gì sau khóa học?</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @foreach($course['benefits'] as $benefit)
                            <div class="flex items-start gap-3 text-sm text-slate-600">
                                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                                <span>{{ $benefit }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- Course Syllabus (Accordion) -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h2 class="text-xl font-extrabold text-slate-950 mb-5">Lộ trình học tập chi tiết</h2>
                    <div class="space-y-3">
                        @foreach($course['syllabus'] as $index => $chapter)
                            <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                <button onclick="toggleAccordion('chapter-{{ $index }}')" class="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100/50 flex justify-between items-center text-left transition font-bold text-slate-800 text-sm">
                                    <span>{{ $chapter['title'] }}</span>
                                    <i id="icon-chapter-{{ $index }}" class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-300"></i>
                                </button>
                                <div id="chapter-{{ $index }}" class="hidden p-5 bg-white border-t border-slate-100 space-y-3">
                                    @foreach($chapter['lessons'] as $lesson)
                                        <div class="flex items-center gap-3 text-xs text-slate-600">
                                            <i class="fa-regular fa-circle-play text-primary text-sm"></i>
                                            <span>{{ $lesson }}</span>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- Reviews & Comments (Edu2Review style) -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                        <h2 class="text-xl font-extrabold text-slate-950">Đánh giá thực tế từ học viên</h2>
                        <span class="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">Edu2Review Verified</span>
                    </div>

                    <!-- Overall Rating Counter -->
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                        <div class="md:col-span-4 text-center space-y-1">
                            <h3 class="text-5xl font-extrabold text-slate-950">{{ $course['rating'] }}</h3>
                            <div class="text-amber-500 text-sm">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star-half-stroke"></i>
                            </div>
                            <p class="text-xs text-slate-400">Trên {{ $course['reviews_count'] }} đánh giá</p>
                        </div>
                        <div class="md:col-span-8 space-y-2">
                            <!-- Star Bars -->
                            <div class="flex items-center gap-3 text-xs">
                                <span class="w-12 text-slate-500">5 sao</span>
                                <div class="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div class="bg-amber-400 h-full" style="width: 85%"></div>
                                </div>
                                <span class="w-8 text-slate-400 text-right">85%</span>
                            </div>
                            <div class="flex items-center gap-3 text-xs">
                                <span class="w-12 text-slate-500">4 sao</span>
                                <div class="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div class="bg-amber-400 h-full" style="width: 12%"></div>
                                </div>
                                <span class="w-8 text-slate-400 text-right">12%</span>
                            </div>
                            <div class="flex items-center gap-3 text-xs">
                                <span class="w-12 text-slate-500">3 sao</span>
                                <div class="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div class="bg-amber-400 h-full" style="width: 3%"></div>
                                </div>
                                <span class="w-8 text-slate-400 text-right">3%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Reviews list -->
                    <div class="space-y-6">
                        @foreach($course['reviews'] as $review)
                            <div class="space-y-2.5 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                                <div class="flex justify-between items-start gap-4">
                                    <div>
                                        <h4 class="font-bold text-slate-900 text-sm">{{ $review['name'] }}</h4>
                                        <p class="text-[10px] text-slate-400">{{ $review['date'] }}</p>
                                    </div>
                                    <div class="text-amber-500 text-xs">
                                        @for($i = 0; $i < $review['rating']; $i++)
                                            <i class="fa-solid fa-star"></i>
                                        @endfor
                                        @for($i = $review['rating']; $i < 5; $i++)
                                            <i class="fa-regular fa-star text-slate-300"></i>
                                        @endfor
                                    </div>
                                </div>
                                <p class="text-xs text-slate-600 leading-relaxed italic">
                                    "{{ $review['comment'] }}"
                                </p>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Right Sidebar (Purchase Details & Related Courses) -->
            <div class="lg:col-span-4 space-y-6">
                <!-- Course Price Box -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6 sticky top-24">
                    <div>
                        <span class="text-slate-400 text-xs line-through block mb-0.5">Giá gốc: {{ number_format($course['price'], 0, ',', '.') }} đ</span>
                        <div class="flex items-center gap-3">
                            <span class="font-black text-primary text-2xl sm:text-3xl">{{ number_format($course['discount_price'], 0, ',', '.') }} đ</span>
                            <span class="px-2 py-0.5 rounded-md bg-rose-500 text-white font-extrabold text-xs">Giảm {{ round((($course['price'] - $course['discount_price']) / $course['price']) * 100) }}%</span>
                        </div>
                    </div>

                    <!-- Key stats list -->
                    <div class="space-y-3.5 text-xs text-slate-600 border-t border-b border-slate-100 py-5">
                        <div class="flex justify-between">
                            <span class="text-slate-400 font-medium"><i class="fa-solid fa-calendar-days w-5 text-slate-400"></i> Thời lượng:</span>
                            <span class="font-bold text-slate-900">{{ $course['duration'] }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400 font-medium"><i class="fa-solid fa-chart-line w-5 text-slate-400"></i> Trình độ:</span>
                            <span class="font-bold text-slate-900">{{ $course['level'] }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400 font-medium"><i class="fa-solid fa-shield-halved w-5 text-slate-400"></i> Cam kết:</span>
                            <span class="font-bold text-slate-900 text-emerald-500">Đầu ra vững vàng</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400 font-medium"><i class="fa-solid fa-ribbon w-5 text-slate-400"></i> Chứng nhận:</span>
                            <span class="font-bold text-slate-900">Chứng chỉ SeduAi</span>
                        </div>
                    </div>

                    <button onclick="openModal()" class="w-full text-center py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition duration-200 shadow-lg shadow-primary/25">
                        Đăng Ký Tư Vấn & Nhận Voucher
                    </button>
                    
                    <p class="text-[10px] text-slate-400 text-center leading-normal">
                        * Đăng ký ngay hôm nay để được nhận thêm 1 tháng đàm thoại 1-1 miễn phí cùng Trợ lý AI.
                    </p>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- Register Modal -->
<div id="register-modal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative animate-scale-up duration-300">
        <!-- Close button -->
        <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="p-6 space-y-5">
            <div class="text-center space-y-2">
                <div class="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-xl shadow-inner">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
                <h3 class="font-extrabold text-slate-900 text-lg">Đăng ký tư vấn khóa học</h3>
                <p class="text-slate-500 text-xs">Bạn đang quan tâm: <strong class="text-slate-700">{{ $course['title'] }}</strong></p>
            </div>

            <!-- Form -->
            <form action="{{ route('contact.submit') }}" method="POST" class="space-y-4">
                @csrf
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ và tên của bạn</label>
                    <input type="text" name="name" required placeholder="Nguyễn Văn A" class="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                </div>
                
                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại liên hệ</label>
                    <input type="tel" name="phone" required placeholder="0901234567" class="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                </div>

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Địa chỉ Email</label>
                    <input type="email" name="email" required placeholder="email@gmail.com" class="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                </div>

                <input type="hidden" name="message" value="Tôi muốn đăng ký tư vấn cho khóa học: {{ $course['title'] }}">

                <button type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition duration-200 shadow-md">
                    Gửi yêu cầu & Đăng ký
                </button>
            </form>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script>
    // Accordion Toggle
    function toggleAccordion(id) {
        const content = document.getElementById(id);
        const icon = document.getElementById('icon-' + id);
        
        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    }

    // Modal Control
    const modal = document.getElementById('register-modal');
    function openModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
</script>
@endsection
