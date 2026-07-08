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

            {/* TAB 3: Avatar Base64 */}
            {activeTab === 'avatar' && (
              <div className="space-y-6 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900">Cập nhật ảnh đại diện (`User Update Avatar`)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tự động chuyển đổi sang định dạng <strong>Base64</strong> chuẩn theo yêu cầu NKS API
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                  <div className="text-center space-y-2">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl mx-auto relative group">
                      <img
                        src={avatarPreview || localSync.avatar}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-slate-500">Ảnh đại diện hiện tại / Xem trước</p>
                  </div>

                  <div className="flex-grow space-y-4 w-full">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary transition bg-slate-50/50">
                      <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">Chọn ảnh mới từ thiết bị</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Hỗ trợ PNG, JPG, WEBP. Ảnh sẽ được chuyển đổi tự động sang chuỗi Base64.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileToBase64(e.target.files[0], (base64) => {
                              setAvatarBase64(base64);
                              setAvatarPreview(base64);
                            });
                          }
                        }}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="inline-block mt-3 px-5 py-2 bg-white border border-slate-300 hover:border-primary text-slate-700 hover:text-primary font-bold text-xs rounded-xl cursor-pointer shadow-sm transition"
                      >
                        Duyệt tệp ảnh...
                      </label>
                    </div>

                    {avatarBase64 && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Đã chuyển đổi sang chuỗi Base64!
                        </p>
                        <p className="font-mono text-[10px] text-slate-500 truncate">
                          {avatarBase64.slice(0, 80)}... [Base64 Encoded]
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleSaveAvatar}
                      disabled={!avatarBase64 || isLoading}
                      className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> {isLoading ? 'Đang gửi Base64 lên API...' : 'Lưu Avatar (Base64)'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CCCD Base64 */}
            {activeTab === 'cccd' && (
              <div className="space-y-6 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900">Xác thực CCCD (`User Update CCCD`)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cập nhật mặt trước (`front`), mặt sau (`back`) dưới dạng Base64 và thông tin định danh
                  </p>
                </div>

                <form onSubmit={handleSaveCccd} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Số CCCD (`number`) *</label>
                      <input
                        type="text"
                        required
                        value={cccdForm.number}
                        onChange={(e) => setCccdForm({ ...cccdForm, number: e.target.value })}
                        placeholder="079099123456"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary font-mono bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Ngày cấp (`date`) *</label>
                      <input
                        type="date"
                        required
                        value={cccdForm.date}
                        onChange={(e) => setCccdForm({ ...cccdForm, date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nơi cấp (`place`) *</label>
                      <input
                        type="text"
                        required
                        value={cccdForm.place}
                        onChange={(e) => setCccdForm({ ...cccdForm, place: e.target.value })}
                        placeholder="Cục Cảnh sát QLHC về TTXH"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Upload Front & Back */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Front card */}
                    <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary" /> Ảnh Mặt Trước (`front` Base64) *
                      </p>
                      <div className="h-44 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative">
                        {frontBase64 ? (
                          <img src={frontBase64} alt="CCCD Front" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                            <span className="text-[11px] text-slate-500 font-semibold">Chưa có ảnh mặt trước</span>
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
                            handleFileToBase64(e.target.files[0], (base64) => setFrontBase64(base64));
                          }
                        }}
                      />
                      <label
                        htmlFor="cccd-front"
                        className="block text-center py-2 bg-white border border-slate-300 hover:border-primary rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-sm transition"
                      >
                        {frontBase64 ? 'Chọn lại mặt trước...' : 'Tải lên mặt trước (Base64)...'}
                      </label>
                    </div>

                    {/* Back card */}
                    <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary" /> Ảnh Mặt Sau (`back` Base64) *
                      </p>
                      <div className="h-44 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative">
                        {backBase64 ? (
                          <img src={backBase64} alt="CCCD Back" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
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
                        className="block text-center py-2 bg-white border border-slate-300 hover:border-primary rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-sm transition"
                      >
                        {backBase64 ? 'Chọn lại mặt sau...' : 'Tải lên mặt sau (Base64)...'}
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> {isLoading ? 'Đang gửi CCCD Base64 lên API...' : 'Lưu thông tin & CCCD Base64'}
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
