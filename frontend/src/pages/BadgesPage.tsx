import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

export const BadgesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const allBadges = [
    { name: 'Container Master', desc: 'Spin up 5 disposable Ubuntu container sessions', unlocked: true, icon: '🚀' },
    { name: 'Terminal Explorer', desc: 'Execute 50 terminal commands in live bash sandbox', unlocked: true, icon: '💻' },
    { name: 'Scripting Pro', desc: 'Complete 5 guided Linux coreutils labs', unlocked: true, icon: '📜' },
    { name: 'RHCSA Aspirant', desc: 'Pass the RHCSA Admin User Setup simulation', unlocked: true, icon: '🛡️' },
    { name: 'Kernel Master', desc: 'Maintain a 14-day continuous daily practice streak', unlocked: false, requirement: '14-Day Streak (Progress: 7/14)', icon: '🧠' },
    { name: 'DevOps Orchestrator', desc: 'Deploy 5 Nginx & Docker web container labs', unlocked: false, requirement: 'Complete 5 DevOps Labs (Progress: 1/5)', icon: '⚙️' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-600" /> Milestone Trophy Cabinet
          </div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-500" /> My Badges & Milestones
          </h1>
          <p className="text-sm text-slate-500">Track unlocked achievement badges and progress towards upcoming Linux & DevOps milestones.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges.map((badge, idx) => (
            <div key={idx} className={`border rounded-3xl p-6 flex flex-col justify-between transition shadow-sm ${
              badge.unlocked
                ? isDark ? 'bg-slate-900 border-emerald-500/40' : 'bg-white border-green-300 hover:border-green-500'
                : isDark ? 'bg-slate-950 border-slate-800 opacity-60' : 'bg-slate-100/70 border-slate-200 opacity-70'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{badge.icon}</div>
                  {badge.unlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" /> LOCKED
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold">{badge.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{badge.desc}</p>
              </div>

              {!badge.unlocked && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-amber-600 font-semibold">
                  🔒 {badge.requirement}
                </div>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};
