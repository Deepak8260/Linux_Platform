import React, { useEffect, useState, useRef } from 'react';
import { XTerminal } from '../components/terminal/XTerminal';
import { AIMentorPanel } from '../components/AI/AIMentorPanel';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Terminal, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PlaygroundPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800);
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  const didInitRef = useRef(false);

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

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      initSession();
    }
  }, []);

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
    initSession();
  };

  const handleRunSuggestedCommand = (cmd: string) => {
    setExternalCommand(cmd);
    setTimeout(() => setExternalCommand(null), 100);
  };

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      <Navbar remainingSeconds={remainingSeconds} onEndSession={handleEndSession} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden max-w-[1700px] w-full mx-auto">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-600" />
              <h2 className="text-sm font-bold">Ubuntu 24.04 Playground Sandbox</h2>
              {isMock && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                  Sandbox Simulation Mode
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={initSession}
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
                Spinning up isolated Ubuntu 24.04 container instance...
              </div>
            ) : sessionId ? (
              <XTerminal sessionId={sessionId} externalInput={externalCommand} />
            ) : (
              <div className="h-full bg-red-50 border border-red-200 rounded-xl flex items-center justify-center text-red-600 text-sm">
                Failed to launch container session.
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-96 h-full overflow-hidden">
          <AIMentorPanel onRunCommand={handleRunSuggestedCommand} />
        </div>
      </div>
    </div>
  );
};
