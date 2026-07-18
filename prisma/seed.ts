import prisma from '../src/lib/prisma';

async function main() {
  console.log('Bắt đầu dọn dẹp và khởi tạo dữ liệu mẫu LMS...');

  // 1. Tạo các vai trò người dùng mặc định
  const adminUsername = process.env.LMS_BOOTSTRAP_ADMIN_USERNAME?.trim() || 'admin_seduai';
  
  console.log(`Đang cấu hình quản trị viên mặc định: ${adminUsername}`);
  const adminUser = await prisma.lmsUser.upsert({
    where: { username: adminUsername },
    update: { role: 'ADMIN' },
    create: {
      username: adminUsername,
      name: 'Quản trị viên SeduAi',
      email: 'admin@seduai.edu.vn',
      phone: '0901234567',
      role: 'ADMIN',
    },
  });

  const teacherUser = await prisma.lmsUser.upsert({
    where: { username: 'teacher_seduai' },
    update: {},
    create: {
      username: 'teacher_seduai',
      name: 'Thầy Nguyễn SeduAi',
      email: 'teacher@seduai.edu.vn',
      phone: '0907654321',
      role: 'TEACHER',
    },
  });

  const studentUser = await prisma.lmsUser.upsert({
    where: { username: 'student_seduai' },
    update: {},
    create: {
      username: 'student_seduai',
      name: 'Học viên SeduAi',
      email: 'student@seduai.edu.vn',
      phone: '0909999999',
      role: 'STUDENT',
    },
  });

  const additionalStudents = await Promise.all(Array.from({ length: 24 }, (_, index) => {
    const number = index + 2;
    return prisma.lmsUser.upsert({
      where: { username: `student_seduai_${number}` },
      update: {},
      create: { username: `student_seduai_${number}`, name: `Học viên SeduAi ${number}`, role: 'STUDENT' },
    });
  }));
  const allStudents = [studentUser, ...additionalStudents];

  console.log('Đã khởi tạo xong tài khoản LMS.');

  // 2. Tạo lớp học mẫu
  const sampleClass = await prisma.lmsClass.create({
    data: {
      name: 'Lớp IELTS Master AI - K24',
      teacherId: teacherUser.id,
      maxStudents: 25,
      status: 'ACTIVE',
    },
  });
  console.log(`Đã tạo lớp học mẫu: ${sampleClass.name}`);

  // 3. Xếp học viên vào lớp học
  await prisma.lmsClassStudent.upsert({
    where: {
      classId_studentId: {
        classId: sampleClass.id,
        studentId: studentUser.id,
      },
    },
    update: {},
    create: {
      classId: sampleClass.id,
      studentId: studentUser.id,
    },
  });
  await prisma.lmsClassStudent.createMany({
    data: allStudents.slice(1).map((student) => ({ classId: sampleClass.id, studentId: student.id })),
    skipDuplicates: true,
  });
  console.log(`Đã xếp học viên ${studentUser.name} vào lớp ${sampleClass.name}`);

  // 4. Tạo môn học mẫu
  const subject1 = await prisma.lmsSubject.create({
    data: {
      classId: sampleClass.id,
      name: 'Tiếng Anh Giao Tiếp Thực Chiến',
      theoryLessons: 8,
      practicalLessons: 8,
    },
  });

  const subject2 = await prisma.lmsSubject.create({
    data: {
      classId: sampleClass.id,
      name: 'Ứng dụng AI trong Giáo dục',
      theoryLessons: 8,
      practicalLessons: 8,
    },
  });
  await prisma.lmsSubject.createMany({
    data: [
      { classId: sampleClass.id, name: 'Lập trình Web cơ bản', theoryLessons: 8, practicalLessons: 8 },
      { classId: sampleClass.id, name: 'Kỹ năng số và dự án', theoryLessons: 8, practicalLessons: 8 },
    ],
  });
  console.log('Đã tạo 2 môn học mẫu.');

  // 5. Tạo bài học và bài tập mẫu
  const lesson1 = await prisma.lmsLesson.create({
    data: {
      subjectId: subject1.id,
      type: 'THEORY',
      orderIndex: 1,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      title: 'Bài 1: Giao tiếp tự nhiên & Phát âm cùng AI',
      content: 'Bài học này hướng dẫn học viên các kỹ năng đàm thoại cơ bản và ứng dụng công cụ luyện giọng nói AI.',
    },
  });

  const lesson2 = await prisma.lmsLesson.create({
    data: {
      subjectId: subject1.id,
      type: 'PRACTICAL',
      orderIndex: 1,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      title: 'Thực hành 1: Hội thoại đàm thoại 1-1',
      content: 'Học viên thực hành ghi âm giọng nói đối thoại và nhận xét trực quan bằng Trợ lý AI.',
    },
  });

  const assignment = await prisma.lmsAssignment.create({
    data: {
      lessonId: lesson2.id,
      title: 'Ghi âm giới thiệu bản thân bằng Tiếng Anh',
      description: 'Luyện nói và ghi âm bài nói giới thiệu bản thân khoảng 2 phút. Nộp bản ghi âm hoặc văn bản lời nói lên hệ thống.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });
  console.log('Đã khởi tạo xong bài học và bài tập mẫu.');

  // 6. Tạo đề thi mẫu
  const examConfig = await prisma.lmsExamConfig.create({
    data: {
      classId: sampleClass.id,
      subjectId: subject1.id,
      examType: 'MIDTERM',
      questionCount: 30,
      durationMinutes: 45,
    },
  });
  console.log('Đã tạo đề thi Giữa Kỳ mẫu.');

  console.log('Chúc mừng! Dữ liệu mẫu LMS đã được khởi tạo thành công.');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
