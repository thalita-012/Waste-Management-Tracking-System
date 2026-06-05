import { useState, useEffect } from 'react';
import { ScreenType } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistrationForm from './components/RegistrationForm';
import SignInForm from './components/SignInForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ProfileManagement from './components/ProfileManagement';
import ResetPasswordForm from './components/ResetPasswordForm';
import TruckDashboard from './components/TruckDashboard';
import { Sparkles, CheckCircle, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  const [currentScreen, setScreen] = useState<ScreenType>('SIGN_IN');
  const [resetToken, setResetToken] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auto-dismiss toasts after 4 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    const newToast: Toast = {
      id: Date.now() + Math.random(),
      message,
      type
    };
    setToasts([newToast]);
  };

  const handleScreenChange = (screen: ScreenType) => {
    setScreen(screen);
    triggerToast(`Navigated to ${screen.replace('_', ' ').toLowerCase()} view`, 'info');
  };

  // Check which forms represent the entry pages
  const isAuthPage = currentScreen === 'SIGN_IN' || currentScreen === 'FORGOT_PASSWORD' || currentScreen === 'RESET_PASSWORD';

  return (
    <div className="relative min-h-screen flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Organic Blurred Atmospheric Shapes for Sign In / Forgot Password screens */}
      {isAuthPage && (
        <>
          <div className="glass-background" />
          <div className="organic-shape bg-primary w-[320px] md:w-[500px] h-[320px] md:h-[500px] -top-32 md:-top-64 -left-16 md:-left-32" />
          <div className="organic-shape bg-secondary w-[260px] md:w-[400px] h-[260px] md:h-[400px] bottom-0 -right-16 md:-right-32" />
        </>
      )}

      {/* Header Top Navigation */}
      <Header currentScreen={currentScreen} setScreen={handleScreenChange} onToast={triggerToast} />

      {/* Main Content Render */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10 select-none">
        
        {currentScreen === 'REGISTRATION' && (
          <RegistrationForm setScreen={handleScreenChange} onToast={triggerToast} />
        )}

        {currentScreen === 'SIGN_IN' && (
          <SignInForm setScreen={handleScreenChange} onToast={triggerToast} />
        )}

        {currentScreen === 'FORGOT_PASSWORD' && (
          <ForgotPasswordForm
            setScreen={handleScreenChange}
            onToast={triggerToast}
            onResetCreated={(token, email) => {
              setResetToken(token);
              setResetEmail(email);
              handleScreenChange('RESET_PASSWORD');
            }}
          />
        )}

        {currentScreen === 'RESET_PASSWORD' && (
          <ResetPasswordForm
            setScreen={handleScreenChange}
            onToast={triggerToast}
            resetToken={resetToken}
            email={resetEmail}
          />
        )}

        {currentScreen === 'TRUCK' && (
          <div className="w-full max-w-7xl mx-auto py-4">
            <TruckDashboard onToast={triggerToast} setScreen={handleScreenChange} />
          </div>
        )}

        {currentScreen === 'PROFILE' && (
          <div className="w-full max-w-7xl mx-auto py-4">
            <ProfileManagement onToast={triggerToast} />
          </div>
        )}

      </main>

      {/* Footer Branding Navigation */}
      <Footer currentScreen={currentScreen} onToast={triggerToast} />

      {/* FLOATING TOAST PROVIDER SYSTEM */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className="flex items-center gap-2.5 bg-white border border-outline-variant text-on-surface px-5 py-3.5 rounded-lg shadow-lg animate-fade-in pointer-events-auto"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-primary stroke-[2] flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-secondary stroke-[2] flex-shrink-0" />
            )}
            <span className="text-xs font-semibold tracking-wide">
              {toast.message}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
