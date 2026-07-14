// ==========================================
// AI Grading & Quiz Generation Service
// Giai đoạn đầu: mock AI logic
// Sau thay bằng OpenAI/Gemini API thật
// ==========================================

import type { QuizQuestion, GeneratedQuiz, ExamAnswer } from '@/types/lms-types';

// ==========================================
// 1. QUIZ GENERATION (AI sinh câu hỏi realtime)
// ==========================================

/**
 * Sinh câu hỏi trắc nghiệm từ nội dung bài học
 * Câu hỏi KHÔNG lưu vào DB — chỉ trả về JSON cho frontend
 */
export async function generateQuizQuestions(
  lessonContents: string[],
  questionCount: number,
  subjectName: string
): Promise<GeneratedQuiz> {
  // TODO: Thay bằng API AI thật (OpenAI/Gemini)
  // Hiện tại dùng mock questions dựa trên subject name

  const questions: QuizQuestion[] = [];

  const questionBanks: Record<string, QuizQuestion[]> = {
    default: generateDefaultQuestions(subjectName, questionCount),
  };

  const bank = questionBanks.default;

  for (let i = 0; i < questionCount; i++) {
    questions.push(bank[i % bank.length]);
    // Đảm bảo index đúng
    questions[i] = { ...questions[i], index: i };
  }

  return {
    questions,
    generatedAt: new Date().toISOString(),
    basedOnLessons: [],
  };
}

function generateDefaultQuestions(subjectName: string, count: number): QuizQuestion[] {
  const templates: QuizQuestion[] = [
    {
      index: 0,
      content: `Trong môn ${subjectName}, khái niệm nào sau đây là cơ bản nhất?`,
      options: ['Khái niệm nền tảng', 'Khái niệm nâng cao', 'Khái niệm ứng dụng', 'Khái niệm phụ trợ'],
      correctAnswer: 0,
      explanation: 'Khái niệm nền tảng là cơ bản nhất trong bất kỳ môn học nào.',
    },
    {
      index: 1,
      content: `Phương pháp học ${subjectName} hiệu quả nhất là gì?`,
      options: ['Chỉ đọc sách', 'Kết hợp lý thuyết và thực hành', 'Chỉ làm bài tập', 'Học thuộc lòng'],
      correctAnswer: 1,
      explanation: 'Kết hợp lý thuyết và thực hành giúp nắm vững kiến thức.',
    },
    {
      index: 2,
      content: `Mục tiêu chính của buổi học lý thuyết trong ${subjectName} là gì?`,
      options: ['Giải trí', 'Nắm vững khái niệm cốt lõi', 'Kiểm tra kiến thức', 'Thảo luận nhóm'],
      correctAnswer: 1,
      explanation: 'Buổi lý thuyết nhằm giúp học viên hiểu rõ khái niệm cốt lõi.',
    },
    {
      index: 3,
      content: `Khi gặp khó khăn trong ${subjectName}, bước đầu tiên nên làm gì?`,
      options: ['Bỏ qua', 'Xem lại tài liệu và hỏi giáo viên', 'Chờ bài kiểm tra', 'Tự suy đoán'],
      correctAnswer: 1,
      explanation: 'Xem lại tài liệu và hỏi giáo viên là cách tiếp cận đúng đắn.',
    },
    {
      index: 4,
      content: `Trong ${subjectName}, buổi thực hành giúp học viên điều gì?`,
      options: ['Nghỉ ngơi', 'Áp dụng kiến thức vào thực tế', 'Học thêm lý thuyết', 'Ôn bài cũ'],
      correctAnswer: 1,
      explanation: 'Thực hành giúp áp dụng kiến thức vào tình huống thực tế.',
    },
    {
      index: 5,
      content: `Đánh giá kết quả học tập ${subjectName} dựa trên yếu tố nào?`,
      options: ['Chỉ điểm thi', 'Quá trình học + bài tập + thi', 'Chỉ bài tập', 'Chỉ đi học đầy đủ'],
      correctAnswer: 1,
      explanation: 'Đánh giá toàn diện bao gồm quá trình, bài tập và bài thi.',
    },
    {
      index: 6,
      content: `Tài liệu bổ trợ nào hữu ích nhất cho ${subjectName}?`,
      options: ['Truyện tranh', 'Sách giáo khoa và bài giảng', 'Mạng xã hội', 'Game online'],
      correctAnswer: 1,
      explanation: 'Sách giáo khoa và bài giảng là tài liệu chính thống và hữu ích nhất.',
    },
    {
      index: 7,
      content: `Kỹ năng quan trọng nhất khi học ${subjectName}?`,
      options: ['Ghi nhớ máy móc', 'Tư duy phân tích và giải quyết vấn đề', 'Sao chép bài', 'Học vẹt'],
      correctAnswer: 1,
      explanation: 'Tư duy phân tích giúp hiểu sâu và vận dụng linh hoạt.',
    },
    {
      index: 8,
      content: `Trong quy trình học ${subjectName}, bước nào nên thực hiện trước khi đến lớp?`,
      options: ['Không cần chuẩn bị', 'Đọc trước tài liệu bài học', 'Làm bài kiểm tra', 'Chỉ cần nghe giảng'],
      correctAnswer: 1,
      explanation: 'Đọc trước giúp nắm bắt bài giảng hiệu quả hơn.',
    },
    {
      index: 9,
      content: `Vai trò của giáo viên trong môn ${subjectName} là gì?`,
      options: ['Chỉ chấm điểm', 'Hướng dẫn, giải đáp và đánh giá', 'Chỉ giảng bài', 'Chỉ quản lý lớp'],
      correctAnswer: 1,
      explanation: 'Giáo viên vừa hướng dẫn, vừa giải đáp thắc mắc và đánh giá tiến bộ.',
    },
  ];

  // Tạo đủ số câu bằng cách lặp và biến tấu
  const result: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const base = templates[i % templates.length];
    result.push({
      ...base,
      index: i,
      content: i >= templates.length ? `(Câu ${i + 1}) ${base.content}` : base.content,
    });
  }

  return result;
}

// ==========================================
// 2. QUIZ GRADING (Chấm điểm trắc nghiệm)
// ==========================================

/**
 * Chấm điểm bài thi trắc nghiệm
 * So sánh đáp án học sinh với đáp án đúng
 */
export function gradeQuizAnswers(
  questions: QuizQuestion[],
  studentAnswers: { questionIndex: number; selectedOption: number }[]
): { score: number; correctCount: number; totalQuestions: number; gradedAnswers: ExamAnswer[] } {
  const totalQuestions = questions.length;
  let correctCount = 0;
  const gradedAnswers: ExamAnswer[] = [];

  for (const question of questions) {
    const studentAnswer = studentAnswers.find((a) => a.questionIndex === question.index);
    const isCorrect = studentAnswer?.selectedOption === question.correctAnswer;
    if (isCorrect) correctCount++;

    gradedAnswers.push({
      questionIndex: question.index,
      selectedOption: studentAnswer?.selectedOption ?? -1,
      isCorrect,
    });
  }

  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 10 * 100) / 100 : 0;

  return { score, correctCount, totalQuestions, gradedAnswers };
}

// ==========================================
// 3. ASSIGNMENT GRADING (AI chấm bài tập)
// ==========================================

/**
 * AI phân tích và chấm bài tập
 * Trả về điểm + nhận xét chi tiết
 */
export async function gradeAssignment(
  assignmentTitle: string,
  assignmentDescription: string,
  submissionContent: string
): Promise<{ grade: number; aiReview: string }> {
  const prompt = `Bạn là SEDUAI, trợ lý chấm bài cho giáo viên. Hãy đánh giá bài làm theo thang 10 dựa trên đúng yêu cầu đề bài, không suy diễn kiến thức không có trong bài.

Đề bài: ${assignmentTitle}
Yêu cầu: ${assignmentDescription || 'Giáo viên chưa cung cấp rubric chi tiết.'}
Bài làm của học sinh:
${submissionContent}

Trả về duy nhất JSON hợp lệ theo cấu trúc:
{"grade": 0-10, "strengths": ["..."], "issues": ["..."], "suggestions": ["..."], "summary": "..."}`;

  try {
    const raw = await callSeduAiGrader(prompt);
    const parsed = parseGradingJson(raw);
    const grade = Math.min(10, Math.max(0, Math.round(Number(parsed.grade) * 10) / 10));
    const list = (items: unknown) => Array.isArray(items) ? items.map(String).slice(0, 5).map((item) => `- ${item}`).join('\n') : '- Chưa có nhận xét.';
    return {
      grade,
      aiReview: `**Tóm tắt:** ${String(parsed.summary || 'SEDUAI đã phân tích bài làm.')}\n\n**Điểm mạnh**\n${list(parsed.strengths)}\n\n**Điểm cần cải thiện**\n${list(parsed.issues)}\n\n**Đề xuất**\n${list(parsed.suggestions)}\n\n*Điểm SEDUAI chỉ là đề xuất; giáo viên quyết định điểm cuối cùng.*`,
    };
  } catch (error) {
    console.error('SEDUAI grading provider failed:', error);
    const hasEnoughContent = submissionContent.trim().length >= 120;
    return {
      grade: hasEnoughContent ? 6.5 : 4,
      aiReview: `SEDUAI chưa kết nối được nhà cung cấp AI nên chỉ thực hiện kiểm tra sơ bộ. Bài làm ${hasEnoughContent ? 'có độ dài cơ bản' : 'còn ngắn'}, giáo viên cần đọc và quyết định điểm cuối cùng.`,
    };
  }
}

async function callSeduAiGrader(prompt: string): Promise<string> {
  if (process.env.GEMINI_API_KEY) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json', maxOutputTokens: 1200 },
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
  }

  if (process.env.GROQ_API_KEY) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return text;
    }
  }

  throw new Error('Không có nhà cung cấp AI khả dụng');
}

function parseGradingJson(raw: string): Record<string, unknown> {
  const normalized = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(normalized) as Record<string, unknown>;
}
