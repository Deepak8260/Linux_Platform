import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { XTerminal } from '../components/terminal/XTerminal';
import { AIMentorPanel } from '../components/AI/AIMentorPanel';
import { Navbar } from '../components/Navbar';
import { CheckCircle2, ArrowLeft, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      <Navbar remainingSeconds={remainingSeconds} />

      <div className="flex-1 flex flex-col lg:flex-row p-3 gap-3 overflow-hidden max-w-[1800px] w-full mx-auto">
        <div className={`w-full lg:w-96 flex flex-col border rounded-xl overflow-hidden shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-4 border-b ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Link to="/labs" className="text-xs text-slate-500 hover:text-green-600 flex items-center gap-1 mb-2 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Labs
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                {lab?.category}
              </span>
              <span className="text-xs text-amber-500 font-bold">+{lab?.xp_reward} XP</span>
            </div>
            <h1 className="text-base font-bold mt-1">{lab?.title}</h1>
            <p className="text-xs text-slate-500 mt-1">{lab?.description}</p>
          </div>

          <div className={`flex border-b px-2 py-1 gap-1 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-100/80'}`}>
            {lab?.steps.map((st, idx) => (
              <button
                key={st.step_number}
                onClick={() => { setCurrentStepIdx(idx); setVerificationResult(null); setShowHint(false); }}
                className={`flex-1 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  currentStepIdx === idx
                    ? 'bg-green-600 text-white'
                    : completedSteps.includes(st.step_number)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {completedSteps.includes(st.step_number) ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <span>Step {st.step_number}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {currentStep && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-extrabold">
                    {currentStep.step_number}
                  </span>
                  {currentStep.title}
                </h3>

                <div className={`p-3 rounded-xl border leading-relaxed ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  {currentStep.instructions}
                </div>

                {currentStep.hint && (
                  <div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-[11px] text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold"
                    >
                      <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showHint && (
                      <div className="mt-2 bg-purple-50 border border-purple-200 p-2.5 rounded-xl text-purple-800 text-[11px]">
                        💡 {currentStep.hint}
                      </div>
                    )}
                  </div>
                )}

                {verificationResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-medium ${
                      verificationResult.success
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {verificationResult.message}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`p-3 border-t ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <button
              onClick={handleVerifyStep}
              disabled={verifying}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
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
