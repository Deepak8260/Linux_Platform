import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Cpu, Trophy, BookOpen, ShieldCheck, Flame, Sparkles, Briefcase } from 'lucide-react';

interface NavbarProps {
  remainingSeconds?: number | null;
  onEndSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ remainingSeconds, onEndSession }) => {
  const location = useLocation();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight hover:opacity-90 transition">
          <div className="bg-gradient-to-tr from-emerald-500 to-cyan-500 p-2 rounded-lg text-slate-950">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
            Linux<span className="text-emerald-400">Arena</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Ubuntu 24.04
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/dashboard') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" /> Dashboard
          </Link>

          <Link
            to="/labs"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/labs') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Practice Labs
          </Link>

          <Link
            to="/playground"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/playground') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" /> Playground
          </Link>

          <Link
            to="/challenges"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/challenges') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" /> RHCSA & Challenges
          </Link>

          <Link
            to="/leaderboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/leaderboard') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" /> Leaderboard
          </Link>

          <Link
            to="/recruiter"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              isActive('/recruiter') ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-400" /> Recruiter
          </Link>
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          
          {/* Active Live Session Timer */}
          {remainingSeconds !== undefined && remainingSeconds !== null && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400 font-mono">Session TTL:</span>
              <span className="font-mono font-bold text-emerald-400">{formatTime(remainingSeconds)}</span>
              {onEndSession && (
                <button
                  onClick={onEndSession}
                  className="ml-1 text-slate-400 hover:text-red-400 transition"
                  title="End Container Session"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* User XP & Streak */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Flame className="w-4 h-4" /> 7
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" /> 1,450 XP
            </span>
          </div>

          {/* User Profile Avatar */}
          <Link to="/dashboard" className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold">
              AS
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
};
