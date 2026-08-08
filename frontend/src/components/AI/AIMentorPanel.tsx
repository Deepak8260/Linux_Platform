import React, { useState } from 'react';
import { Sparkles, Send, Play, ShieldCheck, Terminal } from 'lucide-react';

interface AIMentorPanelProps {
  onRunCommand: (command: string) => void;
  contextText?: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  suggestedCommands?: string[];
}

export const AIMentorPanel: React.FC<AIMentorPanelProps> = ({ onRunCommand, contextText }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "👋 **Hi! I'm your AI DevOps Mentor.** Ask me how to run commands, fix errors, write Bash scripts, or configure Nginx & Docker!",
      suggestedCommands: ['uname -a', 'ls -la /etc']
    }
  ]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, context: contextText || '' })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer,
          suggestedCommands: data.suggested_commands
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "⚠️ Couldn't reach AI Mentor backend. You can still run manual terminal commands!",
          suggestedCommands: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between bg-slate-950 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI DevOps Mentor
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Safe-Mode Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Ask questions or generate verified bash code</p>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</div>

              {msg.suggestedCommands && msg.suggestedCommands.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-400" /> Suggested Execution:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedCommands.map((cmd, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => onRunCommand(cmd)}
                        className="flex items-center gap-1 bg-slate-900 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[11px] font-mono transition"
                      >
                        <Play className="w-3 h-3 fill-emerald-400" /> {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <Sparkles className="w-4 h-4 animate-spin text-purple-400" /> AI Mentor is thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI: e.g. How to grant sudo permissions?"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
