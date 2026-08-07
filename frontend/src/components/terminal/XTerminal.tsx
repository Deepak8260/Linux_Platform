import React, { useEffect, useRef, useState } from 'react';
import { Terminal as Xterm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { RefreshCw, Trash2, Terminal as TermIcon, ShieldAlert } from 'lucide-react';

interface XTerminalProps {
  sessionId: string;
  onCommandExecuted?: (cmd: string) => void;
  externalInput?: string | null;
}

export const XTerminal: React.FC<XTerminalProps> = ({ sessionId, externalInput }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Xterm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const initTerminal = () => {
    if (!terminalRef.current) return;

    if (xtermRef.current) {
      xtermRef.current.dispose();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsConnecting(true);

    const term = new Xterm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: 'Fira Code, JetBrains Mono, Menlo, monospace',
      fontSize: 14,
      theme: {
        background: '#090d16',
        foreground: '#e2e8f0',
        cursor: '#10b981',
        selectionBackground: '#1e293b',
        black: '#0f172a',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#ec4899',
        cyan: '#06b6d4',
        white: '#f8fafc',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/terminal/${sessionId}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);

      ws.send(JSON.stringify({
        type: 'resize',
        cols: term.cols,
        rows: term.rows
      }));
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      term.write('\r\n\x1b[1;31m[Session Disconnected or Expired]\x1b[0m\r\n');
    };

    ws.onerror = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'input', data }));
      }
    });

    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        fitAddonRef.current.fit();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'resize',
            cols: xtermRef.current.cols,
            rows: xtermRef.current.rows
          }));
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      ws.close();
    };
  };

  useEffect(() => {
    initTerminal();
  }, [sessionId]);

  useEffect(() => {
    if (externalInput && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'input', data: `${externalInput}\r` }));
    }
  }, [externalInput]);

  const handleClear = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  const handleReconnect = () => {
    initTerminal();
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex items-center gap-1.5 ml-2 font-mono text-slate-400">
            <TermIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>student@ubuntu-sandbox:~</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {isConnecting ? (
              <span className="flex items-center gap-1 text-amber-400">
                <RefreshCw className="w-3 h-3 animate-spin" /> Connecting...
              </span>
            ) : isConnected ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sandbox Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400">
                <ShieldAlert className="w-3 h-3" /> Disconnected
              </span>
            )}
          </div>

          <div className="h-4 w-px bg-slate-800"></div>

          <button
            onClick={handleClear}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Clear Terminal Screen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReconnect}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Reconnect Terminal Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-hidden relative" ref={terminalRef}></div>
    </div>
  );
};
