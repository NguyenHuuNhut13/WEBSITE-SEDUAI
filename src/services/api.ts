// Client service cho toàn bộ API NKS SCRMAI và User Management NKS

export const CRM_API_BASE = 'https://sdata.io.vn/wp-json/scrmai/v1';
export const CRM_TOKEN = '01KWKATNQGB5TWXYDPJ671X3X1';

export const ACCOUNT_API_BASE = 'https://account.nks.vn/api/nks/user';
export const ONLINE_API_BASE = 'https://online.nks.vn/api/nks';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface ApiCourseACF {
  description?: string;
  benefit?: string;
  intro?: string;
  tag?: string;
  video?: string;
  featureimg?: string;
  duration?: string;
  lession?: string;
  cashback?: string;
  lifetime?: string;
  certificate?: string;
  type?: string;
  category?: string;
  faculty?: string;
  expactteacher?: string;
  trial?: string;
  link?: string;
  price?: number | string;
  sale_price?: number | string;
}

export interface ApiCourse {
  id: number;
  title: string;
  acf: ApiCourseACF;
  created_at?: string;
}

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  demand?: string;
  note?: string;
  source_id?: number;
}

export interface UserInfo {
  id?: number | string;
  username?: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  intro?: string;
  gender?: number; // 0 | 1
  website?: string;
  dob?: string; // yyyy-mm-dd
  pob?: string;
  id_number?: string;
  id_date?: string;
  id_place?: string;
  province?: string | number;
  point?: number;
  cccd_front?: string;
  cccd_back?: string;
}

export interface LoginResponse {
  success?: boolean;
  code?: number;
  message?: string;
  access_token?: string;
  userInfo?: UserInfo;
  data?: any;
  error?: string;
}

// ==========================================
// 1. CRM & COURSES API (sdata.io.vn)
// ==========================================

/**
 * Lấy danh sách khóa học từ API chính thức
 */
export async function getEduCourses(): Promise<ApiCourse[]> {
  try {
    const response = await fetch(`${CRM_API_BASE}/educourses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRM_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache 5 phút cho Next.js
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const json = await response.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.error('Lỗi lấy danh sách khóa học từ API:', error);
    return [];
  }
}

/**
 * Tạo & Lưu thông tin Lead mới lên CRM
 */
export async function createLead(payload: LeadPayload): Promise<{ success: boolean; id?: number; message?: string }> {
  try {
    const response = await fetch(`${CRM_API_BASE}/lead/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRM_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (json.success) {
      return { success: true, id: json.id };
    }
    return { success: false, message: json.message || 'Không thể tạo Lead' };
  } catch (error: any) {
    console.error('Lỗi khi gọi API tạo Lead:', error);
    return { success: false, message: error.message };
  }
}

// ==========================================
// 2. USER MANAGEMENT API (account.nks.vn)
// ==========================================

/**
 * Đăng nhập hệ thống NKS
 */
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${ACCOUNT_API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        system: 'NKS',
        device: 'web browser',
      }),
    });

    const json = await response.json();
    return json;
  } catch (error: any) {
    console.error('Lỗi khi đăng nhập API:', error);
    return { success: false, error: 'Lỗi kết nối máy chủ' };
  }
}

/**
 * Lấy thông tin tài khoản bằng access_token
 */
export async function fetchUserInfo(access_token: string): Promise<UserInfo | null> {
  try {
    const response = await fetch(ACCOUNT_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token }),
    });

    const json = await response.json();
    if (json.userInfo || json.data) {
      return json.userInfo || json.data;
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin user:', error);
    return null;
  }
}

/**
 * Cập nhật thông tin cơ bản thành viên
 */
export async function updateUserInfoApi(access_token: string, data: Partial<UserInfo>): Promise<boolean> {
  try {
    const response = await fetch(`${ACCOUNT_API_BASE}/updateInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        access_token,
      }),
    });

    const json = await response.json();
    return json.success || json.code === 200 || !json.error;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin user:', error);
    return false;
  }
}

/**
 * Cập nhật mật khẩu thành viên
 */
export async function updatePasswordApi(access_token: string, old_password: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${ACCOUNT_API_BASE}/updatePass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        old_password,
        password,
        access_token,
      }),
    });

    const json = await response.json();
    if (json.success || !json.error) {
      return { success: true };
    }
    return { success: false, message: json.error || json.message || 'Mật khẩu cũ không chính xác' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Cập nhật ảnh đại diện Base64
 */
export async function updateAvatarApi(access_token: string, avatarBase64: string): Promise<boolean> {
  try {
    const response = await fetch(`${ACCOUNT_API_BASE}/updateAvatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: avatarBase64,
        access_token,
      }),
    });

    const json = await response.json();
    return json.success || !json.error;
  } catch (error) {
    console.error('Lỗi cập nhật Avatar API:', error);
    return false;
  }
}

/**
 * Cập nhật CCCD Mặt trước, mặt sau Base64
 */
export async function updateCccdApi(
  access_token: string,
  frontBase64: string,
  backBase64: string,
  number: string,
  date: string,
  place: string
): Promise<boolean> {
  try {
    const response = await fetch(`${ACCOUNT_API_BASE}/updateCccd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        front: frontBase64,
        back: backBase64,
        number,
        date,
        place,
        access_token,
      }),
    });

    const json = await response.json();
    return json.success || !json.error;
  } catch (error) {
    console.error('Lỗi cập nhật CCCD API:', error);
    return false;
  }
}

// ==========================================
// 3. PROVINCES API (online.nks.vn)
// ==========================================

export interface Province {
  id: number | string;
  name?: string;
  title?: string;
}

export async function fetchProvincesApi(): Promise<Province[]> {
  try {
    const response = await fetch(`${ONLINE_API_BASE}/provinces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country_id: 192,
        slcBox: 1,
      }),
    });

    const json = await response.json();
    if (Array.isArray(json.data || json)) {
      return json.data || json;
    }
    return [];
  } catch (error) {
    console.error('Lỗi lấy danh sách tỉnh thành:', error);
    return [];
  }
}
