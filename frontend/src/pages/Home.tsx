
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      {/* Background Penguin Image (semi-transparent, left-aligned) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-full flex items-center justify-start opacity-10 pointer-events-none pl-10">
        <img
          src="/images/penguin.png" // User should upload penguin.png here
          alt="Tux the Penguin"
          className="h-5/6 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-5 md:px-12">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl px-8 py-4 shadow-lg shadow-slate-200/50 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            LinuxArena
          </div>
          <div className="hidden md:flex items-center gap-7">
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Features</a>
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Roadmap</a>
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Challenges</a>
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">AI Mentor</a>
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Interview</a>
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">Community</a>
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium text-sm">About</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-800 font-medium text-sm hover:bg-slate-50 transition-all">
              Login
            </button>
            <button className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-sm">
              Start Learning Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 px-6 py-14 md:py-20 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Master Linux & DevOps
            <br />
            through real <span className="text-green-600">Ubuntu labs.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice in real Ubuntu containers, get AI guidance, prepare for Linux certification,
            <br />
            and master DevOps with hands-on labs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="px-8 py-3.5 rounded-lg bg-green-600 text-white font-semibold text-base hover:bg-green-700 transition-all shadow-sm flex items-center gap-2">
              Start Learning Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="px-8 py-3.5 rounded-lg bg-white text-slate-800 font-semibold text-base hover:bg-slate-50 transition-all border border-slate-200 shadow-sm flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 17V7l8 5-8 5z" />
              </svg>
              Watch Platform Demo
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-7 text-slate-600 mb-16">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-600">Real Ubuntu Containers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-600">AI DevOps Mentor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-600">Hands-on Labs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-600">Job Ready Skills</span>
            </div>
          </div>

          {/* Animated Logos Section */}
          <div className="flex items-center justify-center gap-12 md:gap-20 mt-12">
            {/* Linux Logo - Floating Animation */}
            <div className="animate-float">
              <img
                src="/images/Linux_logo.jpg"
                alt="Linux Logo"
                className="h-16 md:h-20 object-contain"
              />
            </div>

            {/* Ubuntu Logo - Bounce Animation */}
            <div className="animate-bounce">
              <img
                src="/images/ubuntu.png"
                alt="Ubuntu Logo"
                className="h-16 md:h-20 object-contain"
              />
            </div>

            {/* AWS Logo - Pulse Animation */}
            <div className="animate-pulse">
              <img
                src="/images/Amazon-Web-Services-AWS-Logo.png"
                alt="AWS Logo"
                className="h-12 md:h-16 object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Custom Animations */}
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

export default Home;
