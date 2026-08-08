import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors font-sans selection:bg-green-500 selection:text-white ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-900'
    }`}>
      <Navbar />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-emerald-900/20' : 'bg-green-200/40'}`} />
        <div className={`absolute top-1/3 right-0 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-purple-900/20' : 'bg-purple-200/40'}`} />
        <div className={`absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/30'}`} />
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-full flex items-center justify-start opacity-10 pointer-events-none pl-10 z-0">
        <img
          src="/images/penguin.png"
          alt="Tux the Penguin"
          className="h-5/6 w-auto object-contain"
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
        />
      </div>

      <section className="relative z-10 pt-16 pb-16 px-4 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-green-100/80 border-green-200 text-green-700 shadow-sm'
          }`}>
            <Sparkles className="w-4 h-4 text-green-600" /> Next-Gen Linux & DevOps Assessment Platform
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Master Linux & DevOps <br />
            through real <span className="text-green-600">Ubuntu labs.</span>
          </h1>

          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Practice in real 30-minute disposable Ubuntu containers, get AI guidance, prepare for RHCSA exams, and master DevOps with hands-on scenario labs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/playground"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-base transition-all shadow-md shadow-green-600/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Terminal className="w-5 h-5" /> Start Learning Free
            </Link>

            <Link
              to="/labs"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base transition-all border shadow-sm flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              Explore Practice Modules <ArrowRight className="w-4 h-4 text-green-600" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-slate-600 mb-16">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Real Ubuntu Containers</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>AI DevOps Mentor</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Automated Lab Checks</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Hands-on Linux & DevOps Skills</span>
            </div>
          </div>

        </div>
      </section>

      <section className={`py-16 px-4 border-t transition-colors ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/50 border-slate-200/80'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              How It Works
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Five simple steps from choosing a lab to earning your credentials.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Choose a Lab', desc: 'Pick a scenario from beginner navigation to RHCSA-level challenges.' },
              { step: '2', title: 'Launch Ubuntu Sandbox', desc: 'Spin up a real, disposable Ubuntu 24.04 sandbox in seconds.' },
              { step: '3', title: 'Complete the Task', desc: 'Work directly in the terminal with AI DevOps Mentor guidance.' },
              { step: '4', title: 'Automated Verification', desc: 'Your sandbox is evaluated automatically for correctness.' },
              { step: '5', title: 'Earn Progress & Credentials', desc: 'Collect XP, badges, and certificates as you complete labs.' },
            ].map((item, idx, arr) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {item.step}
                </div>
                <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                {idx < arr.length - 1 && (
                  <ArrowRight className={`hidden lg:block absolute top-6 -right-4 w-5 h-5 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 px-4 border-t transition-colors ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Complete Learning & Hiring Platform
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Everything you need from beginner navigation to enterprise recruitment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border transition shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>30-Min Disposable Ubuntu</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Spawns real Ubuntu 24.04 Docker containers per user. Automatically pruned after 30 minutes for zero server clutter.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>AI DevOps Mentor</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Translates plain English to Bash commands, debugs errors in real-time, and blocks dangerous system operations.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Automated Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evaluates your terminal execution inside the container to verify file states, permissions, and active services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className={`py-8 px-4 text-center text-xs border-t ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        <p>© 2026 LinuxArena Platform. Built with React, FastAPI, Docker SDK & Gemini AI.</p>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce {
          animation: bounce 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
