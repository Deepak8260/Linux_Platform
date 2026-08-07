import React, { useEffect, useState } from 'react';
import { XTerminal } from '../components/terminal/XTerminal';
import { AIMentorPanel } from '../components/AI/AIMentorPanel';
import { Navbar } from '../components/Navbar';
import { Terminal, RefreshCw } from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800);
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  const initSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'usr_student' })
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
    initSession();
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
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <Navbar remainingSeconds={remainingSeconds} onEndSession={handleEndSession} />

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden max-w-[1700px] w-full mx-auto">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Ubuntu 24.04 Playground Sandbox</h2>
              {isMock && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  Sandbox Simulation Mode
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={initSession}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 transition"
              >
                <RefreshCw className="w-3 h-3 text-emerald-400" /> New Session
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-sm gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                Spinning up isolated Ubuntu 24.04 container instance...
              </div>
            ) : sessionId ? (
              <XTerminal sessionId={sessionId} externalInput={externalCommand} />
            ) : (
              <div className="h-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-red-400 text-sm">
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
