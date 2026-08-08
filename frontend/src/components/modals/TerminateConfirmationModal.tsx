import React from 'react';
import { AlertTriangle, Clock, Trash2, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TerminateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTerminate: () => void;
  isTerminating?: boolean;
}

export const TerminateConfirmationModal: React.FC<TerminateConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmTerminate,
  isTerminating = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className={`w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isTerminating}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5" /> Stop Live Session
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Stop Terminal & Remove Container?</h2>
          <p className="text-xs text-slate-400">
            Do you want to stop using the terminal and destroy your active Ubuntu instance?
          </p>
        </div>

        {/* 5-Minute Cooldown Warning Box */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 mb-6 space-y-2 text-xs">
          <div className="font-bold flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-500 animate-bounce" /> 5-Minute Cooldown Enforced
          </div>
          <p className="leading-relaxed opacity-90">
            If you terminate this container, you will be placed on a <strong>5-minute cooldown period</strong>. You will not be allowed to spin up a new container until the 5 minutes expire.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isTerminating}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-700 text-xs font-bold hover:bg-slate-800 transition"
          >
            Cancel (Keep Session)
          </button>

          <button
            type="button"
            onClick={onConfirmTerminate}
            disabled={isTerminating}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-red-600/20"
          >
            {isTerminating ? (
              <>Stopping Container...</>
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Yes, Stop & Remove
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
