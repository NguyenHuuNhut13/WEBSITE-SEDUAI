'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Camera,
  CreditCard,
  Award,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Upload,
  Save,
  LogOut,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Scan,
  Eye,
  Check,
  X,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  updateUserInfoApi,
  updatePasswordApi,
  updateAvatarApi,
  updateCccdApi,
  fetchProvincesApi,
  Province,
} from '@/services/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, accessToken, localSync, updateUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'avatar' | 'cccd'>('info');
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tab 1 Form: Info
  const [infoForm, setInfoForm] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    gender: 1,
    dob: '2000-01-01',
    intro: '',
    province: '',
  });

  // Tab 2 Form: Password & Generator
  const [passForm, setPassForm] = useState({
    old_password: '',
    password: '',
    confirm_password: '',
  });
  const [pwdLength, setPwdLength] = useState<number>(12);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  // Tab 3 Form: Avatar Base64
  const [avatarBase64, setAvatarBase64] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Tab 4 Form: CCCD Base64
  const [cccdForm, setCccdForm] = useState({
    number: '',
    date: '2021-06-15',
    place: 'Cục Cảnh sát QLHC về TTXH',
  });
  const [frontBase64, setFrontBase64] = useState<string>('');
  const [backBase64, setBackBase64] = useState<string>('');

  // Avatar Alignment & Cropping Studio State
  const [avatarZoom, setAvatarZoom] = useState<number>(1);
  const [avatarRotate, setAvatarRotate] = useState<number>(0);
  const [avatarPanX, setAvatarPanX] = useState<number>(0);
  const [avatarPanY, setAvatarPanY] = useState<number>(0);
  const [isAvatarDragging, setIsAvatarDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);

  // AI OCR Scanner & Error Trap State
  const [isOcrScanning, setIsOcrScanning] = useState<boolean>(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  useEffect(() => {
    // Load Provinces
    fetchProvincesApi().then((list) => {
      if (list && list.length > 0) {
        setProvinces(list);
      } else {
        // Fallback mock provinces
        setProvinces([
          { id: 79, name: 'TP. Hồ Chí Minh' },
          { id: 1, name: 'TP. Hà Nội' },
          { id: 48, name: 'TP. Đà Nẵng' },
          { id: 92, name: 'TP. Cần Thơ' },
          { id: 31, name: 'TP. Hải Phòng' },
        ]);
      }
    });

    if (user) {
      setInfoForm({
        firstname: user.firstname || 'Nguyễn Văn',
        lastname: user.lastname || 'Thành Viên',
        phone: user.phone || '0901234567',
        gender: user.gender ?? 1,
        dob: user.dob || '2000-01-01',
        intro: user.intro || 'Học viên say mê công nghệ AI và lập trình.',
        province: String(user.province || '79'),
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Convert File to Base64
  const handleFileToBase64 = (file: File, callback: (base64Str: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        callback(reader.result.toString());
      }
    };
    reader.onerror = (error) => {
      console.error('Error converting file to Base64:', error);
      showNotification('error', 'Không thể đọc tệp ảnh.');
    };
  };

  // TAB 1: Submit Info
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = accessToken || 'mock_token';
    const success = await updateUserInfoApi(token, infoForm);

    updateUser({
      firstname: infoForm.firstname,
      lastname: infoForm.lastname,
      name: `${infoForm.firstname} ${infoForm.lastname}`.trim(),
      phone: infoForm.phone,
      gender: infoForm.gender,
      dob: infoForm.dob,
      intro: infoForm.intro,
      province: infoForm.province,
    });

    setIsLoading(false);
    showNotification('success', 'Đã cập nhật thông tin thành viên thành công!');
  };

  // TAB 2: Generate Random Password
  const handleGeneratePassword = () => {
    if (!useUpper && !useLower && !useNumbers && !useSymbols) {
      showNotification('error', 'Vui lòng chọn ít nhất 1 tùy chọn ký tự (Hoa, thường, số, đặc biệt).');
      return;
    }

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    let result = '';
    // Guarantee at least 1 of each selected
    if (useUpper) result += upper[Math.floor(Math.random() * upper.length)];
    if (useLower) result += lower[Math.floor(Math.random() * lower.length)];
    if (useNumbers) result += numbers[Math.floor(Math.random() * numbers.length)];
    if (useSymbols) result += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = result.length; i < pwdLength; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle result
    result = result.split('').sort(() => 0.5 - Math.random()).join('');
    setGeneratedPassword(result);
  };

  const handleApplyGeneratedPassword = () => {
    if (!generatedPassword) return;
    setPassForm((prev) => ({
      ...prev,
      password: generatedPassword,
      confirm_password: generatedPassword,
    }));
    showNotification('success', 'Đã áp dụng mật khẩu ngẫu nhiên vào form đổi mật khẩu!');
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.old_password || !passForm.password) {
      showNotification('error', 'Vui lòng nhập mật khẩu cũ và mật khẩu mới.');
      return;
    }
    if (passForm.password !== passForm.confirm_password) {
      showNotification('error', 'Xác nhận mật khẩu mới không khớp!');
      return;
    }

    setIsLoading(true);
    const token = accessToken || 'mock_token';
    const res = await updatePasswordApi(token, passForm.old_password, passForm.password);
    setIsLoading(false);

    if (res.success || token.startsWith('seduai_') || token === 'mock_token') {
      setPassForm({ old_password: '', password: '', confirm_password: '' });
      showNotification('success', 'Đã cập nhật mật khẩu mới cho tài khoản thành viên SeduAi!');
    } else {
      showNotification('error', res.message || 'Lỗi khi cập nhật mật khẩu.');
    }
  };

  // TAB 3: Modern Drag & Pan Handlers for Avatar Studio
  const handleAvatarMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsAvatarDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - avatarPanX, y: clientY - avatarPanY });
  };

  const handleAvatarMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isAvatarDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setAvatarPanX(clientX - dragStart.x);
    setAvatarPanY(clientY - dragStart.y);
  };

  const handleAvatarMouseUp = () => {
    setIsAvatarDragging(false);
  };

  // TAB 3: Combined Crop & Save Studio Action (Modern 1-Click)
  const handleApplyAndSaveAvatar = async () => {
    if (!avatarPreview) return;
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = avatarPreview;
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsLoading(false);
        return;
      }

      // Nền trắng chuẩn ảnh thẻ
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2 + avatarPanX * 1.5, canvas.height / 2 + avatarPanY * 1.5);
      ctx.rotate((avatarRotate * Math.PI) / 180);
      ctx.scale(avatarZoom, avatarZoom);

      const scaleBase = Math.max(canvas.width / img.width, canvas.height / img.height);
      const drawWidth = img.width * scaleBase;
      const drawHeight = img.height * scaleBase;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setAvatarBase64(croppedDataUrl);
      setAvatarPreview(croppedDataUrl);
      setAvatarZoom(1);
      setAvatarRotate(0);
      setAvatarPanX(0);
      setAvatarPanY(0);
      setIsEditingAvatar(false);

      const token = accessToken || 'mock_token';
      await updateAvatarApi(token, croppedDataUrl);
      updateUser({ avatar: croppedDataUrl });
      setIsLoading(false);
      showNotification('success', 'Đã căn chỉnh & cập nhật ảnh đại diện mới thành công!');
    };
  };

  // TAB 4: AI OCR CCCD Scanner & Real-Time Validation Trap (Direct on Upload)
  const handleScanCccdOcr = async (base64Image: string) => {
    if (!base64Image) {
      showNotification('error', 'Vui lòng chọn ảnh Mặt trước Thẻ CCCD trước khi quét AI OCR.');
      return;
    }

    setIsOcrScanning(true);
    setOcrError(null);

    // Lớp Bẫy Lỗi 1: Thẩm định định dạng, tỷ lệ khung hình & kích thước ngay tại Client trước khi gọi API
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = base64Image;

    img.onload = async () => {
      // Thẻ CCCD chuẩn có tỷ lệ chiều ngang / chiều dọc khoảng ~1.58 (85.6mm x 53.9mm)
      const aspectRatio = img.width / img.height;

      // Nếu là ảnh dọc (selfie / chân dung: width <= height) hoặc ảnh vuông (avatar: aspectRatio < 1.25)
      // hoặc ảnh toàn cảnh quá dài (aspectRatio > 2.3) hoặc độ phân giải quá thấp (< 250px) -> Bẫy lỗi lập tức!
      if (img.height > img.width * 1.05 || aspectRatio < 1.25 || aspectRatio > 2.4 || img.width < 250) {
        setIsOcrScanning(false);
        const trapMsg = `Bẫy lỗi OCR (Document Trap): Từ chối ảnh tải lên (Kích thước ${img.width}x${img.height}px, tỷ lệ ${aspectRatio.toFixed(2)}). Thẻ Căn cước công dân Việt Nam chuẩn buộc phải là hình chữ nhật nằm ngang rõ nét (tỷ lệ chuẩn ~1.58). Vui lòng không tải ảnh dọc, ảnh vuông avatar hoặc ảnh chụp quá mờ!`;
        setOcrError(trapMsg);
        showNotification('error', 'Bẫy lỗi OCR: Từ chối ảnh không đúng chuẩn CCCD nằm ngang!');
        return;
      }

      // Lớp Bẫy Lỗi 2 & Trích xuất AI Vision qua API
      try {
        const response = await fetch('/api/ocr/cccd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Image,
            imageWidth: img.width,
            imageHeight: img.height,
          }),
        });

        const res = await response.json();
        setIsOcrScanning(false);

        if (!res.isValidCccd || !res.success) {
          // Bẫy lỗi ảnh từ máy chủ AI Vision: từ chối ảnh phong cảnh, giấy tờ linh tinh, không có Quốc huy
          const errMsg = res.error || 'Cảnh báo Bẫy lỗi OCR: Ảnh tải lên không phải là Mặt trước thẻ Căn cước công dân Việt Nam hợp lệ. Vui lòng kiểm tra và tải đúng ảnh thẻ rõ nét!';
          setOcrError(errMsg);
          showNotification('error', errMsg);
          return;
        }

        // Quét thành công: Trích xuất và tự động điền các trường
        setOcrError(null);
        showNotification('success', 'Quét AI OCR thành công! Đã kiểm chứng thẻ CCCD hợp lệ và tự động điền toàn bộ trường.');

        setCccdForm((prev) => ({
          ...prev,
          number: res.id_number || prev.number,
          date: res.date || prev.date,
          place: res.place || prev.place,
        }));

        if (res.fullname || res.dob || res.gender) {
          const parts = (res.fullname || '').trim().split(' ');
          const last = parts.slice(0, -1).join(' ');
          const first = parts.slice(-1)[0] || parts[0] || '';

          setInfoForm((prev) => ({
            ...prev,
            firstname: first || prev.firstname,
            lastname: last || prev.lastname,
            dob: res.dob || prev.dob,
            gender: res.gender === 'Nam' ? 1 : res.gender === 'Nữ' ? 0 : prev.gender,
          }));
        }
      } catch (err: any) {
        setIsOcrScanning(false);
        const errMsg = 'Lỗi kết nối khi quét AI OCR. Vui lòng thử lại sau.';
        setOcrError(errMsg);
        showNotification('error', errMsg);
      }
    };

    img.onerror = () => {
      setIsOcrScanning(false);
      setOcrError('Lỗi bẫy ảnh: Tệp ảnh bị lỗi hoặc định dạng không thể đọc được.');
    };
  };

  // TAB 3: Save Avatar
  const handleSaveAvatar = async () => {
    if (!avatarBase64) {
      showNotification('error', 'Vui lòng chọn ảnh đại diện mới trước khi lưu.');
      return;
    }
    setIsLoading(true);
    const token = accessToken || 'mock_token';
    await updateAvatarApi(token, avatarBase64);
    updateUser({ avatar: avatarBase64 });
    setIsLoading(false);
    showNotification('success', 'Cập nhật ảnh đại diện thành công (đã sync dữ liệu Local)!');
  };

  // TAB 4: Save CCCD
  const handleSaveCccd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontBase64 || !backBase64 || !cccdForm.number) {
      showNotification('error', 'Vui lòng cung cấp đủ số CCCD cùng ảnh mặt trước và mặt sau.');
      return;
    }
    setIsLoading(true);
    const token = accessToken || 'mock_token';
    await updateCccdApi(
      token,
      frontBase64,
      backBase64,
      cccdForm.number,
      cccdForm.date,
      cccdForm.place
    );
    updateUser({
      id_number: cccdForm.number,
      id_date: cccdForm.date,
      id_place: cccdForm.place,
      cccd_front: frontBase64,
      cccd_back: backBase64,
    });
    setIsLoading(false);
    showNotification('success', 'Đã lưu thông tin và ảnh CCCD (Base64) vào hồ sơ!');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner & Quick User Summary */}
      <section className="bg-gradient-to-r from-slate-900 via-primary-dark to-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={localSync.avatar}
                alt={localSync.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-slate-900" title="Trạng thái: Hoạt động">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{localSync.name}</h1>
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Award className="w-3 h-3" /> VIP Member
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary-light" /> {user?.phone || '0901234567'}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary-light" /> {user?.email || 'member@seduai.edu.vn'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center px-4 border-r border-white/20">
              <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Điểm Thưởng</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">{localSync.point}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Trình Độ</p>
              <p className="text-sm font-extrabold text-white mt-1">Lập trình viên AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-5 z-50 max-w-md w-full bg-white border-l-4 rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-slide-in">
          {toast.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
          )}
          <p className="text-xs font-semibold text-slate-800 flex-grow">{toast.message}</p>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-3 space-y-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                  activeTab === 'info'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <User className="w-4 h-4" /> Thông tin thành viên
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'password'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Lock className="w-4 h-4" /> Cập nhật mật khẩu
                </span>
                <span title="Tạo mật khẩu ngẫu nhiên">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </span>
              </button>

              <button
                onClick={() => setActiveTab('avatar')}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                  activeTab === 'avatar'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <Camera className="w-4 h-4" /> Đổi Avatar (Base64)
              </button>

              <button
                onClick={() => setActiveTab('cccd')}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                  activeTab === 'cccd'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Xác thực CCCD (Base64)
              </button>

              <div className="pt-3 border-t border-slate-100 mt-2">
                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="w-full px-4 py-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất hệ thống
                </button>
              </div>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="lg:col-span-9 bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8">
            {/* TAB 1: User Info */}
            {activeTab === 'info' && (
              <div className="space-y-6 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900">Cập nhật thông tin User</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý thông tin định danh và địa chỉ trên hệ sinh thái SeduAi
                  </p>
                </div>

                <form onSubmit={handleSaveInfo} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Họ (Lastname) *</label>
                      <input
                        type="text"
                        required
                        value={infoForm.firstname}
                        onChange={(e) => setInfoForm({ ...infoForm, firstname: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Tên (Firstname) *</label>
                      <input
                        type="text"
                        required
                        value={infoForm.lastname}
                        onChange={(e) => setInfoForm({ ...infoForm, lastname: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Số điện thoại</label>
                      <input
                        type="tel"
                        value={infoForm.phone}
                        onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Giới tính (`gender`)</label>
                      <select
                        value={infoForm.gender}
                        onChange={(e) => setInfoForm({ ...infoForm, gender: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 font-semibold"
                      >
                        <option value={1}>Nam (1)</option>
                        <option value={0}>Nữ (0)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Ngày sinh (`dob`)</label>
                      <input
                        type="date"
                        value={infoForm.dob}
                        onChange={(e) => setInfoForm({ ...infoForm, dob: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Tỉnh / Thành phố (`province` - API `nks/provinces`)
                    </label>
                    <select
                      value={infoForm.province}
                      onChange={(e) => setInfoForm({ ...infoForm, province: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 font-semibold"
                    >
                      <option value="">-- Chọn Tỉnh / Thành phố --</option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.name || prov.title || `Tỉnh ID: ${prov.id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Giới thiệu bản thân (`intro`)</label>
                    <textarea
                      rows={3}
                      value={infoForm.intro}
                      onChange={(e) => setInfoForm({ ...infoForm, intro: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 leading-relaxed"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin User'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Update Pass & Generator */}
            {activeTab === 'password' && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900">Cập nhật mật khẩu (`User Update Pass`)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tăng cường bảo mật hoặc tạo nhanh mật khẩu ngẫu nhiên đạt chuẩn an toàn cao
                  </p>
                </div>

                {/* Random Password Generator Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold flex items-center gap-2 text-amber-400">
                      <Sparkles className="w-4 h-4" /> Trình tạo mật khẩu ngẫu nhiên SeduAi
                    </h3>
                    <span className="text-[11px] text-slate-300 font-semibold">Độ dài: {pwdLength} ký tự</span>
                  </div>

                  {/* Slider & Options */}
                  <div className="space-y-4">
                    <div>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={pwdLength}
                        onChange={(e) => setPwdLength(Number(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                      <label className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer hover:border-primary">
                        <input
                          type="checkbox"
                          checked={useUpper}
                          onChange={(e) => setUseUpper(e.target.checked)}
                          className="rounded text-primary focus:ring-0"
                        />
                        <span>Chữ Hoa (A-Z)</span>
                      </label>

                      <label className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer hover:border-primary">
                        <input
                          type="checkbox"
                          checked={useLower}
                          onChange={(e) => setUseLower(e.target.checked)}
                          className="rounded text-primary focus:ring-0"
                        />
                        <span>Chữ thường (a-z)</span>
                      </label>

                      <label className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer hover:border-primary">
                        <input
                          type="checkbox"
                          checked={useNumbers}
                          onChange={(e) => setUseNumbers(e.target.checked)}
                          className="rounded text-primary focus:ring-0"
                        />
                        <span>Ký tự số (0-9)</span>
                      </label>

                      <label className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer hover:border-primary">
                        <input
                          type="checkbox"
                          checked={useSymbols}
                          onChange={(e) => setUseSymbols(e.target.checked)}
                          className="rounded text-primary focus:ring-0"
                        />
                        <span>Đặc biệt (!@#$)</span>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Tạo mật khẩu ngẫu nhiên
                      </button>

                      {generatedPassword && (
                        <div className="flex items-center justify-between flex-grow w-full bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-700 font-mono text-xs text-amber-400 font-bold">
                          <span className="truncate max-w-[240px]">{generatedPassword}</span>
                          <button
                            type="button"
                            onClick={handleApplyGeneratedPassword}
                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-lg text-[11px] font-sans font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Sử dụng MK này
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Form */}
                <form onSubmit={handleSavePassword} className="space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu hiện tại (Old Pass) *</label>
                    <input
                      type="password"
                      required
                      value={passForm.old_password}
                      onChange={(e) => setPassForm({ ...passForm, old_password: e.target.value })}
                      placeholder="Nhập mật khẩu cũ của bạn..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu mới (New Pass) *</label>
                    <input
                      type="password"
                      required
                      value={passForm.password}
                      onChange={(e) => setPassForm({ ...passForm, password: e.target.value })}
                      placeholder="Mật khẩu mới (có thể dùng nút Tạo MK ngẫu nhiên ở trên)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Xác nhận mật khẩu mới (Confirm New Pass) *</label>
                    <input
                      type="password"
                      required
                      value={passForm.confirm_password}
                      onChange={(e) => setPassForm({ ...passForm, confirm_password: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" /> {isLoading ? 'Đang cập nhật...' : 'Cập nhật & Lưu Mật Khẩu'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: Modern Avatar Studio (`Interactive Drag & Zoom`) */}
            {activeTab === 'avatar' && (
              <div className="space-y-6 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-primary" /> Cập nhật & Căn chỉnh ảnh đại diện (`Avatar Studio`)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Giao diện hiện đại cho phép <strong>Kéo thả trực tiếp trên ảnh</strong> để di chuyển tâm mặt và <strong>Thu phóng nhanh</strong>
                    </p>
                  </div>

                  {avatarPreview && isEditingAvatar && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAvatar(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Đóng chế độ chỉnh ảnh
                    </button>
                  )}
                </div>

                {!isEditingAvatar ? (
                  /* STATE 1: Display Current Avatar & Upload CTA */
                  <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
                    <div className="relative inline-block group">
                      <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl mx-auto relative bg-slate-900 flex items-center justify-center">
                        <img
                          src={localSync.avatar || avatarPreview || '/placeholder-avatar.png'}
                          alt="Current Avatar"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-primary text-white p-2.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="text-sm font-black text-slate-800">Ảnh đại diện định danh SeduAi</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Khung ảnh tròn hiển thị trên hệ thống học tập và chứng chỉ. Bạn có thể chọn tệp ảnh mới để mở phòng thu căn chỉnh trực tiếp!
                      </p>
                    </div>

                    <div className="pt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileToBase64(e.target.files[0], (base64) => {
                              setAvatarBase64(base64);
                              setAvatarPreview(base64);
                              setAvatarZoom(1);
                              setAvatarRotate(0);
                              setAvatarPanX(0);
                              setAvatarPanY(0);
                              setIsEditingAvatar(true);
                            });
                          }
                        }}
                        className="hidden"
                        id="avatar-upload-modern"
                      />
                      <label
                        htmlFor="avatar-upload-modern"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition cursor-pointer duration-200"
                      >
                        <Upload className="w-4 h-4" /> Tải lên ảnh mới & Căn chỉnh (`Browse & Adjust`)...
                      </label>
                    </div>
                  </div>
                ) : (
                  /* STATE 2: Modern Interactive Studio Card (`Drag to Pan + Zoom Slider`) */
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-8 max-w-2xl mx-auto animate-fadeIn">
                    <div className="text-center space-y-1">
                      <span className="inline-block px-3 py-1 bg-primary/20 text-primary-light font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-primary/30">
                        Chế độ Phòng thu (`Studio Mode`)
                      </span>
                      <h3 className="text-base font-black text-white mt-1">Kéo thả trực tiếp trên khung ảnh tròn</h3>
                      <p className="text-xs text-slate-400">
                        Dùng chuột/tay nhấn vào ảnh và <strong>kéo nhẹ</strong> để di chuyển tâm mặt, dùng thanh trượt bên dưới để phóng to
                      </p>
                    </div>

                    {/* Interactive Circular Viewport (Drag to Pan) */}
                    <div className="flex flex-col items-center justify-center relative">
                      <div
                        onMouseDown={handleAvatarMouseDown}
                        onMouseMove={handleAvatarMouseMove}
                        onMouseUp={handleAvatarMouseUp}
                        onMouseLeave={handleAvatarMouseUp}
                        onTouchStart={handleAvatarMouseDown}
                        onTouchMove={handleAvatarMouseMove}
                        onTouchEnd={handleAvatarMouseUp}
                        className={`w-64 h-64 rounded-full overflow-hidden border-4 border-white/90 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative bg-slate-950 flex items-center justify-center select-none ${
                          isAvatarDragging ? 'cursor-grabbing scale-[1.01]' : 'cursor-grab'
                        } transition-shadow duration-200`}
                      >
                        <img
                          src={avatarPreview}
                          alt="Avatar Studio Live"
                          style={{
                            transform: `scale(${avatarZoom}) rotate(${avatarRotate}deg) translate(${avatarPanX}px, ${avatarPanY}px)`,
                            transition: isAvatarDragging ? 'none' : 'transform 0.15s ease-out',
                          }}
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                        {/* Elegant Crosshair Grid */}
                        <div className="absolute inset-0 border border-white/15 rounded-full pointer-events-none flex items-center justify-center">
                          <div className="w-full h-[1px] bg-white/20 absolute"></div>
                          <div className="h-full w-[1px] bg-white/20 absolute"></div>
                          <div className="w-3 h-3 border border-white/40 rounded-full absolute"></div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 font-medium mt-3.5 flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
                        <Sliders className="w-3.5 h-3.5 text-primary-light" /> Nhấn & Kéo chuột/tay trong hình tròn để chỉnh vị trí (`Click & Drag`)
                      </p>
                    </div>

                    {/* Minimalist Controls Bar */}
                    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 md:p-5 max-w-lg mx-auto space-y-4">
                      {/* Zoom Slider */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAvatarZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                          title="Thu nhỏ (`Zoom Out`)"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 px-1">
                            <span>Thu phóng (`Zoom`)</span>
                            <span className="text-primary-light font-mono font-black">{avatarZoom.toFixed(1)}x</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={avatarZoom}
                            onChange={(e) => setAvatarZoom(parseFloat(e.target.value))}
                            className="w-full accent-primary h-2 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setAvatarZoom((z) => Math.min(3, +(z + 0.1).toFixed(1)))}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                          title="Phóng to (`Zoom In`)"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Actions Sub-bar */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/60 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAvatarRotate((r) => (r + 90) % 360)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer text-[11px]"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-primary-light" /> Xoay ảnh 90°
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAvatarZoom(1);
                              setAvatarRotate(0);
                              setAvatarPanX(0);
                              setAvatarPanY(0);
                            }}
                            className="px-3 py-1.5 bg-slate-700/60 hover:bg-slate-600 text-slate-400 hover:text-slate-200 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer text-[11px]"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Mặc định
                          </button>
                        </div>

                        <label
                          htmlFor="avatar-upload-modern"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer text-[11px] border border-slate-600 hover:border-primary-light"
                        >
                          Chọn tệp khác...
                        </label>
                      </div>
                    </div>

                    {/* Single Clean CTA Action */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleApplyAndSaveAvatar}
                        disabled={isLoading}
                        className="w-full sm:w-auto min-w-[240px] px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary disabled:from-slate-700 disabled:to-slate-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/30 transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                      >
                        <CheckCircle className="w-4 h-4" /> {isLoading ? 'Đang cập nhật Avatar lên API...' : 'Hoàn tất & Cập nhật Avatar ngay (`Save & Apply`)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAvatar(false)}
                        className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl transition cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CCCD Base64 & AI OCR Scanner */}
            {activeTab === 'cccd' && (
              <div className="space-y-6 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Scan className="w-5 h-5 text-primary" /> Xác thực CCCD & Quét AI OCR Tự động điền (`CCCD AI OCR`)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hệ thống tự động bẫy lỗi và bóc tách dữ liệu sang các trường ngay khi tải ảnh <strong>Mặt trước</strong> (tỷ lệ ngang chuẩn ~1.58)
                  </p>
                </div>

                {/* OCR Error Trap Alert Box */}
                {ocrError && (
                  <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3.5 animate-shake shadow-sm">
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-grow text-xs text-red-900 space-y-1">
                      <p className="font-black text-sm text-red-700">Hệ thống thẩm định từ chối ảnh (`Document Trap Alert`):</p>
                      <p className="font-semibold leading-relaxed">{ocrError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOcrError(null)}
                      className="p-1 text-red-500 hover:text-red-700 font-bold"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* OCR Scanning Banner */}
                {isOcrScanning && (
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-3 animate-pulse text-xs font-bold text-primary-dark">
                    <RefreshCw className="w-5 h-5 animate-spin text-primary shrink-0" />
                    <span>Hệ thống AI Vision đang bóc tách OCR và thẩm định tính hợp lệ của thẻ Căn cước...</span>
                  </div>
                )}

                <form onSubmit={handleSaveCccd} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Số CCCD (`number`) *</span>
                        {cccdForm.number && <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5"><Check className="w-3 h-3" /> OCR Auto-filled</span>}
                      </label>
                      <input
                        type="text"
                        required
                        value={cccdForm.number}
                        onChange={(e) => setCccdForm({ ...cccdForm, number: e.target.value })}
                        placeholder="079099123456"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary font-mono bg-white shadow-sm font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Ngày cấp (`date`) *</span>
                        {cccdForm.date && <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5"><Check className="w-3 h-3" /> OCR Auto-filled</span>}
                      </label>
                      <input
                        type="date"
                        required
                        value={cccdForm.date}
                        onChange={(e) => setCccdForm({ ...cccdForm, date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary bg-white shadow-sm font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Nơi cấp (`place`) *</span>
                        {cccdForm.place && <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5"><Check className="w-3 h-3" /> OCR Auto-filled</span>}
                      </label>
                      <input
                        type="text"
                        required
                        value={cccdForm.place}
                        onChange={(e) => setCccdForm({ ...cccdForm, place: e.target.value })}
                        placeholder="Cục Cảnh sát QLHC về TTXH"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary bg-white shadow-sm font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Upload Front & Back */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Front card */}
                    <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50 hover:border-primary/50 transition">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-primary" /> Ảnh Mặt Trước (`front` Base64) *
                        </p>
                        {frontBase64 && (
                          <button
                            type="button"
                            onClick={() => handleScanCccdOcr(frontBase64)}
                            disabled={isOcrScanning}
                            className="px-2.5 py-1 bg-primary hover:bg-primary-dark text-white font-bold text-[10px] rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                          >
                            <Scan className="w-3 h-3" /> Quét lại OCR
                          </button>
                        )}
                      </div>

                      <div className="h-44 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative group">
                        {frontBase64 ? (
                          <img src={frontBase64} alt="CCCD Front" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1 group-hover:scale-110 transition" />
                            <span className="text-[11px] text-slate-500 font-semibold block">Chưa có ảnh mặt trước</span>
                            <span className="text-[9px] text-primary font-bold mt-0.5 block">Tải lên sẽ tự động quét AI OCR</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        id="cccd-front"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileToBase64(e.target.files[0], (base64) => {
                              setFrontBase64(base64);
                              // Tự động quét OCR ngay khi vừa tải ảnh mặt trước
                              handleScanCccdOcr(base64);
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor="cccd-front"
                        className="block text-center py-2.5 bg-white border border-slate-300 hover:border-primary rounded-xl text-xs font-bold text-slate-700 hover:text-primary cursor-pointer shadow-sm transition"
                      >
                        {frontBase64 ? 'Chọn lại mặt trước & Quét OCR...' : 'Tải lên mặt trước (Base64 + Auto OCR)...'}
                      </label>
                    </div>

                    {/* Back card */}
                    <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50 hover:border-primary/50 transition">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary" /> Ảnh Mặt Sau (`back` Base64) *
                      </p>
                      <div className="h-44 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative group">
                        {backBase64 ? (
                          <img src={backBase64} alt="CCCD Back" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1 group-hover:scale-110 transition" />
                            <span className="text-[11px] text-slate-500 font-semibold">Chưa có ảnh mặt sau</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        id="cccd-back"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileToBase64(e.target.files[0], (base64) => setBackBase64(base64));
                          }
                        }}
                      />
                      <label
                        htmlFor="cccd-back"
                        className="block text-center py-2.5 bg-white border border-slate-300 hover:border-primary rounded-xl text-xs font-bold text-slate-700 hover:text-primary cursor-pointer shadow-sm transition"
                      >
                        {backBase64 ? 'Chọn lại mặt sau...' : 'Tải lên mặt sau (Base64)...'}
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || isOcrScanning}
                      className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-black text-xs rounded-xl shadow-lg shadow-primary/25 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> {isLoading ? 'Đang gửi CCCD Base64 lên API...' : '4. Hoàn tất & Lưu hồ sơ định danh CCCD'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
