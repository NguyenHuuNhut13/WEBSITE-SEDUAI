'use client';

import { useState, useEffect, useRef } from 'react';
import { BookOpen, FileSpreadsheet, MessageSquareCode, Loader2, Sparkles, Send, Bot, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  sender: 'AI' | 'User';
  text: string;
}

export default function TeacherConsole() {
  const { localSync } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'AI',
      text: 'Xin chào thầy cô! Tôi là Trợ lý Giáo vụ & Trí tuệ nhân tạo SeduAi. Thầy cô có thể click chọn nhanh các tác vụ soạn thảo ở trên hoặc trực tiếp nhập câu hỏi/yêu cầu của mình ở ô chat bên dưới nhé!',
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleAction = async (promptText: string) => {
    if (isGenerating) return;
    await handleSendMessage(promptText);
  };

  const handleSendMessage = async (text: string) => {
    const val = text.trim();
    if (!val) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), sender: 'User', text: val };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    try {
      // Build conversation context (max 10 messages)
      const contextMessages = [...messages.slice(-9), userMsg].map((m) => ({
        role: m.sender === 'User' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextMessages,
          mode: 'teacher_assistant',
          userContext: localSync,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'AI', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'AI',
            text: 'Xin lỗi, máy chủ AI đang bận hoặc gặp lỗi cấu hình. Vui lòng thử lại sau!',
          },
        ]);
      }
    } catch (error) {
      console.error('[TeacherConsole] Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'AI',
          text: 'Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại mạng.',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        sender: 'AI',
        text: 'Xin chào thầy cô! Tôi là Trợ lý Giáo vụ & Trí tuệ nhân tạo SeduAi. Thầy cô có thể click chọn nhanh các tác vụ soạn thảo ở trên hoặc trực tiếp nhập câu hỏi/yêu cầu của mình ở ô chat bên dưới nhé!',
      },
    ]);
    setInput('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[560px]">
      {/* Console Header */}
      <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-slate-400 text-[10px] sm:text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          <span className="ml-2 font-bold">ai-teacher-assistant.py</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Làm mới cuộc trò chuyện"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="flex items-center gap-1 text-[9px] sm:text-[10px] bg-slate-800 text-primary-light px-2.5 py-1 rounded-full font-bold">
            <Sparkles className="w-3 h-3 text-primary animate-pulse" /> ACTIVE
          </span>
        </div>
      </div>

      {/* Action Selectors (Quick chips) */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800/40 flex flex-wrap gap-2">
        <button
          onClick={() => handleAction('Hãy soạn giáo án Toán lớp 4 bài Phân số và phép chia số tự nhiên')}
          disabled={isGenerating}
          className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-slate-300 hover:text-white rounded-xl font-bold text-[10px] sm:text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-primary" /> Soạn Giáo án Lớp 4
        </button>
        <button
          onClick={() => handleAction('Hãy soạn đề kiểm tra lập trình Python cơ bản 45 phút')}
          disabled={isGenerating}
          className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-slate-300 hover:text-white rounded-xl font-bold text-[10px] sm:text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-primary" /> Soạn Đề Python
        </button>
        <button
          onClick={() => handleAction('Hãy viết phiếu nhận xét học sinh định kỳ chi tiết cho Nguyễn Minh Triết 12 tuổi học Python')}
          disabled={isGenerating}
          className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-slate-300 hover:text-white rounded-xl font-bold text-[10px] sm:text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <MessageSquareCode className="w-3.5 h-3.5 text-primary" /> Nhận Xét Học Sinh
        </button>
      </div>

      {/* Messages Log area */}
      <div ref={chatContainerRef} className="flex-grow p-5 overflow-y-auto space-y-4 bg-slate-950/50 scrollbar-thin text-slate-300 font-mono text-xs leading-relaxed">
        {messages.map((msg) => {
          const isAI = msg.sender === 'AI';
          return (
            <div key={msg.id} className={`flex items-start gap-2.5 max-w-[92%] ${isAI ? '' : 'ml-auto justify-end'}`}>
              {isAI && (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-primary flex-shrink-0 flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className="space-y-1">
                <div
                  className={`p-3 rounded-2xl whitespace-pre-wrap border ${
                    isAI
                      ? 'bg-slate-900/90 border-slate-800 rounded-tl-none text-slate-200'
                      : 'bg-primary/20 border-primary/20 text-white rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isGenerating && (
          <div className="flex items-start gap-2.5 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-primary flex-shrink-0 flex items-center justify-center text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-3 text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>AI Co-Teacher đang xử lý & sinh nội dung...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input panel */}
      <div className="p-4 bg-slate-950 border-t border-slate-800/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !isGenerating) {
              handleSendMessage(input);
            }
          }}
          className="flex gap-2 relative items-center bg-slate-900 border border-slate-800 focus-within:border-primary/80 rounded-xl p-1 transition"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            placeholder="Yêu cầu soạn giáo án, bài viết, đề thi thử..."
            className="flex-grow bg-transparent border-0 py-2.5 pl-3 pr-12 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 p-2 bg-primary hover:bg-primary-dark disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
