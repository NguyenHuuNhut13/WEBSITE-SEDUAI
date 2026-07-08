import Link from 'next/link';
import { Brain, MapPin, Phone, Mail } from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Sedu<span className="text-primary">Ai</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Hệ điều hành trí tuệ nhân tạo toàn diện cho giáo dục. Đột phá tuyển sinh, nâng tầm chất lượng dạy học và tự động hóa quy trình quản lý.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition duration-200"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition duration-200"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition duration-200"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: System modules */}
          <div>
            <h3 className="text-white font-bold text-base mb-5">Hệ thống & Phân hệ</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition duration-150">
                  Admissions CRM
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-150">
                  AI Teacher Assistant
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-150">
                  Học viên & Phụ huynh
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-150">
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition duration-150">
                  AI Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses categories */}
          <div>
            <h3 className="text-white font-bold text-base mb-5">Khóa học Đào tạo</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses?category=Tiếng Anh" className="hover:text-primary transition duration-150">
                  Tiếng Anh giao tiếp & IELTS
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Lập trình" className="hover:text-primary transition duration-150">
                  Lập trình Fullstack & Python
                </Link>
              </li>
              <li>
                <Link href="/courses?category=AI & Công nghệ" className="hover:text-primary transition duration-150">
                  Ứng dụng AI doanh nghiệp
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Kỹ năng" className="hover:text-primary transition duration-150">
                  Kỹ năng mềm thế hệ mới
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-5">Liên hệ SeduAi</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Tầng 5, Tòa nhà SeduAi, Đường 3/2, Quận 10, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:19001234" className="hover:text-primary">
                  1900 1234 (Hotline)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:contact@seduai.edu.vn" className="hover:text-primary">
                  contact@seduai.edu.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 SeduAi. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-slate-300">
              Điều khoản dịch vụ
            </Link>
            <Link href="#" className="hover:text-slate-300">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
