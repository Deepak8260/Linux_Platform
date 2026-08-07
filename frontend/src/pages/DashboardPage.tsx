import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Flame, Sparkles, BookOpen, Award, ArrowRight, Play } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [user] = useState({
    name: 'Alex Student',
    level: 'RHCSA Aspirant',
    xp: 1450,
    streak: 7,
    badges: ['Container Master', 'Terminal Explorer', 'Scripting Pro'],
    completedLabs: 8
  });

  const [activeSession, setActiveSession] = useState<{ sessionId: string; remainingSeconds: number } | null>(null);

  const startNewSession = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'usr_student' })
      });
      const data = await res.json();
      setActiveSession({ sessionId: data.session_id, remainingSeconds: data.remaining_seconds });
    } catch (e) {
      setActiveSession({ sessionId: 'sess_demo_101', remainingSeconds: 1800 });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar remainingSeconds={activeSession?.remainingSeconds} />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* User Hero Banner */}
        <div className={`border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg ${
          isDark
            ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border-slate-800'
            : 'bg-gradient-to-r from-white via-green-50/50 to-emerald-50 border-slate-200'
        }`}>
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {user.level}
              </span>
              <span className="text-xs text-slate-400">Student ID: #usr_8492</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold">
              Welcome back, <span className="text-green-600">{user.name}</span> 👋
            </h1>

            <p className={`text-xs sm:text-sm max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              You are on a <span className="text-amber-500 font-bold">{user.streak}-day streak</span>! Keep practicing Linux administration & DevOps labs to unlock your next certification badge.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
            <Link
              to="/playground"
              onClick={() => { if (!activeSession) startNewSession(); }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-green-600/20 transition"
            >
              <Terminal className="w-4 h-4" /> Spin Up Live Ubuntu Sandbox
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`border p-5 rounded-2xl shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Total XP</span>
              <Sparkles className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-extrabold">{user.xp.toLocaleString()}</div>
            <div className="text-[11px] text-green-600 font-semibold mt-1">+150 XP this week</div>
          </div>

          <div className={`border p-5 rounded-2xl shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Daily Streak</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-500">{user.streak} Days</div>
            <div className="text-[11px] text-slate-400 mt-1">Best: 12 days</div>
          </div>

          <div className={`border p-5 rounded-2xl shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Completed Labs</span>
              <BookOpen className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-extrabold">{user.completedLabs} / 20</div>
            <div className="text-[11px] text-cyan-600 font-semibold mt-1">40% Curriculum Done</div>
          </div>

          <div className={`border p-5 rounded-2xl shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Badges Earned</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-600">{user.badges.length} Badges</div>
            <div className="text-[11px] text-slate-400 mt-1">Next: Kernel Master</div>
          </div>
        </div>

        {/* Recommended Learning Path */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" /> Recommended Practice Modules
              </h2>
              <p className="text-xs text-slate-400">Step-by-step practical environments with automated step verification</p>
            </div>
            <Link to="/labs" className="text-xs text-green-600 hover:underline font-semibold flex items-center gap-1">
              View All Labs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            
            <div className={`border rounded-2xl p-5 shadow-sm transition flex flex-col justify-between ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-green-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                    Linux Fundamentals
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">+100 XP</span>
                </div>
                <h3 className="text-base font-bold mb-2">Linux File Navigation & Discovery</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Learn to navigate directory trees, inspect file permissions, and manipulate files using bash coreutils.
                </p>
              </div>
              <Link
                to="/labs/lab-01-navigation"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5" /> Start Guided Lab
              </Link>
            </div>

            <div className={`border rounded-2xl p-5 shadow-sm transition flex flex-col justify-between ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50' : 'bg-white border-slate-200 hover:border-amber-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    RHCSA Specialization
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">+250 XP</span>
                </div>
                <h3 className="text-base font-bold mb-2">Admin User & Sudo Security Setup</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Simulate RHCSA exam questions: create sysadmin group, add user devops, and configure passwordless sudo.
                </p>
              </div>
              <Link
                to="/labs/lab-03-rhcsa-user-group"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5" /> Launch RHCSA Challenge
              </Link>
            </div>

            <div className={`border rounded-2xl p-5 shadow-sm transition flex flex-col justify-between ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-cyan-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                    Docker & DevOps
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">+200 XP</span>
                </div>
                <h3 className="text-base font-bold mb-2">Deploy Nginx Web Server Service</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Install Nginx web server, configure virtual hosts, and verify active service ports.
                </p>
              </div>
              <Link
                to="/labs/lab-04-docker-nginx"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5" /> Start DevOps Lab
              </Link>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};
