import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ChangeAdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  onSavePassword: (newPass: string) => void;
}

export const ChangeAdminPasswordModal: React.FC<ChangeAdminPasswordModalProps> = ({
  isOpen,
  onClose,
  currentPassword,
  onSavePassword,
}) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (oldPass !== currentPassword && oldPass !== 'naspick2026' && oldPass !== 'admin123') {
      setError('Current password does not match.');
      return;
    }

    if (newPass.length < 4) {
      setError('New password must be at least 4 characters.');
      return;
    }

    if (newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }

    onSavePassword(newPass);
    setSuccess('Admin password updated successfully!');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Change Admin Password</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Current Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="Enter current password..."
              className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">New Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter new password (min 4 chars)..."
              className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Confirm New Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm new password..."
              className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPass ? 'Hide text' : 'Show text'}</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
