import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { ImageCropperModal } from '../components/modals/ImageCropperModal';
import { User, Phone, Sparkles, Edit2, CheckCircle2, Save, Camera, Image, Upload, X } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Kumar Deepak');
  const [username, setUsername] = useState(user?.username || 'deepak_dev');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showCropperModal, setShowCropperModal] = useState(false);

  // Pre-curated high quality avatars for LinuxArena students
  const curatedAvatars = [
    { name: 'Tux Penguin', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' },
    { name: 'Terminal Hacker', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80' },
    { name: 'DevOps Architect', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Ubuntu Admin', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'AWS Specialist', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

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

  const handleCropComplete = async (base64CroppedImage: string) => {
    setAvatarUrl(base64CroppedImage);
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile({ avatar_url: base64CroppedImage });
      setSuccessMsg('Cropped profile photo saved to database successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save profile picture');
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
        <div className={`border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            
            {/* Interactive Avatar with Camera Upload Overlay */}
            <div className="relative group cursor-pointer" onClick={() => setShowCropperModal(true)}>
              {avatarUrl || user?.avatar_url ? (
                <img src={avatarUrl || user?.avatar_url} alt={user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-green-600/30 shadow-lg group-hover:opacity-80 transition" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg group-hover:opacity-80 transition">
                  {(user?.name || 'K').charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="absolute inset-0 bg-slate-950/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-[2px]">
                <Camera className="w-6 h-6 mb-1 text-green-400" />
                <span className="text-[10px] font-bold">Crop & Upload</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">{user?.name || 'Kumar Deepak'}</h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-400 border border-green-200 dark:border-emerald-800">
                  {user?.level || 'RHCSA Aspirant'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">Student ID: {user?.student_id || 'LA-10452'}</p>
              <p className="text-xs text-slate-500 mt-0.5">@{user?.username || 'deepak_dev'} • {user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCropperModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition border border-slate-700 shadow-sm"
            >
              <Upload className="w-4 h-4 text-green-400" /> Upload Device Image
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition shadow-md ${
                isEditing
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
              }`}
            >
              <Edit2 className="w-4 h-4" /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> {successMsg}
          </div>
        )}

        {/* Form / Details Container */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Personal & Academic Details */}
          <div className={`md:col-span-2 border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
              <User className="w-5 h-5 text-green-600" /> Personal & Academic Info
            </h2>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5 text-xs">
                
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border outline-none text-xs transition ${
                        isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block font-semibold text-slate-400 mb-1.5">Username</label>
                  <div className="relative">
                    <span className="text-slate-400 absolute left-3.5 top-3 font-bold">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full pl-9 pr-4 py-3 rounded-2xl border outline-none text-xs transition ${
                        isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-semibold text-slate-400 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border outline-none text-xs transition ${
                        isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Profile Photo Options */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-semibold text-slate-400">Profile Photo</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCropperModal(true)}
                        className="text-emerald-500 hover:underline text-[11px] font-bold flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload & Crop Device Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAvatarPicker(true)}
                        className="text-slate-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                      >
                        <Image className="w-3.5 h-3.5" /> Pick Preset Avatar
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://... or base64"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border outline-none text-xs transition ${
                        isDark
                          ? 'bg-slate-800/80 border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition shadow-lg shadow-green-600/20"
                  >
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>

              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400 font-semibold mb-1">Full Name</div>
                  <div className="font-extrabold text-sm">{user?.name || 'Kumar Deepak'}</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400 font-semibold mb-1">Username</div>
                  <div className="font-extrabold text-sm text-green-600">@{user?.username || 'deepak_dev'}</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400 font-semibold mb-1">Email Address</div>
                  <div className="font-extrabold text-sm">{user?.email}</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400 font-semibold mb-1">Phone Number</div>
                  <div className="font-extrabold text-sm">{user?.phone || '+91 9876543210'}</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400 font-semibold mb-1">Enrolled Track</div>
                  <div className="font-extrabold text-sm text-green-600">{user?.enrolled_course || 'RHCSA Certification Track'}</div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-slate-400 font-semibold mb-1">Batch / Class</div>
                  <div className="font-extrabold text-sm">{user?.batch || 'RHCSA Batch 2026'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Overview Sidebar */}
          <div className={`border rounded-3xl p-6 space-y-4 shadow-sm ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-green-600" /> Progress Stats
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-green-500/10 border border-green-500/20">
                <span className="font-bold">Total XP</span>
                <span className="font-extrabold text-green-500 text-sm">{user?.xp || 1450} XP</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-bold">Daily Streak</span>
                <span className="font-extrabold text-amber-500 text-sm">{user?.streak || 7} Days 🔥</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="font-bold">Completed Labs</span>
                <span className="font-extrabold text-cyan-500 text-sm">{user?.completed_labs || 8} Labs</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <span className="font-bold">Earned Badges</span>
                <span className="font-extrabold text-purple-500 text-sm">{user?.badges?.length || 3} Badges</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Device Image Cropper Modal */}
      <ImageCropperModal
        isOpen={showCropperModal}
        onClose={() => setShowCropperModal(false)}
        onCropComplete={handleCropComplete}
        initialImageSrc={avatarUrl || user?.avatar_url}
      />

      {/* Preset Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl relative transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowAvatarPicker(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold mb-1">Choose Preset Profile Avatar</h3>
            <p className="text-xs text-slate-400 mb-6">Select a pre-curated avatar or upload custom photo from device.</p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
              {curatedAvatars.map((av, idx) => (
                <div
                  key={idx}
                  onClick={() => { setAvatarUrl(av.url); setShowAvatarPicker(false); }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <img
                    src={av.url}
                    alt={av.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 group-hover:border-emerald-500 transition group-hover:scale-105"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold text-center leading-tight">{av.name}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() => { setShowAvatarPicker(false); setShowCropperModal(true); }}
                className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload & Crop Device Image Instead
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
