'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserInfo, fetchUserInfo } from '@/services/api';
import type { UserRole } from '@/types/lms-types';

export interface LocalSyncData {
  name: string;
  avatar: string;
  point: number;
}

interface AuthContextType {
  user: UserInfo | null;
  accessToken: string | null;
  localSync: LocalSyncData;
  isLoading: boolean;
  lmsRole: UserRole;
  lmsUserId: string | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (data: Partial<UserInfo>) => void;
  setLmsRole: (role: UserRole) => void;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStudent: () => boolean;
}

const defaultLocalSync: LocalSyncData = {
  name: 'Khách hàng SeduAi',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  point: 150,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  localSync: defaultLocalSync,
  isLoading: true,
  lmsRole: 'STUDENT',
  lmsUserId: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  setLmsRole: () => {},
  isAdmin: () => false,
  isTeacher: () => false,
  isStudent: () => true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('seduai_user_info');
      try { return stored ? JSON.parse(stored) : null; } catch { return null; }
    }
    return null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seduai_access_token');
    }
    return null;
  });
  const [localSync, setLocalSync] = useState<LocalSyncData>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('seduai_local_sync');
      try { return stored ? JSON.parse(stored) : defaultLocalSync; } catch { return defaultLocalSync; }
    }
    return defaultLocalSync;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lmsRole, setLmsRoleState] = useState<UserRole>(() => {
    return 'STUDENT';
  });
  const [lmsUserId, setLmsUserId] = useState<string | null>(null);

  // Sync state từ localStorage khi mount
  useEffect(() => {
    const storedToken = localStorage.getItem('seduai_access_token');
    const storedUser = localStorage.getItem('seduai_user_info');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Nâng cấp dữ liệu ngầm từ API (Chỉ cập nhật nếu đúng tài khoản, không ghi đè thành demo_student và không làm mất dữ liệu CCCD/profile local)
        fetchUserInfo(storedToken).then((freshUser) => {
          if (freshUser && (!freshUser.username || freshUser.username === parsedUser.username || parsedUser.username === 'demo_student')) {
            const mergedUser = { ...parsedUser, ...freshUser };
            // Bảo toàn các trường chi tiết thành viên đã lưu trên local (CCCD, ngày sinh, tỉnh thành, intro...) nếu API chưa trả về
            ['dob', 'gender', 'intro', 'province', 'phone', 'id_number', 'id_date', 'id_place', 'cccd_front', 'cccd_back', 'avatar', 'name', 'firstname', 'lastname'].forEach((key) => {
              const k = key as keyof UserInfo;
              if (parsedUser[k] !== undefined && parsedUser[k] !== null && parsedUser[k] !== '' && (!freshUser[k] || freshUser[k] === '')) {
                const userKey = k as keyof UserInfo;
                (mergedUser as Record<string, unknown>)[userKey] = parsedUser[userKey];
              }
            });

            setUser(mergedUser);
            localStorage.setItem('seduai_user_info', JSON.stringify(mergedUser));
            const syncData: LocalSyncData = {
              name: mergedUser.name || `${mergedUser.lastname || ''} ${mergedUser.firstname || ''}`.trim() || mergedUser.username || parsedUser.name || 'Thành viên SeduAi',
              avatar: mergedUser.avatar || parsedUser.avatar || defaultLocalSync.avatar,
              point: mergedUser.point ?? parsedUser.point ?? 300,
            };
            setLocalSync(syncData);
            localStorage.setItem('seduai_local_sync', JSON.stringify(syncData));
          }
        });
      } catch (e) {
        console.error('Lỗi parse user info:', e);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  // Resolve the authenticated NKS account to its LMS identity once per login.
  useEffect(() => {
    if (!user?.username || !accessToken) return;

    let cancelled = false;
    fetch(`/api/lms/users?username=${encodeURIComponent(user.username)}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled || !result.success || !result.data?.[0]) return;
        const lmsUser = result.data[0];
        setLmsUserId(lmsUser.id);
        setLmsRoleState(lmsUser.role);
        localStorage.setItem('seduai_lms_user_id', lmsUser.id);
        localStorage.setItem('seduai_lms_role', lmsUser.role);
      })
      .catch((error) => console.error('Không thể đồng bộ tài khoản LMS:', error));

    return () => {
      cancelled = true;
    };
  }, [user?.username, accessToken]);

  const login = (token: string, userInfo: UserInfo) => {
    setAccessToken(token);
    setUser(userInfo);
    localStorage.setItem('seduai_access_token', token);
    localStorage.setItem('seduai_user_info', JSON.stringify(userInfo));

    const syncData: LocalSyncData = {
      name: userInfo.name || `${userInfo.lastname || ''} ${userInfo.firstname || ''}`.trim() || userInfo.username || 'Thành viên SeduAi',
      avatar: userInfo.avatar || defaultLocalSync.avatar,
      point: userInfo.point ?? 300,
    };
    setLocalSync(syncData);
    localStorage.setItem('seduai_local_sync', JSON.stringify(syncData));
  };

  const logout = () => {
    void fetch('/api/proxy/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setAccessToken(null);
    setUser(null);
    setLocalSync(defaultLocalSync);
    setLmsRoleState('STUDENT');
    setLmsUserId(null);
    localStorage.removeItem('seduai_access_token');
    localStorage.removeItem('seduai_user_info');
    localStorage.removeItem('seduai_local_sync');
    localStorage.removeItem('seduai_remembered_user');
    localStorage.removeItem('seduai_lms_role');
    localStorage.removeItem('seduai_lms_user_id');
  };

  const setLmsRole = (role: UserRole) => {
    setLmsRoleState(role);
    localStorage.setItem('seduai_lms_role', role);
  };

  const isAdmin = () => lmsRole === 'ADMIN';
  const isTeacher = () => lmsRole === 'TEACHER';
  const isStudent = () => lmsRole === 'STUDENT';

  const updateUser = (data: Partial<UserInfo>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('seduai_user_info', JSON.stringify(updatedUser));

    const syncData: LocalSyncData = {
      name: updatedUser.name || `${updatedUser.lastname || ''} ${updatedUser.firstname || ''}`.trim() || updatedUser.username || localSync.name,
      avatar: updatedUser.avatar || localSync.avatar,
      point: updatedUser.point ?? localSync.point,
    };
    setLocalSync(syncData);
    localStorage.setItem('seduai_local_sync', JSON.stringify(syncData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        localSync,
        isLoading,
        lmsRole,
        lmsUserId,
        login,
        logout,
        updateUser,
        setLmsRole,
        isAdmin,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
