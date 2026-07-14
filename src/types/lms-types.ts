// ==========================================
// LMS Type Definitions
// Shared types used across frontend and API
// ==========================================

// Re-export Prisma enums for frontend use
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type LessonType = 'THEORY' | 'PRACTICAL';
export type ExamType = 'LESSON_QUIZ' | 'MIDTERM' | 'FINAL';
export type SubmissionStatus = 'PENDING' | 'AI_GRADED' | 'REVIEWED';
export type ClassStatus = 'ACTIVE' | 'ARCHIVED';

// ==========================================
// API Response Types
// ==========================================

export interface LmsUserDTO {
  id: string;
  nksUserId?: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export interface LmsClassDTO {
  id: string;
  name: string;
  teacherId: string;
  teacher?: LmsUserDTO;
  maxStudents: number;
  status: ClassStatus;
  studentCount?: number;
  subjectCount?: number;
  students?: LmsUserDTO[];
  subjects?: LmsSubjectDTO[];
  createdAt: string;
}

export interface LmsSubjectDTO {
  id: string;
  classId: string;
  name: string;
  theoryLessons: number;
  practicalLessons: number;
  lessonCount?: number;
  completedLessons?: number;
  createdAt: string;
}

export interface LmsLessonDTO {
  id: string;
  subjectId: string;
  type: LessonType;
  orderIndex: number;
  title: string;
  content?: string;
  attachments?: AttachmentItem[];
  assignments?: LmsAssignmentDTO[];
  createdAt: string;
}

export interface AttachmentItem {
  name: string;
  url: string;
  size?: number;
}

export interface LmsAssignmentDTO {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  dueDate?: string;
  submissionCount?: number;
  createdAt: string;
}

export interface LmsSubmissionDTO {
  id: string;
  assignmentId: string;
  studentId: string;
  student?: LmsUserDTO;
  assignment?: LmsAssignmentDTO;
  content?: string;
  files?: AttachmentItem[];
  grade?: number;
  aiReview?: string;
  teacherReview?: string;
  status: SubmissionStatus;
  submittedAt: string;
}

export interface LmsExamConfigDTO {
  id: string;
  subjectId: string;
  classId: string;
  subject?: LmsSubjectDTO;
  examType: ExamType;
  questionCount: number;
  durationMinutes: number;
  password?: string;
  startTime?: string;
  endTime?: string;
  lessonOrder?: number;
  resultCount?: number;
  createdAt: string;
}

export interface LmsExamResultDTO {
  id: string;
  examConfigId: string;
  studentId: string;
  student?: LmsUserDTO;
  examConfig?: LmsExamConfigDTO;
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers?: ExamAnswer[];
  startedAt: string;
  finishedAt?: string;
}

export interface ExamAnswer {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
}

// ==========================================
// AI-Generated Quiz Types (NOT stored in DB)
// ==========================================

export interface QuizQuestion {
  index: number;
  content: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-3)
  explanation?: string;
}

export interface GeneratedQuiz {
  questions: QuizQuestion[];
  generatedAt: string;
  basedOnLessons: string[]; // lesson IDs used to generate
}

// ==========================================
// Dashboard / Stats Types
// ==========================================

export interface ClassDashboardStats {
  classId: string;
  className: string;
  totalStudents: number;
  subjectStats: SubjectStat[];
  leaderboard: LeaderboardEntry[];
  assignmentCompletion: number; // percentage
  examCompletion: number; // percentage
}

export interface SubjectStat {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  completedLessons: number;
  totalLessons: number;
  submissionRate: number; // percentage
}

export interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  averageScore: number;
  totalSubmissions: number;
  rank: number;
}

// ==========================================
// API Request Types
// ==========================================

export interface CreateClassPayload {
  name: string;
  teacherId: string;
  subjects: string[]; // subject names
}

export interface CreateLessonPayload {
  subjectId: string;
  type: LessonType;
  orderIndex: number;
  title: string;
  content?: string;
  attachments?: AttachmentItem[];
}

export interface CreateAssignmentPayload {
  lessonId: string;
  title: string;
  description?: string;
  dueDate?: string;
}

export interface SubmitAssignmentPayload {
  assignmentId: string;
  studentId: string;
  content?: string;
  files?: AttachmentItem[];
}

export interface CreateExamConfigPayload {
  subjectId: string;
  classId: string;
  examType: ExamType;
  questionCount: number;
  durationMinutes: number;
  password?: string;
  startTime?: string;
  endTime?: string;
  lessonOrder?: number;
}

export interface SubmitExamPayload {
  examConfigId: string;
  studentId: string;
  answers: ExamAnswer[];
  score: number;
  correctCount: number;
  totalQuestions: number;
  startedAt: string;
  finishedAt: string;
}
