<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'SeduAi - Hệ điều hành AI dành cho giáo dục')</title>
    <meta name="description" content="@yield('meta_description', 'SeduAi kết hợp trí tuệ nhân tạo đột phá để tối ưu hóa quy trình giáo dục, tuyển sinh thông minh và đồng hành học tập cùng học viên.')">
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Maplibre GL CSS (for Contact page) -->
    @yield('styles')

    <!-- Vite Styles & Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen flex flex-col">

    <!-- Header Navigation -->
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="{{ route('home') }}" class="flex items-center space-x-2">
                        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                            <i class="fa-solid fa-brain text-xl"></i>
                        </div>
                        <span class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Sedu<span class="text-primary">Ai</span></span>
                    </a>
                </div>

                <!-- Desktop Navigation Menu -->
                <nav class="hidden md:flex space-x-8 text-sm font-semibold">
                    <a href="{{ route('home') }}" class="transition duration-200 {{ request()->routeIs('home') ? 'text-primary' : 'text-slate-600 hover:text-primary' }}">Trang chủ</a>
                    <a href="{{ route('courses.index') }}" class="transition duration-200 {{ request()->routeIs('courses.*') ? 'text-primary' : 'text-slate-600 hover:text-primary' }}">Khóa học</a>
                    <a href="{{ route('home') }}#features" class="text-slate-600 hover:text-primary transition duration-200">Hệ sinh thái AI</a>
                    <a href="{{ route('contact.show') }}" class="transition duration-200 {{ request()->routeIs('contact.show') ? 'text-primary' : 'text-slate-600 hover:text-primary' }}">Liên hệ</a>
                </nav>

                <!-- CTA Button -->
                <div class="hidden md:flex items-center space-x-4">
                    <a href="{{ route('home') }}#ai-crm-demo" class="px-5 py-2.5 rounded-full bg-primary-light text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2">
                        <i class="fa-solid fa-comments"></i> Chat với AI
                    </a>
                    <a href="{{ route('courses.index') }}" class="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all duration-300 shadow-md shadow-primary/10">
                        Học thử ngay
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <div class="flex items-center md:hidden">
                    <button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 focus:outline-none transition duration-200">
                        <i class="fa-solid fa-bars text-xl" id="menu-icon-open"></i>
                        <i class="fa-solid fa-xmark text-xl hidden" id="menu-icon-close"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div id="mobile-menu" class="hidden md:hidden border-b border-slate-100 bg-white absolute top-full left-0 w-full shadow-lg transition-all duration-300">
            <div class="px-4 pt-2 pb-6 space-y-3">
                <a href="{{ route('home') }}" class="block px-4 py-2.5 rounded-xl text-base font-semibold {{ request()->routeIs('home') ? 'bg-primary-light text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary' }}">Trang chủ</a>
                <a href="{{ route('courses.index') }}" class="block px-4 py-2.5 rounded-xl text-base font-semibold {{ request()->routeIs('courses.*') ? 'bg-primary-light text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary' }}">Khóa học</a>
                <a href="{{ route('home') }}#features" class="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary">Hệ sinh thái AI</a>
                <a href="{{ route('contact.show') }}" class="block px-4 py-2.5 rounded-xl text-base font-semibold {{ request()->routeIs('contact.show') ? 'bg-primary-light text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary' }}">Liên hệ</a>
                
                <div class="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <a href="{{ route('home') }}#ai-crm-demo" class="w-full text-center px-5 py-3 rounded-xl bg-primary-light text-primary font-bold text-sm flex items-center justify-center gap-2">
                        <i class="fa-solid fa-comments"></i> Chat với AI Tuyển sinh
                    </a>
                    <a href="{{ route('courses.index') }}" class="w-full text-center px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/10">
                        Đăng ký học thử
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Toast Notification (Success messages) -->
    @if(session('success'))
        <div id="toast-success" class="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border-l-4 border-emerald-500 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slide-in duration-300">
            <div class="text-emerald-500 mt-0.5">
                <i class="fa-solid fa-circle-check text-lg"></i>
            </div>
            <div class="flex-grow">
                <p class="text-sm font-semibold text-slate-800">Thành công!</p>
                <p class="text-xs text-slate-600 mt-0.5">{{ session('success') }}</p>
            </div>
            <button onclick="document.getElementById('toast-success').remove()" class="text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    @endif

    <!-- Footer Area -->
    <footer class="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <!-- Col 1: Brand Info -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                            <i class="fa-solid fa-brain text-xl"></i>
                        </div>
                        <span class="text-2xl font-extrabold tracking-tight text-white">Sedu<span class="text-primary">Ai</span></span>
                    </div>
                    <p class="text-sm leading-relaxed">
                        Hệ điều hành trí tuệ nhân tạo toàn diện cho giáo dục. Đột phá tuyển sinh, nâng tầm chất lượng dạy học và tự động hóa quy trình quản lý.
                    </p>
                    <div class="flex space-x-4 pt-2">
                        <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition duration-200"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition duration-200"><i class="fa-brands fa-linkedin-in"></i></a>
                        <a href="#" class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition duration-200"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>

                <!-- Col 2: Quick Links -->
                <div>
                    <h3 class="text-white font-bold text-base mb-5">Hệ thống & Phân hệ</h3>
                    <ul class="space-y-2.5 text-sm">
                        <li><a href="#" class="hover:text-primary transition duration-150">Admissions CRM</a></li>
                        <li><a href="#" class="hover:text-primary transition duration-150">AI Teacher Assistant</a></li>
                        <li><a href="#" class="hover:text-primary transition duration-150">Học viên & Phụ huynh</a></li>
                        <li><a href="#" class="hover:text-primary transition duration-150">Workflow Automation</a></li>
                        <li><a href="#" class="hover:text-primary transition duration-150">AI Marketplace</a></li>
                    </ul>
                </div>

                <!-- Col 3: Courses -->
                <div>
                    <h3 class="text-white font-bold text-base mb-5">Khóa học Đào tạo</h3>
                    <ul class="space-y-2.5 text-sm">
                        <li><a href="{{ route('courses.index', ['category' => 'Tiếng Anh']) }}" class="hover:text-primary transition duration-150">Tiếng Anh giao tiếp & IELTS</a></li>
                        <li><a href="{{ route('courses.index', ['category' => 'Lập trình']) }}" class="hover:text-primary transition duration-150">Lập trình Fullstack & Python</a></li>
                        <li><a href="{{ route('courses.index', ['category' => 'AI & Công nghệ']) }}" class="hover:text-primary transition duration-150">Ứng dụng AI doanh nghiệp</a></li>
                        <li><a href="{{ route('courses.index', ['category' => 'Kỹ năng']) }}" class="hover:text-primary transition duration-150">Kỹ năng mềm thế hệ mới</a></li>
                    </ul>
                </div>

                <!-- Col 4: Contact -->
                <div>
                    <h3 class="text-white font-bold text-base mb-5">Liên hệ SeduAi</h3>
                    <ul class="space-y-3.5 text-sm">
                        <li class="flex items-start gap-2.5">
                            <i class="fa-solid fa-location-dot text-primary mt-1"></i>
                            <span>Tầng 5, Tòa nhà SeduAi, Đường 3/2, Quận 10, TP. Hồ Chí Minh</span>
                        </li>
                        <li class="flex items-center gap-2.5">
                            <i class="fa-solid fa-phone text-primary"></i>
                            <a href="tel:19001234" class="hover:text-primary">1900 1234 (Hotline)</a>
                        </li>
                        <li class="flex items-center gap-2.5">
                            <i class="fa-solid fa-envelope text-primary"></i>
                            <a href="mailto:contact@seduai.edu.vn" class="hover:text-primary">contact@seduai.edu.vn</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Copyright -->
            <div class="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>&copy; 2026 SeduAi. Tất cả quyền được bảo lưu.</p>
                <div class="flex space-x-6">
                    <a href="#" class="hover:text-slate-300">Điều khoản dịch vụ</a>
                    <a href="#" class="hover:text-slate-300">Chính sách bảo mật</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Interactive Scripts -->
    <script>
        // Toggle mobile menu
        const btn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        const openIcon = document.getElementById('menu-icon-open');
        const closeIcon = document.getElementById('menu-icon-close');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });

        // Hide mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                menu.classList.add('hidden');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });

        // Auto remove toast after 5s
        const toast = document.getElementById('toast-success');
        if (toast) {
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                setTimeout(() => toast.remove(), 500);
            }, 5000);
        }
    </script>
    
    @yield('scripts')
</body>
</html>
