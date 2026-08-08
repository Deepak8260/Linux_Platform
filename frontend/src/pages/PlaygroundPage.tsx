import React, { useEffect, useState } from 'react';
import { XTerminal } from '../components/terminal/XTerminal';
import { AIMentorPanel } from '../components/AI/AIMentorPanel';
import { Navbar } from '../components/Navbar';
import { SpinConfirmationModal } from '../components/modals/SpinConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { Terminal, RefreshCw, Play, MessageSquare, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PlaygroundPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800);
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [showSpinModal, setShowSpinModal] = useState<boolean>(true);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [mentorCollapsed, setMentorCollapsed] = useState<boolean>(true);

  const initSession = async () => {
    setLoading(true);
    try {
      const userId = user?.id || 'usr_student';
      const res = await fetch('http://localhost:8000/api/v1/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      setSessionId(data.session_id);
      setRemainingSeconds(data.remaining_seconds);
      setIsMock(data.is_mock);
    } catch (e) {
      setSessionId(`sess_${Math.random().toString(36).substring(2, 10)}`);
      setRemainingSeconds(1800);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSpin = async () => {
    setIsLaunching(true);
    await initSession();
    setIsLaunching(false);
    setShowSpinModal(false);
  };

  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleEndSession = async () => {
    if (sessionId) {
      try {
        await fetch(`http://localhost:8000/api/v1/sessions/${sessionId}/terminate`, { method: 'POST' });
      } catch (e) {}
    }
    setSessionId(null);
  };

  const handleRunSuggestedCommand = (cmd: string) => {
    setExternalCommand(cmd);
    setTimeout(() => setExternalCommand(null), 100);
  };

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      <Navbar remainingSeconds={sessionId ? remainingSeconds : null} onEndSession={handleEndSession} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden max-w-[1700px] w-full mx-auto">
        <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${mentorCollapsed ? 'flex-1' : 'flex-[3]'}`}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-600" />
              <h2 className="text-sm font-bold">Ubuntu Sandbox</h2>
              {isMock && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                  Sandbox Simulation Mode
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShowSpinModal(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl border font-semibold transition ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <RefreshCw className="w-3 h-3 text-green-600" /> New Session
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className={`h-full border rounded-xl flex items-center justify-center text-sm gap-2 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
              }`}>
                <RefreshCw className="w-5 h-5 animate-spin text-green-600" />
                Launching your Ubuntu Sandbox...
              </div>
            ) : sessionId ? (
              <XTerminal sessionId={sessionId} externalInput={externalCommand} />
            ) : (
              <div className={`h-full border rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-4 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="p-4 rounded-full bg-green-500/10 text-green-500">
                  <Terminal className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold mb-1">No Active Ubuntu Sandbox</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Click below to review the sandbox details and confirm launching your Ubuntu Sandbox.
                  </p>
                </div>
                <button
                  onClick={() => setShowSpinModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition shadow-lg shadow-green-600/20"
                >
                  <Play className="w-4 h-4 fill-white" /> Launch Ubuntu Sandbox (30m)
                </button>
              </div>
            )}
          </div>
        </div>

        {mentorCollapsed ? (
          <button
            onClick={() => setMentorCollapsed(false)}
            className={`w-full md:w-14 h-12 md:h-full shrink-0 rounded-2xl border flex md:flex-col items-center justify-center gap-2 font-semibold text-xs transition-all duration-300 ease-in-out ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
            }`}
            title="Expand AI DevOps Mentor"
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span className="md:[writing-mode:vertical-rl] md:rotate-180">AI DevOps Mentor</span>
            <ChevronUp className="w-3.5 h-3.5 md:rotate-90" />
          </button>
        ) : (
          <div className="w-full md:flex-1 h-full overflow-hidden transition-all duration-300 ease-in-out">
            <AIMentorPanel onRunCommand={handleRunSuggestedCommand} onCollapse={() => setMentorCollapsed(true)} />
          </div>
        )}
      </div>

      {/* Confirmation Modal prior to spinning container */}
      <SpinConfirmationModal
        isOpen={showSpinModal}
        onClose={() => setShowSpinModal(false)}
        onConfirm={handleConfirmSpin}
        isLaunching={isLaunching}
      />
    </div>
  );
};
