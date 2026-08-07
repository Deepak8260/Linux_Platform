import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { User, Sparkles, Edit2, CheckCircle2, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Deepak');
  const [username, setUsername] = useState(user?.username || 'deepak_dev');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile({ name, username, phone, avatar_url: avatarUrl });
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* Header Profile Banner */}
        <div className={`border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow-md" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {(user?.name || 'D').charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold">{user?.name || 'Deepak'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                  {user?.level || 'RHCSA Aspirant'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">Student ID: {user?.student_id || 'LA-10452'}</p>
              <p className="text-xs text-slate-400 mt-0.5">@{user?.username || 'deepak_dev'} • {user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Edit2 className="w-4 h-4" /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" /> {successMsg}
          </div>
        )}

        {/* Form / Details Container */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Personal & Academic Details */}
          <div className={`md:col-span-2 border rounded-3xl p-6 space-y-6 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3 border-slate-200/80">
              <User className="w-5 h-5 text-green-600" /> Personal & Academic Info
            </h2>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-green-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Full Name</div>
                  <div className="font-bold text-sm">{user?.name || 'Deepak'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Username</div>
                  <div className="font-bold text-sm">@{user?.username || 'deepak_dev'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Email Address</div>
                  <div className="font-bold text-sm">{user?.email}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Phone Number</div>
                  <div className="font-bold text-sm">{user?.phone || '+91 9876543210'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Enrolled Course</div>
                  <div className="font-bold text-sm text-green-600">{user?.enrolled_course || 'RHCSA Certification Track'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Batch / Class</div>
                  <div className="font-bold text-sm">{user?.batch || 'RHCSA Batch 2026'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Overview Sidebar */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3 border-slate-200/80">
              <Sparkles className="w-5 h-5 text-green-600" /> Progress Stats
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-emerald-950/40 border border-green-200">
                <span className="font-bold">Total XP</span>
                <span className="font-extrabold text-green-600 text-sm">{user?.xp || 1450} XP</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                <span className="font-bold">Daily Streak</span>
                <span className="font-extrabold text-amber-600 text-sm">{user?.streak || 7} Days 🔥</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200">
                <span className="font-bold">Completed Labs</span>
                <span className="font-extrabold text-cyan-600 text-sm">{user?.completed_labs || 8} Labs</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200">
                <span className="font-bold">Earned Badges</span>
                <span className="font-extrabold text-purple-600 text-sm">{user?.badges?.length || 3} Badges</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
