import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Timer, Play } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export const ChallengesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className={`border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ${
          isDark ? 'bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border-purple-500/30' : 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200'
        }`}>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-600" /> Exam Mode Enabled
            </div>
            <h1 className="text-3xl font-extrabold">RHCSA & DevOps Timed Challenges</h1>
            <p className="text-sm text-slate-600 max-w-xl">
              Simulate actual Red Hat Certified System Administrator (EX200) exams with strict timers and disabled AI assistance to test your true command-line speed and knowledge.
            </p>
          </div>

          <Link
            to="/labs/lab-03-rhcsa-user-group"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 transition shadow-md shadow-purple-600/20"
          >
            <Play className="w-4 h-4" /> Start RHCSA Exam Simulation
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`border rounded-2xl p-6 space-y-4 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                RHCSA Practical Test #1
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Timer className="w-4 h-4 text-amber-500" /> 45 Minutes
              </span>
            </div>
            <h3 className="text-xl font-bold">Storage Management & LVM Setup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create a physical volume, volume group `app_vg`, and 500MB logical volume formatted as ext4 mounted at `/mnt/data`.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-green-600">+500 XP Reward</span>
              <Link to="/playground" className="bg-slate-900 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition">
                Enter Exam Sandbox
              </Link>
            </div>
          </div>

          <div className={`border rounded-2xl p-6 space-y-4 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                DevOps Incident #4
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Timer className="w-4 h-4 text-cyan-600" /> 30 Minutes
              </span>
            </div>
            <h3 className="text-xl font-bold">Fix Broken Nginx Reverse Proxy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Debug a failing Nginx configuration: locate syntax errors, fix upstream port binding, and reload systemd service.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-green-600">+400 XP Reward</span>
              <Link to="/playground" className="bg-slate-900 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition">
                Enter Troubleshooting Sandbox
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
