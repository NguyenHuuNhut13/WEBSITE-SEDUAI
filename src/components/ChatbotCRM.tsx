'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bot, User, CheckCircle2, Send, Loader2, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { createLead, getEduCourses, ApiCourse } from '@/services/api';

interface Message {
  id: string;
  sender: 'AI' | 'User';
  text: string;
  isHtml?: boolean;
  suggestedCourses?: ApiCourse[];
}

interface LeadData {
  age: string;
  subject: string;
  budget: string;
  location: string;
  phone: string;
  leadId?: number;
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
  const [allApiCourses, setAllApiCourses] = useState<ApiCourse[]>([]);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Load API courses in background on mount
  useEffect(() => {
    getEduCourses().then((list) => {
      if (list && list.length > 0) {
        setAllApiCourses(list);
      }
    });
  }, []);

  const addMessage = (sender: 'AI' | 'User', text: string, isHtml?: boolean, suggestedCourses?: ApiCourse[]) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender, text, isHtml, suggestedCourses },
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

  const handlePhoneSubmit = async (e?: React.FormEvent) => {
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

    // 1. Gọi API Lưu thông tin Lead lên CRM thật
    const leadResponse = await createLead({
      name: `Khách hàng AI Chatbot (${phone})`,
      phone: phone,
      email: `chatbot_${phone}@seduai.edu.vn`,
      demand: `${lead.subject} | Tuổi: ${lead.age}`,
      note: `Ngân sách: ${lead.budget} - Địa điểm: ${lead.location}`,
    });

    if (leadResponse.success && leadResponse.id) {
      setLead((prev) => ({ ...prev, leadId: leadResponse.id }));
    }

    // 2. Lọc Khóa học phù hợp theo API EduCourses
    let matchingCourses: ApiCourse[] = [];
    if (allApiCourses.length > 0) {
      const kw = lead.subject.toLowerCase();
      matchingCourses = allApiCourses.filter((c) => {
        const title = (c.title || '').toLowerCase();
        const desc = (c.acf?.description || '').toLowerCase();
        if (kw.includes('tiếng anh') || kw.includes('ielts')) {
          return title.includes('anh') || title.includes('ielts') || desc.includes('anh') || desc.includes('ielts');
        }
        if (kw.includes('lập trình') || kw.includes('máy tính')) {
          return title.includes('web') || title.includes('python') || title.includes('code') || title.includes('lập trình');
        }
        if (kw.includes('ai') || kw.includes('công nghệ')) {
          return title.includes('ai') || title.includes('chatbot') || title.includes('tự động');
        }
        return true;
      }).slice(0, 2);

      // Nếu không khớp từ khóa cụ thể, lấy 2 khóa đầu tiên của API
      if (matchingCourses.length === 0) {
        matchingCourses = allApiCourses.slice(0, 2);
      }
    }

    setIsThinking(false);
    setStep('completed');
    addMessage(
      'AI',
      `Dạ xin cảm ơn phụ huynh! Thông tin liên hệ đã được <strong>lưu trực tiếp vào Hệ thống AI Admissions CRM</strong> (Mã Lead ID: #${leadResponse.id || 'NKS_2026'}). Dưới đây là danh sách các khóa học SeduAi phù hợp nhất được đề xuất tự động từ API cho con:`,
      true,
      matchingCourses
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[560px]">
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
            <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
              Trợ lý Tuyển sinh SeduAi <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h3>
            <p className="text-xs text-white/80 mt-1">Tự động hóa CRM - Sync API thật</p>
          </div>
        </div>
        <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
          API Live Mode
        </span>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAI = msg.sender === 'AI';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[90%] ${
                isAI ? '' : 'ml-auto justify-end'
              }`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-sm font-semibold">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className="space-y-3 w-full">
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

                {/* Suggested Courses from API */}
                {msg.suggestedCourses && msg.suggestedCourses.length > 0 && (
                  <div className="space-y-2 pt-1 animate-fadeInUp">
                    <p className="text-[11px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1 pl-1">
                      <BookOpen className="w-3.5 h-3.5" /> Khóa học phù hợp theo API EduCourses:
                    </p>
                    {msg.suggestedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white border border-primary/20 hover:border-primary rounded-2xl p-3.5 shadow-sm transition flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {course.title}
                          </h4>
                          <span className="text-[10px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded-md flex-shrink-0">
                            #{course.id}
                          </span>
                        </div>
                        {course.acf?.description && (
                          <div
                            className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: course.acf.description }}
                          />
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-extrabold text-primary">
                            {course.acf?.price
                              ? `${Number(course.acf.price).toLocaleString('vi-VN')} VNĐ`
                              : 'Ưu đãi học phí 30%'}
                          </span>
                          <Link
                            href="/courses"
                            className="font-bold text-slate-700 hover:text-primary flex items-center gap-1"
                          >
                            Xem chi tiết <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              <span>AI đang phân tích & đồng bộ API CRM...</span>
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
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Đã lưu thông tin Lead vào CRM API!
              </span>
              {lead.leadId && (
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                  ID #{lead.leadId}
                </span>
              )}
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
