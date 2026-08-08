import React, { useEffect, useState } from 'react';
import { Briefcase, Users, Plus, Clock, Download, Mail, ClipboardList } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

interface Assessment {
  id: string;
  title: string;
  topic: string;
  duration_minutes: number;
  candidate_count: number;
  status: string;
}

export const RecruiterPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // No fabricated sample assessments anymore - this always reflects real
    // data (currently empty until the recruiter feature has real records).
    fetch('http://localhost:8000/api/v1/platform/recruiter/assessments')
      .then(res => (res.ok ? res.json() : []))
      .then(data => setAssessments(Array.isArray(data) ? data : []))
      .catch(() => setAssessments([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-purple-600" /> Recruiter & Hiring Portal
            </h1>
            <p className="text-sm text-slate-500">
              Conduct live, practical Linux and DevOps evaluations in isolated container environments.
            </p>
          </div>

          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm">
            <Plus className="w-4 h-4" /> Create Practical Test
          </button>
        </div>

        {loaded && assessments.length === 0 && (
          <div className={`border rounded-2xl p-10 text-center space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-bold">No assessments created yet</p>
            <p className="text-xs text-slate-500">Click "Create Practical Test" to set up your first candidate evaluation.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {assessments.map(ass => (
            <div key={ass.id} className={`border rounded-2xl p-6 space-y-4 shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                  {ass.topic}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">
                  {ass.status}
                </span>
              </div>

              <h3 className="text-lg font-bold">{ass.title}</h3>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" /> {ass.duration_minutes} Mins
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-600" /> {ass.candidate_count} Candidates Evaluated
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition">
                  <Mail className="w-3.5 h-3.5" /> Invite Candidates
                </button>
                <button className="flex-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition">
                  <Download className="w-3.5 h-3.5" /> Download Reports
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};
