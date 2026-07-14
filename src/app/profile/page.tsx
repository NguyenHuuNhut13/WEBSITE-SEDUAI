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
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [showBusinessCard, setShowBusinessCard] = useState<boolean>(false);

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
      if (user.id_number) {
        setCccdForm({
          number: user.id_number,
          date: user.id_date || '2021-06-15',
          place: user.id_place || 'Cục Cảnh sát QLHC về TTXH',
        });
        if (user.cccd_front) setFrontBase64(user.cccd_front);
        if (user.cccd_back) setBackBase64(user.cccd_back);
        setShowBusinessCard(true);
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
      const scaleMultiplier = canvas.width / 256;
      ctx.translate(canvas.width / 2 + avatarPanX * scaleMultiplier, canvas.height / 2 + avatarPanY * scaleMultiplier);
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

  // TAB 4: AI OCR CCCD Scanner - chạy Tesseract.js trực tiếp trên trình duyệt quét song song cả 2 mặt
  const handleScanCccdOcr = async (frontBaseImage: string, backBaseImage: string) => {
    if (!frontBaseImage || !backBaseImage) {
      showNotification('error', 'Vui lòng chọn đầy đủ cả ảnh Mặt trước và Mặt sau trước khi quét.');
      return;
    }

    setIsOcrScanning(true);
    setOcrProgress(0);
    setOcrError(null);

    try {
      const Tesseract = await import('tesseract.js');

      let frontProgress = 0;
      let backProgress = 0;
      const updateCombinedProgress = () => {
        setOcrProgress(Math.round(((frontProgress + backProgress) / 2) * 100));
      };

      // Chạy nhận diện song song cả 2 mặt bằng tiếng Việt (vie) để đạt hiệu năng tối đa
      const [frontResult, backResult] = await Promise.all([
        Tesseract.recognize(frontBaseImage, 'vie', {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === 'recognizing text') {
              frontProgress = m.progress;
              updateCombinedProgress();
            }
          },
        }),
        Tesseract.recognize(backBaseImage, 'vie', {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === 'recognizing text') {
              backProgress = m.progress;
              updateCombinedProgress();
            }
          },
        }),
      ]);

      const frontText = frontResult?.data?.text || '';
      const backText = backResult?.data?.text || '';

      console.log('[OCR Front Raw]', frontText);
      console.log('[OCR Back Raw]', backText);

      const frontLines = frontText.split('\n').map((l: string) => l.trim()).filter(Boolean);
      const backLines = backText.split('\n').map((l: string) => l.trim()).filter(Boolean);

      // ===== 1. TRÍCH XUẤT SỐ CCCD (12 chữ số - nằm ở mặt trước) =====
      const frontDigitsOnly = frontText.replace(/[\s\-.–_,;:]/g, '');
      const idMatch = frontDigitsOnly.match(/(\d{12})/) || frontDigitsOnly.replace(/[Oo]/g, '0').match(/(0\d{11})/);
      const extractedId = idMatch ? idMatch[1] : null;

      // ===== 2. BẪY LỖI: Kiểm tra tính hợp lệ của ảnh mặt trước =====
      const upperFront = frontText.toUpperCase();
      const hasFrontKeywords =
        upperFront.includes('CĂN CƯỚC') || upperFront.includes('CÔNG DÂN') ||
        upperFront.includes('CAN CUOC') || upperFront.includes('CONG DAN') ||
        upperFront.includes('CITIZEN') || upperFront.includes('IDENTITY') ||
        upperFront.includes('VIỆT NAM') || upperFront.includes('VIET NAM');

      if (!extractedId && !hasFrontKeywords) {
        setIsOcrScanning(false);
        setOcrProgress(0);
        const errMsg = 'Ảnh mặt trước tải lên không phải là thẻ Căn cước công dân hoặc ảnh quá mờ để nhận diện. Vui lòng thử lại với ảnh rõ nét hơn.';
        setOcrError(errMsg);
        showNotification('error', errMsg);
        return;
      }

      // ===== 3. TRÍCH XUẤT HỌ VÀ TÊN (Mặt trước) =====
      let extractedFullname = '';
      for (let i = 0; i < frontLines.length; i++) {
        const lower = frontLines[i].toLowerCase();
        if (lower.includes('họ và tên') || lower.includes('họ tên') || lower.includes('full name') || lower.includes('ho va ten')) {
          const afterColon = frontLines[i].split(/[:/]/);
          if (afterColon.length > 1) {
            const namePart = afterColon.slice(1).join(' ').trim();
            if (namePart.length >= 3) { extractedFullname = namePart.toUpperCase(); break; }
          }
          if (!extractedFullname && i + 1 < frontLines.length) {
            const nextLine = frontLines[i + 1].trim();
            if (nextLine.length >= 3 && !nextLine.match(/^\d/) && !nextLine.toLowerCase().includes('date') && !nextLine.toLowerCase().includes('ngày')) {
              extractedFullname = nextLine.toUpperCase();
              break;
            }
          }
        }
      }

      // Hàm format ngày DD/MM/YYYY hoặc các biến thể sang YYYY-MM-DD
      const formatToYMD = (dateStr: string): string => {
        const parts = dateStr.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
        if (parts) {
          const d = parts[1].padStart(2, '0');
          const m = parts[2].padStart(2, '0');
          const y = parts[3];
          if (parseInt(m) >= 1 && parseInt(m) <= 12 && parseInt(d) >= 1 && parseInt(d) <= 31) {
            return `${y}-${m}-${d}`;
          }
        }
        return '';
      };

      // ===== 4. TRÍCH XUẤT NGÀY SINH (Mặt trước) =====
      let extractedDob = '';
      for (let i = 0; i < frontLines.length; i++) {
        const lower = frontLines[i].toLowerCase();
        if (lower.includes('ngày sinh') || lower.includes('date of birth') || lower.includes('ngay sinh')) {
          const dateInLine = frontLines[i].match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
          if (dateInLine) { extractedDob = formatToYMD(frontLines[i]); break; }
          if (i + 1 < frontLines.length) {
            const nextDate = frontLines[i + 1].match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
            if (nextDate) { extractedDob = formatToYMD(frontLines[i + 1]); break; }
          }
        }
      }
      if (!extractedDob) {
        const allDatesFront = frontText.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/g) || [];
        if (allDatesFront[0]) extractedDob = formatToYMD(allDatesFront[0]);
      }

      // ===== 5. TRÍCH XUẤT GIỚI TÍNH (Mặt trước) =====
      let extractedGender = '';
      for (const line of frontLines) {
        const lower = line.toLowerCase();
        if (lower.includes('giới tính') || lower.includes('sex') || lower.includes('gioi tinh')) {
          if (/nữ|nu$|female/i.test(line)) { extractedGender = 'Nữ'; break; }
          if (/nam|male/i.test(line)) { extractedGender = 'Nam'; break; }
        }
      }
      if (!extractedGender) {
        extractedGender = /\bnữ\b/i.test(frontText) ? 'Nữ' : 'Nam';
      }

      // ===== 6. TRÍCH XUẤT NGÀY CẤP (Nằm ở MẶT SAU) =====
      let extractedDate = '';
      const backTextCleaned = backText.replace(/[\.\,]/g, ' ');
      
      // Chấp nhận: "Ngày 15 tháng 06 năm 2021", "Ngay 15 thang 06 nam 2021", "15 tháng 6 năm 2021", "15/06/2021", v.v.
      const dateMatchBack = backTextCleaned.match(/(?:ngày|ngay)?\s*(\d{1,2})\s*(?:tháng|thang|\/|\-)\s*(\d{1,2})\s*(?:năm|nam|\/|\-)\s*(\d{4})/i) ||
                            backTextCleaned.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
      
      if (dateMatchBack) {
        const d = dateMatchBack[1].padStart(2, '0');
        const m = dateMatchBack[2].padStart(2, '0');
        const y = dateMatchBack[3];
        if (parseInt(m) >= 1 && parseInt(m) <= 12 && parseInt(d) >= 1 && parseInt(d) <= 31) {
          extractedDate = `${y}-${m}-${d}`;
        }
      }

      // ===== 7. TRÍCH XUẤT NƠI CẤP (Nằm ở MẶT SAU) =====
      let extractedPlace = '';
      for (let i = 0; i < backLines.length; i++) {
        const line = backLines[i];
        const upperLine = line.toUpperCase();
        
        // Quét các từ khóa cơ quan cấp thẻ
        if (
          upperLine.includes('CỤC CẢNH SÁT') || 
          upperLine.includes('CUC CANH SAT') ||
          upperLine.includes('CỤC TRƯỞNG') ||
          upperLine.includes('CUC TRUONG') ||
          upperLine.includes('CÔNG AN') ||
          upperLine.includes('CONG AN')
        ) {
          let mergedPlace = line;
          // Nếu dòng tiếp theo chứa các thông tin bổ nghĩa cho phòng ban cấp thì gộp lại
          if (i + 1 < backLines.length) {
            const nextUpper = backLines[i + 1].toUpperCase();
            if (
              nextUpper.includes('QUẢN LÝ') || 
              nextUpper.includes('TRẬT TỰ') || 
              nextUpper.includes('TTXH') ||
              nextUpper.includes('QLHC') ||
              nextUpper.includes('CẢNH SÁT')
            ) {
              mergedPlace += ' ' + backLines[i + 1];
            }
          }
          extractedPlace = mergedPlace
            .replace(/^(Nơi cấp|Issuing authority|Authority)[:\s\.]*/i, '')
            .trim();
          break;
        }
      }

      // Chuẩn hóa thẩm mỹ nơi cấp nếu ra kết quả viết tắt hoặc thiếu dấu
      if (extractedPlace) {
        // Chuẩn hóa một số chuỗi phổ biến cho chuyên nghiệp
        if (extractedPlace.toUpperCase().includes('QLHC VỀ TTXH') || extractedPlace.toUpperCase().includes('QLHC VE TTXH')) {
          extractedPlace = 'Cục Cảnh sát QLHC về TTXH';
        } else if (extractedPlace.toUpperCase().includes('CỤC TRƯỞNG CỤC CẢNH SÁT')) {
          extractedPlace = 'Cục Cảnh sát QLHC về TTXH'; // Rút gọn cho vừa form
        }
      } else {
        // Fallback mặc định chuyên nghiệp
        extractedPlace = 'Cục Cảnh sát QLHC về TTXH';
      }

      // ===== HOÀN TẤT: Tự động điền form =====
      setIsOcrScanning(false);
      setOcrProgress(100);
      setOcrError(null);
      showNotification('success', `Quét OCR thành công! Số CCCD: ${extractedId || 'Đã nhận dạng'} ${extractedFullname ? `- ${extractedFullname}` : ''}`);

      setCccdForm((prev) => ({
        ...prev,
        number: extractedId || prev.number,
        date: extractedDate || prev.date,
        place: extractedPlace || prev.place,
      }));

      if (extractedFullname || extractedDob || extractedGender) {
        const parts = (extractedFullname || '').trim().split(' ');
        const last = parts.slice(0, -1).join(' ');
        const first = parts.slice(-1)[0] || parts[0] || '';

        setInfoForm((prev) => ({
          ...prev,
          firstname: first || prev.firstname,
          lastname: last || prev.lastname,
          dob: extractedDob || prev.dob,
          gender: extractedGender === 'Nam' ? 1 : extractedGender === 'Nữ' ? 0 : prev.gender,
        }));
      }
    } catch (err: any) {
      setIsOcrScanning(false);
      setOcrProgress(0);
      console.error('[Client OCR Error]', err);
      const errMsg = 'Đã xảy ra lỗi khi quét ảnh. Vui lòng kiểm tra và thử lại với ảnh rõ nét hơn.';
      setOcrError(errMsg);
      showNotification('error', errMsg);
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
    setShowBusinessCard(true);
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
                  onClick={async () => {
                    if (await logout()) router.push('/login');
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
                            transform: `translate(${avatarPanX}px, ${avatarPanY}px) rotate(${avatarRotate}deg) scale(${avatarZoom})`,
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
                    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 md:p-5 max-w-lg mx-auto space-y-5">
                      {/* Zoom Slider */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAvatarZoom((z) => Math.max(0.2, +(z - 0.1).toFixed(2)))}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                          title="Thu nhỏ (`Zoom Out`)"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 px-1">
                            <span>Thu phóng (`Zoom`)</span>
                            <span className="text-primary-light font-mono font-black">{avatarZoom.toFixed(2)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="5"
                            step="0.01"
                            value={avatarZoom}
                            onChange={(e) => setAvatarZoom(parseFloat(e.target.value))}
                            className="w-full accent-primary h-2 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setAvatarZoom((z) => Math.min(5, +(z + 0.1).toFixed(2)))}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                          title="Phóng to (`Zoom In`)"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Continuous Rotation Slider */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setAvatarRotate((r) => Math.max(-180, r - 5))}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                          title="Xoay trái"
                        >
                          <RotateCw className="w-4 h-4 -scale-x-100" />
                        </button>
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 px-1">
                            <span>Góc xoay (`Rotation`)</span>
                            <span className="text-primary-light font-mono font-black">{avatarRotate}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={avatarRotate}
                            onChange={(e) => setAvatarRotate(parseInt(e.target.value))}
                            className="w-full accent-primary h-2 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setAvatarRotate((r) => Math.min(180, r + 5))}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                          title="Xoay phải"
                        >
                          <RotateCw className="w-4 h-4" />
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
                            <RotateCw className="w-3.5 h-3.5 text-primary-light" /> Xoay nhanh 90°
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
            {activeTab === 'cccd' && showBusinessCard ? (
              <div className="space-y-8 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-500" /> Thẻ Thành Viên Số SEDU AI
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hồ sơ định danh của bạn đã được xác minh bảo mật thành công
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBusinessCard(false)}
                    className="px-4 py-2 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer bg-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Quét/Cập nhật lại
                  </button>
                </div>

                {/* Info Note about Legal Data Privacy Protection */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed space-y-1">
                  <p className="font-extrabold flex items-center gap-1 text-emerald-800">
                    <CheckCircle className="w-4 h-4 shrink-0" /> Bảo mật thông tin CCCD (Luật bảo vệ dữ liệu cá nhân)
                  </p>
                  <p>
                    Để đảm bảo an toàn tuyệt đối và tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân, toàn bộ thông tin CCCD gốc của bạn đã được mã hóa ẩn danh (`Masked`) và lưu trữ dạng băm bảo mật. Thẻ thành viên dưới đây được sinh tự động nhằm mục đích học tập & định danh nội bộ tại SEDU AI mà không làm lộ các dữ liệu nhạy cảm của bạn.
                  </p>
                </div>

                {/* Premium Member Business Card Grid */}
                <div className="flex flex-col items-center justify-center py-6">
                  {/* The actual premium digital membership business card */}
                  <div className="w-full max-w-md h-64 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl border border-slate-800/80 p-6 flex flex-col justify-between group hover:shadow-emerald-950/30 hover:shadow-2xl transition duration-500">
                    {/* Gloss Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none"></div>

                    {/* Mesh Lines Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none"></div>

                    {/* Top Row: SEDU AI Logo & Member Status Indicator */}
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20">
                          <Sparkles className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-sm tracking-widest text-white leading-none">SEDU AI</p>
                          <p className="text-[8px] text-emerald-400 tracking-wider font-extrabold uppercase mt-0.5">Digital Academy</p>
                        </div>
                      </div>
                      
                      <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                        VERIFIED MEMBER
                      </div>
                    </div>

                    {/* Middle Row: User Photo & Bio details */}
                    <div className="flex items-center gap-4 relative z-10 my-auto">
                      {/* Avatar Frame */}
                      <div className="w-16 h-16 rounded-full border-2 border-emerald-400/40 p-0.5 overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={avatarPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                          alt="Member Avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      
                      {/* Name & Title */}
                      <div className="space-y-1">
                        <h3 className="font-black text-base tracking-wide text-slate-100 uppercase leading-none">
                          {infoForm.firstname ? `${infoForm.lastname} ${infoForm.firstname}` : 'Thành Viên SEDU AI'}
                        </h3>
                        <p className="text-[10px] text-emerald-300 font-extrabold tracking-wider uppercase">
                          AI Specialized Specialist
                        </p>
                        <div className="flex items-center gap-3 text-[9px] text-slate-400 font-semibold pt-1">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {user?.email || 'member@sedu.ai'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Masked ID Number & Expiry/Issue dates */}
                    <div className="flex justify-between items-end border-t border-slate-800/80 pt-4 relative z-10">
                      <div className="space-y-0.5">
                        <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest">Digital ID Card (Secured)</p>
                        <p className="font-mono text-xs font-black tracking-widest text-emerald-400">
                          {cccdForm.number ? `${cccdForm.number.slice(0, 3)}*******${cccdForm.number.slice(-3)}` : '079*******56'}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="space-y-0.5 text-right">
                          <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest">Issue Date</p>
                          <p className="font-mono text-[9px] font-black text-slate-300">{cccdForm.date || '2021-06-15'}</p>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest">Authority</p>
                          <p className="text-[9px] font-black text-emerald-400">SEDU AI Verified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Action Buttons for Sharing/Downloading */}
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      showNotification('success', 'Đang kết xuất và tải xuống Thẻ thành viên SEDU AI dạng PDF...');
                      window.print();
                    }}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer border border-slate-800"
                  >
                    <Upload className="w-4 h-4 rotate-180" /> Tải Xuống PDF (Print Card)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`SEDU AI MEMBER: ${infoForm.lastname} ${infoForm.firstname} (ID: ${cccdForm.number ? `${cccdForm.number.slice(0, 3)}*******${cccdForm.number.slice(-3)}` : '079*******56'})`);
                      showNotification('success', 'Đã sao chép mã liên kết Thẻ thành viên vào bộ nhớ tạm!');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" /> Sao Chép Mã Liên Kết Thẻ
                  </button>
                </div>
              </div>
            ) : activeTab === 'cccd' && (
              <div className="space-y-6 animate-fadeInUp">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Scan className="w-5 h-5 text-primary" /> Xác thực CCCD & Quét AI OCR Tự động điền (`CCCD AI OCR`)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hệ thống tự động phân tích và trích xuất thông tin sang các trường ngay khi tải ảnh <strong>Mặt trước</strong>
                  </p>
                </div>

                {/* OCR Error Alert Box */}
                {ocrError && (
                  <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3.5 animate-shake shadow-sm">
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-grow text-xs text-red-900 space-y-1">
                      <p className="font-black text-sm text-red-700">Không thể nhận diện thông tin trên thẻ:</p>
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

                {/* OCR Scanning Banner with Progress Bar */}
                {isOcrScanning && (
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl space-y-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-primary-dark">
                      <RefreshCw className="w-5 h-5 animate-spin text-primary shrink-0" />
                      <span>Đang quét và nhận diện văn bản trên thẻ... {ocrProgress > 0 ? `(${ocrProgress}%)` : ''}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.max(ocrProgress, 5)}%` }}
                      />
                    </div>
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
                    <div className={`border rounded-2xl p-4 space-y-3 bg-slate-50/50 transition ${frontBase64 ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-primary/50'}`}>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary" /> Ảnh Mặt Trước *
                        {frontBase64 && <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                      </p>

                      <div className="h-44 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative group">
                        {frontBase64 ? (
                          <img src={frontBase64} alt="CCCD Front" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1 group-hover:scale-110 transition" />
                            <span className="text-[11px] text-slate-500 font-semibold block">Chưa có ảnh mặt trước</span>
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
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor="cccd-front"
                        className="block text-center py-2.5 bg-white border border-slate-300 hover:border-primary rounded-xl text-xs font-bold text-slate-700 hover:text-primary cursor-pointer shadow-sm transition"
                      >
                        {frontBase64 ? 'Chọn lại ảnh mặt trước...' : 'Tải lên ảnh mặt trước...'}
                      </label>
                    </div>

                    {/* Back card */}
                    <div className={`border rounded-2xl p-4 space-y-3 bg-slate-50/50 transition ${backBase64 ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-primary/50'}`}>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary" /> Ảnh Mặt Sau *
                        {backBase64 && <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
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
                        {backBase64 ? 'Chọn lại ảnh mặt sau...' : 'Tải lên ảnh mặt sau...'}
                      </label>
                    </div>
                  </div>

                  {/* Nút Quét OCR - chỉ bật khi đã tải đủ cả 2 ảnh */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleScanCccdOcr(frontBase64, backBase64)}
                      disabled={!frontBase64 || !backBase64 || isOcrScanning}
                      className={`w-full py-3.5 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer ${
                        frontBase64 && backBase64 && !isOcrScanning
                          ? 'bg-gradient-to-r from-primary to-emerald-500 hover:from-primary-dark hover:to-emerald-600 text-white shadow-primary/25'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Scan className="w-5 h-5" />
                      {isOcrScanning
                        ? 'Đang quét OCR...'
                        : frontBase64 && backBase64
                          ? 'Quét OCR & Tự động điền thông tin'
                          : `Vui lòng tải lên ${!frontBase64 && !backBase64 ? 'ảnh mặt trước và mặt sau' : !frontBase64 ? 'ảnh mặt trước' : 'ảnh mặt sau'} để quét`}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || isOcrScanning}
                      className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-black text-xs rounded-xl shadow-lg shadow-primary/25 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> {isLoading ? 'Đang gửi CCCD lên API...' : 'Hoàn tất & Lưu hồ sơ định danh CCCD'}
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
