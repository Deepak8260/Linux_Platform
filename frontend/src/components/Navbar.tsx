import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Cpu, Trophy, BookOpen, ShieldCheck, Flame, Sparkles, Briefcase, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  remainingSeconds?: number | null;
  onEndSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ remainingSeconds, onEndSession }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 px-4 py-3 transition-colors ${
      isDark
        ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white'
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight hover:opacity-90 transition">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950' : 'bg-green-600 text-white shadow-sm'}`}>
            <Terminal className="w-5 h-5" />
          </div>
          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Linux<span className={isDark ? 'text-emerald-400' : 'text-green-600'}>Arena</span>
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            Ubuntu 24.04
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/dashboard')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" /> Dashboard
          </Link>

          <Link
            to="/labs"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/labs')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Practice Labs
          </Link>

          <Link
            to="/playground"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/playground')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Terminal className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} /> Playground
          </Link>

          <Link
            to="/challenges"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive('/challenges')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" /> RHCSA
          </Link>

          <Link
            to="/leaderboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/leaderboard')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-500" /> Leaderboard
          </Link>

          <Link
            to="/recruiter"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/recruiter')
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-purple-50 text-purple-700'
                : isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-500" /> Recruiter
          </Link>
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">

          {/* Theme Switcher Toggle (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDark ? 'Switch to Light Theme (Default)' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          {/* Active Live Session Timer */}
          {remainingSeconds !== undefined && remainingSeconds !== null && (
            <div className={`flex items-center gap-2 border px-3 py-1 rounded-full text-xs ${
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

          {/* User XP & Streak */}
          <div className={`hidden sm:flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Flame className="w-4 h-4" /> 7
            </span>
            <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
            <span className="flex items-center gap-1 text-green-600 font-bold">
              <Sparkles className="w-4 h-4" /> 1,450 XP
            </span>
          </div>

          {/* User Profile Avatar */}
          <Link to="/dashboard" className="w-8 h-8 rounded-full bg-green-600 p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
              AS
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
};
