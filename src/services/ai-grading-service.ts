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
  // TODO: Thay bằng OpenAI/Gemini API thật
  // Mock AI grading logic

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const contentLength = submissionContent.length;
  let grade: number;
  let aiReview: string;

  if (contentLength < 50) {
    grade = 4.0 + Math.random() * 2;
    aiReview = `📝 **Nhận xét AI cho bài "${assignmentTitle}":**\n\n` +
      `- **Nội dung**: Bài làm còn quá ngắn, chưa đáp ứng yêu cầu đề bài.\n` +
      `- **Phân tích**: Cần bổ sung thêm chi tiết và lập luận.\n` +
      `- **Đề xuất**: Đọc lại đề bài và phát triển ý tưởng rõ ràng hơn.\n` +
      `- **Điểm mạnh**: Có nỗ lực hoàn thành bài.\n`;
  } else if (contentLength < 200) {
    grade = 6.0 + Math.random() * 1.5;
    aiReview = `📝 **Nhận xét AI cho bài "${assignmentTitle}":**\n\n` +
      `- **Nội dung**: Bài làm đạt yêu cầu cơ bản, có đề cập đến các ý chính.\n` +
      `- **Phân tích**: Lập luận khá rõ ràng nhưng cần bổ sung ví dụ minh hoạ.\n` +
      `- **Đề xuất**: Thêm ví dụ thực tế và phân tích sâu hơn.\n` +
      `- **Điểm mạnh**: Trình bày mạch lạc, đúng hướng.\n`;
  } else {
    grade = 7.5 + Math.random() * 2.5;
    aiReview = `📝 **Nhận xét AI cho bài "${assignmentTitle}":**\n\n` +
      `- **Nội dung**: Bài làm xuất sắc, trả lời đầy đủ và chi tiết các yêu cầu.\n` +
      `- **Phân tích**: Lập luận logic, có ví dụ minh hoạ rõ ràng.\n` +
      `- **Đề xuất**: Có thể mở rộng thêm phần ứng dụng thực tế.\n` +
      `- **Điểm mạnh**: Tư duy tốt, trình bày chuyên nghiệp, bao quát vấn đề.\n`;
  }

  grade = Math.round(grade * 10) / 10; // Round to 1 decimal

  return { grade, aiReview };
}
