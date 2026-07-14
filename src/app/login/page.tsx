'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, Lock, User, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
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
      const dataPayload = res.data as Record<string, any> | undefined;
      const realToken = res.access_token || res.token || dataPayload?.access_token || dataPayload?.token;
      const rawUser = res.userInfo || res.user || dataPayload?.userInfo || dataPayload?.user || (dataPayload?.username ? dataPayload : null);
      const isApiSuccess = Boolean(realToken && rawUser && !res.error);

      if (isApiSuccess) {
        login(realToken, rawUser);
        localStorage.setItem('seduai_remembered_user', username);
        router.push('/profile');
      } else {
        setError(res.error || res.message || 'Tài khoản hoặc mật khẩu không chính xác.');
      }
    } catch {
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
      {/* Animated Blob Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '8s' }} />

      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 border border-white/30 p-8 relative z-10 animate-slide-up-fade">
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
            Hệ sinh thái AI dành cho giáo dục - Kết nối NKS
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white focus:shadow-sm focus:shadow-primary/10 text-xs text-slate-800 bg-slate-50/80 transition-all duration-200"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white focus:shadow-sm focus:shadow-primary/10 text-xs text-slate-800 bg-slate-50/80 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-primary disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer animate-gradient-shift"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang kết nối...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security note */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Dữ liệu tài khoản được bảo mật và đồng bộ từ hệ thống quản trị NKS Account.
          </p>
        </div>
      </div>
    </div>
  );
}
