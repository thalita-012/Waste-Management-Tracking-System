import { useState, FormEvent } from 'react';
import { KeyRound, Lock, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { ScreenType } from '../types';
import { AuthAPI } from '../utils/api';

interface ResetPasswordFormProps {
  setScreen: (screen: ScreenType) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
  resetToken: string;
  email: string;
}

export default function ResetPasswordForm({ setScreen, onToast, resetToken, email }: ResetPasswordFormProps) {
  const [token, setToken] = useState(resetToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token || !password || !confirmPassword) {
      onToast('Please fill all fields to reset your password.', 'info');
      return;
    }

    if (password !== confirmPassword) {
      onToast('Passwords do not match.', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthAPI.resetPassword(token, password);
      if (response.success) {
        onToast('Password reset successfully. Please sign in again.', 'success');
        setScreen('SIGN_IN');
      } else {
        onToast(response.message || 'Unable to reset password.', 'info');
      }
    } catch (error) {
      onToast('An error occurred. Please try again.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] px-4 select-none animate-fade-in relative z-10">
      <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-3 text-secondary shadow-inner">
            <KeyRound className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-1 font-sans">
            Reset Password
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed px-4">
            Enter the reset token and your new password to complete the account recovery.
          </p>
        </div>

        <div className="space-y-4 mb-6 text-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
          <p className="font-semibold text-on-surface">Reset Token</p>
          <p className="text-xs text-on-surface-variant leading-relaxed break-all">{token || 'Token not set yet. Please request a reset token first.'}</p>
          <p className="text-xs text-on-surface-variant">Email: <span className="font-medium text-on-surface">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter or paste token"
              className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-primary text-on-primary font-bold text-sm rounded-full hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-outline-variant text-center">
          <button
            type="button"
            onClick={() => setScreen('SIGN_IN')}
            className="text-secondary text-sm font-semibold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
