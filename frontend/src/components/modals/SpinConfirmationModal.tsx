import React, { useState, useEffect } from 'react';
import { Terminal, Clock, Cpu, ShieldCheck, X, Sparkles, Check, AlertTriangle } from 'lucide-react';
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

  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    const checkCooldown = () => {
      const cooldownUntilStr = localStorage.getItem('linuxarena_cooldown_until');
      if (cooldownUntilStr) {
        const cooldownUntil = parseInt(cooldownUntilStr, 10);
        const remainingMs = cooldownUntil - Date.now();
        if (remainingMs > 0) {
          setCooldownRemaining(Math.ceil(remainingMs / 1000));
        } else {
          setCooldownRemaining(0);
          localStorage.removeItem('linuxarena_cooldown_until');
        }
      } else {
        setCooldownRemaining(0);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

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

        {/* Cooldown Alert Banner if active */}
        {cooldownRemaining > 0 ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 mb-6 space-y-1.5 text-xs">
            <div className="font-bold flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> 5-Minute Cooldown Active
            </div>
            <p className="leading-relaxed opacity-90">
              You recently stopped your terminal container session. To prevent server overload, please wait <strong className="underline text-red-400 font-mono">{formatCooldown(cooldownRemaining)}</strong> before spinning up a new container.
            </p>
          </div>
        ) : (
          /* Highlighted 30-Min Session Notice */
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 mb-6 space-y-1.5 text-xs">
            <div className="font-bold flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" /> 30-Minute Session Duration
            </div>
            <p className="leading-relaxed opacity-90">
              This live Ubuntu instance will run for <strong>exactly 30 minutes</strong>. After 30 mins, the session auto-expires and cleans up to maintain platform performance.
            </p>
          </div>
        )}

        {/* Specs & Instance Grid */}
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
            disabled={isLaunching || cooldownRemaining > 0}
            className={`flex-1 font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg ${
              cooldownRemaining > 0
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
            }`}
          >
            {isLaunching ? (
              <>Spinning Up Instance...</>
            ) : cooldownRemaining > 0 ? (
              <>Wait {formatCooldown(cooldownRemaining)}</>
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
