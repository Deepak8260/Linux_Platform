import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { SpinConfirmationModal } from '../components/modals/SpinConfirmationModal';
import { Terminal, BookOpen, Flame, Award, Cpu, ArrowRight, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [showSpinModal, setShowSpinModal] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  // TODO: wire this up to the real sandbox/session status API once available.
  const [hasActiveSandbox] = useState(false);

  const completedLabs = user?.completed_labs || 8;
  const totalLabs = 20;
  const learningProgressPct = Math.round((completedLabs / totalLabs) * 100);

  const handleConfirmSpin = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setShowSpinModal(false);
      navigate('/playground');
    }, 800);
  };

  const recentActivity = [
    { type: 'lab', title: 'Completed: Linux Coreutils & Navigation', time: '2 hours ago', icon: '✅' },
    { type: 'badge', title: 'Earned: Terminal Pioneer Badge', time: 'Yesterday', icon: '🏆' },
    { type: 'sandbox', title: 'Created: Ubuntu Sandbox', time: 'Today', icon: '🚀' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* Personalized Welcome Banner (compact) */}
        <div className={`border rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm relative overflow-hidden ${
          isDark ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border-slate-800' : 'bg-gradient-to-r from-emerald-50 via-white to-green-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3 text-center sm:text-left z-10">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Welcome back, <span className="text-green-600">{user?.name || 'Deepak'}</span> 👋
            </h1>
            <span className="hidden sm:inline px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
              {user?.level || 'RHCSA Aspirant'}
            </span>
            <span className="hidden md:inline text-[10px] text-slate-400 font-mono">Student ID: {user?.student_id || 'LA-10452'}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
            <button
              onClick={() => setShowSpinModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-green-600/20"
            >
              <Terminal className="w-4 h-4" /> Launch Ubuntu Sandbox
            </button>
          </div>
        </div>

        {/* Stats Grid: Labs Completed, Current Streak, Total XP, Learning Progress */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`border rounded-3xl p-5 space-y-1 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Labs Completed <BookOpen className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-600">{completedLabs} <span className="text-xs font-normal text-slate-400">/ {totalLabs}</span></div>
            <div className="text-[10px] text-slate-400 font-medium">{learningProgressPct}% of curriculum</div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-1 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Current Streak <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600">{user?.streak || 7} <span className="text-xs font-normal text-slate-400">Days</span></div>
            <div className="text-[10px] text-slate-400 font-medium">Personal Best: 12 days</div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-1 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Total XP <Sparkles className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-extrabold text-green-600">{user?.xp || 1450} <span className="text-xs font-normal text-slate-400">XP</span></div>
            <div className="text-[10px] text-green-600 font-semibold">+150 XP earned this week</div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-1 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Learning Progress <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-600">{learningProgressPct}<span className="text-xs font-normal text-slate-400">%</span></div>
            <div className="text-[10px] text-purple-600 font-semibold">Curriculum complete</div>
          </div>
        </div>

        {/* Highlight Section: Continue Where Left Off (primary) & Active Sandbox Status */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Continue Where Left Off - largest, most prominent card */}
          <div className={`md:col-span-2 border rounded-3xl p-8 space-y-5 shadow-md flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                  CONTINUE WHERE LEFT OFF
                </span>
                <span className="text-xs font-bold text-green-600">65% Complete</span>
              </div>

              <h3 className="text-2xl font-extrabold">Linux File Permissions & Ownership</h3>
              <p className="text-sm text-slate-500">Practice `chmod 755`, `chown`, and `umask` security configurations in live bash terminal.</p>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <div className="w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-green-600 h-full w-[65%] rounded-full"></div>
              </div>
              <button
                onClick={() => navigate('/labs/lab-02-permissions')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                Resume Lab <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Sandbox Status - conditional, compact when no active sandbox */}
          {hasActiveSandbox ? (
            <div className={`border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> SANDBOX READY
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Ubuntu 24.04 LTS</span>
                </div>

                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-green-600" /> Active Ubuntu Sandbox
                </h3>
                <p className="text-xs text-slate-500">Your isolated Ubuntu Sandbox is ready with 30-minute auto-expiry safety TTL.</p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Remaining: <strong className="text-green-600 font-bold">28m 45s</strong></span>
                <button
                  onClick={() => setShowSpinModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <Terminal className="w-3.5 h-3.5 text-green-400" /> Open Terminal →
                </button>
              </div>
            </div>
          ) : (
            <div className={`border rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Cpu className="w-6 h-6 text-slate-400" />
              <p className="text-xs font-semibold text-slate-400">No active sandbox</p>
              <button
                onClick={() => navigate('/playground')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5" /> Launch Playground
              </button>
            </div>
          )}

        </div>

        {/* Recommended Next & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recommended Next */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" /> Recommended Next
              </h2>
              <Link to="/labs" className="text-xs font-bold text-green-600 hover:underline">View All Labs →</Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className={`border rounded-3xl p-5 space-y-3 transition shadow-sm ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/40' : 'bg-white border-slate-200 hover:border-green-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">Linux Fundamentals</span>
                  <span className="text-xs font-bold text-green-600">+100 XP</span>
                </div>
                <h3 className="font-bold text-sm">Linux File Navigation & Discovery</h3>
                <p className="text-xs text-slate-500 line-clamp-2">Master pwd, ls, cd, find, and grep commands in terminal.</p>
                <button onClick={() => navigate('/labs/lab-01-navigation')} className="w-full text-center py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-green-600 hover:text-white transition">
                  Start Lab →
                </button>
              </div>

              <div className={`border rounded-3xl p-5 space-y-3 transition shadow-sm ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/40' : 'bg-white border-slate-200 hover:border-green-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">RHCSA Specialization</span>
                  <span className="text-xs font-bold text-green-600">+250 XP</span>
                </div>
                <h3 className="font-bold text-sm">Admin User & Sudo Security Setup</h3>
                <p className="text-xs text-slate-500 line-clamp-2">Create sysadmin users, grant visudo privileges, and lock root logins.</p>
                <button onClick={() => navigate('/labs/lab-03-rhcsa-user-group')} className="w-full text-center py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-green-600 hover:text-white transition">
                  Start Lab →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity - compact timeline */}
          <div className={`border rounded-3xl p-6 space-y-1 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-lg font-bold border-b pb-3 mb-2 border-slate-200/80">Recent Activity</h2>
            <div className="divide-y divide-slate-200/70 dark:divide-slate-800 text-xs">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2.5">
                  <span className="text-sm">{act.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{act.title}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 whitespace-nowrap">{act.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Spin Up Confirmation Modal */}
      <SpinConfirmationModal
        isOpen={showSpinModal}
        onClose={() => setShowSpinModal(false)}
        onConfirm={handleConfirmSpin}
        isLaunching={isLaunching}
      />
    </div>
  );
};
