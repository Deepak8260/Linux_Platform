import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, BookOpen, Sun, Moon, LogIn, LogOut, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  remainingSeconds?: number | null;
  onEndSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ remainingSeconds, onEndSession }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, openAuthModal } = useAuth();
  const isDark = theme === 'dark';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 px-4 py-3 transition-colors ${
      isDark
        ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white'
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight hover:opacity-90 transition">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950' : 'bg-green-600 text-white shadow-sm'}`}>
            <Terminal className="w-5 h-5" />
          </div>
          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Linux<span className={isDark ? 'text-emerald-400' : 'text-green-600'}>Arena</span>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            Ubuntu 24.04
          </span>
        </Link>

        {/* Clean Essential Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/labs"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              isActive('/labs')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Practice Labs
          </Link>

          <Link
            to="/playground"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              isActive('/playground')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Terminal className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} /> Playground
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isActive('/dashboard')
                  ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                  : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </nav>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3">

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Active Container Session Timer */}
          {remainingSeconds !== undefined && remainingSeconds !== null && (
            <div className={`hidden sm:flex items-center gap-2 border px-3 py-1 rounded-full text-xs ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span className={isDark ? 'text-slate-400 font-mono' : 'text-slate-600 font-mono'}>Session:</span>
              <span className="font-mono font-bold text-green-600">{formatTime(remainingSeconds)}</span>
              {onEndSession && (
                <button
                  onClick={onEndSession}
                  className="ml-1 text-slate-400 hover:text-red-500 transition"
                  title="End Container Session"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-2 border p-1 rounded-full bg-green-50/50 border-green-200">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold pr-2 hidden sm:inline text-slate-800">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <LogIn className="w-4 h-4" /> Log In / Sign Up
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
