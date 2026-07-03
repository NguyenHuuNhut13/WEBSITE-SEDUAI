@extends('layouts.app')

@title('SeduAi - Hệ điều hành AI dành cho giáo dục')

@section('content')

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white overflow-hidden py-20 lg:py-32">
    <!-- Background grid decoration -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
    <!-- Floating glowing orbs -->
    <div class="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-1/10 right-1/10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Hero Text -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                    <span class="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
                    Hệ điều hành AI giáo dục thế hệ mới
                </div>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                    Cá nhân hóa giáo dục bằng <span class="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Trí tuệ nhân tạo</span>
                </h1>
                <p class="text-slate-300 text-lg max-w-2xl mx-auto lg:mx-0">
                    SeduAi giúp các trung tâm đào tạo và trường học thu hút học viên tự động bằng AI, nâng tầm phương pháp dạy học với trợ lý giáo viên AI, và tối ưu hóa 90% vận hành.
                </p>
                <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <a href="{{ route('courses.index') }}" class="px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all duration-300 shadow-lg shadow-primary/30 flex items-center gap-2 group">
                        Khám phá khóa học
                        <i class="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                    </a>
                    <a href="#ai-crm-demo" class="px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-all duration-300 flex items-center gap-2">
                        <i class="fa-solid fa-play"></i> Xem AI tư vấn tuyển sinh
                    </a>
                </div>
            </div>

            <!-- Hero Widget Showcase -->
            <div class="lg:col-span-5 relative mt-8 lg:mt-0">
                <div class="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden max-w-md mx-auto">
                    <!-- Glassmorphism card header -->
                    <div class="flex items-center justify-between pb-4 border-b border-slate-700">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-red-500"></span>
                            <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                            <span class="w-3 h-3 rounded-full bg-green-500"></span>
                        </div>
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI Agent Dashboard</span>
                    </div>

                    <!-- Small Dashboard Widget statistics -->
                    <div class="space-y-4 pt-4">
                        <div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <i class="fa-solid fa-user-plus"></i>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-400 font-medium">Học viên mới hôm nay</p>
                                    <h4 class="text-lg font-bold text-white">42 Leads</h4>
                                </div>
                            </div>
                            <span class="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+18%</span>
                        </div>

                        <div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-xs font-semibold text-slate-300">Trợ lý giáo viên AI soạn bài</span>
                                <span class="text-xs text-slate-400">88% hoàn thành</span>
                            </div>
                            <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div class="bg-primary h-full rounded-full" style="width: 88%"></div>
                            </div>
                        </div>

                        <!-- Mini chat simulator trigger -->
                        <div class="bg-primary/10 rounded-xl p-4 border border-primary/25 space-y-2">
                            <p class="text-xs text-primary font-bold"><i class="fa-solid fa-robot"></i> Trợ lý AI đang hỏi phụ huynh:</p>
                            <p class="text-sm italic text-slate-300">"Quý phụ huynh đang tìm khóa học tiếng Anh hay Lập trình cho bé?"</p>
                            <div class="flex justify-end pt-1">
                                <span class="text-[10px] text-slate-400"><i class="fa-solid fa-check-double text-primary"></i> Đã đồng bộ CRM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- AI Systems Cycle Flow -->
<section class="py-16 bg-white border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12">
            <h2 class="text-3xl font-extrabold text-slate-900">Chu trình Vận hành Đào tạo bằng AI</h2>
            <p class="text-slate-500 mt-3 text-base">Từ lúc tiếp cận học viên mới cho đến khi đào tạo thành tài và giới thiệu học viên mới, AI tự động hóa hoàn toàn.</p>
        </div>

        <!-- Horizontal Flow layout -->
        <div class="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-4 text-center">
            @php
                $steps = [
                    ['icon' => 'fa-robot', 'title' => 'AI CRM', 'desc' => 'Thu hút & Tư vấn'],
                    ['icon' => 'fa-heart', 'title' => 'Chăm sóc', 'desc' => 'Tự động gửi tin'],
                    ['icon' => 'fa-file-signature', 'title' => 'Đăng ký', 'desc' => 'Xếp lớp tự động'],
                    ['icon' => 'fa-person-chalkboard', 'title' => 'Đào tạo', 'desc' => 'Học cùng AI Tutor'],
                    ['icon' => 'fa-clipboard-question', 'title' => 'Đánh giá', 'desc' => 'Chấm điểm bằng AI'],
                    ['icon' => 'fa-arrow-rotate-right', 'title' => 'Gia hạn', 'desc' => 'Phân tích nhu cầu'],
                    ['icon' => 'fa-users', 'title' => 'Giới thiệu', 'desc' => 'Lan tỏa học viên']
                ];
            @endphp
            
            @foreach($steps as $index => $step)
                <div class="bg-slate-50 border border-slate-100 p-4 rounded-2xl relative shadow-sm hover:border-primary/50 transition duration-300 col-span-1">
                    <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 text-xl">
                        <i class="fa-solid {{ $step['icon'] }}"></i>
                    </div>
                    <h4 class="text-sm font-bold text-slate-800">{{ $step['title'] }}</h4>
                    <p class="text-[10px] text-slate-500 mt-1 leading-tight">{{ $step['desc'] }}</p>
                    
                    @if($index < count($steps) - 1)
                        <!-- Desktop arrow indicator -->
                        <div class="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-300">
                            <i class="fa-solid fa-chevron-right text-sm"></i>
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- AI Admissions CRM (Interactive Chat) -->
<section id="ai-crm-demo" class="py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left introduction -->
            <div class="lg:col-span-5 space-y-6">
                <div class="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl shadow-sm">
                    <i class="fa-solid fa-comments"></i>
                </div>
                <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
                    AI Admissions CRM
                </h2>
                <p class="text-slate-600 text-base leading-relaxed">
                    Trợ lý tuyển sinh AI tương tác trực tiếp với phụ huynh và học sinh qua Website/Fanpage. AI tự động khai thác nhu cầu thực tế: độ tuổi, môn học mong muốn, ngân sách, vị trí địa lý... sau đó phân tích và tự động tạo cơ hội (Lead) trên CRM quản trị kèm theo đánh giá tiềm năng.
                </p>
                <div class="space-y-3">
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <i class="fa-solid fa-check text-emerald-500"></i> Trò chuyện tự nhiên 24/7 không cần người trực.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <i class="fa-solid fa-check text-emerald-500"></i> Đẩy trực tiếp thông tin vào hệ thống CRM quản lý.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <i class="fa-solid fa-check text-emerald-500"></i> Phân loại khách hàng tiềm năng bằng AI.
                    </div>
                </div>
            </div>

            <!-- Right interactive simulator -->
            <div class="lg:col-span-7">
                <div class="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[520px]">
                    <!-- Chat Header -->
                    <div class="bg-primary px-6 py-4 flex items-center justify-between text-white">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                                    <i class="fa-solid fa-robot"></i>
                                </div>
                                <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-primary"></span>
                            </div>
                            <div>
                                <h3 class="font-bold text-sm">Trợ lý Tuyển sinh SeduAi</h3>
                                <p class="text-xs text-white/80">Đang hoạt động tự động</p>
                            </div>
                        </div>
                        <span class="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">Demo trực tiếp</span>
                    </div>

                    <!-- Chat Message Area -->
                    <div id="chat-messages" class="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                        <!-- AI welcome message -->
                        <div class="flex items-start gap-3 max-w-[85%]">
                            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-sm font-semibold">
                                AI
                            </div>
                            <div class="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sm text-slate-700 leading-relaxed">
                                Xin kính chào quý phụ huynh! Tôi là trợ lý tư vấn tuyển sinh AI của SeduAi. Quý phụ huynh đang quan tâm tìm khoá học cho con đúng không ạ? Xin hỏi bé nhà mình năm nay bao nhiêu tuổi rồi ạ?
                            </div>
                        </div>
                    </div>

                    <!-- Chat Actions / Option selection buttons -->
                    <div id="chat-actions" class="p-4 border-t border-slate-100 bg-white flex flex-wrap gap-2 justify-center">
                        <button onclick="sendOption('Dưới 6 tuổi')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Dưới 6 tuổi</button>
                        <button onclick="sendOption('Từ 6 - 10 tuổi')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Từ 6 - 10 tuổi</button>
                        <button onclick="sendOption('Từ 11 - 15 tuổi')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Từ 11 - 15 tuổi</button>
                        <button onclick="sendOption('Trên 15 tuổi')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Trên 15 tuổi</button>
                    </div>

                    <!-- Phone Number Input (Initially hidden) -->
                    <div id="chat-input-area" class="hidden p-4 border-t border-slate-100 bg-white">
                        <div class="flex gap-2">
                            <input type="tel" id="user-phone-input" placeholder="Nhập số điện thoại của phụ huynh..." class="flex-grow px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <button onclick="sendPhone()" class="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition duration-200">Gửi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- AI Teacher Assistant (Interactive Tool) -->
<section class="py-20 bg-white border-t border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left interactive demo panel -->
            <div class="lg:col-span-7 order-last lg:order-first">
                <div class="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
                    <!-- Console Header -->
                    <div class="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-slate-400 text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                            <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                            <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
                            <span class="ml-2">ai-teacher-assistant.py</span>
                        </div>
                        <span>STATUS: ACTIVE</span>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Action Selectors -->
                        <div class="flex flex-wrap gap-2.5">
                            <button onclick="triggerTeacherAI('lesson-plan')" class="teacher-btn px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition duration-200 flex items-center gap-2 border border-slate-700">
                                <i class="fa-solid fa-book-open text-primary"></i> Soạn Giáo án Lớp 4
                            </button>
                            <button onclick="triggerTeacherAI('exam-gen')" class="teacher-btn px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition duration-200 flex items-center gap-2 border border-slate-700">
                                <i class="fa-solid fa-file-pen text-primary"></i> Soạn Đề Kiểm Tra Python
                            </button>
                            <button onclick="triggerTeacherAI('student-comment')" class="teacher-btn px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition duration-200 flex items-center gap-2 border border-slate-700">
                                <i class="fa-solid fa-comment-medical text-primary"></i> Viết Nhận Xét Học Sinh
                            </button>
                        </div>

                        <!-- Console Output display -->
                        <div class="relative bg-slate-950 rounded-2xl p-5 border border-slate-800 h-[280px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
                            <!-- Spinner overlay -->
                            <div id="console-spinner" class="hidden absolute inset-0 bg-slate-950/80 flex items-center justify-center z-10">
                                <div class="flex flex-col items-center gap-3">
                                    <div class="w-8 h-8 rounded-full border-4 border-slate-800 border-t-primary animate-spin"></div>
                                    <span class="text-slate-400 font-semibold">AI đang xử lý yêu cầu...</span>
                                </div>
                            </div>
                            
                            <div id="console-output">
                                <span class="text-slate-500">// Chọn một tác vụ của Giáo viên ở trên để xem Trợ lý AI thực hiện soạn thảo tài liệu giáo án lập tức.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right introduction -->
            <div class="lg:col-span-5 space-y-6">
                <div class="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl shadow-sm">
                    <i class="fa-solid fa-person-chalkboard"></i>
                </div>
                <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
                    AI Teacher Assistant
                </h2>
                <p class="text-slate-600 text-base leading-relaxed">
                    Giảm tải áp lực chuẩn bị bài học cho giáo viên. Chỉ với lệnh nói hoặc văn bản đơn giản, Trợ lý AI sẽ hỗ trợ đắc lực giáo viên trong việc: soạn thảo giáo án chi tiết theo chương trình, tạo kho đề thi phong phú đa dạng, hỗ trợ chấm điểm và viết nhận xét học sinh định kỳ chi tiết và ý nghĩa.
                </p>
                <div class="space-y-3">
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <i class="fa-solid fa-bolt text-primary"></i> Tiết kiệm 10+ giờ làm việc mỗi tuần cho giáo viên.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <i class="fa-solid fa-bolt text-primary"></i> Giáo án & Đề thi chuẩn hóa, tự động tạo ba-rem đáp án.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <i class="fa-solid fa-bolt text-primary"></i> Nhận xét cá nhân hóa bám sát quá trình học của học viên.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Featured Courses Section -->
<section class="py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
                <h2 class="text-3xl font-extrabold text-slate-900">Khóa Học Đột Phá AI & Công Nghệ</h2>
                <p class="text-slate-500 mt-2">Các khóa đào tạo kết hợp cùng công cụ Trí tuệ nhân tạo độc quyền tại SeduAi</p>
            </div>
            <a href="{{ route('courses.index') }}" class="px-5 py-2.5 rounded-full border border-slate-200 hover:border-primary hover:text-primary text-slate-600 font-semibold text-sm transition duration-200 flex items-center gap-2">
                Xem tất cả khóa học
                <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>

        <!-- Courses Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @foreach($featuredCourses as $course)
                <div class="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col group h-full">
                    <!-- Course Image -->
                    <div class="relative overflow-hidden aspect-video bg-slate-100">
                        <img src="{{ $course['image'] }}" alt="{{ $course['title'] }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white font-semibold text-[10px] tracking-wider uppercase">
                            {{ $course['category'] }}
                        </span>
                    </div>

                    <!-- Card Body -->
                    <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div class="space-y-2">
                            <!-- Ratings & Stars -->
                            <div class="flex items-center gap-1.5 text-xs text-slate-500">
                                <span class="font-bold text-amber-500 flex items-center gap-0.5">
                                    {{ $course['rating'] }}
                                    <i class="fa-solid fa-star"></i>
                                </span>
                                <span>({{ $course['reviews_count'] }} đánh giá)</span>
                            </div>
                            
                            <!-- Title -->
                            <h3 class="font-bold text-slate-950 text-base leading-snug line-clamp-2 group-hover:text-primary transition duration-150">
                                <a href="{{ route('courses.show', $course['slug']) }}">{{ $course['title'] }}</a>
                            </h3>
                            
                            <!-- Small metadata -->
                            <div class="flex items-center gap-3 text-xs text-slate-400 pt-1">
                                <span><i class="fa-solid fa-clock"></i> {{ $course['duration'] }}</span>
                                <span><i class="fa-solid fa-user-graduate"></i> {{ $course['student_count'] }} học viên</span>
                            </div>
                        </div>

                        <!-- Price & CTA -->
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span class="text-xs text-slate-400 line-through block">{{ number_format($course['price'], 0, ',', '.') }} đ</span>
                                <span class="font-extrabold text-primary text-base">{{ number_format($course['discount_price'], 0, ',', '.') }} đ</span>
                            </div>
                            <a href="{{ route('courses.show', $course['slug']) }}" class="px-4 py-2 bg-slate-900 group-hover:bg-primary text-white font-bold text-xs rounded-xl transition duration-200">
                                Chi tiết
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Statistics Counters -->
<section class="py-16 bg-primary text-white relative overflow-hidden">
    <!-- background styling -->
    <div class="absolute inset-0 bg-primary-dark/25 mix-blend-overlay"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div class="space-y-1">
                <h3 class="text-4xl lg:text-5xl font-extrabold">15,000+</h3>
                <p class="text-primary-light font-medium text-sm lg:text-base">Học viên theo học</p>
            </div>
            <div class="space-y-1">
                <h3 class="text-4xl lg:text-5xl font-extrabold">1,200+</h3>
                <p class="text-primary-light font-medium text-sm lg:text-base">Trợ lý Giáo án được tạo</p>
            </div>
            <div class="space-y-1">
                <h3 class="text-4xl lg:text-5xl font-extrabold">98%</h3>
                <p class="text-primary-light font-medium text-sm lg:text-base">Đánh giá hài lòng</p>
            </div>
            <div class="space-y-1">
                <h3 class="text-4xl lg:text-5xl font-extrabold">250+</h3>
                <p class="text-primary-light font-medium text-sm lg:text-base">Trung tâm & Đối tác</p>
            </div>
        </div>
    </div>
</section>

@endsection

@section('scripts')
<script>
    // --- Interactive AI Admission CRM Simulator ---
    const chatMessages = document.getElementById('chat-messages');
    const chatActions = document.getElementById('chat-actions');
    const chatInputArea = document.getElementById('chat-input-area');
    const userPhoneInput = document.getElementById('user-phone-input');

    let leadData = {
        age: '',
        subject: '',
        budget: '',
        location: '',
        phone: ''
    };

    function appendMessage(sender, text, isAI = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = isAI ? 'flex items-start gap-3 max-w-[85%]' : 'flex items-start gap-3 max-w-[85%] ml-auto justify-end';
        
        const avatar = isAI 
            ? `<div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-sm font-semibold">AI</div>` 
            : '';
            
        const bubbleBg = isAI 
            ? 'bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sm text-slate-700 leading-relaxed' 
            : 'bg-primary text-white rounded-2xl rounded-tr-none p-3.5 shadow-md text-sm leading-relaxed';

        msgDiv.innerHTML = `
            ${avatar}
            <div class="${bubbleBg}">
                ${text}
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendOption(optionText) {
        // Append user response message
        appendMessage('User', optionText, false);
        
        // Hide actions during thinking
        chatActions.innerHTML = `<span class="text-xs text-slate-400 italic"><i class="fa-solid fa-spinner animate-spin"></i> AI đang gõ...</span>`;

        setTimeout(() => {
            if (!leadData.age) {
                leadData.age = optionText;
                appendMessage('AI', `Dạ ghi nhận bé ở độ tuổi <strong>${optionText}</strong>. Quý phụ huynh đang muốn hướng cho con học môn học gì ạ?`, true);
                
                chatActions.innerHTML = `
                    <button onclick="sendOption('Tiếng Anh & IELTS')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Tiếng Anh & IELTS</button>
                    <button onclick="sendOption('Lập trình & Máy tính')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Lập trình & Máy tính</button>
                    <button onclick="sendOption('AI & Công nghệ')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">AI & Công nghệ</button>
                    <button onclick="sendOption('Kỹ năng mềm')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Kỹ năng mềm</button>
                `;
            } else if (!leadData.subject) {
                leadData.subject = optionText;
                appendMessage('AI', `Dạ bé học môn <strong>${optionText}</strong> rất tốt ạ. Phụ huynh dự kiến chi phí đầu tư học phí hàng tháng cho bé khoảng bao nhiêu để tôi lọc khóa học phù hợp ạ?`, true);
                
                chatActions.innerHTML = `
                    <button onclick="sendOption('Dưới 1 triệu/tháng')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Dưới 1 triệu/tháng</button>
                    <button onclick="sendOption('Từ 1 - 2 triệu/tháng')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Từ 1 - 2 triệu/tháng</button>
                    <button onclick="sendOption('Trên 2 triệu/tháng')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Trên 2 triệu/tháng</button>
                `;
            } else if (!leadData.budget) {
                leadData.budget = optionText;
                appendMessage('AI', `Dạ mức ngân sách <strong>${optionText}</strong> rất phù hợp với nhiều chương trình đào tạo tối ưu của SeduAi. Phụ huynh muốn tìm lớp học Online hay tại khu vực nào để thuận tiện cho bé học ạ?`, true);
                
                chatActions.innerHTML = `
                    <button onclick="sendOption('Học Online tại nhà')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Học Online tại nhà</button>
                    <button onclick="sendOption('Quận 10, TP. HCM')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Quận 10, TP. HCM</button>
                    <button onclick="sendOption('Cầu Giấy, Hà Nội')" class="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm">Cầu Giấy, Hà Nội</button>
                `;
            } else if (!leadData.location) {
                leadData.location = optionText;
                appendMessage('AI', `Tuyệt vời! Tôi đã chọn lọc được 3 khoá học phù hợp nhất với con tại <strong>${optionText}</strong>. Để chuyên viên tuyển sinh của SeduAi gửi chi tiết lộ trình học và ưu đãi học phí lên đến 30% cho phụ huynh, xin phụ huynh cho hỏi số điện thoại liên hệ là gì ạ?`, true);
                
                chatActions.classList.add('hidden');
                chatInputArea.classList.remove('hidden');
                userPhoneInput.focus();
            }
        }, 1000);
    }

    function sendPhone() {
        const phone = userPhoneInput.value.trim();
        if (!phone || phone.length < 9) {
            alert('Vui lòng nhập số điện thoại hợp lệ để AI tạo Lead!');
            return;
        }

        leadData.phone = phone;
        appendMessage('User', phone, false);
        chatInputArea.classList.add('hidden');
        
        const successDiv = document.createElement('div');
        successDiv.className = 'p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1.5 shadow-inner mt-2';
        successDiv.innerHTML = `
            <div class="flex items-center gap-1.5 font-bold">
                <i class="fa-solid fa-circle-check text-sm text-emerald-500"></i>
                Hệ thống CRM đồng bộ Lead thành công!
            </div>
            <ul class="list-disc pl-4 space-y-0.5">
                <li>Độ tuổi: ${leadData.age}</li>
                <li>Nhu cầu: ${leadData.subject}</li>
                <li>Ngân sách: ${leadData.budget}</li>
                <li>Địa điểm: ${leadData.location}</li>
                <li>Số điện thoại: ${leadData.phone}</li>
            </ul>
        `;

        setTimeout(() => {
            appendMessage('AI', `Dạ xin cảm ơn phụ huynh! Thông tin liên hệ đã được chuyển trực tiếp vào hệ thống quản lý Admissions CRM của chúng tôi. Chuyên viên sẽ gọi điện tư vấn chi tiết cho phụ huynh trong vòng 15-30 phút tới. Chúc phụ huynh một ngày vui vẻ!`, true);
            chatMessages.appendChild(successDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }


    // --- Interactive AI Teacher Assistant Simulator ---
    const consoleOutput = document.getElementById('console-output');
    const consoleSpinner = document.getElementById('console-spinner');

    const teacherMockContent = {
        'lesson-plan': `
<span class="text-blue-400"># GIÁO ÁN TOÁN LỚP 4: PHÂN SỐ VÀ PHÉP CHIA SỐ TỰ NHIÊN</span>
<span class="text-emerald-400">## I. MỤC TIÊU BÀI HỌC</span>
- Học sinh nhận biết được phép chia số tự nhiên cho số tự nhiên khác 0 không phải lúc nào cũng ra số tự nhiên, kết quả đó có thể viết dưới dạng một phân số.
- Biết biểu diễn thương của phép chia dưới dạng phân số (Tử số là số bị chia, mẫu số là số chia).

<span class="text-emerald-400">## II. HOẠT ĐỘNG DẠY HỌC CHỦ CHỐT</span>
<strong>1. Khởi động (5 phút):</strong> Cho học sinh chia đều 3 quả cam cho 3 bạn (mỗi bạn 1 quả). Tiếp tục chia đều 3 quả cam cho 4 bạn. Học sinh nhận thấy không thể chia nguyên quả.
<strong>2. Khám phá kiến thức (15 phút):</strong>
   - Thực hiện phép chia: 3 : 4. Ta viết kết quả phép chia này dưới dạng phân số là: <strong>3/4</strong>.
   - Kết luận: Thương của phép chia số tự nhiên cho số tự nhiên (khác 0) viết dưới dạng phân số.
<strong>3. Thực hành & Luyện tập (15 phút):</strong> Giải bài toán trang 108 SGK.
        `,
        'exam-gen': `
<span class="text-purple-400"># ĐỀ KIỂM TRA LẬP TRÌNH PYTHON CƠ BẢN (THỜI GIAN: 45 PHÚT)</span>
<span class="text-emerald-400">## CÂU 1 (Trắc nghiệm - 4 điểm)</span>
Đoạn code sau đây sẽ in ra kết quả gì màn hình?
<code>x = 5
y = "10"
print(str(x) + y)</code>
A. 15       B. 510       C. TypeError       D. None

<span class="text-emerald-400">## CÂU 2 (Tự luận - 6 điểm)</span>
Viết một hàm Python mang tên <strong>kiem_tra_so_chan(n)</strong> nhận vào một số nguyên n. Trả về True nếu số đó là số chẵn, ngược lại trả về False.
<span class="text-slate-500"># Gợi ý đáp án:</span>
<code class="text-yellow-500">def kiem_tra_so_chan(n):
    return n % 2 == 0</code>
        `,
        'student-comment': `
<span class="text-amber-400"># PHIẾU NHẬN XÉT HỌC VIÊN ĐỊNH KỲ</span>
<strong>Học sinh:</strong> Nguyễn Minh Triết (12 tuổi) - Khóa Lập trình Scratch/Python.
<strong>Đánh giá của AI Co-Teacher:</strong>
- <strong>Tư duy logic:</strong> Triết có tư duy logic rất tốt, hiểu bài nhanh và biết vận dụng vòng lặp linh hoạt trong trò chơi.
- <strong>Thái độ học tập:</strong> Chăm chỉ nghe giảng, chủ động hỏi bài khi gặp lỗi code khó.
- <strong>Điểm cần cải thiện:</strong> Cần rèn luyện thêm tính cẩn thận, hay viết sai chính tả tên biến dẫn đến lỗi cú pháp không đáng có.
- <strong>Lời khuyên của GV:</strong> Khuyên con nên chạy thử từng đoạn code nhỏ để kiểm tra lỗi trước khi viết khối lệnh quá dài.
        `
    };

    function triggerTeacherAI(actionType) {
        // Show spinner
        consoleSpinner.classList.remove('hidden');

        // Disable buttons temporary
        const buttons = document.querySelectorAll('.teacher-btn');
        buttons.forEach(btn => btn.disabled = true);

        setTimeout(() => {
            // Hide spinner
            consoleSpinner.classList.add('hidden');

            // Render mock markdown content
            consoleOutput.innerHTML = teacherMockContent[actionType];

            // Re-enable buttons
            buttons.forEach(btn => btn.disabled = false);
        }, 1500);
    }
</script>
@endsection
