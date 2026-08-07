import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Terminal, BookOpen, Flame, Award, Cpu, ArrowRight, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const recentActivity = [
    { type: 'lab', title: 'Completed: Linux Coreutils & Navigation', time: '2 hours ago', icon: '✅' },
    { type: 'badge', title: 'Earned: Terminal Pioneer Badge', time: 'Yesterday', icon: '🏆' },
    { type: 'sandbox', title: 'Created: Disposable Ubuntu 24.04 Container', time: 'Today', icon: '🚀' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* Personalized Welcome Banner */}
        <div className={`border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden ${
          isDark ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border-slate-800' : 'bg-gradient-to-r from-emerald-50 via-white to-green-50 border-slate-200'
        }`}>
          <div className="space-y-3 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                {user?.level || 'RHCSA Aspirant'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Student ID: {user?.student_id || 'LA-10452'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-green-600">{user?.name || 'Deepak'}</span> 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              You are on a <strong className="text-amber-600">{user?.streak || 7}-day streak!</strong> Keep practicing Linux administration & DevOps labs to unlock your next certification badge.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto">
            <button
              onClick={() => navigate('/playground')}
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20"
            >
              <Terminal className="w-4 h-4" /> Spin Up Live Ubuntu Sandbox
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              Daily Streak <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600">{user?.streak || 7} <span className="text-xs font-normal text-slate-400">Days</span></div>
            <div className="text-[10px] text-slate-400 font-medium">Personal Best: 12 days</div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-1 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Completed Labs <BookOpen className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-600">{user?.completed_labs || 8} <span className="text-xs font-normal text-slate-400">/ 20</span></div>
            <div className="text-[10px] text-slate-400 font-medium">40% Curriculum Complete</div>
          </div>

          <div className={`border rounded-3xl p-5 space-y-1 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Badges Earned <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-600">{user?.badges?.length || 3} <span className="text-xs font-normal text-slate-400">Badges</span></div>
            <div className="text-[10px] text-purple-600 font-semibold">Next: Kernel Master</div>
          </div>
        </div>

        {/* Highlight Section: Continue Where Left Off & Active Sandbox Status */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Continue Where Left Off */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                  CONTINUE WHERE LEFT OFF
                </span>
                <span className="text-xs font-bold text-green-600">65% Complete</span>
              </div>

              <h3 className="text-lg font-extrabold">Linux File Permissions & Ownership</h3>
              <p className="text-xs text-slate-500">Practice `chmod 755`, `chown`, and `umask` security configurations in live bash terminal.</p>
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

          {/* Active Sandbox Status */}
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
                <Cpu className="w-5 h-5 text-green-600" /> Active Disposable Container
              </h3>
              <p className="text-xs text-slate-500">Your isolated Linux sandbox instance is ready with 30-minute auto-expiry safety TTL.</p>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Remaining: <strong className="text-green-600 font-bold">28m 45s</strong></span>
              <button
                onClick={() => navigate('/playground')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5 text-green-400" /> Open Terminal →
              </button>
            </div>
          </div>

        </div>

        {/* Recommended Practice Labs & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Practice Modules */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" /> Practice Modules
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

          {/* Recent Activity Feed */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-lg font-bold border-b pb-3 border-slate-200/80">Recent Activity</h2>
            <div className="space-y-3 text-xs">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-base">{act.icon}</span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{act.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
