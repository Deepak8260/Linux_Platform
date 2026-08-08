import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Users } from 'lucide-react';
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Real leaderboard data only - no placeholder/sample learners are shown
    // here anymore. If the request fails or there's nobody ranked yet, this
    // just shows an empty state instead of fabricated names.
    fetch('http://localhost:8000/api/v1/platform/leaderboard')
      .then(res => (res.ok ? res.json() : []))
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoaded(true));
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
          <p className="text-xs text-slate-500">Earn XP by completing practical labs, maintaining daily streaks, and solving Linux administration challenges.</p>
        </div>

        <div className={`border rounded-2xl overflow-hidden shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {loaded && users.length === 0 && (
            <div className="p-10 text-center space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-bold">No ranked learners yet</p>
              <p className="text-xs text-slate-500">Complete labs and earn XP to be the first to appear on the leaderboard.</p>
            </div>
          )}
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
