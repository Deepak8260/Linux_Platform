import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

interface Lab {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  description: string;
}

export const LabsCatalogPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
          { id: 'lab-03-rhcsa-user-group', title: 'Linux Admin Exam Challenge: Admin User Setup', category: 'Linux Administration', difficulty: 'Hard', xp_reward: 250, description: 'Create sysadmin group, add user devops, configure passwordless sudo.' },
          { id: 'lab-04-docker-nginx', title: 'DevOps Lab: Deploy Nginx Web Container', category: 'Docker & DevOps', difficulty: 'Medium', xp_reward: 200, description: 'Launch web server container and inspect active processes.' }
        ]);
      });
  }, []);

  const categories = ['All', 'Linux Fundamentals', 'Users & Permissions', 'Linux Administration', 'Docker & DevOps'];

  const filteredLabs = selectedCategory === 'All'
    ? labs
    : labs.filter(l => l.category === selectedCategory);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-green-600" /> Learning Roadmap & Practice Labs
          </h1>
          <p className="text-sm text-slate-500">
            Interactive scenario-based labs with automated Docker container step validation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-sm'
                  : isDark ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map(lab => (
            <div key={lab.id} className={`border rounded-2xl p-6 flex flex-col justify-between transition shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-green-400'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                    {lab.category}
                  </span>
                  <span className="text-xs text-amber-500 font-bold">+{lab.xp_reward} XP</span>
                </div>

                <h3 className="text-lg font-bold mb-2">{lab.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{lab.description}</p>
              </div>

              <Link
                to={`/labs/${lab.id}`}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-white" /> Start Lab
              </Link>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};
