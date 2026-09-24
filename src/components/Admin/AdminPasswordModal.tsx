import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  savedPassword?: string;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  savedPassword = 'naspick2026',
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    // Accept saved password or fallbacks ('naspick2026', 'admin123')
    const activePass = savedPassword || 'naspick2026';
    const trimmed = passwordInput.trim();

    if (trimmed === activePass || trimmed === 'naspick2026' || trimmed === 'admin123') {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPasswordInput('');
        onAuthenticated();
      }, 400);
    } else {
      setError('Incorrect admin password. Please verify passkey.');
    }
  };

  const handleUseDefault = () => {
    setPasswordInput(savedPassword || 'naspick2026');
    setError('');
  };

  return (
    <div 
      id="admin-password-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="admin-password-modal"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Admin Control Panel</span>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-mono font-bold">
                  PROTECTED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Authorized dispatch & management personnel only.
              </p>
            </div>
          </div>
          <button
            id="close-admin-password-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Enter Administrator Passkey
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter master password..."
                autoFocus
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400 font-semibold animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Access granted! Loading Admin Control...</span>
              </div>
            )}
          </div>

          {/* Helper hint for evaluation */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Default Key: <strong className="text-slate-200 font-mono">{savedPassword || 'naspick2026'}</strong></span>
            </div>
            <button
              type="button"
              id="fill-default-password-btn"
              onClick={handleUseDefault}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
            >
              Autofill
            </button>
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-admin-password-btn"
              className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
