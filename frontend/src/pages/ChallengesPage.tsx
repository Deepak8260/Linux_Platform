import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Timer, Play } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const ChallengesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Exam Mode Enabled
            </div>
            <h1 className="text-3xl font-extrabold text-white">RHCSA & DevOps Timed Challenges</h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Simulate actual Red Hat Certified System Administrator (EX200) exams with strict timers and disabled AI assistance to test your true command-line speed and knowledge.
            </p>
          </div>

          <Link
            to="/labs/lab-03-rhcsa-user-group"
            className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 transition shadow-lg shadow-purple-500/20"
          >
            <Play className="w-4 h-4" /> Start RHCSA Exam Simulation
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                RHCSA Practical Test #1
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Timer className="w-4 h-4 text-amber-400" /> 45 Minutes
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Storage Management & LVM Setup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create a physical volume, volume group `app_vg`, and 500MB logical volume formatted as ext4 mounted at `/mnt/data`.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">+500 XP Reward</span>
              <Link to="/playground" className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold px-4 py-2 rounded-lg text-xs transition">
                Enter Exam Sandbox
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                DevOps Incident #4
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Timer className="w-4 h-4 text-cyan-400" /> 30 Minutes
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Fix Broken Nginx Reverse Proxy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Debug a failing Nginx configuration: locate syntax errors, fix upstream port binding, and reload systemd service.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">+400 XP Reward</span>
              <Link to="/playground" className="bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold px-4 py-2 rounded-lg text-xs transition">
                Enter Troubleshooting Sandbox
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
