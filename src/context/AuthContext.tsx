'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccountSessionUnavailableError, UserInfo, fetchUserInfo } from '@/services/api';
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
  lmsIdentityLoading: boolean;
  lmsIdentityError: string | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => Promise<boolean>;
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
  lmsIdentityLoading: true,
  lmsIdentityError: null,
  login: () => {},
  logout: async () => false,
  updateUser: () => {},
  setLmsRole: () => {},
  isAdmin: () => false,
  isTeacher: () => false,
  isStudent: () => true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Keep the server render and the client's first render identical.
  // Browser storage is restored only after hydration in the mount effect below.
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [localSync, setLocalSync] = useState<LocalSyncData>(defaultLocalSync);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lmsRole, setLmsRoleState] = useState<UserRole>(() => {
    return 'STUDENT';
  });
  const [lmsUserId, setLmsUserId] = useState<string | null>(null);
  const [lmsIdentityLoading, setLmsIdentityLoading] = useState(true);
  const [lmsIdentityError, setLmsIdentityError] = useState<string | null>(null);
  const authOperationRef = useRef(0);
  const logoutPromiseRef = useRef<Promise<boolean> | null>(null);

  const clearClientAuthState = useCallback((forgetRememberedUser = false) => {
    setAccessToken(null);
    setUser(null);
    setLocalSync(defaultLocalSync);
    setLmsRoleState('STUDENT');
    setLmsUserId(null);
    setLmsIdentityLoading(false);
    setLmsIdentityError(null);
    localStorage.removeItem('seduai_access_token');
    localStorage.removeItem('seduai_user_info');
    localStorage.removeItem('seduai_local_sync');
    localStorage.removeItem('seduai_lms_role');
    localStorage.removeItem('seduai_lms_user_id');
    if (forgetRememberedUser) localStorage.removeItem('seduai_remembered_user');
  }, []);

  // Restore browser state only after the token is verified by NKS.
  // This keeps the server render stable and prevents stale localStorage from
  // being treated as an authenticated session.
  useEffect(() => {
    let cancelled = false;
    const operationId = ++authOperationRef.current;
    const isStale = () => cancelled || authOperationRef.current !== operationId;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem('seduai_access_token');
      const storedUser = localStorage.getItem('seduai_user_info');
      const storedLocalSync = localStorage.getItem('seduai_local_sync');

      if (!storedToken) {
        if (!isStale()) {
          clearClientAuthState();
          setIsLoading(false);
        }
        return;
      }

      let parsedUser: UserInfo | null = null;
      try {
        if (storedUser) parsedUser = JSON.parse(storedUser) as UserInfo;
      } catch (error) {
        console.warn('Không thể đọc dữ liệu tài khoản đã lưu:', error);
      }

      try {
        // This request also refreshes the server-side HttpOnly cookie when the
        // supplied token is valid.
        const freshUser = await fetchUserInfo(storedToken);
        if (isStale()) return;

        if (!freshUser?.username) {
          clearClientAuthState();
          return;
        }

        const sameAccount = Boolean(
          parsedUser?.username
          && parsedUser.username.toLowerCase() === freshUser.username.toLowerCase(),
        );
        const mergedUser: UserInfo = sameAccount ? { ...parsedUser, ...freshUser } : { ...freshUser };

        // Preserve locally enriched profile fields only for the same verified
        // account and only when NKS omitted their value.
        if (sameAccount && parsedUser) {
          ['dob', 'gender', 'intro', 'province', 'phone', 'id_number', 'id_date', 'id_place', 'cccd_front', 'cccd_back', 'avatar', 'name', 'firstname', 'lastname'].forEach((key) => {
            const userKey = key as keyof UserInfo;
            const localValue = parsedUser[userKey];
            const remoteValue = freshUser[userKey];
            if (localValue !== undefined && localValue !== null && localValue !== '' && (remoteValue === undefined || remoteValue === null || remoteValue === '')) {
              (mergedUser as Record<string, unknown>)[userKey] = localValue;
            }
          });
        }

        let cachedSync: Partial<LocalSyncData> = {};
        if (sameAccount && storedLocalSync) {
          try {
            cachedSync = JSON.parse(storedLocalSync) as Partial<LocalSyncData>;
          } catch {
            cachedSync = {};
          }
        }

        const syncData: LocalSyncData = {
          name: mergedUser.name || `${mergedUser.lastname || ''} ${mergedUser.firstname || ''}`.trim() || mergedUser.username || cachedSync.name || 'Thành viên SeduAi',
          avatar: mergedUser.avatar || cachedSync.avatar || defaultLocalSync.avatar,
          point: mergedUser.point ?? cachedSync.point ?? 300,
        };

        setAccessToken(storedToken);
        setUser(mergedUser);
        setLocalSync(syncData);
        localStorage.setItem('seduai_user_info', JSON.stringify(mergedUser));
        localStorage.setItem('seduai_local_sync', JSON.stringify(syncData));
      } catch (error) {
        if (!isStale()) {
          console.warn('Không thể xác minh phiên đăng nhập đã lưu:', error);
          if (error instanceof AccountSessionUnavailableError && parsedUser?.username) {
            let cachedSync: Partial<LocalSyncData> = {};
            try {
              cachedSync = storedLocalSync ? JSON.parse(storedLocalSync) as Partial<LocalSyncData> : {};
            } catch {
              cachedSync = {};
            }
            setAccessToken(storedToken);
            setUser(parsedUser);
            setLocalSync({
              name: cachedSync.name || parsedUser.name || parsedUser.username,
              avatar: cachedSync.avatar || parsedUser.avatar || defaultLocalSync.avatar,
              point: cachedSync.point ?? parsedUser.point ?? defaultLocalSync.point,
            });
          } else {
            clearClientAuthState();
          }
        }
      } finally {
        if (!isStale()) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, [clearClientAuthState]);

  // localStorage is shared between tabs while React state is not. Keep every
  // tab on the same verified account and clear stale LMS identity immediately
  // when another tab logs out.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'seduai_access_token') return;
      if (!event.newValue) {
        authOperationRef.current += 1;
        clearClientAuthState();
        setIsLoading(false);
        return;
      }
      window.location.reload();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [clearClientAuthState]);

  // Resolve the authenticated NKS account to its LMS identity once per login.
  useEffect(() => {
    if (isLoading) return;
    if (!user?.username || !accessToken) {
      setLmsIdentityLoading(false);
      setLmsIdentityError(accessToken ? 'Tài khoản NKS không có username hợp lệ.' : null);
      return;
    }

    let cancelled = false;
    setLmsIdentityLoading(true);
    setLmsIdentityError(null);
    fetch(`/api/lms/users?username=${encodeURIComponent(user.username)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => ({ response, result: await response.json() }))
      .then(({ response, result }) => {
        if (cancelled) return;
        if (!response.ok || !result.success || !result.data?.[0]) {
          setLmsUserId(null);
          setLmsIdentityError(result.error || 'Tài khoản chưa được cấp quyền sử dụng LMS.');
          return;
        }
        const lmsUser = result.data[0];
        setLmsUserId(lmsUser.id);
        setLmsRoleState(lmsUser.role);
        localStorage.setItem('seduai_lms_user_id', lmsUser.id);
        localStorage.setItem('seduai_lms_role', lmsUser.role);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Không thể đồng bộ tài khoản LMS:', error);
          setLmsUserId(null);
          setLmsIdentityError('Không thể kết nối dịch vụ xác thực LMS. Vui lòng thử đăng nhập lại.');
        }
      })
      .finally(() => {
        if (!cancelled) setLmsIdentityLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.username, accessToken, isLoading]);

  const login = (token: string, userInfo: UserInfo) => {
    const operationId = ++authOperationRef.current;
    const pendingLogout = logoutPromiseRef.current;
    setAccessToken(token);
    setUser(userInfo);
    setLmsRoleState('STUDENT');
    setLmsUserId(null);
    setLmsIdentityLoading(true);
    setLmsIdentityError(null);
    localStorage.setItem('seduai_access_token', token);
    localStorage.setItem('seduai_user_info', JSON.stringify(userInfo));
    localStorage.removeItem('seduai_lms_role');
    localStorage.removeItem('seduai_lms_user_id');

    const syncData: LocalSyncData = {
      name: userInfo.name || `${userInfo.lastname || ''} ${userInfo.firstname || ''}`.trim() || userInfo.username || 'Thành viên SeduAi',
      avatar: userInfo.avatar || defaultLocalSync.avatar,
      point: userInfo.point ?? 300,
    };
    setLocalSync(syncData);
    localStorage.setItem('seduai_local_sync', JSON.stringify(syncData));

    // A login started while an older logout request was still in flight must
    // win. Re-sync its cookie after that logout response has settled.
    if (pendingLogout) {
      void pendingLogout.then(async () => {
        if (authOperationRef.current !== operationId) return;
        try {
          await fetchUserInfo(token);
        } catch (error) {
          console.warn('Không thể đồng bộ lại cookie của phiên đăng nhập mới:', error);
        }
      });
    }
  };

  const logout = () => {
    if (logoutPromiseRef.current) return logoutPromiseRef.current;

    const tokenToRevoke = accessToken;
    const operationId = ++authOperationRef.current;
    const logoutTask = (async () => {
      try {
        const response = await fetch('/api/proxy/account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'logout',
            payload: tokenToRevoke ? { access_token: tokenToRevoke } : {},
          }),
          keepalive: true,
        });
        if (!response.ok) {
          console.warn('Máy chủ chưa xác nhận xóa phiên đăng nhập:', response.status);
          return false;
        }
        if (authOperationRef.current === operationId) {
          clearClientAuthState(true);
        }
        return true;
      } catch (error) {
        // Keep the visible session when the server could not delete its
        // HttpOnly cookie. The user can retry instead of entering a split state.
        console.warn('Không thể hoàn tất yêu cầu đăng xuất trên máy chủ:', error);
        return false;
      } finally {
        logoutPromiseRef.current = null;
      }
    })();
    logoutPromiseRef.current = logoutTask;
    return logoutTask;
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
        lmsIdentityLoading,
        lmsIdentityError,
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
