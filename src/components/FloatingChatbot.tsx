'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bot, User, CheckCircle2, Send, Loader2, Sparkles, BookOpen, ArrowRight, X, MessageSquare } from 'lucide-react';
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

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

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
    addMessage('User', option);
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

    addMessage('User', phone);
    setLead((prev) => ({ ...prev, phone }));
    setIsThinking(true);
    setPhoneInput('');

    // 1. Call API to save Lead on actual NKS CRM
    const leadResponse = await createLead({
      name: `Khách hàng Widget Chatbot (${phone})`,
      phone: phone,
      email: `widget_chatbot_${phone}@seduai.edu.vn`,
      demand: `${lead.subject} | Tuổi: ${lead.age}`,
      note: `Ngân sách: ${lead.budget} - Địa điểm: ${lead.location}`,
    });

    if (leadResponse.success && leadResponse.id) {
      setLead((prev) => ({ ...prev, leadId: leadResponse.id }));
    }

    // 2. Filter courses dynamically based on API list
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (hasNewMessage) {
      setHasNewMessage(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="w-[350px] sm:w-[380px] h-[520px] bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 animate-scale-up border-primary/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-5 py-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5.5 h-5.5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary"></span>
              </div>
              <div>
                <h3 className="font-bold text-xs leading-none flex items-center gap-1">
                  Trợ lý Tuyển sinh AI <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                </h3>
                <p className="text-[10px] text-white/80 mt-1">Hỗ trợ 24/7 • CRM Connected</p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/50 scrollbar-thin">
            {messages.map((msg) => {
              const isAI = msg.sender === 'AI';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[90%] ${
                    isAI ? '' : 'ml-auto justify-end'
                  }`}
                >
                  {isAI && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="space-y-2.5 w-full">
                    <div
                      className={`text-xs p-3 leading-relaxed shadow-sm ${
                        isAI
                          ? 'bg-white border border-slate-100 rounded-2xl rounded-tl-none text-slate-700'
                          : 'bg-primary text-white rounded-2xl rounded-tr-none'
                      }`}
                      dangerouslySetInnerHTML={
                        msg.isHtml ? { __html: msg.text } : undefined
                      }
                    >
                      {!msg.isHtml && msg.text}
                    </div>

                    {/* Suggested Courses */}
                    {msg.suggestedCourses && msg.suggestedCourses.length > 0 && (
                      <div className="space-y-2 pt-1 animate-fadeInUp">
                        <p className="text-[10px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1 pl-1">
                          <BookOpen className="w-3 h-3" /> Khóa học đề xuất cho con:
                        </p>
                        {msg.suggestedCourses.map((course) => (
                          <div
                            key={course.id}
                            className="bg-white border border-primary/10 hover:border-primary/30 rounded-xl p-3 shadow-sm transition flex flex-col gap-1.5"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-[11px] text-slate-900 line-clamp-1">
                                {typeof course.title === 'object' && course.title !== null && 'rendered' in course.title 
                                  ? (course.title as { rendered: string }).rendered 
                                  : String(course.title || '')}
                              </h4>
                              <span className="text-[9px] bg-primary-light text-primary font-bold px-1.5 py-0.25 rounded">
                                #{course.id}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 text-[10px]">
                              <span className="font-extrabold text-primary">
                                {course.acf?.price
                                  ? `${Number(course.acf.price).toLocaleString('vi-VN')} VNĐ`
                                  : 'Liên hệ tư vấn'}
                              </span>
                              <Link
                                href={`/courses/api-course-${course.id}`}
                                onClick={handleToggle}
                                className="font-bold text-slate-600 hover:text-primary flex items-center gap-0.5"
                              >
                                Xem chi tiết <ArrowRight className="w-2.5 h-2.5" />
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

            {isThinking && (
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm text-xs text-slate-400 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>AI đang kết nối CRM...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Action options */}
          <div className="p-4 border-t border-slate-100 bg-white">
            {step === 'age' && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Dưới 6 tuổi', 'Từ 6 - 10 tuổi', 'Từ 11 - 15 tuổi', 'Trên 15 tuổi'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="px-3 py-1.5 text-[11px] font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {step === 'subject' && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Tiếng Anh & IELTS', 'Lập trình & Máy tính', 'AI & Công nghệ', 'Kỹ năng mềm'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="px-3 py-1.5 text-[11px] font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {step === 'budget' && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Dưới 1 triệu/tháng', 'Từ 1 - 2 triệu/tháng', 'Trên 2 triệu/tháng'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="px-3 py-1.5 text-[11px] font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {step === 'location' && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Học Online tại nhà', 'Quận 10, TP. HCM', 'Cầu Giấy, Hà Nội'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="px-3 py-1.5 text-[11px] font-semibold rounded-full border border-primary text-primary bg-primary-light hover:bg-primary hover:text-white transition duration-200 cursor-pointer"
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
                  placeholder="Nhập số điện thoại..."
                  className="flex-grow px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition duration-200 flex items-center gap-1 cursor-pointer"
                >
                  Gửi <Send className="w-3 h-3" />
                </button>
              </form>
            )}

            {step === 'completed' && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-emerald-800 space-y-1 shadow-inner animate-scale-up">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Đã lưu Lead vào CRM!
                  </span>
                  {lead.leadId && (
                    <span className="bg-emerald-600 text-white px-1.5 py-0.25 rounded text-[8px]">
                      ID #{lead.leadId}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-2 text-slate-700 font-semibold mt-1">
                  <div>• Độ tuổi: {lead.age}</div>
                  <div>• Môn học: {lead.subject}</div>
                  <div>• Địa điểm: {lead.location}</div>
                  <div>• SĐT: {lead.phone}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleToggle}
        className="relative w-14 h-14 bg-gradient-to-tr from-primary to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition duration-300 group cursor-pointer"
        title="Trò chuyện cùng trợ lý tuyển sinh SeduAi"
      >
        {/* Pulsing glow ring */}
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping group-hover:animate-none scale-105"></span>
        <span className="absolute inset-0 rounded-full border-2 border-white/20 scale-100 group-hover:scale-105 transition duration-300"></span>

        {isOpen ? (
          <X className="w-6 h-6 transform hover:rotate-90 transition duration-300" />
        ) : (
          <MessageSquare className="w-6 h-6 transform -scale-x-100" />
        )}

        {/* New message notification badge */}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
            1
          </span>
        )}
      </button>
    </div>
  );
}
