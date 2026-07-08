import { NextResponse } from 'next/server';

// Danh sách 63 Tỉnh/Thành phố chuẩn Việt Nam làm dữ liệu dự phòng (Fallback) khi API online.nks.vn bị lỗi CORS hoặc gián đoạn
const FALLBACK_PROVINCES = [
  { id: 1, name: 'TP. Hồ Chí Minh' },
  { id: 2, name: 'Hà Nội' },
  { id: 3, name: 'Đà Nẵng' },
  { id: 4, name: 'Hải Phòng' },
  { id: 5, name: 'Cần Thơ' },
  { id: 6, name: 'An Giang' },
  { id: 7, name: 'Bà Rịa - Vũng Tàu' },
  { id: 8, name: 'Bắc Giang' },
  { id: 9, name: 'Bắc Kạn' },
  { id: 10, name: 'Bạc Liêu' },
  { id: 11, name: 'Bắc Ninh' },
  { id: 12, name: 'Bến Tre' },
  { id: 13, name: 'Bình Định' },
  { id: 14, name: 'Bình Dương' },
  { id: 15, name: 'Bình Phước' },
  { id: 16, name: 'Bình Thuận' },
  { id: 17, name: 'Cà Mau' },
  { id: 18, name: 'Cao Bằng' },
  { id: 19, name: 'Đắk Lắk' },
  { id: 20, name: 'Đắk Nông' },
  { id: 21, name: 'Điện Biên' },
  { id: 22, name: 'Đồng Nai' },
  { id: 23, name: 'Đồng Tháp' },
  { id: 24, name: 'Gia Lai' },
  { id: 25, name: 'Hà Giang' },
  { id: 26, name: 'Hà Nam' },
  { id: 27, name: 'Hà Tĩnh' },
  { id: 28, name: 'Hải Dương' },
  { id: 29, name: 'Hậu Giang' },
  { id: 30, name: 'Hòa Bình' },
  { id: 31, name: 'Hưng Yên' },
  { id: 32, name: 'Khánh Hòa' },
  { id: 33, name: 'Kiên Giang' },
  { id: 34, name: 'Kon Tum' },
  { id: 35, name: 'Lai Châu' },
  { id: 36, name: 'Lâm Đồng' },
  { id: 37, name: 'Lạng Sơn' },
  { id: 38, name: 'Lào Cai' },
  { id: 39, name: 'Long An' },
  { id: 40, name: 'Nam Định' },
  { id: 41, name: 'Nghệ An' },
  { id: 42, name: 'Ninh Bình' },
  { id: 43, name: 'Ninh Thuận' },
  { id: 44, name: 'Phú Thọ' },
  { id: 45, name: 'Phú Yên' },
  { id: 46, name: 'Quảng Bình' },
  { id: 47, name: 'Quảng Nam' },
  { id: 48, name: 'Quảng Ngãi' },
  { id: 49, name: 'Quảng Ninh' },
  { id: 50, name: 'Quảng Trị' },
  { id: 51, name: 'Sóc Trăng' },
  { id: 52, name: 'Sơn La' },
  { id: 53, name: 'Tây Ninh' },
  { id: 54, name: 'Thái Bình' },
  { id: 55, name: 'Thái Nguyên' },
  { id: 56, name: 'Thanh Hóa' },
  { id: 57, name: 'Thừa Thiên Huế' },
  { id: 58, name: 'Tiền Giang' },
  { id: 59, name: 'Trà Vinh' },
  { id: 60, name: 'Tuyên Quang' },
  { id: 61, name: 'Vĩnh Long' },
  { id: 62, name: 'Vĩnh Phúc' },
  { id: 63, name: 'Yên Bái' },
];

export async function POST() {
  try {
    // Gọi sang server NKS từ Node.js (bỏ qua hoàn toàn CORS của trình duyệt)
    const res = await fetch('https://online.nks.vn/api/nks/provinces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country_id: 192,
        slcBox: 1,
      }),
      // Timeout 6 giây tránh treo Vercel serverless
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      console.warn(`[Proxy] online.nks.vn provinces returned ${res.status}. Using fallback.`);
      return NextResponse.json({ success: true, data: FALLBACK_PROVINCES, source: 'fallback' });
    }

    const json = await res.json();
    const list = Array.isArray(json.data || json) ? (json.data || json) : FALLBACK_PROVINCES;
    return NextResponse.json({ success: true, data: list, source: 'live' });
  } catch (error: any) {
    console.warn('[Proxy] Failed to fetch provinces from online.nks.vn:', error.message);
    return NextResponse.json({ success: true, data: FALLBACK_PROVINCES, source: 'fallback' });
  }
}

export async function GET() {
  return POST();
}
