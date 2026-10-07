import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  quickSwitchRole: (role: UserRole) => void;
}

const DEFAULT_STUDENT: User = {
  id: 'usr-student-01',
  name: 'Alex Sterling',
  email: 'alex.student@ielts.practice',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  targetBandScore: 7.5,
  examDate: '2026-11-15',
  createdAt: '2026-09-01T10:00:00Z',
};

const DEFAULT_ADMIN: User = {
  id: 'usr-admin-01',
  name: 'Dr. Evelyn Ward',
  email: 'evelyn.admin@ielts.practice',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  targetBandScore: 9.0,
  createdAt: '2026-08-01T10:00:00Z',
};

const AUTH_STORAGE_KEY = 'ielts_auth_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return DEFAULT_STUDENT;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    if (email.toLowerCase().includes('admin')) {
      setUser(DEFAULT_ADMIN);
    } else {
      setUser({
        ...DEFAULT_STUDENT,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' '),
      });
    }
    return true;
  };

  const register = async (name: string, email: string, role: UserRole = 'student'): Promise<boolean> => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role,
      targetBandScore: 7.0,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const quickSwitchRole = (role: UserRole) => {
    if (role === 'admin') {
      setUser(DEFAULT_ADMIN);
    } else {
      setUser(DEFAULT_STUDENT);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        quickSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
