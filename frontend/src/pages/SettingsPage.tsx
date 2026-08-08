import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Settings, Lock, Sun, Moon, Bell, Key, Laptop, AlertTriangle, Trash2 } from 'lucide-react';

export const SettingsContent: React.FC = () => {
  const { updatePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Danger Zone: account deletion confirmation guard
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      // TODO: wire this up to the real account-deletion backend endpoint once available.
      // e.g. await api.delete('/api/v1/account');
      await new Promise((resolve) => setTimeout(resolve, 600));
      alert('Account deletion requested. Our team will process this shortly.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

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
    <div className="space-y-8">

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

        {/* Danger Zone */}
        <div className={`border rounded-3xl p-6 space-y-4 shadow-sm border-red-500/30 ${
          isDark ? 'bg-red-950/10' : 'bg-red-50/50'
        }`}>
          <h2 className="text-base font-bold flex items-center gap-2 border-b pb-3 border-red-500/20 text-red-500">
            <AlertTriangle className="w-4 h-4" /> Danger Zone
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-red-500">Delete Account</div>
              <p className="text-slate-500 mt-0.5">Permanently delete your account and all associated progress. This cannot be undone.</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl relative transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 mb-3 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-extrabold">Delete Account?</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              This will permanently delete your account, XP, badges, certificates, and lab history. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <SettingsContent />
      </main>
    </div>
  );
};
