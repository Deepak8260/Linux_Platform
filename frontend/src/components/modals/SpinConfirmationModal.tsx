import React from 'react';
import { Terminal, Clock, Cpu, ShieldCheck, X, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SpinConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLaunching?: boolean;
}

export const SpinConfirmationModal: React.FC<SpinConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLaunching = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className={`w-full max-w-lg border rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLaunching}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Docker Container Sandbox
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Spin Up Ubuntu Instance?</h2>
          <p className="text-xs text-slate-400">
            Confirm launching a fresh, isolated bash sandbox instance on the server.
          </p>
        </div>

        {/* Highlighted 30-Min Session Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 mb-6 space-y-1.5 text-xs">
          <div className="font-bold flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" /> 30-Minute Session Duration
          </div>
          <p className="leading-relaxed opacity-90">
            This live Ubuntu instance will run for <strong>exactly 30 minutes</strong>. After 30 mins, the session auto-expires and cleans up to maintain platform performance for all students.
          </p>
        </div>

        {/* Specs & Instance Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-green-500" /> OS Image
            </div>
            <div className="font-extrabold text-sm">Ubuntu 24.04 LTS</div>
          </div>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-500" /> Resources
            </div>
            <div className="font-extrabold text-sm">0.5 vCPU • 256MB</div>
          </div>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Permissions
            </div>
            <div className="font-extrabold text-sm">Root Bash Access</div>
          </div>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Auto-Expiry TTL
            </div>
            <div className="font-extrabold text-sm text-green-500">30 Minutes</div>
          </div>
        </div>

        {/* Confirmation Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLaunching}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-700 text-xs font-bold hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLaunching}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20"
          >
            {isLaunching ? (
              <>Spinning Up Instance...</>
            ) : (
              <>
                <Check className="w-4 h-4" /> Spin Up Instance (30m)
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
