import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  auth_provider: string;
  xp: number;
  streak: number;
  level: string;
  badges: string[];
  completed_labs: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loginManual: (email: string, pass: string) => Promise<void>;
  signupManual: (name: string, email: string, pass: string) => Promise<void>;
  loginOAuth: (provider: 'google' | 'github', name: string, email: string, avatarUrl?: string) => Promise<void>;
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
