    @extends('layouts.app')

@section('title', 'SeduAi - Hệ điều hành AI dành cho giáo dục')

@section('content')

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-primary-dark text-white overflow-hidden pt-28 pb-40 lg:pt-36 lg:pb-52">
    <!-- Background grid decoration -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
    
    <!-- Floating glowing orbs -->
    <div class="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse duration-10000"></div>
    <div class="absolute bottom-1/10 right-1/10 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <!-- Hero Text -->
            <div class="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                    <span class="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
                    Hệ điều hành AI giáo dục thế hệ mới
                </div>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black font-heading leading-tight tracking-tight">
                    Cá nhân hóa giáo dục bằng <br>
                    <span class="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">Trí tuệ nhân tạo</span>
                </h1>
                <p class="text-slate-300 text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                    SeduAi giúp các trung tâm đào tạo và trường học thu hút học viên tự động bằng AI, nâng tầm phương pháp dạy học với trợ lý giáo viên AI, và tối ưu hóa 90% vận hành.
                </p>
                <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <a href="{{ route('courses.index') }}" class="px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-base transition-all duration-300 shadow-xl shadow-primary/30 flex items-center gap-2 group hover:scale-[1.02]">
                        Khám phá khóa học
                        <i class="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                    </a>
                    <a href="#ai-crm-demo" class="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-base transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]">
                        <i class="fa-solid fa-play text-primary"></i> Xem AI tư vấn tuyển sinh
                    </a>
                </div>
            </div>

            <!-- Hero Widget Showcase -->
            <div class="lg:col-span-5 relative mt-8 lg:mt-0">
                <div class="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-w-md mx-auto">
                    <!-- Glow effect behind container -->
                    <div class="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>

                    <!-- Card Header -->
                    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                        </div>
                        <span class="text-xs font-extrabold font-heading text-slate-400 uppercase tracking-widest">AI OS Dashboard</span>
                    </div>

                    <!-- Statistics / UI Simulation widgets -->
                    <div class="space-y-5 pt-5">
                        <div class="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-between shadow-inner">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                    <i class="fa-solid fa-user-plus text-lg"></i>
                                </div>
                                <div>
                                    <p class="text-[11px] text-slate-400 font-bold">Học viên mới hôm nay</p>
                                    <h4 class="text-lg font-black text-white">42 Leads</h4>
                                </div>
                            </div>
                            <span class="text-xs font-extrabold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">+18%</span>
                        </div>

                        <div class="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-inner">
                            <div class="flex justify-between items-center mb-2.5">
                                <span class="text-xs font-bold text-slate-300">Trợ lý giáo viên AI soạn bài</span>
                                <span class="text-xs font-bold text-primary">88% hoàn thành</span>
                            </div>
                            <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-primary h-full rounded-full" style="width: 88%"></div>
                            </div>
                        </div>

                        <!-- Mini chat simulator trigger -->
                        <div class="bg-primary/5 rounded-2xl p-4 border border-primary/20 space-y-2">
                            <p class="text-xs text-primary font-extrabold flex items-center gap-1.5"><i class="fa-solid fa-robot"></i> Trợ lý AI đang hỏi phụ huynh:</p>
                            <p class="text-xs italic text-slate-300">"Quý phụ huynh đang tìm khóa học tiếng Anh hay Lập trình cho bé?"</p>
                            <div class="flex justify-end pt-1">
                                <span class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1"><i class="fa-solid fa-check-double text-xs"></i> Đã đồng bộ CRM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Overlapping Features Grid -->
<section class="relative z-20 -mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Box 1 -->
            <div class="bg-white rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col justify-between group">
                <div class="space-y-4">
                    <div class="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid fa-comments"></i>
                    </div>
                    <h3 class="text-xl font-bold font-heading text-slate-900">AI CRM Tuyển Sinh</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        Tự động tiếp cận, tư vấn và phân loại dữ liệu học viên tiềm năng 24/7 trên Website và Fanpage của bạn.
                    </p>
                </div>
                <a href="#ai-crm-demo" class="text-primary font-bold text-sm mt-6 flex items-center gap-1.5 hover:underline group/btn">
                    Thử demo chat
                    <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover/btn:translate-x-1"></i>
                </a>
            </div>

            <!-- Box 2 -->
            <div class="bg-white rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col justify-between group">
                <div class="space-y-4">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid fa-person-chalkboard"></i>
                    </div>
                    <h3 class="text-xl font-bold font-heading text-slate-900">Trợ Lý Giáo Viên AI</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        Giảm tải 80% công việc soạn thảo giáo án chi tiết, tạo đề kiểm tra đa dạng và viết nhận xét học sinh định kỳ.
                    </p>
                </div>
                <a href="#ai-teacher-section" class="text-primary font-bold text-sm mt-6 flex items-center gap-1.5 hover:underline group/btn">
                    Thử soạn giáo án
                    <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover/btn:translate-x-1"></i>
                </a>
            </div>

            <!-- Box 3 -->
            <div class="bg-white rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col justify-between group">
                <div class="space-y-4">
                    <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <h3 class="text-xl font-bold font-heading text-slate-900">Học Tập Cá Nhân Hóa</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        Lộ trình đào tạo tương thích từng năng lực học viên, có sự đồng hành của Chatbot AI sửa lỗi phát âm và viết code 24/7.
                    </p>
                </div>
                <a href="{{ route('courses.index') }}" class="text-primary font-bold text-sm mt-6 flex items-center gap-1.5 hover:underline group/btn">
                    Xem khóa học
                    <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover/btn:translate-x-1"></i>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- About SeduAi Section -->
<section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <!-- Left graphic collage -->
            <div class="lg:col-span-5 relative">
                <!-- Stacked cards representing system core -->
                <div class="relative space-y-6">
                    <div class="bg-gradient-to-r from-primary to-blue-500 p-8 rounded-3xl text-white shadow-xl relative z-10">
                        <span class="text-xs uppercase font-extrabold tracking-widest text-primary-light">SeduAi OS Core</span>
                        <h4 class="text-2xl font-bold font-heading mt-2">Hệ sinh thái Giáo dục toàn diện</h4>
                        <p class="text-xs text-blue-100 mt-2 leading-relaxed">Tích hợp đa phân hệ giúp quản lý đồng bộ từ tuyển sinh đến dạy & học.</p>
                        <div class="mt-6 flex items-center gap-3">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span class="text-[11px] font-bold text-emerald-300">Hệ thống đang vận hành mượt mà</span>
                        </div>
                    </div>
                    
                    <div class="bg-slate-50 border border-slate-100 p-6 rounded-3xl shadow-lg flex items-center gap-4 hover:border-primary/30 transition duration-300">
                        <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl flex-shrink-0">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <div>
                            <h5 class="font-bold text-slate-800 text-sm">Báo cáo & Phân tích</h5>
                            <p class="text-xs text-slate-500 mt-0.5">Dữ liệu học tập và phễu tuyển sinh thời gian thực.</p>
                        </div>
                    </div>

                    <div class="bg-slate-50 border border-slate-100 p-6 rounded-3xl shadow-lg flex items-center gap-4 hover:border-primary/30 transition duration-300">
                        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl flex-shrink-0">
                            <i class="fa-solid fa-code-fork"></i>
                        </div>
                        <div>
                            <h5 class="font-bold text-slate-800 text-sm">Tự động hóa Quy trình</h5>
                            <p class="text-xs text-slate-500 mt-0.5">Xếp lớp học viên và chấm bài hoàn toàn bằng AI.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right content detail -->
            <div class="lg:col-span-7 space-y-6">
                <span class="text-xs uppercase font-extrabold tracking-widest text-primary">Về chúng tôi</span>
                <h2 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight leading-tight">
                    Kiến tạo giải pháp công nghệ giáo dục vượt trội bằng AI
                </h2>
                <p class="text-slate-600 text-base leading-relaxed">
                    SeduAi ra đời với sứ mệnh định hình lại phương thức quản lý và đào tạo truyền thống. Bằng việc ứng dụng các mô hình trí tuệ nhân tạo tiên tiến nhất, chúng tôi giải quyết triệt để bài toán thu hút học viên, tối ưu nhân sự chuẩn bị tài liệu và nâng tầm trải nghiệm của học sinh.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-semibold">
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></div>
                        <span class="text-sm text-slate-700">Tối ưu 90% thời gian vận hành</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></div>
                        <span class="text-sm text-slate-700">Tiết kiệm 50% chi phí marketing</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></div>
                        <span class="text-sm text-slate-700">Giáo trình chuẩn hóa quốc tế</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></div>
                        <span class="text-sm text-slate-700">Học thử miễn phí trọn đời cùng AI</span>
                    </div>
                </div>
                <div class="pt-4">
                    <a href="{{ route('courses.index') }}" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-primary text-white font-extrabold text-sm transition-all duration-300 shadow-md">
                        Xem danh sách khóa học <i class="fa-solid fa-arrow-right text-xs"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- AI Systems Cycle Flow -->
<section id="features" class="py-24 bg-slate-50 border-t border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span class="text-xs uppercase font-extrabold tracking-widest text-primary">Chu trình khép kín</span>
            <h2 class="text-3xl sm:text-4xl font-black font-heading text-slate-900">Chu trình Vận hành Đào tạo bằng AI</h2>
            <p class="text-slate-500 text-base">Từ lúc tiếp cận học viên mới cho đến khi đào tạo thành tài và giới thiệu học viên mới, AI tự động hóa hoàn toàn.</p>
        </div>

        <!-- Horizontal Flow layout -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5 text-center">
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
                <div class="bg-white border border-slate-200/80 p-6 rounded-2xl relative shadow-sm hover:shadow-md hover:border-primary/50 transition duration-300 col-span-1 group">
                    <div class="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid {{ $step['icon'] }}"></i>
                    </div>
                    <h4 class="text-base font-bold font-heading text-slate-800">{{ $step['title'] }}</h4>
                    <p class="text-xs text-slate-500 mt-2 leading-relaxed">{{ $step['desc'] }}</p>
                    
                    @if($index < count($steps) - 1)
                        <!-- Desktop arrow indicator -->
                        <div class="hidden lg:block absolute top-1/2 -right-3.5 -translate-y-1/2 z-10 text-slate-300">
                            <i class="fa-solid fa-chevron-right text-xs"></i>
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- AI Admissions CRM (Interactive Chat) -->
<section id="ai-crm-demo" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <!-- Left introduction -->
            <div class="lg:col-span-5 space-y-6">
                <div class="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl shadow-sm">
                    <i class="fa-solid fa-comments"></i>
                </div>
                <h2 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight leading-tight">
                    Trợ lý Tuyển sinh AI CRM
                </h2>
                <p class="text-slate-600 text-base leading-relaxed">
                    Trợ lý tuyển sinh AI tương tác trực tiếp với phụ huynh và học sinh qua Website/Fanpage. AI tự động khai thác nhu cầu thực tế: độ tuổi, môn học mong muốn, ngân sách, vị trí địa lý... sau đó phân tích và tự động tạo cơ hội (Lead) trên CRM quản trị kèm theo đánh giá tiềm năng.
                </p>
                <div class="space-y-3.5 pt-2">
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-bold">
                        <i class="fa-solid fa-circle-check text-emerald-500 text-base"></i> Trò chuyện tự nhiên 24/7 không cần người trực.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-bold">
                        <i class="fa-solid fa-circle-check text-emerald-500 text-base"></i> Đẩy trực tiếp thông tin vào hệ thống CRM quản lý.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700 font-bold">
                        <i class="fa-solid fa-circle-check text-emerald-500 text-base"></i> Phân loại khách hàng tiềm năng bằng AI.
                    </div>
                </div>
            </div>

            <!-- Right interactive simulator -->
            <div class="lg:col-span-7">
                <div class="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[540px]">
                    <!-- Chat Header -->
                    <div class="bg-gradient-to-r from-primary to-blue-600 px-6 py-5 flex items-center justify-between text-white shadow-sm">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <div class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
                                    <i class="fa-solid fa-robot"></i>
                                </div>
                                <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
                            </div>
                            <div>
                                <h3 class="font-extrabold font-heading text-sm">Trợ lý Tuyển sinh SeduAi</h3>
                                <p class="text-[11px] text-white/80 font-semibold">Đang hoạt động tự động</p>
                            </div>
                        </div>
                        <span class="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold border border-white/10">Demo trực tiếp</span>
                    </div>

                    <!-- Chat Message Area -->
                    <div id="chat-messages" class="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                        <!-- AI welcome message -->
                        <div class="flex items-start gap-3 max-w-[85%]">
                            <div class="w-8 h-8 rounded-full bg-primary-light text-primary flex-shrink-0 flex items-center justify-center text-xs font-extrabold shadow-sm">
                                AI
                            </div>
                            <div class="bg-white border border-slate-200/60 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sm text-slate-700 leading-relaxed">
                                Xin kính chào quý phụ huynh! Tôi là trợ lý tư vấn tuyển sinh AI của SeduAi. Quý phụ huynh đang quan tâm tìm khoá học cho con đúng không ạ? Xin hỏi bé nhà mình năm nay bao nhiêu tuổi rồi ạ?
                            </div>
                        </div>
                    </div>

                    <!-- Chat Actions / Option selection buttons -->
                    <div id="chat-actions" class="p-4 border-t border-slate-100 bg-white flex flex-wrap gap-2.5 justify-center">
                        <button onclick="sendOption('Dưới 6 tuổi')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Dưới 6 tuổi</button>
                        <button onclick="sendOption('Từ 6 - 10 tuổi')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Từ 6 - 10 tuổi</button>
                        <button onclick="sendOption('Từ 11 - 15 tuổi')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Từ 11 - 15 tuổi</button>
                        <button onclick="sendOption('Trên 15 tuổi')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Trên 15 tuổi</button>
                    </div>

                    <!-- Phone Number Input (Initially hidden) -->
                    <div id="chat-input-area" class="hidden p-4 border-t border-slate-100 bg-white">
                        <div class="flex gap-2">
                            <input type="tel" id="user-phone-input" placeholder="Nhập số điện thoại của phụ huynh..." class="flex-grow px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 font-semibold">
                            <button onclick="sendPhone()" class="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-extrabold text-sm rounded-xl transition duration-200 shadow-md">Gửi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- AI Teacher Assistant (Interactive Tool) -->
<section id="ai-teacher-section" class="py-24 bg-slate-50 border-t border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <!-- Left interactive demo panel -->
            <div class="lg:col-span-7 order-last lg:order-first">
                <div class="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                    <!-- Console Header -->
                    <div class="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-slate-400 text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
                            <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
                            <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                            <span class="ml-2 font-bold">ai-teacher-assistant.py</span>
                        </div>
                        <span class="font-bold text-primary flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> ONLINE</span>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Action Selectors -->
                        <div class="flex flex-wrap gap-2.5">
                            <button onclick="triggerTeacherAI('lesson-plan')" class="teacher-btn px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition duration-200 flex items-center gap-2 border border-slate-700 cursor-pointer">
                                <i class="fa-solid fa-book-open text-primary"></i> Soạn Giáo án Lớp 4
                            </button>
                            <button onclick="triggerTeacherAI('exam-gen')" class="teacher-btn px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition duration-200 flex items-center gap-2 border border-slate-700 cursor-pointer">
                                <i class="fa-solid fa-file-pen text-primary"></i> Soạn Đề Kiểm Tra Python
                            </button>
                            <button onclick="triggerTeacherAI('student-comment')" class="teacher-btn px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition duration-200 flex items-center gap-2 border border-slate-700 cursor-pointer">
                                <i class="fa-solid fa-comment-medical text-primary"></i> Viết Nhận Xét Học Sinh
                            </button>
                        </div>

                        <!-- Console Output display -->
                        <div class="relative bg-slate-950 rounded-2xl p-5 border border-slate-800 h-[300px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed shadow-inner">
                            <!-- Spinner overlay -->
                            <div id="console-spinner" class="hidden absolute inset-0 bg-slate-950/90 flex items-center justify-center z-10 rounded-2xl">
                                <div class="flex flex-col items-center gap-3">
                                    <div class="w-9 h-9 rounded-full border-4 border-slate-800 border-t-primary animate-spin"></div>
                                    <span class="text-slate-400 font-bold">AI Co-Teacher đang xử lý yêu cầu...</span>
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
                <h2 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight leading-tight">
                    AI Co-Teacher Assistant
                </h2>
                <p class="text-slate-600 text-base leading-relaxed">
                    Giảm tải áp lực chuẩn bị bài học cho giáo viên. Chỉ với lệnh nói hoặc văn bản đơn giản, Trợ lý AI sẽ hỗ trợ đắc lực giáo viên trong việc: soạn thảo giáo án chi tiết theo chương trình, tạo kho đề thi phong phú đa dạng, hỗ trợ chấm điểm và viết nhận xét học sinh định kỳ chi tiết và ý nghĩa.
                </p>
                <div class="space-y-3.5 pt-2 font-semibold">
                    <div class="flex items-center gap-3 text-sm text-slate-700">
                        <i class="fa-solid fa-bolt text-primary text-base"></i> Tiết kiệm 10+ giờ làm việc mỗi tuần cho giáo viên.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700">
                        <i class="fa-solid fa-bolt text-primary text-base"></i> Giáo án & Đề thi chuẩn hóa, tự động tạo ba-rem đáp án.
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-700">
                        <i class="fa-solid fa-bolt text-primary text-base"></i> Nhận xét cá nhân hóa bám sát quá trình học của học viên.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Featured Courses Section -->
<section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-16">
            <div class="space-y-2">
                <span class="text-xs uppercase font-extrabold tracking-widest text-primary">Các khóa đào tạo tiêu biểu</span>
                <h2 class="text-3xl sm:text-4xl font-black font-heading text-slate-900">Khóa Học Đột Phá AI & Công Nghệ</h2>
                <p class="text-slate-500">Các khóa đào tạo kết hợp cùng công cụ Trí tuệ nhân tạo độc quyền tại SeduAi</p>
            </div>
            <a href="{{ route('courses.index') }}" class="px-6 py-3 rounded-xl border border-slate-200 hover:border-primary hover:text-primary text-slate-600 font-bold text-sm transition duration-200 flex items-center gap-2 shadow-sm">
                Xem tất cả khóa học
                <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>

        <!-- Courses Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            @foreach($featuredCourses as $course)
                <div class="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col group h-full">
                    <!-- Course Image -->
                    <div class="relative overflow-hidden aspect-video bg-slate-100">
                        <img src="{{ $course['image'] }}" alt="{{ $course['title'] }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <span class="absolute top-3.5 left-3.5 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white font-extrabold text-[10px] tracking-wider uppercase">
                            {{ $course['category'] }}
                        </span>
                    </div>

                    <!-- Card Body -->
                    <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div class="space-y-2.5">
                            <!-- Ratings & Stars -->
                            <div class="flex items-center gap-1.5 text-xs text-slate-500">
                                <span class="font-bold text-amber-500 flex items-center gap-0.5">
                                    {{ $course['rating'] }}
                                    <i class="fa-solid fa-star"></i>
                                </span>
                                <span class="font-medium">({{ $course['reviews_count'] }} đánh giá)</span>
                            </div>
                            
                            <!-- Title -->
                            <h3 class="font-bold font-heading text-slate-900 text-[16px] leading-snug line-clamp-2 group-hover:text-primary transition duration-150">
                                <a href="{{ route('courses.show', $course['slug']) }}">{{ $course['title'] }}</a>
                            </h3>
                            
                            <!-- Small metadata -->
                            <div class="flex items-center gap-3 text-xs text-slate-400 pt-1 font-semibold">
                                <span><i class="fa-solid fa-clock text-slate-300 mr-1"></i>{{ $course['duration'] }}</span>
                                <span><i class="fa-solid fa-user-graduate text-slate-300 mr-1"></i>{{ $course['student_count'] }} học viên</span>
                            </div>
                        </div>

                        <!-- Price & CTA -->
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span class="text-xs text-slate-400 line-through block">{{ number_format($course['price'], 0, ',', '.') }} đ</span>
                                <span class="font-black text-primary text-[17px]">{{ number_format($course['discount_price'], 0, ',', '.') }} đ</span>
                            </div>
                            <a href="{{ route('courses.show', $course['slug']) }}" class="px-4 py-2.5 bg-slate-900 group-hover:bg-primary text-white font-bold text-xs rounded-xl transition duration-200 shadow-sm">
                                Chi tiết
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Why Choose Us -->
<section class="py-24 bg-slate-50 border-t border-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span class="text-xs uppercase font-extrabold tracking-widest text-primary">Giá trị cốt lõi</span>
            <h2 class="text-3xl sm:text-4xl font-black font-heading text-slate-900">Tại Sao Lựa Chọn Học Tại SeduAi?</h2>
            <p class="text-slate-500 text-base">Học thực chiến, ứng dụng công nghệ hàng đầu giúp đẩy nhanh tiến trình tiếp thu tri thức.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-xl">
                    <i class="fa-solid fa-book"></i>
                </div>
                <h3 class="font-bold font-heading text-slate-900 text-base">Hệ Đào Tạo Toàn Diện</h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                    Từ tiếng Anh giao tiếp chuẩn đầu ra đến lập trình chuyên sâu, các bài học đều lồng ghép cách ứng dụng AI hỗ trợ.
                </p>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-clock"></i>
                </div>
                <h3 class="font-bold font-heading text-slate-900 text-base">Hỗ Trợ Học Tập 24/7</h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                    Học viên được cấp tài khoản AI riêng để đàm thoại luyện nói, kiểm tra code và giải thích đáp án bất kể ngày đêm.
                </p>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-chart-pie"></i>
                </div>
                <h3 class="font-bold font-heading text-slate-900 text-base">Báo Cáo Tự Động</h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                    Hệ thống tự động lưu trữ tiến trình học tập, thông báo bài làm và chất lượng cải thiện định kỳ cho học sinh và phụ huynh.
                </p>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-award"></i>
                </div>
                <h3 class="font-bold font-heading text-slate-900 text-base">Chứng Chỉ & Việc Làm</h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                    Đảm bảo đầu ra vững vàng thực hành tốt, nhận chứng chỉ uy tín từ SeduAi và cơ hội giới thiệu việc làm doanh nghiệp.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Statistics Counters -->
<section class="py-20 bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
    <!-- background styling -->
    <div class="absolute inset-0 bg-primary-dark/20 mix-blend-overlay"></div>
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-xl mb-1">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
                <h3 class="text-4xl lg:text-5xl font-black font-heading tracking-tight">15,000+</h3>
                <p class="text-primary-light font-bold text-sm lg:text-base">Học viên theo học</p>
            </div>
            <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-xl mb-1">
                    <i class="fa-solid fa-file-invoice"></i>
                </div>
                <h3 class="text-4xl lg:text-5xl font-black font-heading tracking-tight">1,200+</h3>
                <p class="text-primary-light font-bold text-sm lg:text-base">Giáo án được tạo hàng tuần</p>
            </div>
            <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-xl mb-1">
                    <i class="fa-solid fa-face-smile"></i>
                </div>
                <h3 class="text-4xl lg:text-5xl font-black font-heading tracking-tight">98%</h3>
                <p class="text-primary-light font-bold text-sm lg:text-base">Đánh giá hài lòng</p>
            </div>
            <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-xl mb-1">
                    <i class="fa-solid fa-handshake"></i>
                </div>
                <h3 class="text-4xl lg:text-5xl font-black font-heading tracking-tight">250+</h3>
                <p class="text-primary-light font-bold text-sm lg:text-base">Trung tâm đối tác</p>
            </div>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span class="text-xs uppercase font-extrabold tracking-widest text-primary">Đánh giá học viên</span>
            <h2 class="text-3xl sm:text-4xl font-black font-heading text-slate-900">Phản Hồi Từ Phụ Huynh & Học Viên</h2>
            <p class="text-slate-500 text-base">Câu chuyện thành công từ những người đã trải nghiệm hệ sinh thái học tập cùng AI.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-5 relative">
                <div class="text-amber-400 text-sm flex gap-1">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <p class="text-sm text-slate-600 italic leading-relaxed">
                    "Tôi đăng ký khóa tiếng Anh cho bé nhà tôi 10 tuổi. Bé rất hào hứng khi tối nào cũng được trò chuyện luyện phát âm với Chatbot AI của SeduAi. Kỹ năng nghe nói của con tiến bộ trông thấy."
                </p>
                <div class="flex items-center gap-3 pt-2">
                    <div class="w-11 h-11 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60" alt="Avatar" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm">Chị Thu Trang</h4>
                        <p class="text-[11px] text-slate-400 font-semibold">Phụ huynh bé Nhật Minh (Hà Nội)</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-5 relative">
                <div class="text-amber-400 text-sm flex gap-1">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <p class="text-sm text-slate-600 italic leading-relaxed">
                    "Là một giáo viên, phần mềm soạn bài của SeduAi thực sự cứu cánh cho tôi. Thay vì mất cả ngày nghỉ cuối tuần chuẩn bị bài giảng và đề kiểm tra, giờ tôi chỉ mất 30 phút rà soát giáo án AI lập ra."
                </p>
                <div class="flex items-center gap-3 pt-2">
                    <div class="w-11 h-11 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60" alt="Avatar" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm">Thầy Minh Hoàng</h4>
                        <p class="text-[11px] text-slate-400 font-semibold">Giáo viên Toán (TP. HCM)</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-5 relative">
                <div class="text-amber-400 text-sm flex gap-1">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <p class="text-sm text-slate-600 italic leading-relaxed">
                    "Khóa học lập trình Full-stack rất chất lượng. Sự đồng hành của mentor cùng với chatbot sửa lỗi code 24/7 giúp một người trái ngành như mình có thể xây dựng hoàn thiện trang web sau 6 tháng học."
                </p>
                <div class="flex items-center gap-3 pt-2">
                    <div class="w-11 h-11 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60" alt="Avatar" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm">Anh Tuấn Kiệt</h4>
                        <p class="text-[11px] text-slate-400 font-semibold">Học viên chuyển ngành (Đà Nẵng)</p>
                    </div>
                </div>
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
            ? `<div class="w-8 h-8 rounded-full bg-primary-light text-primary flex-shrink-0 flex items-center justify-center text-xs font-extrabold shadow-sm">AI</div>` 
            : '';
            
        const bubbleBg = isAI 
            ? 'bg-white border border-slate-200/60 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sm text-slate-700 leading-relaxed' 
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
        chatActions.innerHTML = `<span class="text-xs text-slate-400 font-bold flex items-center gap-1.5"><i class="fa-solid fa-spinner animate-spin text-primary"></i> Trợ lý AI đang gõ...</span>`;

        setTimeout(() => {
            if (!leadData.age) {
                leadData.age = optionText;
                appendMessage('AI', `Dạ ghi nhận bé ở độ tuổi <strong>${optionText}</strong>. Quý phụ huynh đang muốn hướng cho con học môn học gì ạ?`, true);
                
                chatActions.innerHTML = `
                    <button onclick="sendOption('Tiếng Anh & IELTS')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Tiếng Anh & IELTS</button>
                    <button onclick="sendOption('Lập trình & Máy tính')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Lập trình & Máy tính</button>
                    <button onclick="sendOption('AI & Công nghệ')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">AI & Công nghệ</button>
                    <button onclick="sendOption('Kỹ năng mềm')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Kỹ năng mềm</button>
                `;
            } else if (!leadData.subject) {
                leadData.subject = optionText;
                appendMessage('AI', `Dạ bé học môn <strong>${optionText}</strong> rất tốt ạ. Phụ huynh dự kiến chi phí đầu tư học phí hàng tháng cho bé khoảng bao nhiêu để tôi lọc khóa học phù hợp ạ?`, true);
                
                chatActions.innerHTML = `
                    <button onclick="sendOption('Dưới 1 triệu/tháng')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Dưới 1 triệu/tháng</button>
                    <button onclick="sendOption('Từ 1 - 2 triệu/tháng')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Từ 1 - 2 triệu/tháng</button>
                    <button onclick="sendOption('Trên 2 triệu/tháng')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Trên 2 triệu/tháng</button>
                `;
            } else if (!leadData.budget) {
                leadData.budget = optionText;
                appendMessage('AI', `Dạ mức ngân sách <strong>${optionText}</strong> rất phù hợp với nhiều chương trình đào tạo tối ưu của SeduAi. Phụ huynh muốn tìm lớp học Online hay tại khu vực nào để thuận tiện cho bé học ạ?`, true);
                
                chatActions.innerHTML = `
                    <button onclick="sendOption('Học Online tại nhà')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Học Online tại nhà</button>
                    <button onclick="sendOption('Quận 10, TP. HCM')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Quận 10, TP. HCM</button>
                    <button onclick="sendOption('Cầu Giấy, Hà Nội')" class="px-4 py-2 text-xs font-extrabold rounded-xl border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer">Cầu Giấy, Hà Nội</button>
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
            <ul class="list-disc pl-4 space-y-0.5 font-semibold">
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
