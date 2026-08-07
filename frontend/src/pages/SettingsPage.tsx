import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Settings, Lock, Sun, Moon, Bell, Key, Laptop } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Notification Toggles
  const [notifs, setNotifs] = useState({
    emailNotif: true,
    badgeEarned: true,
    sandboxExpiry: true,
    newLabs: false,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    setPwdLoading(true);
    try {
      await updatePassword(currentPwd, newPwd);
      setPwdMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPwd('');
      setNewPwd('');
    } catch (err: any) {
      setPwdMsg({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Settings className="w-7 h-7 text-green-600" /> Platform Settings
          </h1>
          <p className="text-sm text-slate-500">Manage account security, theme preferences, and notifications.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Change Password Card */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2 border-b pb-3 border-slate-200/80">
              <Lock className="w-4 h-4 text-green-600" /> Account Security & Password
            </h2>

            {pwdMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                pwdMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {pwdMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-green-600"
                />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Key className="w-4 h-4" /> {pwdLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Appearance & Theme Selector */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2 border-b pb-3 border-slate-200/80">
              <Sun className="w-4 h-4 text-amber-500" /> Appearance & Theme
            </h2>

            <p className="text-xs text-slate-500">Choose your preferred workspace visual theme.</p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => { if (isDark) toggleTheme(); }}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                  !isDark ? 'border-green-600 bg-green-50/50 text-green-700 font-bold' : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <Sun className="w-6 h-6 text-amber-500" />
                <span>Light Theme (Default)</span>
              </button>

              <button
                onClick={() => { if (!isDark) toggleTheme(); }}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                  isDark ? 'border-emerald-500 bg-slate-900 text-emerald-400 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <Moon className="w-6 h-6 text-purple-400" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          {/* Notifications Preferences */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2 border-b pb-3 border-slate-200/80">
              <Bell className="w-4 h-4 text-green-600" /> Notification Preferences
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
                <span className="font-semibold">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={notifs.emailNotif}
                  onChange={(e) => setNotifs({ ...notifs, emailNotif: e.target.checked })}
                  className="w-4 h-4 accent-green-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
                <span className="font-semibold">Badge Earned Alert</span>
                <input
                  type="checkbox"
                  checked={notifs.badgeEarned}
                  onChange={(e) => setNotifs({ ...notifs, badgeEarned: e.target.checked })}
                  className="w-4 h-4 accent-green-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
                <span className="font-semibold">Sandbox Expiry Warning (30 mins)</span>
                <input
                  type="checkbox"
                  checked={notifs.sandboxExpiry}
                  onChange={(e) => setNotifs({ ...notifs, sandboxExpiry: e.target.checked })}
                  className="w-4 h-4 accent-green-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Active Sessions */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2 border-b pb-3 border-slate-200/80">
              <Laptop className="w-4 h-4 text-green-600" /> Active Sessions
            </h2>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-green-600" /> Current Windows Device
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Active now • Chrome Browser</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-700 font-bold">This Device</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
