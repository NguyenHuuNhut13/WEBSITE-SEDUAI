'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, Lock, User, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { loginUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, accessToken } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberedUsername, setRememberedUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      router.push('/profile');
    }
    const savedUser = localStorage.getItem('seduai_remembered_user');
    if (savedUser) {
      setRememberedUsername(savedUser);
      setUsername(savedUser);
    }
  }, [accessToken, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(username, password);

      // 1. Kiểm tra nếu máy chủ NKS trả về thành công (200 OK / success: true / có token hoặc userInfo)
      const isApiSuccess =
        res.success === true ||
        res.code === 200 ||
        res.status === 200 ||
        Boolean(res.access_token) ||
        Boolean(res.token) ||
        (Boolean(res.userInfo) && !res.error) ||
        (Boolean(res.user) && !res.error) ||
        (Boolean(res.data) && (res.data.access_token || res.data.token || res.data.userInfo || res.data.user || res.data.id));

      if (isApiSuccess) {
        const token = res.access_token || res.token || res.data?.access_token || res.data?.token || `seduai_nks_token_${Date.now()}`;
        const rawUser = res.userInfo || res.user || res.data?.userInfo || res.data?.user || (res.data?.id || res.data?.username ? res.data : null);
        const info = rawUser || {
          username,
          name: username === 'demo_student' ? 'Học viên Demo SeduAi' : username,
          point: 500,
          email: `${username}@seduai.edu.vn`,
          phone: '0901234567',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        };

        login(token, info);
        localStorage.setItem('seduai_remembered_user', username);
        router.push('/profile');
      } else {
        setError(res.error || res.message || 'Tài khoản hoặc mật khẩu API không chính xác.');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem('seduai_remembered_user');
    setRememberedUsername(null);
    setUsername('');
    setPassword('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15"></div>
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10 animate-scale-up">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Sedu<span className="text-primary">Ai</span>
            </span>
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">Đăng Nhập Thành Viên</h1>
          <p className="text-xs text-slate-500 mt-1">
            Hệ sinh thái AI dành cho giáo dục - Kết nối API NKS
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {rememberedUsername ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                  {rememberedUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Xin chào trở lại</p>
                  <p className="text-sm font-bold text-slate-800">{rememberedUsername}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSwitchAccount}
                title="Đăng nhập tài khoản khác"
                className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Đổi TK
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Tên đăng nhập (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập hoặc email..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs text-slate-800 bg-slate-50 transition"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Mật khẩu (Password)
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] font-semibold text-primary hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs text-slate-800 bg-slate-50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Đang kết nối API...</span>
            ) : (
              <>
                <span>Đăng nhập hệ thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security note */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Dữ liệu tài khoản được bảo mật và đồng bộ từ hệ thống quản trị NKS Account API.
          </p>
        </div>
      </div>
    </div>
  );
}
