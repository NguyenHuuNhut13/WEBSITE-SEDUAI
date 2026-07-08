'use client';

import { useState } from 'react';
import { BookOpen, FileSpreadsheet, MessageSquareCode, Loader2, Sparkles } from 'lucide-react';

type ConsoleAction = 'lesson-plan' | 'exam-gen' | 'student-comment' | null;

export default function TeacherConsole() {
  const [activeAction, setActiveAction] = useState<ConsoleAction>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const teacherMockContent = {
    'lesson-plan': (
      <div className="space-y-4 animate-scale-up">
        <h3 className="text-blue-400 font-bold text-sm"># GIÁO ÁN TOÁN LỚP 4: PHÂN SỐ VÀ PHÉP CHIA SỐ TỰ NHIÊN</h3>
        <div className="space-y-2">
          <h4 className="text-emerald-400 font-bold">## I. MỤC TIÊU BÀI HỌC</h4>
          <p className="pl-3">- Học sinh nhận biết được phép chia số tự nhiên cho số tự nhiên khác 0 không phải lúc nào cũng ra số tự nhiên, kết quả đó có thể viết dưới dạng một phân số.</p>
          <p className="pl-3">- Biết biểu diễn thương của phép chia dưới dạng phân số (Tử số là số bị chia, mẫu số là số chia).</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-emerald-400 font-bold">## II. HOẠT ĐỘNG DẠY HỌC CHỦ CHỐT</h4>
          <p className="pl-3"><strong>1. Khởi động (5 phút):</strong> Cho học sinh chia đều 3 quả cam cho 3 bạn (mỗi bạn 1 quả). Tiếp tục chia đều 3 quả cam cho 4 bạn. Học sinh nhận thấy không thể chia nguyên quả.</p>
          <p className="pl-3"><strong>2. Khám phá kiến thức (15 phút):</strong> Thực hiện phép chia: 3 : 4. Ta viết kết quả phép chia này dưới dạng phân số là: <strong>3/4</strong>. Kết luận: Thương của phép chia số tự nhiên cho số tự nhiên (khác 0) viết dưới dạng phân số.</p>
          <p className="pl-3"><strong>3. Thực hành & Luyện tập (15 phút):</strong> Giải bài toán trang 108 SGK.</p>
        </div>
      </div>
    ),
    'exam-gen': (
      <div className="space-y-4 animate-scale-up">
        <h3 className="text-purple-400 font-bold text-sm"># ĐỀ KIỂM TRA LẬP TRÌNH PYTHON CƠ BẢN (THỜI GIAN: 45 PHÚT)</h3>
        <div className="space-y-2">
          <h4 className="text-emerald-400 font-bold">## CÂU 1 (Trắc nghiệm - 4 điểm)</h4>
          <p className="pl-3">Đoạn code sau đây sẽ in ra kết quả gì màn hình?</p>
          <pre className="bg-slate-900 p-3 rounded-lg text-slate-300 font-mono mt-1 text-xs">
{`x = 5
y = "10"
print(str(x) + y)`}
          </pre>
          <p className="pl-3 font-semibold text-slate-400 mt-1">A. 15 &nbsp;&nbsp;&nbsp;&nbsp; B. 510 &nbsp;&nbsp;&nbsp;&nbsp; C. TypeError &nbsp;&nbsp;&nbsp;&nbsp; D. None</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-emerald-400 font-bold">## CÂU 2 (Tự luận - 6 điểm)</h4>
          <p className="pl-3">Viết một hàm Python mang tên <strong>kiem_tra_so_chan(n)</strong> nhận vào một số nguyên n. Trả về True nếu số đó là số chẵn, ngược lại trả về False.</p>
          <p className="pl-3 text-slate-500 font-mono mt-1">// Gợi ý đáp án:</p>
          <pre className="bg-slate-900 p-3 rounded-lg text-yellow-500 font-mono text-xs">
{`def kiem_tra_so_chan(n):
    return n % 2 == 0`}
          </pre>
        </div>
      </div>
    ),
    'student-comment': (
      <div className="space-y-4 animate-scale-up">
        <h3 className="text-amber-400 font-bold text-sm"># PHIẾU NHẬN XÉT HỌC VIÊN ĐỊNH KỲ</h3>
        <p className="font-semibold">Học sinh: Nguyễn Minh Triết (12 tuổi) - Khóa Lập trình Python.</p>
        <div className="space-y-2 text-slate-300">
          <p><strong>Đánh giá của AI Co-Teacher:</strong></p>
          <p className="pl-3"><strong>- Tư duy logic:</strong> Triết có tư duy logic rất tốt, hiểu bài nhanh và biết vận dụng vòng lặp linh hoạt trong trò chơi.</p>
          <p className="pl-3"><strong>- Thái độ học tập:</strong> Chăm chỉ nghe giảng, chủ động hỏi bài khi gặp lỗi code khó.</p>
          <p className="pl-3"><strong>- Điểm cần cải thiện:</strong> Cần rèn luyện thêm tính cẩn thận, hay viết sai chính tả tên biến dẫn đến lỗi cú pháp không đáng có.</p>
          <p className="pl-3"><strong>- Lời khuyên của GV:</strong> Khuyên con nên chạy thử từng đoạn code nhỏ để kiểm tra lỗi trước khi viết khối lệnh quá dài.</p>
        </div>
      </div>
    ),
  };

  const handleAction = (action: ConsoleAction) => {
    setActiveAction(action);
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      {/* Console Header */}
      <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-slate-400 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          <span className="ml-2">ai-teacher-assistant.py</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] bg-slate-800 text-primary-light px-2.5 py-1 rounded-full font-bold">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> STATUS: ACTIVE
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Action Selectors */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleAction('lesson-plan')}
            disabled={isGenerating}
            className={`px-4 py-2.5 rounded-xl border font-semibold text-xs transition duration-200 flex items-center gap-2 cursor-pointer ${
              activeAction === 'lesson-plan'
                ? 'bg-primary border-primary text-white'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-primary" /> Soạn Giáo án Lớp 4
          </button>
          <button
            onClick={() => handleAction('exam-gen')}
            disabled={isGenerating}
            className={`px-4 py-2.5 rounded-xl border font-semibold text-xs transition duration-200 flex items-center gap-2 cursor-pointer ${
              activeAction === 'exam-gen'
                ? 'bg-primary border-primary text-white'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-primary" /> Soạn Đề Kiểm Tra Python
          </button>
          <button
            onClick={() => handleAction('student-comment')}
            disabled={isGenerating}
            className={`px-4 py-2.5 rounded-xl border font-semibold text-xs transition duration-200 flex items-center gap-2 cursor-pointer ${
              activeAction === 'student-comment'
                ? 'bg-primary border-primary text-white'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquareCode className="w-4 h-4 text-primary" /> Viết Nhận Xét Học Sinh
          </button>
        </div>

        {/* Console Output Display */}
        <div className="relative bg-slate-950 rounded-2xl p-5 border border-slate-800 h-[300px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
          {/* Spinner Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-slate-400 font-semibold">AI đang xử lý yêu cầu...</span>
              </div>
            </div>
          )}

          {activeAction && !isGenerating ? (
            teacherMockContent[activeAction]
          ) : !isGenerating ? (
            <span className="text-slate-500">
              // Chọn một tác vụ của Giáo viên ở trên để xem Trợ lý AI thực hiện soạn thảo tài liệu giáo án lập tức.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
