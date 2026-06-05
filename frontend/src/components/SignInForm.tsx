import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Globe, Loader2, Recycle, AlertCircle } from 'lucide-react';
import { ScreenType } from '../types';
import { AuthAPI } from '../utils/api';

interface SignInFormProps {
  setScreen: (screen: ScreenType) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export default function SignInForm({ setScreen, onToast }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both your email and password.');
      return;
    }

    setAuthError('');
    setIsSubmitting(true);
    
    try {
      const response = await AuthAPI.login(email, password);

      if (response.success) {
        onToast('Logged in successfully!', 'success');
        // Store token in localStorage
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        setScreen('TRUCK');
      } else {
        setAuthError(response.message || 'We could not sign you in. Please check your details and try again.');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] px-4 relative z-10 animate-fade-in">
      {/* Background visual container */}
      <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] relative overflow-hidden">
        
        {/* Recycle floating background insignia */}
        <div className="absolute top-0 right-0 p-8 opacity-5 text-primary pointer-events-none select-none">
          <Recycle className="w-24 h-24 stroke-[1]" />
        </div>

        {/* Text Area */}
        <div className="relative z-10 mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-on-surface-variant">
            Log in to track your environmental impact.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant block select-none" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                <Mail className="w-4 h-4 opacity-70 group-focus-within:text-primary transition-colors" />
              </span>
              <input 
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setAuthError('');
                }}
                required
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-on-surface-variant block" htmlFor="password">
                Password
              </label>
              <button 
                type="button"
                onClick={() => setScreen('FORGOT_PASSWORD')}
                className="text-xs text-primary font-bold hover:underline transition-all cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                <Lock className="w-4 h-4 opacity-70 group-focus-within:text-primary transition-colors" />
              </span>
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError('');
                }}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 pl-10 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/40"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 opacity-70" />
                ) : (
                  <Eye className="w-4 h-4 opacity-70" />
                )}
              </button>
            </div>
          </div>

          {/* Stay Logged In Checkbox */}
          <div className="flex items-center gap-2 select-none">
            <input 
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-on-surface-variant cursor-pointer select-none">
              Stay logged in
            </label>
          </div>

          {authError && (
            <div className="rounded-lg border border-error/25 bg-error-container/70 px-4 py-3 text-left">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-error" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold leading-relaxed text-on-error-container">
                    {authError}
                  </p>
                  {authError.toLowerCase().includes('create an account') && (
                    <button
                      type="button"
                      onClick={() => setScreen('REGISTRATION')}
                      className="text-xs font-bold text-error hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action CTA Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary font-bold text-sm py-3 rounded-full shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Login
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* SignUp Redirect */}
        <div className="mt-6 pt-6 border-t border-outline-variant text-center select-none">
          <p className="text-xs text-on-surface-variant">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={() => setScreen('REGISTRATION')}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>

      {/* Badges footer */}
      <div className="mt-6 flex justify-center gap-6 select-none opacity-80">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Secure Encryption
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <Globe className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Global Access
          </span>
        </div>
      </div>
    </div>
  );
}
