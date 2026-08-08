import React from 'react';
import {
  Cpu, Award, FileText, Settings, User, Flame, TrendingUp,
  BookOpen, ChevronsLeft, ChevronsRight
} from 'lucide-react';

export type DashboardTab = 'overview' | 'badges' | 'certificates' | 'profile' | 'settings';

interface DashboardSidebarProps {
  isDark: boolean;
  collapsed: boolean;
  onToggle: () => void;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  stats: {
    xp: number;
    streak: number;
    completedLabs: number;
    totalLabs: number;
  };
}

const NAV_ITEMS: { tab: DashboardTab; label: string; icon: typeof Cpu }[] = [
  { tab: 'overview', label: 'Dashboard', icon: Cpu },
  { tab: 'badges', label: 'My Badges', icon: Award },
  { tab: 'certificates', label: 'Certificates', icon: FileText },
  { tab: 'profile', label: 'My Profile', icon: User },
  { tab: 'settings', label: 'Settings', icon: Settings },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isDark, collapsed, onToggle, activeTab, onTabChange, stats }) => {
  const isActive = (tab: DashboardTab) => activeTab === tab;
  const progressPct = Math.round((stats.completedLabs / stats.totalLabs) * 100);

  return (
    <aside
      className={`shrink-0 h-full border rounded-3xl flex flex-col shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? 'w-16' : 'w-64'
      } ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
    >
      {/* Toggle */}
      <div className={`flex items-center px-3 py-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <span className="text-xs font-bold uppercase tracking-wider text-slate-400">My Space</span>}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg transition ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Links */}
      <nav className="flex flex-col gap-1 p-2">
        {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition text-left w-full ${
              collapsed ? 'justify-center' : ''
            } ${
              isActive(tab)
                ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-green-50 text-green-700'
                : isDark ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </button>
        ))}
      </nav>

      <div className={`mt-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} p-3 space-y-2`}>
        {!collapsed && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">Stats Snapshot</div>
        )}

        <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? 'justify-center' : ''} ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-green-600 leading-tight">{stats.xp} XP</div>
              <div className="text-[10px] text-slate-400">Total earned</div>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? 'justify-center' : ''} ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-amber-600 leading-tight">{stats.streak} Days</div>
              <div className="text-[10px] text-slate-400">Current streak</div>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? 'justify-center' : ''} ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <BookOpen className="w-4 h-4 text-cyan-600 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-cyan-600 leading-tight">{stats.completedLabs}/{stats.totalLabs} Labs</div>
              <div className="text-[10px] text-slate-400">{progressPct}% complete</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
