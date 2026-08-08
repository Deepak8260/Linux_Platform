import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { FileText, Download, Share2, Award, Calendar } from 'lucide-react';

export const CertificatesContent: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Certificates aren't backed by a real "issued certificates" table yet, so
  // there is nothing genuine to show a regular learner. Only admins get a
  // labeled sample preview (via the Admin Panel's "Sample / Demo Data" tab);
  // everyone else sees an honest empty state below.
  const certificatesList: {
    id: string; title: string; issueDate: string; serialNumber: string; skills: string[]; disclaimer: string;
  }[] = [];

  const handleDownloadPDF = (title: string) => {
    alert(`Downloading Official PDF Certificate for: ${title}`);
  };

  const handleShareLinkedIn = (title: string) => {
    const text = encodeURIComponent(`I'm proud to share that I completed ${title} on LinuxArena!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
          <Award className="w-4 h-4 text-green-600" /> Verified Achievements
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <FileText className="w-7 h-7 text-green-600" /> My Certificates
        </h1>
        <p className="text-sm text-slate-500">Official completion certificates earned through hands-on practical lab mastery.</p>
      </div>

      {certificatesList.length === 0 && (
        <div className={`border rounded-2xl p-10 text-center space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <Award className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-bold">No certificates earned yet</p>
          <p className="text-xs text-slate-500">Complete a lab track's full curriculum to unlock its completion certificate here.</p>
          {user?.is_admin && (
            <p className="text-[11px] text-emerald-600 font-semibold pt-2">
              You're an admin — view a labeled sample certificate preview in the Admin Panel's "Sample / Demo Data" tab.
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {certificatesList.map(cert => (
          <div key={cert.id} className={`border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm transition flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-green-400'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-green-100 text-green-700 border border-green-200">
                  VERIFIED CERTIFICATE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{cert.serialNumber}</span>
              </div>

              <h3 className="text-xl font-extrabold leading-snug">{cert.title}</h3>

              <div className="text-xs text-slate-500 space-y-1">
                <div>Issued to: <strong className="text-slate-900 dark:text-white">{user?.name || 'Deepak'}</strong> (ID: {user?.student_id || 'LA-10452'})</div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-green-600" /> Date: {cert.issueDate}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {cert.skills.map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    ✓ {sk}
                  </span>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 italic leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                {cert.disclaimer}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80">
              <button
                onClick={() => handleDownloadPDF(cert.title)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>

              <button
                onClick={() => handleShareLinkedIn(cert.title)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Share2 className="w-4 h-4" /> Share Achievement
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export const CertificatesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <CertificatesContent />
      </main>
    </div>
  );
};
