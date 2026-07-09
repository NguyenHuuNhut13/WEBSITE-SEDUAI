'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  Send,
  Plus,
  Trash2,
  Bot,
  User,
  Sparkles,
  GraduationCap,
  Target,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  MessageSquare,
  Award,
  ShieldCheck,
  PhoneCall,
  HelpCircle,
  Menu,
  X,
  Code2,
  Languages,
  Lock,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createLead } from '@/services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  leadSaved?: boolean;
}

interface Thread {
  id: string;
  title: string;
  mode: 'teacher_assistant' | 'admissions_crm';
  messages: ChatMessage[];
  updatedAt: number;
}

export default function AiAssistantPage() {
  const { user, accessToken, localSync, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [mode, setMode] = useState<'teacher_assistant' | 'admissions_crm'>('teacher_assistant');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check role: teacher, giangvien, gv
  const isTeacher = user && (
    (user.username && (
      user.username.toLowerCase().includes('teacher') ||
      user.username.toLowerCase().includes('giangvien') ||
      user.username.toLowerCase().includes('gv')
    )) ||
    (user.email && (
      user.email.toLowerCase().includes('teacher') ||
      user.email.toLowerCase().includes('giangvien') ||
      user.email.toLowerCase().includes('gv')
    )) ||
    (user as any).role?.toLowerCase().includes('teacher') ||
    (user as any).role?.toLowerCase().includes('giáo viên') ||
    (user as any).group?.toLowerCase().includes('teacher')
  );

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !accessToken) {
      router.push('/login?redirect=/ai-assistant');
    }
  }, [authLoading, accessToken, router]);

  // Tự động mở sidebar nếu ở màn hình lớn (Desktop >= 1024px)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Load threads from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('seduai_chat_threads');
    if (saved) {
      try {
        const parsed: Thread[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setThreads(parsed);
          setActiveThreadId(parsed[0].id);
          setMode(parsed[0].mode);
          return;
        }
      } catch (e) {
        console.error('Failed to parse chat threads:', e);
      }
    }

    // Default initial thread
    const newThread: Thread = {
      id: Date.now().toString(),
      title: 'Học lập trình & Giải đáp AI',
      mode: 'teacher_assistant',
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads([newThread]);
    setActiveThreadId(newThread.id);
  }, []);

  // Save threads to localStorage
  useEffect(() => {
    if (threads.length > 0) {
      localStorage.setItem('seduai_chat_threads', JSON.stringify(threads));
    }
  }, [threads]);

  const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const messages = currentThread ? currentThread.messages : [];

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCreateNewThread = (targetMode?: 'teacher_assistant' | 'admissions_crm') => {
    const chosenMode = targetMode || mode;
    const newThread: Thread = {
      id: Date.now().toString(),
      title: chosenMode === 'teacher_assistant' ? 'Buổi học mới cùng AI Teacher' : 'Tư vấn lộ trình SeduAi CRM',
      mode: chosenMode,
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setMode(chosenMode);
  };

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = threads.filter((t) => t.id !== id);
    if (updated.length === 0) {
      handleCreateNewThread();
    } else {
      setThreads(updated);
      if (activeThreadId === id) {
        setActiveThreadId(updated[0].id);
        setMode(updated[0].mode);
      }
    }
  };

  const handleSelectThread = (thread: Thread) => {
    setActiveThreadId(thread.id);
    setMode(thread.mode);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend || isLoading) return;

    if (!customPrompt) {
      setInput('');
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update current thread with user message
    const updatedMessages = [...messages, userMsg];
    let titleToSet = currentThread.title;
    if (currentThread.messages.length === 0) {
      titleToSet = promptToSend.slice(0, 32) + (promptToSend.length > 32 ? '...' : '');
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, title: titleToSet, messages: updatedMessages, updatedAt: Date.now() }
          : t
      )
    );

    setIsLoading(true);

    // If in CRM mode and user entered a phone number, trigger live createLead API concurrently
    let leadSavedStatus = false;
    const phoneMatch = promptToSend.match(/(0|\+84)\d{8,10}/);
    if (mode === 'admissions_crm' && phoneMatch) {
      try {
        const phone = phoneMatch[0];
        await createLead({
          name: `Khách hàng AI Assistant (${phone})`,
          phone: phone,
          email: `chat_crm_${phone}@seduai.edu.vn`,
          demand: `Tư vấn khóa học qua ChatGPT Assistant Mode`,
          note: `Thảo luận: "${promptToSend.slice(0, 100)}"`,
        });
        leadSavedStatus = true;
      } catch (e) {
        console.error('Error saving lead via AI Assistant:', e);
      }
    }

    try {
      // Call Backend API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          mode: mode,
          userContext: {
            name: localSync.name,
            point: localSync.point,
          },
        }),
      });

      const data = await res.json();
      const aiReplyText = data.reply || 'Đã xảy ra sự cố gián đoạn. Vui lòng thử gửi lại nhé.';

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        leadSaved: leadSavedStatus,
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...updatedMessages, aiMsg], updatedAt: Date.now() }
            : t
        )
      );
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '⚠️ Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra kết nối mạng của bạn và thử lại.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...updatedMessages, errorMsg], updatedAt: Date.now() }
            : t
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="mt-4 font-bold text-xs uppercase tracking-widest text-slate-500">Đang xác thực thông tin...</span>
      </div>
    );
  }

  // Not logged in -> Let useEffect handle redirect
  if (!accessToken || !user) {
    return null;
  }

  // Access check: Only Teachers
  if (!isTeacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decor */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-3xl border border-rose-500/20 shadow-2xl p-8 text-center relative z-10 animate-scale-up">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-inner animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          
          <h1 className="text-xl font-black text-white tracking-tight mb-2">Quyền Truy Cập Bị Giới Hạn</h1>
          <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mb-6">Chỉ Dành Cho Giáo Viên</p>
          
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-left text-xs text-slate-400 space-y-2 mb-6">
            <p className="font-semibold text-slate-300">Tính năng AI Assistant được bảo vệ nghiêm ngặt:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>AI Co-Teacher Assistant giúp soạn giáo án và chấm bài.</li>
              <li>Admissions CRM truy cập trực tiếp phễu tư vấn NKS API.</li>
            </ul>
            <div className="pt-2 border-t border-slate-900 mt-2 text-[11px]">
              <span className="text-slate-500">Tài khoản hiện tại:</span> <strong className="text-slate-300">{user?.username || 'Chưa xác định'}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/login?redirect=/ai-assistant');
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Đổi Tài Khoản Giáo Viên
            </button>
            <Link
              href="/"
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Quay Lại Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-72px)] lg:h-[calc(100vh-122px)] bg-slate-900 text-slate-100 overflow-hidden font-sans relative">
      {/* Backdrop overlay cho Mobile khi mở Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* LEFT SIDEBAR (ChatGPT Style - True Responsive Drawer on Mobile & Column on Desktop) */}
      <div
        className={`${
          isSidebarOpen
            ? 'translate-x-0 w-[280px] sm:w-[320px] lg:w-72 xl:w-80'
            : '-translate-x-full lg:translate-x-0 w-[280px] sm:w-[320px] lg:w-0'
        } bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 z-50 fixed inset-y-0 left-0 lg:relative lg:inset-auto lg:h-full lg:z-auto flex-shrink-0 overflow-hidden`}
      >
        {/* Top Header inside Sidebar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/30">
              <Brain className="w-4 h-4" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              Sedu<span className="text-primary">Ai</span> <span className="text-[10px] font-normal bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded ml-1">v2.0</span>
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => handleCreateNewThread()}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Đoạn Chat Mới (New Chat)
          </button>
        </div>

        {/* Mode Switcher inside Sidebar */}
        <div className="px-3 py-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1.5">
            Chế Độ Hoạt Động (Mode)
          </p>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => {
                setMode('teacher_assistant');
                if (currentThread) {
                  setThreads((prev) =>
                    prev.map((t) => (t.id === activeThreadId ? { ...t, mode: 'teacher_assistant' } : t))
                  );
                }
              }}
              className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'teacher_assistant'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Gia sư AI 1-1, giải bài tập, chấm IELTS, Code"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Teacher AI
            </button>
            <button
              onClick={() => {
                setMode('admissions_crm');
                if (currentThread) {
                  setThreads((prev) =>
                    prev.map((t) => (t.id === activeThreadId ? { ...t, mode: 'admissions_crm' } : t))
                  );
                }
              }}
              className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'admissions_crm'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Tư vấn khóa học & tự động đồng bộ CRM"
            >
              <Target className="w-3.5 h-3.5" /> Admissions CRM
            </button>
          </div>
        </div>

        {/* Conversation Threads List */}
        <div className="flex-grow overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 my-2">
            Lịch sử Trò Chuyện ({threads.length})
          </p>
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleSelectThread(thread)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                thread.id === activeThreadId
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {thread.mode === 'teacher_assistant' ? (
                  <GraduationCap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <Target className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                <span className="truncate max-w-[170px]">{thread.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteThread(thread.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition rounded"
                title="Xóa đoạn chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-grow flex flex-col h-full bg-slate-900 relative">
        {/* Top Bar of Main Chat Area */}
        <div className="min-h-[60px] sm:h-16 border-b border-slate-800 px-3 sm:px-6 py-2 sm:py-0 flex items-center justify-between bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            {/* Nút Hamburger luôn hiện ở màn hình Mobile để mở Drawer */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition lg:hidden flex-shrink-0"
              title="Mở menu & lịch sử chat"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Nút Hamburger cho Desktop khi đóng Sidebar */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden lg:block p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition flex-shrink-0"
                title="Mở thanh bên"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <h2 className="font-extrabold text-xs sm:text-base text-white flex items-center gap-1.5 sm:gap-2 truncate">
                {mode === 'teacher_assistant' ? (
                  <>
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">AI Teacher Assistant</span>
                    <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full flex-shrink-0">
                      Học tập 1-1 & Lập trình chuẩn Edu2Review
                    </span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">AI Admissions CRM</span>
                    <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full flex-shrink-0">
                      Tư vấn khóa học & Sync NKS Lead API
                    </span>
                  </>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="hidden xs:flex text-[10px] sm:text-xs bg-primary/20 text-primary border border-primary/40 px-2 sm:px-3 py-1 rounded-full font-bold items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" /> <span className="hidden sm:inline">GPT-4o</span> Engine
            </span>
            <Link
              href="/"
              className="text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap"
            >
              Trang Chủ
            </Link>
          </div>
        </div>

        {/* Message Feed Container */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-8 space-y-6">
          {messages.length === 0 ? (
            /* WELCOME SCREEN & SUGGESTED PROMPTS */
            <div className="max-w-3xl mx-auto py-8 sm:py-16 text-center space-y-8 animate-fadeInUp">
              <div className="relative inline-block">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-primary via-blue-600 to-amber-500 flex items-center justify-center text-white shadow-2xl mx-auto transform hover:rotate-3 transition duration-300">
                  <Bot className="w-12 h-12" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-900 border-2 border-slate-700 p-1.5 rounded-2xl text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  {mode === 'teacher_assistant'
                    ? 'Xin chào! Tôi là Giảng Viên AI SeduAi'
                    : 'Hệ Thống AI Admissions CRM & Tuyển Sinh'}
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  {mode === 'teacher_assistant'
                    ? 'Sẵn sàng giải đáp mọi câu hỏi về Lập trình Web Full-Stack, Python, luyện viết IELTS 6.5+ và giải bài tập chi tiết chuẩn Edu2Review.'
                    : 'Tư vấn lộ trình học tập, thông báo học phí ưu đãi và tự động đồng bộ hồ sơ đăng ký vào hệ thống quản trị CRM của SeduAi.'}
                </p>
              </div>

              {/* Suggested Prompt Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-4 text-left">
                {mode === 'teacher_assistant' ? (
                  <>
                    <button
                      onClick={() =>
                        handleSendMessage(
                          'Hãy giải thích chi tiết khái niệm React Server Components (RSC) trong Next.js 15 với code minh họa dễ hiểu nhất.'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-primary/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Code2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Lập trình React / Next.js</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Giải thích React Server Components & Code ví dụ
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleSendMessage(
                          'Tôi muốn luyện thi IELTS Speaking Part 2 chủ đề "Describe an education experience that changed your life". Hãy đưa ra dàn ý và từ vựng band 7.5+.'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-primary/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Languages className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Luyện thi IELTS 6.5+</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Dàn ý Speaking Part 2 & Từ vựng Academic Band 7.5+
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleSendMessage(
                          'Hãy ra cho tôi 3 bài tập trắc nghiệm (quiz) về Python cơ bản cho người mới bắt đầu và giải thích đáp án khi tôi trả lời.'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-primary/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <GraduationCap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Bài tập trắc nghiệm Python</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Tạo 3 câu hỏi trắc nghiệm Python cơ bản & chấm điểm
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleSendMessage(
                          'Tôi muốn học viết code sạch (Clean Code) trong JavaScript. Hãy chỉ ra 5 nguyên tắc quan trọng nhất kèm code xấu vs code tốt.'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-primary/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <HelpCircle className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Nguyên tắc Clean Code</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          5 nguyên tắc viết JavaScript sạch & dễ bảo trì
                        </p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleSendMessage(
                          'Xin chào, tôi muốn tư vấn khóa học Lập trình Web Full-Stack (Laravel & React) tại SeduAi. Học phí hiện tại và lộ trình như thế nào?'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Khóa Lập Trình Web Full-Stack</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Hỏi học phí ưu đãi & lộ trình 12 tuần thực chiến
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleSendMessage(
                          'Khóa học IELTS 6.5+ cam kết đầu ra của SeduAi có những quyền lợi gì và mức giảm giá khi đăng ký sớm là bao nhiêu?'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Award className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Quyền Lợi Khóa IELTS 6.5+</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Cam kết hoàn tiền bằng văn bản & ưu đãi sớm
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleSendMessage(
                          'Tôi muốn đăng ký nhận tư vấn trực tiếp từ chuyên viên SeduAi. Số điện thoại của tôi là 0909123456.'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <PhoneCall className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Gửi SĐT Ghi Nhận Lead CRM</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Tự động lưu Lead lên NKS API & Nhận Voucher 30%
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleSendMessage(
                          'SeduAi có khóa học lập trình nào phù hợp cho trẻ em từ 10 tuổi không? Học phí tháng là bao nhiêu?'
                        )
                      }
                      className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ShieldCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">Lập Trình Python Cho Trẻ Em</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Khóa học tư duy logic & tạo game cho bé từ 10 tuổi
                        </p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* ACTIVE MESSAGES LIST */
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 sm:gap-4 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md ${
                        isUser
                          ? 'bg-primary text-white'
                          : mode === 'teacher_assistant'
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950'
                          : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950'
                      }`}
                    >
                      {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>

                    {/* Message Content Card */}
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-5 shadow-lg space-y-3 relative ${
                        isUser
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-sm'
                      }`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 pb-1 border-b border-white/10">
                        <span className="font-extrabold flex items-center gap-1.5">
                          {isUser ? (
                            'Học viên'
                          ) : mode === 'teacher_assistant' ? (
                            <>
                              <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> AI Teacher Assistant (Edu2Review)
                            </>
                          ) : (
                            <>
                              <Target className="w-3.5 h-3.5 text-emerald-400" /> AI Admissions CRM Assistant
                            </>
                          )}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Text / Markdown content */}
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>

                      {/* Live Lead Saved Badge */}
                      {msg.leadSaved && (
                        <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center justify-between gap-2 shadow-inner animate-scale-up">
                          <span className="font-bold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>Đã tự động lưu hồ sơ Lead vào NKS SCRMAI API!</span>
                          </span>
                          <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">
                            LIVE SYNC
                          </span>
                        </div>
                      )}

                      {/* Copy Action for AI */}
                      {!isUser && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/60 transition cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Đã sao chép
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Sao chép phản hồi
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div
                    className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md ${
                      mode === 'teacher_assistant'
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950'
                        : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950'
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl rounded-tl-sm p-4 text-xs text-slate-300 flex items-center gap-2.5 shadow-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>
                      {mode === 'teacher_assistant'
                        ? 'Giảng viên AI đang suy nghĩ và phân tích chi tiết...'
                        : 'Trợ lý Tuyển sinh đang đồng bộ dữ liệu CRM & khóa học...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* PROMPT INPUT BOX (Bottom ChatGPT Input) */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800/80 relative z-30">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Quick Action Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-amber-400" /> Gợi ý hỏi nhanh:
              </span>
              <button
                onClick={() => setInput('Giải bài tập Python: Viết hàm kiểm tra số nguyên tố tối ưu.')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-xs font-semibold border border-slate-700/60 flex-shrink-0 transition cursor-pointer"
              >
                🐍 Bài tập Python
              </button>
              <button
                onClick={() => setInput('Sửa ngữ pháp và từ vựng IELTS cho câu tiếng Anh này: ...')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-xs font-semibold border border-slate-700/60 flex-shrink-0 transition cursor-pointer"
              >
                🇬🇧 Sửa IELTS Writing
              </button>
              <button
                onClick={() => setInput('Tôi muốn nhận Voucher học phí khóa Lập trình Web Full-Stack.')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-xs font-semibold border border-slate-700/60 flex-shrink-0 transition cursor-pointer"
              >
                🎁 Nhận Voucher Khóa Học
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  mode === 'teacher_assistant'
                    ? 'Hỏi Giảng viên AI bất cứ câu hỏi nào về Lập trình, Tiếng Anh, bài tập... (Enter để gửi)'
                    : 'Nhập thông tin hoặc câu hỏi về khóa học, số điện thoại để đăng ký tư vấn CRM...'
                }
                className="w-full bg-slate-900 focus:bg-slate-900/90 border border-slate-700 focus:border-primary rounded-2xl pl-4 pr-14 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-none leading-relaxed font-sans"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 p-2.5 bg-primary hover:bg-primary-dark disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition duration-200 shadow-md cursor-pointer flex items-center justify-center"
                title="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <span>🔒 AI Assistant tích hợp API OpenAI & NKS SCRMAI CRM.</span>
              <span>Dữ liệu tham khảo chuẩn từ hệ sinh thái giáo dục Edu2Review.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
