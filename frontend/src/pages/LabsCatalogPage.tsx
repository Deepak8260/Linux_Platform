import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface Lab {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  description: string;
}

export const LabsCatalogPage: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/labs')
      .then(res => res.json())
      .then(data => setLabs(data))
      .catch(() => {
        setLabs([
          { id: 'lab-01-navigation', title: 'Linux File Navigation & Discovery', category: 'Linux Fundamentals', difficulty: 'Easy', xp_reward: 100, description: 'Master foundational directory navigation and coreutils.' },
          { id: 'lab-02-permissions', title: 'File Permissions & Ownership (Chmod/Chown)', category: 'Users & Permissions', difficulty: 'Medium', xp_reward: 150, description: 'Set read, write, execution bits and owner groups.' },
          { id: 'lab-03-rhcsa-user-group', title: 'RHCSA Exam Challenge: Admin User Setup', category: 'RHCSA', difficulty: 'Hard', xp_reward: 250, description: 'Create sysadmin group, add user devops, configure passwordless sudo.' },
          { id: 'lab-04-docker-nginx', title: 'DevOps Lab: Deploy Nginx Web Container', category: 'Docker & DevOps', difficulty: 'Medium', xp_reward: 200, description: 'Launch web server container and inspect active processes.' }
        ]);
      });
  }, []);

  const categories = ['All', 'Linux Fundamentals', 'Users & Permissions', 'RHCSA', 'Docker & DevOps'];

  const filteredLabs = selectedCategory === 'All'
    ? labs
    : labs.filter(l => l.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-400" /> Learning Roadmap & Practice Labs
          </h1>
          <p className="text-sm text-slate-400">
            Interactive scenario-based labs with automated Docker container step validation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map(lab => (
            <div key={lab.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {lab.category}
                  </span>
                  <span className="text-xs text-amber-400 font-bold">+{lab.xp_reward} XP</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{lab.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{lab.description}</p>
              </div>

              <Link
                to={`/labs/${lab.id}`}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Start Practice Environment
              </Link>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};
