import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck, Users, LayoutDashboard, FlaskConical, ShieldAlert,
  Trash2, ShieldOff, RefreshCw, Trophy, Briefcase, Award, FileText
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API_BASE = 'http://localhost:8000/api/v1';

interface AdminStats {
  total_users: number;
  admin_users: number;
  total_labs_completed_events: number;
  active_container_sessions: number;
  total_curated_labs: number;
  signups_last_7_days: number;
}

interface DemoLeaderboardUser { rank: number; name: string; avatar: string; xp: number; streak: number; badge: string; }
interface DemoAssessment { id: string; title: string; topic: string; duration_minutes: number; candidate_count: number; status: string; }
interface DemoCertificate { id: string; title: string; issueDate: string; serialNumber: string; skills: string[]; disclaimer: string; }
interface DemoBadge { name: string; desc: string; unlocked: boolean; inProgress: boolean; requirement?: string; icon: string; }

interface DemoContent {
  note: string;
  leaderboard: DemoLeaderboardUser[];
  recruiter_assessments: DemoAssessment[];
  certificates: DemoCertificate[];
  badges: DemoBadge[];
}

type TabKey = 'overview' | 'users' | 'demo';

export const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [tab, setTab] = useState<TabKey>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [demo, setDemo] = useState<DemoContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }),
    [token]
  );

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load admin stats');
      setStats(await res.json());
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load users');
      setUsers(await res.json());
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const loadDemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/demo-content`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load demo content');
      setDemo(await res.json());
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (tab === 'overview') loadOverview();
    if (tab === 'users') loadUsers();
    if (tab === 'demo') loadDemo();
  }, [tab, loadOverview, loadUsers, loadDemo]);

  const toggleAdmin = async (targetId: string, makeAdmin: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${targetId}/admin`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ is_admin: makeAdmin }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to update admin status');
      }
      await loadUsers();
    } catch (e: any) {
      alert(e.message || 'Failed to update admin status');
    }
  };

  const deleteUser = async (targetId: string) => {
    if (!confirm('Delete this user permanently? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${targetId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to delete user');
      }
      await loadUsers();
    } catch (e: any) {
      alert(e.message || 'Failed to delete user');
    }
  };

  const cardCls = `border rounded-2xl p-5 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;
  const tabBtn = (key: TabKey, label: string, Icon: any) => (
    <button
      onClick={() => setTab(key)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
        tab === key
          ? 'bg-green-600 text-white shadow-sm'
          : isDark ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" /> Admin Access
            </div>
            <h1 className="text-3xl font-extrabold mt-2">Admin Panel</h1>
            <p className="text-xs text-slate-500">Signed in as {user?.name} ({user?.email})</p>
          </div>
          <button
            onClick={() => (tab === 'overview' ? loadOverview() : tab === 'users' ? loadUsers() : loadDemo())}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabBtn('overview', 'Overview', LayoutDashboard)}
          {tabBtn('users', 'Users', Users)}
          {tabBtn('demo', 'Sample / Demo Data', FlaskConical)}
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 text-xs font-semibold rounded-xl p-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> {error}
          </div>
        )}

        {tab === 'overview' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Total Users', value: stats?.total_users, icon: Users, color: 'text-blue-600' },
              { label: 'Admins', value: stats?.admin_users, icon: ShieldCheck, color: 'text-emerald-600' },
              { label: 'Signups (7 days)', value: stats?.signups_last_7_days, icon: LayoutDashboard, color: 'text-purple-600' },
              { label: 'Completed Lab Steps', value: stats?.total_labs_completed_events, icon: FlaskConical, color: 'text-amber-600' },
              { label: 'Active Sandbox Sessions', value: stats?.active_container_sessions, icon: RefreshCw, color: 'text-cyan-600' },
              { label: 'Curated Labs', value: stats?.total_curated_labs, icon: FlaskConical, color: 'text-rose-600' },
            ].map((c) => (
              <div key={c.label} className={cardCls}>
                <c.icon className={`w-5 h-5 mb-2 ${c.color}`} />
                <div className="text-2xl font-extrabold">{c.value ?? (loading ? '…' : 0)}</div>
                <div className="text-xs text-slate-500 font-semibold">{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <div className={`border rounded-2xl overflow-hidden shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}>
                  <tr>
                    <th className="text-left font-bold px-4 py-3">Name</th>
                    <th className="text-left font-bold px-4 py-3">Email</th>
                    <th className="text-left font-bold px-4 py-3">Role</th>
                    <th className="text-left font-bold px-4 py-3">XP</th>
                    <th className="text-left font-bold px-4 py-3">Joined</th>
                    <th className="text-right font-bold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-semibold">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.is_admin ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Admin</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">User</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{u.xp}</td>
                      <td className="px-4 py-3 text-slate-500">{u.created_at}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleAdmin(u.id, !u.is_admin)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition ${
                              u.is_admin
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {u.is_admin ? <><ShieldOff className="w-3.5 h-3.5" /> Revoke</> : <><ShieldCheck className="w-3.5 h-3.5" /> Make Admin</>}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold bg-red-50 text-red-600 hover:bg-red-100 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && users.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No users yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'demo' && (
          <div className="space-y-8">
            <div className="border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold rounded-xl p-3">
              {demo?.note || 'Sample/demo content used only for previewing UI. Regular visitors never see this — it is not stored in, or read from, the real database.'}
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-extrabold flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-600" /> Sample Leaderboard</h2>
              <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                {(demo?.leaderboard || []).map((u) => (
                  <div key={u.rank} className="p-3 flex items-center justify-between text-xs border-b last:border-b-0 border-slate-200/70 dark:border-slate-800/70">
                    <span>#{u.rank} {u.name} <span className="text-slate-400">({u.badge})</span></span>
                    <span className="font-bold text-green-600">{u.xp} XP</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-extrabold flex items-center gap-2"><Briefcase className="w-4 h-4 text-purple-600" /> Sample Recruiter Assessments</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(demo?.recruiter_assessments || []).map((a) => (
                  <div key={a.id} className={cardCls}>
                    <div className="font-bold text-xs">{a.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{a.topic} • {a.duration_minutes} mins • {a.candidate_count} candidates • {a.status}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-extrabold flex items-center gap-2"><FileText className="w-4 h-4 text-green-600" /> Sample Certificates</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(demo?.certificates || []).map((c) => (
                  <div key={c.id} className={cardCls}>
                    <div className="font-bold text-xs">{c.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{c.issueDate} • {c.serialNumber}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-extrabold flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" /> Sample Badge Catalog</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(demo?.badges || []).map((b) => (
                  <div key={b.name} className={cardCls}>
                    <div className="font-bold text-xs">{b.icon} {b.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{b.desc}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
