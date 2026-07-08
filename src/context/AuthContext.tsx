'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserInfo, fetchUserInfo } from '@/services/api';

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
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
  updateUser: (data: Partial<UserInfo>) => void;
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
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [localSync, setLocalSync] = useState<LocalSyncData>(defaultLocalSync);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state từ localStorage khi mount
  useEffect(() => {
    const storedToken = localStorage.getItem('seduai_access_token');
    const storedUser = localStorage.getItem('seduai_user_info');
    const storedSync = localStorage.getItem('seduai_local_sync');

    if (storedSync) {
      try {
        setLocalSync(JSON.parse(storedSync));
      } catch (e) {
        console.error('Lỗi parse local sync:', e);
      }
    }

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessToken(storedToken);
        setUser(parsedUser);

        // Nâng cấp dữ liệu ngầm từ API (Chỉ cập nhật nếu đúng tài khoản, không ghi đè thành demo_student)
        fetchUserInfo(storedToken).then((freshUser) => {
          if (freshUser && (!freshUser.username || freshUser.username === parsedUser.username || parsedUser.username === 'demo_student')) {
            setUser(freshUser);
            localStorage.setItem('seduai_user_info', JSON.stringify(freshUser));
            const syncData: LocalSyncData = {
              name: freshUser.name || `${freshUser.lastname || ''} ${freshUser.firstname || ''}`.trim() || freshUser.username || parsedUser.name || 'Thành viên SeduAi',
              avatar: freshUser.avatar || parsedUser.avatar || defaultLocalSync.avatar,
              point: freshUser.point ?? parsedUser.point ?? 300,
            };
            setLocalSync(syncData);
            localStorage.setItem('seduai_local_sync', JSON.stringify(syncData));
          }
        });
      } catch (e) {
        console.error('Lỗi parse user info:', e);
      }
    }
    setIsLoading(false);
  }, []);

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
    setAccessToken(null);
    setUser(null);
    setLocalSync(defaultLocalSync);
    localStorage.removeItem('seduai_access_token');
    localStorage.removeItem('seduai_user_info');
    localStorage.removeItem('seduai_local_sync');
    localStorage.removeItem('seduai_remembered_user');
  };

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
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
