// Client service cho toàn bộ API NKS SCRMAI và User Management NKS

export const CRM_API_BASE = 'https://sdata.io.vn/wp-json/scrmai/v1';

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
  zalo?: string;
  demand?: string;
  company?: string;
  position?: string;
  comsize?: string | number;
  source?: string | number; // e.g. 31 (Website)
  status?: string; // e.g. "APPROVED"
  note?: string;
  source_id?: number; // Hỗ trợ tương thích ngược
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
  status?: number | string;
  message?: string;
  access_token?: string;
  token?: string;
  userInfo?: UserInfo;
  user?: UserInfo;
  data?: unknown;
  error?: string;
}

export class AccountSessionUnavailableError extends Error {
  constructor() {
    super('Dịch vụ xác thực NKS đang tạm thời gián đoạn. Phiên đăng nhập trên thiết bị vẫn được giữ.');
    this.name = 'AccountSessionUnavailableError';
  }
}

// ==========================================
// ==========================================
// 1. CRM & COURSES API
// ==========================================

/**
 * Lấy danh sách khóa học từ API chính thức
 */
export async function getEduCourses(): Promise<ApiCourse[]> {
  try {
    const isClient = typeof window !== 'undefined';
    const crmToken = process.env.CRM_API_TOKEN;
    if (!isClient && !crmToken) return [];
    const url = isClient ? '/api/proxy/crm' : `${CRM_API_BASE}/educourses`;
    const options: RequestInit = isClient
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: 'educourses' }),
        }
      : {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${crmToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          next: { revalidate: 300 },
        };

    const response = await fetch(url, options);
    if (!response.ok) return [];

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
    // Chuẩn hóa payload theo đặc tả API của NKS
    const finalPayload = {
      source: payload.source ?? 31, // Mặc định 31 là nguồn "Website"
      status: payload.status ?? 'APPROVED',
      comsize: payload.comsize ?? 1,
      company: payload.company ?? 'S',
      zalo: payload.zalo ?? '',
      position: payload.position ?? '',
      ...payload
    };

    const isClient = typeof window !== 'undefined';
    const crmToken = process.env.CRM_API_TOKEN;
    if (!isClient && !crmToken) {
      return { success: false, message: 'CRM_API_TOKEN chưa được cấu hình' };
    }
    const url = isClient ? '/api/proxy/crm' : `${CRM_API_BASE}/lead/create`;
    const options: RequestInit = isClient
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: 'lead/create', payload: finalPayload }),
        }
      : {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${crmToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(finalPayload),
        };

    const response = await fetch(url, options);
    const json = await response.json();
    if (json.success) {
      return { success: true, id: json.id };
    }
    return { success: false, message: json.message || 'Không thể tạo Lead' };
  } catch (error) {
    console.error('Lỗi khi gọi API tạo Lead:', error);
    return { success: false, message: error instanceof Error ? error.message : String(error) };
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
    const isClient = typeof window !== 'undefined';
    const url = isClient ? '/api/proxy/account' : `${ACCOUNT_API_BASE}/login`;
    const bodyPayload = isClient
      ? { action: 'login', payload: { username, password, system: 'NKS', device: 'web browser' } }
      : { username, password, system: 'NKS', device: 'web browser' };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    const json = await response.json();
    if (!response.ok || json?.success === false || json?.error) {
      return {
        ...json,
        success: false,
        error: json?.error || json?.message || 'Tài khoản hoặc mật khẩu không chính xác',
      };
    }
    return json;
  } catch (error) {
    console.error('Lỗi khi đăng nhập API:', error);
    return { success: false, error: 'Lỗi kết nối máy chủ' };
  }
}

/**
 * Lấy thông tin tài khoản bằng access_token
 */
export async function fetchUserInfo(access_token: string): Promise<UserInfo | null> {
  try {
    if (!access_token) return null;
    const isClient = typeof window !== 'undefined';
    const url = isClient ? '/api/proxy/account' : ACCOUNT_API_BASE;
    const bodyPayload = isClient
      ? { action: '', payload: { access_token } }
      : { access_token };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok) throw new AccountSessionUnavailableError();

    const json = await response.json();
    const data = json?.data && typeof json.data === 'object' ? json.data : null;
    const account = json?.userInfo
      || json?.user
      || data?.userInfo
      || data?.user
      || data;

    if (account && typeof account === 'object') {
      const username = account.username || account.email;
      if (typeof username === 'string' && username.trim()) {
        return {
          ...account,
          username: username.trim(),
        } as UserInfo;
      }
    }
    return null;
  } catch (error) {
    if (error instanceof AccountSessionUnavailableError) throw error;
    throw new AccountSessionUnavailableError();
  }
}

/**
 * Cập nhật thông tin cơ bản thành viên
 */
export async function updateUserInfoApi(access_token: string, data: Partial<UserInfo>): Promise<boolean> {
  try {
    const isClient = typeof window !== 'undefined';
    const url = isClient ? '/api/proxy/account' : `${ACCOUNT_API_BASE}/updateInfo`;
    const bodyPayload = isClient
      ? { action: 'updateInfo', payload: { ...data, access_token } }
      : { ...data, access_token };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
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
    const isClient = typeof window !== 'undefined';
    const url = isClient ? '/api/proxy/account' : `${ACCOUNT_API_BASE}/updatePass`;
    const bodyPayload = isClient
      ? { action: 'updatePass', payload: { old_password, password, access_token } }
      : { old_password, password, access_token };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    const json = await response.json();
    if (json.success || !json.error) {
      return { success: true };
    }
    return { success: false, message: json.error || json.message || 'Mật khẩu cũ không chính xác' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Cập nhật ảnh đại diện Base64
 */
export async function updateAvatarApi(access_token: string, avatarBase64: string): Promise<boolean> {
  try {
    const isClient = typeof window !== 'undefined';
    const url = isClient ? '/api/proxy/account' : `${ACCOUNT_API_BASE}/updateAvatar`;
    const bodyPayload = isClient
      ? { action: 'updateAvatar', payload: { avatar: avatarBase64, access_token } }
      : { avatar: avatarBase64, access_token };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
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
    const isClient = typeof window !== 'undefined';
    const url = isClient ? '/api/proxy/account' : `${ACCOUNT_API_BASE}/updateCccd`;
    const bodyPayload = isClient
      ? { action: 'updateCccd', payload: { front: frontBase64, back: backBase64, number, date, place, access_token } }
      : { front: frontBase64, back: backBase64, number, date, place, access_token };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
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
    const isClient = typeof window !== 'undefined';
    const url = isClient ? '/api/proxy/provinces' : `${ONLINE_API_BASE}/provinces`;
    const options: RequestInit = isClient
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country_id: 192, slcBox: 1 }),
        };

    const response = await fetch(url, options);
    const json = await response.json();
    if (Array.isArray(json.data || json)) {
      return json.data || json;
    }
    return [];
  } catch (error) {
    console.warn('Lỗi lấy danh sách tỉnh thành (đã chuyển sang dữ liệu dự phòng):', error);
    return [];
  }
}
