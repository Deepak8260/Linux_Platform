import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Sparkles, ArrowRight, Server, Users } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <section className="relative pt-20 pb-16 px-4 overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Linux & DevOps Assessment Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Master Real Linux & DevOps Skills on <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Live Ubuntu Containers
            </span>
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Instant 30-minute disposable Ubuntu 24.04 instances. Guided RHCSA labs, automated validation, LeetCode-style sysadmin challenges, and AI DevOps mentoring.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link
              to="/playground"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl text-base flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
            >
              <Terminal className="w-5 h-5" /> Launch Free Ubuntu Session
            </Link>
            <Link
              to="/labs"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl text-base flex items-center gap-2 transition"
            >
              Explore Learning Modules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <Server className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white">Disposable Containers</div>
              <div className="text-xs text-slate-400">30-min session TTL with Docker isolation</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
              <div className="text-sm font-bold text-white">Gemini AI Mentor</div>
              <div className="text-xs text-slate-400">English-to-Bash & safe execution filter</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-sm font-bold text-white">RHCSA Exam Prep</div>
              <div className="text-xs text-slate-400">Practical graded administration labs</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <Users className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-sm font-bold text-white">Recruiter Portal</div>
              <div className="text-xs text-slate-400">Create & grade candidate assessments</div>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Built for Serious Practitioners & Learners</h2>
            <p className="text-slate-400 mt-2 text-sm">Beyond simple command execution: complete scenario-based training.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Step Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The platform executes live checks inside your container to verify system states, file permissions, and active services.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">DevOps & Cloud Scenarios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice Nginx reverse proxies, Docker container orchestration, Systemd services, Cron jobs, and Bash automation scripts.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Recruiter Assessment Suite</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Companies can build customized, timed practical Linux tests and automatically evaluate candidate skill reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 LinuxArena Platform. Built with React, FastAPI, Docker SDK & Gemini AI.</p>
      </footer>
    </div>
  );
};
