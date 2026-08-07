import React, { useEffect, useState } from 'react';
import { Briefcase, Users, Plus, Clock, Download, Mail } from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface Assessment {
  id: string;
  title: string;
  topic: string;
  duration_minutes: number;
  candidate_count: number;
  status: string;
}

export const RecruiterPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/platform/recruiter/assessments')
      .then(res => res.json())
      .then(data => setAssessments(data))
      .catch(() => {
        setAssessments([
          { id: 'eval-01', title: 'Senior DevOps Engineer Linux Practical Test', topic: 'Linux Admin + K8s', duration_minutes: 45, candidate_count: 12, status: 'Active' },
          { id: 'eval-02', title: 'RHCSA System Administrator Screening', topic: 'Users, Permissions, Storage', duration_minutes: 60, candidate_count: 8, status: 'Completed' }
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-purple-400" /> Recruiter & Hiring Portal
            </h1>
            <p className="text-sm text-slate-400">
              Conduct live, practical Linux and DevOps evaluations in isolated container environments.
            </p>
          </div>

          <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4" /> Create Practical Test
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {assessments.map(ass => (
            <div key={ass.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {ass.topic}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {ass.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{ass.title}</h3>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> {ass.duration_minutes} Mins
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> {ass.candidate_count} Candidates Evaluated
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 transition">
                  <Mail className="w-3.5 h-3.5" /> Invite Candidates
                </button>
                <button className="flex-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 transition">
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
