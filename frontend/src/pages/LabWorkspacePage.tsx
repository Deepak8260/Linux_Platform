import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { XTerminal } from '../components/terminal/XTerminal';
import { AIMentorPanel } from '../components/AI/AIMentorPanel';
import { Navbar } from '../components/Navbar';
import { CheckCircle2, ArrowLeft, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LabStep {
  step_number: number;
  title: string;
  instructions: string;
  hint?: string;
}

interface Lab {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  description: string;
  steps: LabStep[];
}

export const LabWorkspacePage: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800);
  const [externalCommand, setExternalCommand] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/labs/${labId || 'lab-01-navigation'}`);
        const data = await res.json();
        setLab(data);
      } catch (e) {
        setLab({
          id: 'lab-01-navigation',
          title: 'Linux File Navigation & Discovery',
          category: 'Linux Fundamentals',
          difficulty: 'Easy',
          xp_reward: 100,
          description: 'Master foundational coreutils commands to inspect working directories and file contents.',
          steps: [
            {
              step_number: 1,
              title: 'Identify Working Directory',
              instructions: 'Print your current working directory using `pwd`.',
              hint: 'Run `pwd` in the terminal.'
            },
            {
              step_number: 2,
              title: 'Create Workspace Directory',
              instructions: 'Create a directory named `/home/student/workspace` using `mkdir`.',
              hint: 'Run `mkdir -p /home/student/workspace`'
            },
            {
              step_number: 3,
              title: 'Create Notes File',
              instructions: "Create a file at `/home/student/workspace/notes.txt` containing 'LinuxArena'.",
              hint: "Run `echo 'LinuxArena' > /home/student/workspace/notes.txt`"
            }
          ]
        });
      }
    };

    const createSession = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/sessions/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 'usr_student' })
        });
        const data = await res.json();
        setSessionId(data.session_id);
        setRemainingSeconds(data.remaining_seconds);
      } catch (e) {
        setSessionId(`sess_${Math.random().toString(36).substring(2, 10)}`);
        setRemainingSeconds(1800);
      }
    };

    fetchLab();
    createSession();
  }, [labId]);

  const handleVerifyStep = async () => {
    if (!lab || !sessionId) return;
    setVerifying(true);
    setVerificationResult(null);

    const step = lab.steps[currentStepIdx];
    try {
      const res = await fetch('http://localhost:8000/api/v1/labs/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          lab_id: lab.id,
          step_number: step.step_number
        })
      });
      const data = await res.json();
      setVerificationResult(data);

      if (data.success) {
        if (!completedSteps.includes(step.step_number)) {
          setCompletedSteps(prev => [...prev, step.step_number]);
        }
        if (currentStepIdx === lab.steps.length - 1) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (e) {
      setVerificationResult({ success: false, message: 'Server verification check failed.' });
    } finally {
      setVerifying(false);
    }
  };

  const currentStep = lab?.steps[currentStepIdx];

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <Navbar remainingSeconds={remainingSeconds} />

      <div className="flex-1 flex flex-col lg:flex-row p-3 gap-3 overflow-hidden max-w-[1800px] w-full mx-auto">
        <div className="w-full lg:w-96 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800">
            <Link to="/labs" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Labs
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {lab?.category}
              </span>
              <span className="text-xs text-amber-400 font-bold">+{lab?.xp_reward} XP</span>
            </div>
            <h1 className="text-base font-bold text-white mt-1">{lab?.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{lab?.description}</p>
          </div>

          <div className="flex border-b border-slate-800 bg-slate-900/80 px-2 py-1 gap-1">
            {lab?.steps.map((st, idx) => (
              <button
                key={st.step_number}
                onClick={() => { setCurrentStepIdx(idx); setVerificationResult(null); setShowHint(false); }}
                className={`flex-1 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  currentStepIdx === idx
                    ? 'bg-emerald-600 text-white'
                    : completedSteps.includes(st.step_number)
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {completedSteps.includes(st.step_number) ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span>Step {st.step_number}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {currentStep && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                    {currentStep.step_number}
                  </span>
                  {currentStep.title}
                </h3>

                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-300 leading-relaxed">
                  {currentStep.instructions}
                </div>

                {currentStep.hint && (
                  <div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                    >
                      <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showHint && (
                      <div className="mt-2 bg-purple-950/40 border border-purple-500/30 p-2.5 rounded-lg text-purple-200 text-[11px]">
                        💡 {currentStep.hint}
                      </div>
                    )}
                  </div>
                )}

                {verificationResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs ${
                      verificationResult.success
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-950/60 border-red-500/40 text-red-300'
                    }`}
                  >
                    {verificationResult.message}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleVerifyStep}
              disabled={verifying}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" /> {verifying ? 'Running Docker Exec Check...' : 'Verify Step Solution ⚡'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {sessionId && (
            <XTerminal sessionId={sessionId} externalInput={externalCommand} />
          )}
        </div>

        <div className="w-full lg:w-80 h-full overflow-hidden hidden xl:block">
          <AIMentorPanel onRunCommand={(cmd) => setExternalCommand(cmd)} />
        </div>
      </div>
    </div>
  );
};
