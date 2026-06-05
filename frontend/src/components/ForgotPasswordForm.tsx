import { useState, FormEvent } from 'react';
import { KeyRound, Mail, Send, ArrowLeft, Info, Loader2 } from 'lucide-react';
import { ScreenType } from '../types';
import { AuthAPI } from '../utils/api';

interface ForgotPasswordFormProps {
  setScreen: (screen: ScreenType) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
  onResetCreated: (token: string, email: string) => void;
}

export default function ForgotPasswordForm({ setScreen, onToast, onResetCreated }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      onToast('Please enter your email address first.', 'info');
      return;
    }

    setIsSending(true);
    try {
      const response = await AuthAPI.requestPasswordReset(email);
      if (response.success && response.token) {
        onToast(`Password reset token created. Use it on the next page.`, 'success');
        setEmail('');
        onResetCreated(response.token, email);
      } else {
        onToast(response.message || 'Unable to create reset token.', 'info');
      }
    } catch (error) {
      onToast('An error occurred. Please try again.', 'info');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] px-4 select-none animate-fade-in relative z-10">
      
      {/* Central Auth Reset Card */}
      <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-10 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        
        {/* Rounded Icon Header */}
        <div className="flex flex-col items-center mb-6 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-3 text-secondary shadow-inner">
            <KeyRound className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-1 font-sans">
            Forgot Password
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface block" htmlFor="email-reset">
              Email Address
            </label>
            <div className="relative group">
              <input 
                id="email-reset"
                type="email"
                placeholder="name@company.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                <Mail className="w-5 h-5 opacity-60 group-focus-within:text-primary transition-colors" />
              </span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSending}
            className="w-full h-12 bg-primary text-on-primary font-bold text-sm rounded hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Send Reset Link
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login link */}
        <div className="mt-8 pt-4 border-t border-outline-variant text-center select-none">
          <button 
            type="button"
            onClick={() => setScreen('SIGN_IN')}
            className="inline-flex items-center gap-1.5 text-secondary text-sm font-semibold hover:underline group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </button>
        </div>
      </div>

      {/* Spam Hint Notification Container */}
      <div className="mt-6 flex items-start gap-3 p-4 bg-secondary-container rounded-lg border border-secondary/20 shadow-sm">
        <Info className="text-secondary w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-on-secondary-container font-medium text-left">
          Check your spam folder if you don't receive the email within a few minutes.
        </p>
      </div>
    </div>
  );
}
