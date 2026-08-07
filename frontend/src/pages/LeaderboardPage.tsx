import React, { useEffect, useState } from 'react';
import { Trophy, Flame } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badge: string;
}

export const LeaderboardPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/platform/leaderboard')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => {
        setUsers([
          { rank: 1, name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', xp: 4850, streak: 24, badge: 'DevOps Legend' },
          { rank: 2, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', xp: 4120, streak: 19, badge: 'RHCSA Specialist' },
          { rank: 3, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', xp: 3890, streak: 14, badge: 'Kernel Master' },
          { rank: 4, name: 'Alex Student (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', xp: 1450, streak: 7, badge: 'Terminal Explorer' },
        ]);
      });
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 text-xs font-bold">
            <Trophy className="w-4 h-4 text-yellow-600" /> Global Rankings
          </div>
          <h1 className="text-3xl font-extrabold">LinuxArena Global Leaderboard</h1>
          <p className="text-xs text-slate-500">Earn XP by completing practical labs, maintaining daily streaks, and solving RHCSA challenges.</p>
        </div>

        <div className={`border rounded-2xl overflow-hidden shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="divide-y divide-slate-200/80">
            {users.map(u => (
              <div
                key={u.rank}
                className={`p-4 sm:p-5 flex items-center justify-between transition ${
                  u.name.includes('(You)')
                    ? isDark ? 'bg-emerald-950/40 border-l-4 border-emerald-400' : 'bg-green-50/80 border-l-4 border-green-600'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-extrabold text-lg text-slate-400">
                    {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : `#${u.rank}`}
                  </div>
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      {u.name}
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {u.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Flame className="w-3.5 h-3.5" /> {u.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-green-600">{u.xp.toLocaleString()} XP</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
