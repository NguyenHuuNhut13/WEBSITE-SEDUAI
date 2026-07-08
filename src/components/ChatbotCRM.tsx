'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, User, CheckCircle2, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'AI' | 'User';
  text: string;
  isHtml?: boolean;
}

interface LeadData {
  age: string;
  subject: string;
  budget: string;
  location: string;
  phone: string;
}

export default function ChatbotCRM() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'AI',
      text: 'Xin kính chào quý phụ huynh! Tôi là trợ lý tư vấn tuyển sinh AI của SeduAi. Quý phụ huynh đang quan tâm tìm khoá học cho con đúng không ạ? Xin hỏi bé nhà mình năm nay bao nhiêu tuổi rồi ạ?',
    },
  ]);
  const [lead, setLead] = useState<LeadData>({
    age: '',
    subject: '',
    budget: '',
    location: '',
    phone: '',
  });
  const [step, setStep] = useState<'age' | 'subject' | 'budget' | 'location' | 'phone' | 'completed'>('age');
  const [isThinking, setIsThinking] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const addMessage = (sender: 'AI' | 'User', text: string, isHtml?: boolean) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender, text, isHtml },
    ]);
  };

  const handleOption = (option: string) => {
    // 1. Append user message
    addMessage('User', option);

    // 2. Set thinking state
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);

      if (step === 'age') {
        setLead((prev) => ({ ...prev, age: option }));
        addMessage(
          'AI',
          `Dạ ghi nhận bé ở độ tuổi <strong>${option}</strong>. Quý phụ huynh đang muốn hướng cho con học môn học gì ạ?`,
          true
        );
        setStep('subject');
      } else if (step === 'subject') {
        setLead((prev) => ({ ...prev, subject: option }));
        addMessage(
          'AI',
          `Dạ bé học môn <strong>${option}</strong> rất tốt ạ. Phụ huynh dự kiến chi phí đầu tư học phí hàng tháng cho bé khoảng bao nhiêu để tôi lọc khóa học phù hợp ạ?`,
          true
        );
        setStep('budget');
      } else if (step === 'budget') {
        setLead((prev) => ({ ...prev, budget: option }));
        addMessage(
          'AI',
          `Dạ mức ngân sách <strong>${option}</strong> rất phù hợp với nhiều chương trình đào tạo tối ưu của SeduAi. Phụ huynh muốn tìm lớp học Online hay tại khu vực nào để thuận tiện cho bé học ạ?`,
          true
        );
        setStep('location');
      } else if (step === 'location') {
        setLead((prev) => ({ ...prev, location: option }));
        addMessage(
          'AI',
          `Tuyệt vời! Tôi đã chọn lọc được các khoá học phù hợp nhất với con tại <strong>${option}</strong>. Để chuyên viên tuyển sinh của SeduAi gửi chi tiết lộ trình học và ưu đãi học phí lên đến 30% cho phụ huynh, xin phụ huynh cho hỏi số điện thoại liên hệ là gì ạ?`,
          true
        );
        setStep('phone');
      }
    }, 1000);
  };

  const handlePhoneSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const phone = phoneInput.trim();
    if (!phone || phone.length < 9) {
      alert('Vui lòng nhập số điện thoại hợp lệ!');
      return;
    }

    // Append user phone
    addMessage('User', phone);
    setLead((prev) => ({ ...prev, phone }));
    setIsThinking(true);
    setPhoneInput('');

    setTimeout(() => {
      setIsThinking(false);
      setStep('completed');
      addMessage(
        'AI',
        'Dạ xin cảm ơn phụ huynh! Thông tin liên hệ đã được chuyển trực tiếp vào hệ thống quản lý Admissions CRM của chúng tôi. Chuyên viên sẽ gọi điện tư vấn chi tiết cho phụ huynh trong vòng 15-30 phút tới. Chúc phụ huynh một ngày vui vẻ!',
        true
      );
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[520px]">
      {/* Chat Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-primary"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none">Trợ lý Tuyển sinh SeduAi</h3>
            <p className="text-xs text-white/80 mt-1">Đang hoạt động tự động</p>
          </div>
        </div>
        <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
          Demo trực tiếp
        </span>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAI = msg.sender === 'AI';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isAI ? '' : 'ml-auto justify-end'
              }`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-sm font-semibold">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`${
                  isAI
                    ? 'bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sm text-slate-700 leading-relaxed'
                    : 'bg-primary text-white rounded-2xl rounded-tr-none p-3.5 shadow-md text-sm leading-relaxed'
                }`}
                dangerouslySetInnerHTML={
                  msg.isHtml ? { __html: msg.text } : undefined
                }
              >
                {!msg.isHtml && msg.text}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-sm font-semibold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sm text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>AI đang gõ...</span>
            </div>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>

      {/* Actions and inputs */}
      <div className="p-4 border-t border-slate-100 bg-white">
        {step === 'age' && (
          <div className="flex flex-wrap gap-2 justify-center">
            {['Dưới 6 tuổi', 'Từ 6 - 10 tuổi', 'Từ 11 - 15 tuổi', 'Trên 15 tuổi'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step === 'subject' && (
          <div className="flex flex-wrap gap-2 justify-center">
            {['Tiếng Anh & IELTS', 'Lập trình & Máy tính', 'AI & Công nghệ', 'Kỹ năng mềm'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step === 'budget' && (
          <div className="flex flex-wrap gap-2 justify-center">
            {['Dưới 1 triệu/tháng', 'Từ 1 - 2 triệu/tháng', 'Trên 2 triệu/tháng'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step === 'location' && (
          <div className="flex flex-wrap gap-2 justify-center">
            {['Học Online tại nhà', 'Quận 10, TP. HCM', 'Cầu Giấy, Hà Nội'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 shadow-sm cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="flex gap-2">
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Nhập số điện thoại của phụ huynh..."
              className="flex-grow px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              Gửi <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {step === 'completed' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1.5 shadow-inner animate-scale-up">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Hệ thống CRM đồng bộ Lead thành công!
            </div>
            <ul className="list-disc pl-4 space-y-0.5 font-semibold text-slate-700">
              <li>Độ tuổi: {lead.age}</li>
              <li>Nhu cầu: {lead.subject}</li>
              <li>Ngân sách: {lead.budget}</li>
              <li>Địa điểm: {lead.location}</li>
              <li>Số điện thoại: {lead.phone}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
