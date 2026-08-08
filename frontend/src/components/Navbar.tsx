import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Terminal, BookOpen, Sun, Moon, LogIn, LogOut, Cpu, Bell, Search, User,
  Settings, ChevronDown, X, ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { TerminateConfirmationModal } from './modals/TerminateConfirmationModal';

interface NavbarProps {
  remainingSeconds?: number | null;
  onEndSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ remainingSeconds, onEndSession }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, openAuthModal } = useAuth();
  const isDark = theme === 'dark';

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notificationsList = [
    { id: 1, title: 'Sandbox expires in 30 mins', time: 'Just now', type: 'warning' },
    { id: 2, title: 'New Linux Administration Lab Released: Admin User Setup', time: '2 hours ago', type: 'info' },
    { id: 3, title: 'Badge Earned: Terminal Pioneer', time: '1 day ago', type: 'success' },
    { id: 4, title: 'Linux Administration Certificate Ready', time: '3 days ago', type: 'success' },
  ];

  const searchItems = [
    { type: 'Lab', title: 'Linux File Navigation & Discovery', path: '/labs/lab-01-navigation' },
    { type: 'Lab', title: 'File Permissions & Ownership (Chmod/Chown)', path: '/labs/lab-02-permissions' },
    { type: 'Lab', title: 'Linux Admin Exam Challenge: Admin User Setup', path: '/labs/lab-03-rhcsa-user-group' },
    { type: 'Lab', title: 'DevOps Lab: Deploy Nginx Web Container', path: '/labs/lab-04-docker-nginx' },
    { type: 'Command', title: 'chmod 755 - Grant execute permissions', path: '/playground' },
    { type: 'Command', title: 'useradd -g sysadmin devops - Create user', path: '/playground' },
    { type: 'Playground', title: 'Interactive Ubuntu 24.04 Sandbox', path: '/playground' },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchItems;

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
        : 'bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm'
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

        {/* Clean Navigation Links */}
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

          {user ? (
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
          ) : (
            <button
              onClick={openAuthModal}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Terminal className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-green-600'}`} /> Playground
            </button>
          )}

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

        {/* Right Actions, Notifications, Search, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Global Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className={`p-2 rounded-xl transition border text-slate-500 hover:text-slate-800 ${
              isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
            }`}
            title="Global Search Labs & Commands"
          >
            <Search className="w-4 h-4" />
          </button>

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

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              className={`p-2 rounded-xl transition border relative ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl p-4 z-50 transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between border-b pb-2.5 mb-2 border-slate-200/80">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-green-600" /> Notifications
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold">4 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  {notificationsList.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl border transition ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="font-semibold text-[11px] leading-tight">{n.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
                  onClick={() => setShowTerminateModal(true)}
                  className="ml-1 text-slate-400 hover:text-red-500 transition font-extrabold px-1"
                  title="End Sandbox Session"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* User Profile & Avatar Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className={`flex items-center gap-2 border p-1 rounded-full transition ${
                  isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold px-1 hidden sm:inline">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:inline" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  {/* User Header */}
                  <div className="p-3 border-b border-slate-200/80 mb-1">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: {user.student_id || 'LA-10452'}</div>
                    <div className="text-[10px] text-green-600 font-bold mt-0.5">{user.level || 'Linux Administrator'}</div>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-0.5 text-xs font-semibold">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 hover:text-green-700 transition"
                    >
                      <User className="w-4 h-4 text-green-600" /> My Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 hover:text-green-700 transition"
                    >
                      <Settings className="w-4 h-4 text-slate-500" /> Settings
                    </Link>

                    {user.is_admin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-slate-200/80 my-1"></div>

                    <button
                      onClick={() => { logout(); setShowProfileMenu(false); navigate('/'); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
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

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className={`w-full max-w-xl border rounded-3xl p-6 shadow-2xl relative transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b pb-3 border-slate-200/80">
              <Search className="w-5 h-5 text-green-600" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labs, Linux commands, notes, or playgrounds..."
                className="w-full text-sm bg-transparent outline-none placeholder-slate-400"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => { navigate(item.path); setShowSearchModal(false); }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isDark ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-200 hover:border-green-400'
                    }`}
                  >
                    <div className="font-semibold">{item.title}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">{item.type}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-6">No matching items found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Terminate Session Confirmation Modal */}
      <TerminateConfirmationModal
        isOpen={showTerminateModal}
        onClose={() => setShowTerminateModal(false)}
        onConfirmTerminate={() => {
          setIsTerminating(true);
          const cooldownUntil = Date.now() + 5 * 60 * 1000;
          localStorage.setItem('linuxarena_cooldown_until', cooldownUntil.toString());

          if (onEndSession) {
            onEndSession();
          }

          setTimeout(() => {
            setIsTerminating(false);
            setShowTerminateModal(false);
            navigate('/dashboard');
          }, 500);
        }}
        isTerminating={isTerminating}
      />
    </header>
  );
};
