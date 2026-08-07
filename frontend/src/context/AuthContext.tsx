import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  student_id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  auth_provider: string;
  enrolled_course: string;
  batch: string;
  xp: number;
  streak: number;
  level: string;
  badges: string[];
  completed_labs: number;
  created_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loginManual: (email: string, pass: string) => Promise<void>;
  signupManual: (name: string, email: string, pass: string) => Promise<void>;
  loginOAuth: (provider: 'google' | 'github', name: string, email: string, avatarUrl?: string) => Promise<void>;
  updateProfile: (data: { name?: string; username?: string; phone?: string; avatar_url?: string; enrolled_course?: string; batch?: string }) => Promise<void>;
  updatePassword: (current_password: string, new_password: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loginManual: async () => {},
  signupManual: async () => {},
  loginOAuth: async () => {},
  updateProfile: async () => {},
  updatePassword: async () => {},
  logout: () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('linuxarena_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('linuxarena_token');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const saveAuthSession = (tokenStr: string, profile: UserProfile) => {
    setToken(tokenStr);
    setUser(profile);
    localStorage.setItem('linuxarena_token', tokenStr);
    localStorage.setItem('linuxarena_user', JSON.stringify(profile));
  };

  // Sync user profile on mount if token exists
  useEffect(() => {
    if (token) {
      fetch('http://localhost:8000/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setUser(data);
            localStorage.setItem('linuxarena_user', JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const loginManual = async (email: string, pass: string) => {
    const res = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    saveAuthSession(data.access_token, data.user);
    setIsAuthModalOpen(false);
  };

  const signupManual = async (name: string, email: string, pass: string) => {
    const res = await fetch('http://localhost:8000/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Signup failed');
    }
    const data = await res.json();
    saveAuthSession(data.access_token, data.user);
    setIsAuthModalOpen(false);
  };

  const loginOAuth = async (provider: 'google' | 'github', name: string, email: string, avatarUrl?: string) => {
    const endpoint = `http://localhost:8000/api/v1/auth/${provider}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        name,
        email,
        avatar_url: avatarUrl || (provider === 'google' ? 'https://lh3.googleusercontent.com/a/default-user' : 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'),
        provider_id: `${provider}_${Math.random().toString(36).substring(2, 8)}`
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || `${provider} Auth failed`);
    }
    const data = await res.json();
    saveAuthSession(data.access_token, data.user);
    setIsAuthModalOpen(false);
  };

  const updateProfile = async (profileData: { name?: string; username?: string; phone?: string; avatar_url?: string; enrolled_course?: string; batch?: string }) => {
    // Always update local state immediately so user sees their cropped photo without delay
    setUser(prev => {
      const fallbackUser: UserProfile = prev || {
        id: 'usr_demo',
        student_id: 'LA-10452',
        name: 'Kumar Deepak',
        username: 'deepak_dev',
        email: 'kd8260@gmail.com',
        auth_provider: 'manual',
        enrolled_course: 'RHCSA Certification Track',
        batch: 'RHCSA Batch 2026',
        xp: 1450,
        streak: 7,
        level: 'RHCSA Aspirant',
        badges: ['Container Master', 'Terminal Explorer', 'Scripting Pro'],
        completed_labs: 8
      };
      const updated = { ...fallbackUser, ...profileData };
      localStorage.setItem('linuxarena_user', JSON.stringify(updated));
      return updated;
    });

    // Try syncing to MySQL database
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : 'Bearer mock'
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const dbUser = await res.json();
        setUser(dbUser);
        localStorage.setItem('linuxarena_user', JSON.stringify(dbUser));
      }
    } catch (e) {
      console.warn("Backend server offline, profile photo saved locally.");
    }
  };

  const updatePassword = async (current_password: string, new_password: string) => {
    if (!token) return;
    const res = await fetch('http://localhost:8000/api/v1/auth/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ current_password, new_password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to update password');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('linuxarena_token');
    localStorage.removeItem('linuxarena_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loginManual,
      signupManual,
      loginOAuth,
      updateProfile,
      updatePassword,
      logout,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
