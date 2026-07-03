@extends('layouts.app')

@section('title', 'Liên hệ SeduAi - Hệ điều hành AI cho Giáo dục')

@section('styles')
<!-- Maplibre GL CSS -->
<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
<style>
    /* Styling map controls to fit our primary color */
    .maplibregl-ctrl-group button span {
        color: #0077bb;
    }
</style>
@endsection

@section('content')

<!-- Header Banner -->
<section class="bg-slate-900 text-white py-16 relative overflow-hidden">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Liên Hệ Với SeduAi</h1>
        <p class="text-slate-400 text-sm max-w-xl mx-auto">
            Học tập thực chiến cùng các giảng viên chất lượng cao kết hợp với Trợ lý ảo AI đắc lực hỗ trợ 24/7.
        </p>
        
        <!-- Breadcrumb -->
        <nav class="flex justify-center text-xs font-semibold text-slate-400 gap-2 pt-2">
            <a href="{{ route('home') }}" class="hover:text-primary transition">Trang chủ</a>
            <span>/</span>
            <span class="text-primary-light">Liên hệ</span>
        </nav>
    </div>
</section>

<!-- Contact Content Section -->
<section class="py-16 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Three-column Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <!-- Card 1: Address -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg flex-shrink-0">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <div class="space-y-1">
                    <h3 class="font-bold text-slate-900 text-sm">Văn phòng chính</h3>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        Tầng 5, Tòa nhà SeduAi, Đường 3/2, Quận 10, TP. Hồ Chí Minh
                    </p>
                </div>
            </div>

            <!-- Card 2: Phone -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg flex-shrink-0">
                    <i class="fa-solid fa-phone"></i>
                </div>
                <div class="space-y-1">
                    <h3 class="font-bold text-slate-900 text-sm">Hotline liên hệ</h3>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        Chuyên viên tư vấn sẵn sàng hỗ trợ 24/7.
                    </p>
                    <a href="tel:19001234" class="text-xs font-bold text-primary hover:underline block pt-0.5">1900 1234 (Miễn phí)</a>
                </div>
            </div>

            <!-- Card 3: Email -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center text-lg flex-shrink-0">
                    <i class="fa-solid fa-envelope-open-text"></i>
                </div>
                <div class="space-y-1">
                    <h3 class="font-bold text-slate-900 text-sm">Email liên hệ</h3>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        Gửi email để hợp tác hoặc yêu cầu hỗ trợ.
                    </p>
                    <a href="mailto:contact@seduai.edu.vn" class="text-xs font-bold text-primary hover:underline block pt-0.5">contact@seduai.edu.vn</a>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left: Contact Form -->
            <div class="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
                <h2 class="text-xl font-extrabold text-slate-950 mb-1">Gửi lời nhắn cho SeduAi</h2>
                <p class="text-xs text-slate-500 mb-6">Hãy gửi thắc mắc của bạn qua mẫu bên dưới, Trợ lý AI và đội ngũ tư vấn sẽ trả lời bạn sớm nhất.</p>
                
                <form action="{{ route('contact.submit') }}" method="POST" class="space-y-4">
                    @csrf
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ và tên *</label>
                            <input type="text" name="name" required placeholder="Nguyễn Văn A" class="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại *</label>
                            <input type="tel" name="phone" required placeholder="0901234567" class="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50">
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Địa chỉ Email *</label>
                        <input type="email" name="email" required placeholder="email@gmail.com" class="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50">
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lời nhắn của bạn *</label>
                        <textarea name="message" rows="4" required placeholder="Tôi muốn tìm hiểu thêm về khóa học tiếng Anh..." class="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 leading-relaxed"></textarea>
                    </div>

                    <button type="submit" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition duration-200 shadow-md flex items-center gap-2">
                        <i class="fa-solid fa-paper-plane"></i> Gửi lời nhắn
                    </button>
                </form>
            </div>

            <!-- Right: Maplibre Map -->
            <div class="lg:col-span-6 space-y-4">
                <div class="bg-white border border-slate-200 rounded-3xl p-4 shadow-md">
                    <!-- Map Container -->
                    <div id="map" class="w-full h-[360px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-100"></div>
                </div>
                <div class="flex items-center gap-2.5 text-xs text-slate-500 px-4">
                    <i class="fa-solid fa-circle-info text-primary"></i>
                    <span>Tọa độ hiển thị: <strong>[10.7712, 106.6773]</strong>. Nhấp và kéo để xoay bản đồ vector mượt mà.</span>
                </div>
            </div>

        </div>
    </div>
</section>

@endsection

@section('scripts')
<!-- Maplibre GL JS -->
<script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
<script>
    // Khởi tạo bản đồ Maplibre GL
    try {
        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json', // Nguồn bản đồ vector mẫu miễn phí không cần API Key
            center: [106.6773, 10.7712], // [Kinh độ, Vĩ độ] Đường 3/2, Quận 10, TP.HCM
            zoom: 14,
            pitch: 30 // Độ nghiêng giúp bản đồ trông 3D hiện đại
        });

        // Thêm các nút điều khiển thu phóng, xoay
        map.addControl(new maplibregl.NavigationControl());

        // Tạo phần popup hiển thị khi bấm vào marker
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="font-sans p-1 text-slate-800 text-xs">
                <h4 class="font-bold text-primary text-sm flex items-center gap-1"><i class="fa-solid fa-brain"></i> SeduAi</h4>
                <p class="text-slate-500 mt-1 leading-snug">Hệ điều hành AI dành cho giáo dục</p>
                <p class="font-semibold text-slate-600 mt-0.5">Tòa nhà SeduAi, Đường 3/2, Quận 10</p>
            </div>
        `);

        // Tạo Maker màu chủ đạo #0077bb
        const marker = new maplibregl.Marker({ color: '#0077bb' })
            .setLngLat([106.6773, 10.7712])
            .setPopup(popup)
            .addTo(map);

        // Mặc định mở popup
        marker.togglePopup();
        
    } catch (e) {
        console.error('Không thể tải bản đồ Maplibre: ', e);
        document.getElementById('map').innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
                <p class="text-xs font-semibold">Lỗi kết nối bản đồ. Vui lòng kiểm tra lại kết nối mạng.</p>
            </div>
        `;
    }
</script>
@endsection
